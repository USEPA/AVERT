import { type RDFJSON } from "@/redux/reducers/geography";
import {
  type _SelectedRegionsTotalMonthlyEmissionChanges,
  type VehicleEmissionChangesByGeography,
} from "@/calculations/transportation";
import { type EmptyObject, sortObjectByKeys } from "@/utilities";
import { type RegionId, type StateId } from "@/config";

export type EmissionsChanges = ReturnType<typeof calculateEmissionsChanges>;
export type AggregatedEmissionsData = ReturnType<
  typeof calculateAggregatedEmissionsData
>;
export type CombinedSectorsEmissionsData = ReturnType<
  typeof createCombinedSectorsEmissionsData
>;

const emissionsFields = ["generation", "so2", "nox", "co2", "pm25", "vocs", "nh3"] as const; // prettier-ignore

type EguData = EmissionsChanges[string];

export type EmissionsData = {
  [field in (typeof emissionsFields)[number]]: {
    power: {
      annual: { original: number; postEere: number };
      monthly: EguData["data"][keyof EguData["data"]];
    } | null;
    vehicle: {
      annual: number;
      monthly: { [month: number]: number } | null;
    };
  };
};

export type EmissionsFlagsField = EguData["emissionsFlags"][number];

type NEIPollutantsEmissionRates = {
  generation: number;
  heat: number;
  pm25: number;
  vocs: number;
  nh3: number;
};

type NEIEmissionRatesByEGU = {
  region: string;
  state: string;
  plant: string;
  orspl: number;
  unit: string;
  name: string;
  county: string;
  "orspl|unit|region": string;
  years: {
    "2017": NEIPollutantsEmissionRates;
    "2018": NEIPollutantsEmissionRates;
    "2019": NEIPollutantsEmissionRates;
    "2020": NEIPollutantsEmissionRates;
    "2021": NEIPollutantsEmissionRates;
    "2022": NEIPollutantsEmissionRates;
    "2023": NEIPollutantsEmissionRates;
    "2024": NEIPollutantsEmissionRates;
  };
};

type RDFDataField = keyof RDFJSON["data"];

/**
 * Adds a number to an array of numbers, sorts it, and returns the index of the
 * number directly before the one that was inserted
 */
function getPrecedingIndex(array: number[], number: number) {
  // insert provided number into the provided array and sort it
  const sortedArray = array.concat(number).sort((a, b) => a - b);
  const numberIndex = sortedArray.indexOf(number);
  // return the index of the number directly before the inserted number
  if (array[numberIndex] === number) return numberIndex;
  return numberIndex - 1;
}

/**
 * Excel: "Pre" and "Post" calculation from "m_3_displaced_gen_emissions" module
 */
function calculateLinear(options: {
  load: number;
  genA: number;
  genB: number;
  edgeA: number;
  edgeB: number;
}) {
  const { load, genA, genB, edgeA, edgeB } = options;
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - slope * edgeA;
  return load * slope + intercept;
}

