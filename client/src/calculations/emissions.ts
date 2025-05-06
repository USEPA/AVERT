import { type RDFJSON } from "@/redux/reducers/geography";
import {
  type SelectedRegionsMonthlyEmissionChangesTotals,
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

const emissionsFields = [
  "generation",
  "so2",
  "nox",
  "co2",
  "pm25",
  "vocs",
  "nh3",
] as const;

type EmissionsFields = (typeof emissionsFields)[number];

type EguData = EmissionsChanges["egus"][string];

export type EmissionsData = {
  [field in EmissionsFields]: {
    power: {
      annual: { pre: number; post: number };
      monthly: { [month: number]: { pre: number; post: number } };
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
 * Rounds a number to three decimal places.
 */
function roundToThreeDecimals(num: number) {
  return Math.round(num * 1000) / 1000;
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

  type OzoneSeasonDataField = (RDFDataField & EmissionsFields) | "heat";

  /**
   * Cumulative hourly emissions impacts from all electric generating units
   * (EGUs) for each pollutant/emissions field.
   *
   * Excel: "Sum: All Units (lb)" (or in the case of the "CO2" Excel sheet,
   * "Sum: All Units (tons)") column (K) of the various pollutant/emissions
   * sheets: "Generation", "SO2", "NOx", "CO2", "PM25", "VOCs", and "NH3".
   */
  const hourlyImpacts = {} as {
    [regionId in RegionId]: {
      [emissionsField in EmissionsFields]: {
        [hour: number]: number;
      };
    };
  };

  /**
   * Total yearly emissions impacts from all electric generating units for each
   * pollutant/emissions field.
   *
   * NOTE: This value isn't in Excel, but is the sum of the hourly impacts, and
   * can be calculated in Excel via: `=SUM(K4:K8787)`.
   */
  const yearlyImpacts = {} as {
    [regionId in RegionId]: {
      [emissionsField in EmissionsFields]: number;
    };
  };

  /**
   * Monthly emissions changes data for each electric generating unit.
   *
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
  const egus = {} as {
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
      monthly: {
        [field in EmissionsFields]: {
          [month: number]: {
            pre: number;
            post: number;
          };
        };
      };
    };
  };

  const neiFields = ["pm25", "vocs", "nh3"];

  const regionId = rdf.region.region_abbv as RegionId;

  const loadBinEdges = rdf.load_bin_edges;
  const firstLoadBinEdge = loadBinEdges[0];
  const lastLoadBinEdge = loadBinEdges[loadBinEdges.length - 1];

  /**
   * Iterate over each hour in the year (8760 in non-leap years)
   */
  for (const [i, hourlyLoad] of rdf.regional_load.entries()) {
    const hour = hourlyLoad.hour_of_year;
    const month = hourlyLoad.month; // numeric month of load

    const preLoad = hourlyLoad.regional_load_mw; // original regional load (mwh) for the hour
    const postLoad = preLoad + hourlyChanges[i]; // merged regional energy profile (mwh) for the hour

    const preLoadInBounds = preLoad >= firstLoadBinEdge && preLoad <= lastLoadBinEdge; // prettier-ignore
    const postLoadInBounds = postLoad >= firstLoadBinEdge && postLoad <= lastLoadBinEdge; // prettier-ignore

    // filter out outliers
    if (!(preLoadInBounds && postLoadInBounds)) continue;

    // get index of load bin edge closest to preLoad or postLoad
    const preLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, preLoad);
    const postLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, postLoad);

    /**
     * Iterate over each emissions field: generation, so2, nox, co2...
     */
    emissionsFields.forEach((field) => {
      /**
       * NOTE: PM2.5, VOCs, and NH3 always use the `heat` or `heat_not` fields
       * of the RDF's `data` object.
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
       * dataset for the current month.
       */
      const datasetMedians = !nonOzoneSeasonMedians
        ? ozoneSeasonMedians
        : month >= 5 && month <= 9
          ? ozoneSeasonMedians
          : nonOzoneSeasonMedians;

      /**
       * Iterate over each electric generating unit (EGU). The total number of
       * EGUs varries per region (less than 100 for the RM region; more than
       * 1000 for the SE region).
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

        const calculatedPre = calculateLinear({
          load: preLoad,
          genA: medians[preLoadBinEdgeIndex],
          genB: medians[preLoadBinEdgeIndex + 1],
          edgeA: loadBinEdges[preLoadBinEdgeIndex],
          edgeB: loadBinEdges[preLoadBinEdgeIndex + 1],
        });

        /**
         * Handle special exclusions for emissions changes at specific EGUs
         * (specifically added for errors with SO2 reporting, but the RDFs were
         * updated to include the `infreq_emissions_flag` for all pollutants for
         * consistency, which allows other pollutants at specific EGUs to be
         * excluded in the future).
         */
        const calculatedPost =
          infreq_emissions_flag === 1
            ? calculatedPre
            : calculateLinear({
                load: postLoad,
                genA: medians[postLoadBinEdgeIndex],
                genB: medians[postLoadBinEdgeIndex + 1],
                edgeA: loadBinEdges[postLoadBinEdgeIndex],
                edgeB: loadBinEdges[postLoadBinEdgeIndex + 1],
              });

        /**
         * Conditionally multiply NEI factor to calculated pre and post values.
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

        const pre =
          neiFields.includes(field) && neiFieldData !== undefined
            ? calculatedPre * neiFieldData
            : calculatedPre;

        const post =
          neiFields.includes(field) && neiFieldData !== undefined
            ? calculatedPost * neiFieldData
            : calculatedPost;

        /**
         * Conditionally initialize the field's hourly impacts.
         */
        hourlyImpacts[regionId] ??= {
          generation: {},
          so2: {},
          nox: {},
          co2: {},
          pm25: {},
          vocs: {},
          nh3: {},
        };
        hourlyImpacts[regionId][field][hour] ??= 0;

        /**
         * Add the rounded difference between the calculated post and pre values
         * and then round the accumulated value.
         */
        hourlyImpacts[regionId][field][hour] += roundToThreeDecimals(post - pre); // prettier-ignore
        hourlyImpacts[regionId][field][hour] = roundToThreeDecimals(hourlyImpacts[regionId][field][hour]); // prettier-ignore

        /**
         * Conditionally initialize the field's yearly impacts.
         */
        yearlyImpacts[regionId] ??= {
          generation: 0,
          so2: 0,
          nox: 0,
          co2: 0,
          pm25: 0,
          vocs: 0,
          nh3: 0,
        };

        /**
         * Add the rounded difference between the calculated post and pre values
         * and then round the accumulated value.
         */
        yearlyImpacts[regionId][field] += roundToThreeDecimals(post - pre); // prettier-ignore
        yearlyImpacts[regionId][field] = roundToThreeDecimals(yearlyImpacts[regionId][field]); // prettier-ignore

        /**
         * Conditionally initialize each EGU's metadata.
         */
        egus[eguId] ??= {
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
          monthly: {
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
          !egus[eguId].emissionsFlags.includes(field as OzoneSeasonDataField)
        ) {
          egus[eguId].emissionsFlags.push(field as OzoneSeasonDataField);
        }

        /**
         * Conditionally initialize the field's monthly data.
         */
        egus[eguId].monthly[field][month] ??= { pre: 0, post: 0 };

        /**
         * Increment the field's monthly pre and post values.
         */
        egus[eguId].monthly[field][month].pre += pre;
        egus[eguId].monthly[field][month].post += post;
      });
    });
  }

  return { hourlyImpacts, yearlyImpacts, egus };
}

/**
 * Creates initial (empty) monthly power sector data.
 */
function createEmptyMonthlyPowerData() {
  const result = [...Array(12)].reduce(
    (object, _item, index) => {
      object[index + 1] = { pre: 0, post: 0 };
      return object;
    },
    {} as EguData["monthly"][keyof EguData["monthly"]],
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
        annual: { pre: 0, post: 0 },
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
 * Sum the provided EGUs emissions data into monthly and annual pre and post
 * values for each pollutant.
 */
export function calculateAggregatedEmissionsData(
  emissionChanges: EmissionsChanges,
) {
  if (Object.keys(emissionChanges.egus).length === 0) return null;

  const result = Object.values(emissionChanges.egus).reduce(
    (object, eguData) => {
      const regionId = eguData.region as RegionId;
      const stateId = eguData.state as StateId;
      const county = eguData.county;

      object.regions[regionId] ??= createInitialEmissionsData();
      object.states[stateId] ??= createInitialEmissionsData();
      object.counties[stateId] ??= {};
      object.counties[stateId][county] ??= createInitialEmissionsData();

      Object.entries(eguData.monthly).forEach(([fieldKey, fieldValue]) => {
        const field = fieldKey as keyof typeof eguData.monthly;

        Object.entries(fieldValue).forEach(([monthKey, monthValue]) => {
          const month = Number(monthKey);
          const { pre, post } = monthValue;

          const powerTotal = object.total[field].power;
          const powerRegions = object.regions[regionId][field].power;
          const powerStates = object.states[stateId][field].power;
          const powerCounties = object.counties[stateId][county][field].power;

          if (powerTotal && powerRegions && powerStates && powerCounties) {
            powerTotal.annual.pre += pre;
            powerTotal.annual.post += post;
            powerTotal.monthly[month].pre += pre;
            powerTotal.monthly[month].post += post;

            powerRegions.annual.pre += pre;
            powerRegions.annual.post += post;
            powerRegions.monthly[month].pre += pre;
            powerRegions.monthly[month].post += post;

            powerStates.annual.pre += pre;
            powerStates.annual.post += post;
            powerStates.monthly[month].pre += pre;
            powerStates.monthly[month].post += post;

            powerCounties.annual.pre += pre;
            powerCounties.annual.post += post;
            powerCounties.monthly[month].pre += pre;
            powerCounties.monthly[month].post += post;
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
  selectedRegionsMonthlyEmissionChangesTotals:
    | SelectedRegionsMonthlyEmissionChangesTotals
    | EmptyObject;
  vehicleEmissionChangesByGeography:
    | VehicleEmissionChangesByGeography
    | EmptyObject;
}) {
  const {
    aggregatedEmissionsData,
    selectedRegionsMonthlyEmissionChangesTotals,
    vehicleEmissionChangesByGeography,
  } = options;

  if (
    !aggregatedEmissionsData ||
    Object.keys(selectedRegionsMonthlyEmissionChangesTotals).length === 0 ||
    Object.keys(vehicleEmissionChangesByGeography).length === 0
  ) {
    return null;
  }

  /**
   * Format `selectedRegionsChangesData` for storing regional and total monthly
   * emission changes per pollutant.
   */
  const monthlyChangesData = Object.entries(
    selectedRegionsMonthlyEmissionChangesTotals,
  ).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEmissionChangesTotals; // prettier-ignore

      object[regionId] ??= { co2: {}, nox: {}, so2: {}, pm25: {}, vocs: {}, nh3: {} }; // prettier-ignore

      Object.entries(regionValue).forEach(
        ([regionMonthKey, regionMonthValue]) => {
          const month = Number(regionMonthKey);

          Object.entries(regionMonthValue).forEach(([key, value]) => {
            const pollutant = key as keyof typeof regionMonthValue;

            /** Conditionally convert CO2 pounds into tons. */
            const result = pollutant === "co2" ? value / 2000 : value;

            object[regionId][pollutant][month] = -1 * result;
            object.regionTotals[pollutant][month] ??= 0;
            object.regionTotals[pollutant][month] += -1 * result;
          });
        },
      );

      return object;
    },
    {
      regionTotals: { co2: {}, nox: {}, so2: {}, pm25: {}, vocs: {}, nh3: {} },
    } as {
      [regionId in RegionId | "regionTotals"]: {
        [pollutant in "co2" | "nox" | "so2" | "pm25" | "vocs" | "nh3"]: {
          [month: number]: number;
        };
      };
    },
  );

  /** start with power sector emissions data */
  const result = { ...aggregatedEmissionsData };

  /** add total transportation sector emissions data */
  Object.keys(result.total).forEach((key) => {
    const pollutant = key as keyof typeof result.total;

    const annualVehicleData =
      pollutant !== "generation" &&
      pollutant in vehicleEmissionChangesByGeography.total
        ? vehicleEmissionChangesByGeography.total[pollutant]
        : 0;

    const monthlyVehicleData =
      pollutant !== "generation" && pollutant in monthlyChangesData.regionTotals
        ? monthlyChangesData.regionTotals[pollutant]
        : null;

    result.total[pollutant].vehicle.annual = annualVehicleData;
    result.total[pollutant].vehicle.monthly = monthlyVehicleData;
  });

  /** add region level transportation sector emissions data */
  Object.keys(vehicleEmissionChangesByGeography.regions).forEach((key) => {
    const regionId = key as keyof typeof vehicleEmissionChangesByGeography.regions; // prettier-ignore

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

      const annualVehicleData =
        pollutant !== "generation" &&
        pollutant in vehicleEmissionChangesByGeography.regions[regionId]
          ? vehicleEmissionChangesByGeography.regions[regionId][pollutant]
          : 0;

      const monthlyVehicleData =
        pollutant !== "generation" &&
        pollutant in monthlyChangesData[regionId][pollutant]
          ? monthlyChangesData[regionId][pollutant]
          : null;

      region[pollutant].vehicle.annual = annualVehicleData;
      region[pollutant].vehicle.monthly = monthlyVehicleData;
    });
  });

  /** add state level transportation sector annual emissions data */
  Object.keys(vehicleEmissionChangesByGeography.states).forEach((key) => {
    const stateId = key as keyof typeof vehicleEmissionChangesByGeography.states; // prettier-ignore

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

      const annualVehicleData =
        pollutant !== "generation" &&
        pollutant in vehicleEmissionChangesByGeography.states[stateId]
          ? vehicleEmissionChangesByGeography.states[stateId][pollutant]
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
  Object.entries(vehicleEmissionChangesByGeography.counties).forEach(
    ([key, value]) => {
      const stateId = key as keyof typeof vehicleEmissionChangesByGeography.counties; // prettier-ignore

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

          const annualVehicleData =
            pollutant !== "generation" &&
            pollutant in vehicleEmissionChangesByGeography.counties[stateId][countyName] // prettier-ignore
              ? vehicleEmissionChangesByGeography.counties[stateId][countyName][pollutant] // prettier-ignore
              : 0;

          county[pollutant].vehicle.annual = annualVehicleData;
        });
      });
    },
  );

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