/**
 * *****************************************************************************
 * NOTE: This is a TypeScript version of the `calculateEmissionsChanges()`
 * function found in the server app (`server/app/calculations.js`). This
 * TypeScript version of the function isn't actually used in the client app, but
 * it's return type (`EmissionsChanges`) is used. Ideally, we'd use this version
 * within the client app and calculate the emissions changes in the client app,
 * but the calculations are too intesive and lock the UI, which is why we
 * offload them to the server app, and receive the results through API calls.
 *
 * TLDR; much of the code in this file is for reference only (except for the
 * return type, which is currently used) in case we're able update the client
 * app at some point in the future in a way where we can handle the emissions
 * calculations in the client app alone.
 * *****************************************************************************
 *
 * Calculates emissions changes for a provided region.
 */
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function calculateEmissionsChanges(options: {
  year: number;
  rdf: RDFJSON;
  neiEmissionRates: NEIEmissionRatesByEGU[];
  hourlyChanges: number[];
}) {
  const { year, rdf, neiEmissionRates, hourlyChanges } = options;

  /**
   * NOTE: Emissions rates for generation, so2, nox, and co2 are calculated with
   * data in the RDF's `data` object under it's corresponding key: ozone season
   * data matches the field exactly (e.g. `data.so2`, `data.nox`) and non-ozone
   * season data has a `_not` suffix in the field name (e.g. `data.so2_not`,
   * `data.nox_not`). There's no non-ozone season for generation, so it always
   * uses `data.generation`, regardless of ozone season.
   *
   * Emissions rates for pm2.5, vocs, and nh3 are calculated with both annual
   * point-source data from the National Emissions Inventory
   * (`neiEmissionRates`) and the `heat` and `heat_not` fields in the RDF's
   * `data` object (for ozone and non-ozone season respectively).
   */
  const result = {} as {
    [eguId: string]: {
      region: string;
      state: string;
      county: string;
      lat: number;
      lon: number;
      fuelType: string;
      orisplCode: number;
      unitCode: string;
      name: string;
      emissionsFlags: ("generation" | "so2" | "nox" | "co2" | "heat")[];
      data: {
        generation: { [month: number]: { original: number; postEere: number } };
        so2: { [month: number]: { original: number; postEere: number } };
        nox: { [month: number]: { original: number; postEere: number } };
        co2: { [month: number]: { original: number; postEere: number } };
        pm25: { [month: number]: { original: number; postEere: number } };
        vocs: { [month: number]: { original: number; postEere: number } };
        nh3: { [month: number]: { original: number; postEere: number } };
      };
    };
  };

  const dataFields = ["generation", "so2", "nox", "co2", "pm25", "vocs", "nh3"] as const; // prettier-ignore
  const neiFields = ["pm25", "vocs", "nh3"];

  type OzoneSeasonDataField =
    | (RDFDataField & (typeof dataFields)[number])
    | "heat";

  const regionId = rdf.region.region_abbv;

  const loadBinEdges = rdf.load_bin_edges;
  const firstLoadBinEdge = loadBinEdges[0];
  const lastLoadBinEdge = loadBinEdges[loadBinEdges.length - 1];

  /**
   * Iterate over each hour in the year (8760 in non-leap years)
   */
  for (const [i, hourlyLoad] of rdf.regional_load.entries()) {
    const month = hourlyLoad.month; // numeric month of load

    const originalLoad = hourlyLoad.regional_load_mw; // original regional load (mwh) for the hour
    const postEereLoad = originalLoad + hourlyChanges[i]; // merged regional energy profile (mwh) for the hour

    const originalLoadInBounds = originalLoad >= firstLoadBinEdge && originalLoad <= lastLoadBinEdge; // prettier-ignore
    const postEereLoadInBounds = postEereLoad >= firstLoadBinEdge && postEereLoad <= lastLoadBinEdge; // prettier-ignore

    // filter out outliers
    if (!(originalLoadInBounds && postEereLoadInBounds)) continue;

    // get index of load bin edge closest to originalLoad or postEereLoad
    const originalLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, originalLoad); // prettier-ignore
    const postEereLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, postEereLoad); // prettier-ignore

    /**
     * Iterate over each data field: generation, so2, nox, co2...
     */
    dataFields.forEach((field) => {
      /**
       * NOTE: PM2.5, VOCs, and NH3 always use the `heat` or `heat_not` fields
       * of the RDF's `data` object
       */
      const ozoneSeasonData = neiFields.includes(field)
        ? rdf.data.heat
        : rdf.data[field as RDFDataField];

      const nonOzoneSeasonData =
        field === "generation"
          ? null // NOTE: there's no non-ozone season for generation
          : neiFields.includes(field)
            ? rdf.data.heat_not
            : rdf.data[`${field}_not` as RDFDataField];

      const ozoneSeasonMedians = ozoneSeasonData.map((egu) => egu.medians);

      const nonOzoneSeasonMedians = nonOzoneSeasonData
        ? nonOzoneSeasonData.map((egu) => egu.medians)
        : null;

      /**
       * Ozone season is between May and September, so use the correct medians
       * dataset for the current month
       */
      const datasetMedians = !nonOzoneSeasonMedians
        ? ozoneSeasonMedians
        : month >= 5 && month <= 9
          ? ozoneSeasonMedians
          : nonOzoneSeasonMedians;

      /**
       * Iterate over each electric generating unit (EGU). The total number of
       * EGUs varries per region (less than 100 for the RM region; more than
       * 1000 for the SE region)
       */
      ozoneSeasonData.forEach((egu, eguIndex) => {
        const {
          state,
          county,
          lat,
          lon,
          fuel_type,
          orispl_code,
          unit_code,
          full_name,
          infreq_emissions_flag,
        } = egu;

        const eguId = `${regionId}_${state}_${orispl_code}_${unit_code}`;
        const medians = datasetMedians[eguIndex];

        const calculatedOriginal = calculateLinear({
          load: originalLoad,
          genA: medians[originalLoadBinEdgeIndex],
          genB: medians[originalLoadBinEdgeIndex + 1],
          edgeA: loadBinEdges[originalLoadBinEdgeIndex],
          edgeB: loadBinEdges[originalLoadBinEdgeIndex + 1],
        });

        /**
         * Handle special exclusions for emissions changes at specific EGUs
         * (specifically added for errors with SO2 reporting, but the RDFs were
         * updated to include the `infreq_emissions_flag` for all pollutants for
         * consistency, which allows other pollutants at specific EGUs to be
         * excluded in the future)
         */
        const calculatedPostEere =
          infreq_emissions_flag === 1
            ? calculatedOriginal
            : calculateLinear({
                load: postEereLoad,
                genA: medians[postEereLoadBinEdgeIndex],
                genB: medians[postEereLoadBinEdgeIndex + 1],
                edgeA: loadBinEdges[postEereLoadBinEdgeIndex],
                edgeB: loadBinEdges[postEereLoadBinEdgeIndex + 1],
              });

        /**
         * Conditionally multiply NEI factor to calculated original and postEere
         * values
         */
        const matchedEgu = neiEmissionRates.find((item) => {
          return item.orspl === orispl_code && item.unit === unit_code;
        });

        const neiEguData =
          matchedEgu?.years?.[
            year.toString() as keyof NEIEmissionRatesByEGU["years"]
          ];

        const neiFieldData =
          neiEguData?.[field as keyof NEIPollutantsEmissionRates];

        const original =
          neiFields.includes(field) && neiFieldData !== undefined
            ? calculatedOriginal * neiFieldData
            : calculatedOriginal;

        const postEere =
          neiFields.includes(field) && neiFieldData !== undefined
            ? calculatedPostEere * neiFieldData
            : calculatedPostEere;

        /**
         * Conditionally initialize each EGU's metadata
         */
        result[eguId] ??= {
          region: regionId,
          state: state,
          county: county,
          lat: lat,
          lon: lon,
          fuelType: fuel_type,
          orisplCode: orispl_code,
          unitCode: unit_code,
          name: full_name,
          emissionsFlags: [],
          data: {
            generation: {},
            so2: {},
            nox: {},
            co2: {},
            pm25: {},
            vocs: {},
            nh3: {},
          },
        };

        /**
         * Conditionally add field (e.g. so2, nox, co2) to EGU's emissions
         * flags, as emissions "replacement" will be needed for that pollutant
         */
        if (
          infreq_emissions_flag === 1 &&
          !result[eguId].emissionsFlags.includes(field as OzoneSeasonDataField)
        ) {
          result[eguId].emissionsFlags.push(field as OzoneSeasonDataField);
        }

        /**
         * Conditionally initialize the field's monthly data
         */
        result[eguId].data[field][month] ??= { original: 0, postEere: 0 };

        /**
         * Increment the field's monthly original and postEere values
         */
        result[eguId].data[field][month].original += original;
        result[eguId].data[field][month].postEere += postEere;
      });
    });
  }

  return result;
}

/**
 * Creates initial (empty) monthly power sector data.
 */
function createEmptyMonthlyPowerData() {
  const result = [...Array(12)].reduce(
    (object, _item, index) => {
      object[index + 1] = { original: 0, postEere: 0 };
      return object;
    },
    {} as EguData["data"][keyof EguData["data"]],
  );

  return result;
}

/**
 * Creates initial (empty) monthly transportation sector data.
 */
function createEmptyMonthlyVehicleData() {
  const result = [...Array(12)].reduce(
    (object, _item, index) => {
      object[index + 1] = 0;
      return object;
    },
    {} as { [month: number]: number },
  );

  return result;
}

/**
 * Creates the intial structure of monthly and annual emissions data for each
 * pollutant.
 */
function createInitialEmissionsData() {
  const result = emissionsFields.reduce((object, field) => {
    object[field] = {
      power: {
        annual: { original: 0, postEere: 0 },
        monthly: createEmptyMonthlyPowerData(),
      },
      vehicle: {
        annual: 0,
        monthly: null,
      },
    };

    return object;
  }, {} as EmissionsData);

  return result;
}

/**
 * Sum the provided EGUs emissions data into monthly and annual original and
 * post-EERE values for each pollutant.
 */
export function calculateAggregatedEmissionsData(egus: EmissionsChanges) {
  if (Object.keys(egus).length === 0) return null;

  const result = Object.values(egus).reduce(
    (object, eguData) => {
      const regionId = eguData.region as RegionId;
      const stateId = eguData.state as StateId;
      const county = eguData.county;

      object.regions[regionId] ??= createInitialEmissionsData();
      object.states[stateId] ??= createInitialEmissionsData();
      object.counties[stateId] ??= {};
      object.counties[stateId][county] ??= createInitialEmissionsData();

      Object.entries(eguData.data).forEach(([annualKey, annualData]) => {
        const pollutant = annualKey as keyof typeof eguData.data;

        Object.entries(annualData).forEach(([monthlyKey, monthlyData]) => {
          const month = Number(monthlyKey);
          const { original, postEere } = monthlyData;

          const powerTotal = object.total[pollutant].power;
          const powerRegions = object.regions[regionId][pollutant].power;
          const powerStates = object.states[stateId][pollutant].power;
          const powerCounties = object.counties[stateId][county][pollutant].power; // prettier-ignore

          if (powerTotal && powerRegions && powerStates && powerCounties) {
            powerTotal.annual.original += original;
            powerTotal.annual.postEere += postEere;
            powerTotal.monthly[month].original += original;
            powerTotal.monthly[month].postEere += postEere;

            powerRegions.annual.original += original;
            powerRegions.annual.postEere += postEere;
            powerRegions.monthly[month].original += original;
            powerRegions.monthly[month].postEere += postEere;

            powerStates.annual.original += original;
            powerStates.annual.postEere += postEere;
            powerStates.monthly[month].original += original;
            powerStates.monthly[month].postEere += postEere;

            powerCounties.annual.original += original;
            powerCounties.annual.postEere += postEere;
            powerCounties.monthly[month].original += original;
            powerCounties.monthly[month].postEere += postEere;
          }
        });
      });

      return object;
    },
    {
      total: createInitialEmissionsData(),
      regions: {},
      states: {},
      counties: {},
    } as {
      total: EmissionsData;
      regions: { [regionId in RegionId]: EmissionsData };
      states: { [stateId in StateId]: EmissionsData };
      counties: { [stateId in StateId]: { [county: string]: EmissionsData } };
    },
  );

  return result;
}

/**
 * Combines transportation sector and power sector emissions data.
 */
export function createCombinedSectorsEmissionsData(options: {
  aggregatedEmissionsData: AggregatedEmissionsData;
  _selectedRegionsTotalMonthlyEmissionChanges:
    | _SelectedRegionsTotalMonthlyEmissionChanges
    | EmptyObject;
  vehicleEmissionChangesByGeography:
    | VehicleEmissionChangesByGeography
    | EmptyObject;
}) {
  const {
    aggregatedEmissionsData,
    _selectedRegionsTotalMonthlyEmissionChanges,
    vehicleEmissionChangesByGeography,
  } = options;

  const selectedRegionsChangesData =
    Object.keys(_selectedRegionsTotalMonthlyEmissionChanges).length !== 0
      ? (_selectedRegionsTotalMonthlyEmissionChanges as _SelectedRegionsTotalMonthlyEmissionChanges)
      : null;

  const vehicleEmissionChanges =
    Object.keys(vehicleEmissionChangesByGeography).length !== 0
      ? (vehicleEmissionChangesByGeography as VehicleEmissionChangesByGeography)
      : null;

  if (
    !aggregatedEmissionsData ||
    !selectedRegionsChangesData ||
    !vehicleEmissionChanges
  ) {
    return null;
  }

  /**
   * Format `selectedRegionsChangesData` for storing regional and total monthly
   * emission changes per pollutant.
   */
  const monthlyChangesData = Object.entries(selectedRegionsChangesData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsChangesData;

      object[regionId] ??= { CO2: {}, NOX: {}, SO2: {}, PM25: {}, VOCs: {}, NH3: {} }; // prettier-ignore

      Object.entries(regionValue).forEach(
        ([regionMonthKey, regionMonthValue]) => {
          const month = Number(regionMonthKey);

          Object.entries(regionMonthValue.total).forEach(([key, value]) => {
            const pollutant = key as keyof typeof regionMonthValue.total;
            // conditionally convert CO2 pounds into tons
            const result = pollutant === "CO2" ? value / 2_000 : value;

            object[regionId][pollutant][month] = -1 * result;
            object.regionTotals[pollutant][month] ??= 0;
            object.regionTotals[pollutant][month] += -1 * result;
          });
        },
      );

      return object;
    },
    {
      regionTotals: { CO2: {}, NOX: {}, SO2: {}, PM25: {}, VOCs: {}, NH3: {} },
    } as {
      [regionId in RegionId | "regionTotals"]: {
        [pollutant in "CO2" | "NOX" | "SO2" | "PM25" | "VOCs" | "NH3"]: {
          [month: number]: number;
        };
      };
    },
  );

  /**
   * pollutant key mapping between `aggregatedEmissionsData` and
   * `vehicleEmissionChanges` datasets
   */
  const pollutantKeyMap = new Map<
    keyof typeof aggregatedEmissionsData.total,
    keyof typeof vehicleEmissionChanges.total | null
  >()
    .set("generation", null)
    .set("so2", "SO2")
    .set("nox", "NOX")
    .set("co2", "CO2")
    .set("pm25", "PM25")
    .set("vocs", "VOCs")
    .set("nh3", "NH3");

  /** start with power sector emissions data */
  const result = { ...aggregatedEmissionsData };

  /** add total transportation sector emissions data */
  Object.keys(result.total).forEach((key) => {
    const pollutant = key as keyof typeof result.total;
    const vehiclePollutant = pollutantKeyMap.get(pollutant);

    const annualVehicleData = vehiclePollutant
      ? vehicleEmissionChanges.total[vehiclePollutant]
      : 0;

    const monthlyVehicleData = vehiclePollutant
      ? monthlyChangesData.regionTotals[vehiclePollutant]
      : null;

    result.total[pollutant].vehicle.annual = annualVehicleData;
    result.total[pollutant].vehicle.monthly = monthlyVehicleData;
  });

  /** add region level transportation sector emissions data */
  Object.keys(vehicleEmissionChanges.regions).forEach((key) => {
    const regionId = key as keyof typeof vehicleEmissionChanges.regions;

    /** initialize region data if it doesn't already exist */
    result.regions[regionId] ??= {
      generation: { power: null, vehicle: { annual: 0, monthly: null } },
      so2: { power: null, vehicle: { annual: 0, monthly: null } },
      nox: { power: null, vehicle: { annual: 0, monthly: null } },
      co2: { power: null, vehicle: { annual: 0, monthly: null } },
      pm25: { power: null, vehicle: { annual: 0, monthly: null } },
      vocs: { power: null, vehicle: { annual: 0, monthly: null } },
      nh3: { power: null, vehicle: { annual: 0, monthly: null } },
    };

    const region = result.regions[regionId];

    Object.keys(region).forEach((key) => {
      const pollutant = key as keyof typeof region;
      const vehiclePollutant = pollutantKeyMap.get(pollutant);

      const annualVehicleData = vehiclePollutant
        ? vehicleEmissionChanges.regions[regionId][vehiclePollutant]
        : 0;

      const monthlyVehicleData = vehiclePollutant
        ? monthlyChangesData[regionId]?.[vehiclePollutant] || null
        : null;

      region[pollutant].vehicle.annual = annualVehicleData;
      region[pollutant].vehicle.monthly = monthlyVehicleData;
    });
  });

  /** add state level transportation sector annual emissions data */
  Object.keys(vehicleEmissionChanges.states).forEach((key) => {
    const stateId = key as keyof typeof vehicleEmissionChanges.states;

    /** initialize state data if it doesn't already exist */
    result.states[stateId] ??= {
      generation: { power: null, vehicle: { annual: 0, monthly: null } },
      so2: { power: null, vehicle: { annual: 0, monthly: null } },
      nox: { power: null, vehicle: { annual: 0, monthly: null } },
      co2: { power: null, vehicle: { annual: 0, monthly: null } },
      pm25: { power: null, vehicle: { annual: 0, monthly: null } },
      vocs: { power: null, vehicle: { annual: 0, monthly: null } },
      nh3: { power: null, vehicle: { annual: 0, monthly: null } },
    };

    const state = result.states[stateId];

    Object.keys(state).forEach((key) => {
      const pollutant = key as keyof typeof state;
      const vehiclePollutant = pollutantKeyMap.get(pollutant);

      const annualVehicleData = vehiclePollutant
        ? vehicleEmissionChanges.states[stateId][vehiclePollutant]
        : 0;

      state[pollutant].vehicle.annual = annualVehicleData;
    });
  });

  /** update state level transportation sector monthly emissions data */
  Object.keys(result.states).forEach((key) => {
    const stateId = key as keyof typeof result.states;
    const state = result.states[stateId];

    Object.keys(state).forEach((key) => {
      const pollutant = key as keyof typeof state;

      state[pollutant].vehicle.monthly =
        state[pollutant].vehicle.annual === 0
          ? createEmptyMonthlyVehicleData()
          : null;
    });
  });

  /** add county level transportation sector annual emissions data */
  Object.entries(vehicleEmissionChanges.counties).forEach(([key, value]) => {
    const stateId = key as keyof typeof vehicleEmissionChanges.counties;

    Object.keys(value).forEach((countyName) => {
      result.counties[stateId] ??= {};

      /** initialize county data if it doesn't already exist */
      result.counties[stateId][countyName] ??= {
        generation: { power: null, vehicle: { annual: 0, monthly: null } },
        so2: { power: null, vehicle: { annual: 0, monthly: null } },
        nox: { power: null, vehicle: { annual: 0, monthly: null } },
        co2: { power: null, vehicle: { annual: 0, monthly: null } },
        pm25: { power: null, vehicle: { annual: 0, monthly: null } },
        vocs: { power: null, vehicle: { annual: 0, monthly: null } },
        nh3: { power: null, vehicle: { annual: 0, monthly: null } },
      };

      const county = result.counties[stateId][countyName];

      Object.keys(county).forEach((key) => {
        const pollutant = key as keyof typeof county;
        const vehiclePollutant = pollutantKeyMap.get(pollutant);

        const annualVehicleData = vehiclePollutant
          ? vehicleEmissionChanges.counties[stateId][countyName][vehiclePollutant] // prettier-ignore
          : 0;

        county[pollutant].vehicle.annual = annualVehicleData;
      });
    });
  });

  /** update county level transportation sector monthly emissions data */
  Object.entries(result.counties).forEach(([key, value]) => {
    const stateId = key as keyof typeof result.counties;

    Object.keys(value).forEach((countyName) => {
      const county = result.counties[stateId][countyName];

      Object.keys(county).forEach((key) => {
        const pollutant = key as keyof typeof county;

        county[pollutant].vehicle.monthly =
          county[pollutant].vehicle.annual === 0
            ? createEmptyMonthlyVehicleData()
            : null;
      });
    });
  });

  // sort results alphabetically
  result.regions = sortObjectByKeys(result.regions);
  result.states = sortObjectByKeys(result.states);
  result.counties = sortObjectByKeys(result.counties);
  result.counties = Object.entries(result.counties).reduce(
    (object, [stateId, counties]) => {
      object[stateId as StateId] = sortObjectByKeys(counties);
      return object;
    },
    {} as typeof result.counties,
  );

  return result;
}
