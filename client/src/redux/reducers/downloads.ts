import { type AppThunk } from "@/redux/index";
import { type EgusNeeingEmissionsReplacement } from "@/redux/reducers/results";
import {
  type EmissionsData,
  type EmissionsFlagsField,
  type CombinedSectorsEmissionsData,
} from "@/calculations/emissions";
import {
  type CountyFIPS,
  type RegionId,
  regions as regionsConfig,
  states as statesConfig,
} from "@/config";
/**
 * Excel: "CountyFIPS" sheet.
 */
import countyFipsData from "@/data/county-fips.json";

/**
 * Work around due to TypeScript inability to infer types from large JSON files.
 */
const countyFips = countyFipsData as CountyFIPS;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const emissionsFields = [
  "Power Sector: Annual",
  "Power Sector: January",
  "Power Sector: February",
  "Power Sector: March",
  "Power Sector: April",
  "Power Sector: May",
  "Power Sector: June",
  "Power Sector: July",
  "Power Sector: August",
  "Power Sector: September",
  "Power Sector: October",
  "Power Sector: November",
  "Power Sector: December",
  "Vehicles: Annual",
  "Vehicles: January",
  "Vehicles: February",
  "Vehicles: March",
  "Vehicles: April",
  "Vehicles: May",
  "Vehicles: June",
  "Vehicles: July",
  "Vehicles: August",
  "Vehicles: September",
  "Vehicles: October",
  "Vehicles: November",
  "Vehicles: December",
] as const;

type Pollutant = "SO2" | "NOX" | "CO2" | "PM25" | "VOCS" | "NH3";

type CountyData = {
  "Aggregation level": string;
  State: string | null;
  County: string | null;
  "State FIPS Code": string | null;
  "County FIPS Code": string | null;
  Pollutant: Pollutant;
  "Unit of measure": "percent" | "emissions (tons)" | "emissions (pounds)";
} & {
  [field in (typeof emissionsFields)[number]]: number | null;
};

type CobraData = {
  FIPS: string;
  STATE: string;
  COUNTY: string;
  TIER1NAME: "FUEL COMB. ELEC. UTIL." | "Highway Vehicles";
  NOx_REDUCTIONS_TONS: number;
  SO2_REDUCTIONS_TONS: number;
  PM25_REDUCTIONS_TONS: number;
  VOCS_REDUCTIONS_TONS: number;
  NH3_REDUCTIONS_TONS: number;
};

type Action = {
  type: "downloads/SET_DOWNLOAD_DATA";
  payload: {
    countyData: CountyData[];
    cobraData: CobraData[];
  };
};

type State = {
  countyData: CountyData[];
  cobraData: CobraData[];
};

const initialState: State = {
  countyData: [],
  cobraData: [],
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case "downloads/SET_DOWNLOAD_DATA": {
      const { countyData, cobraData } = action.payload;

      return {
        ...state,
        countyData: countyData,
        cobraData: cobraData,
      };
    }

    default: {
      return state;
    }
  }
}

export function setDownloadData(): AppThunk {
  return (dispatch, getState) => {
    const { results } = getState();
    const { combinedSectorsEmissionsData, egusNeedingEmissionsReplacement } =
      results;

    const countyData = formatCountyDownloadData({
      combinedSectorsEmissionsData,
      egusNeedingEmissionsReplacement,
    });

    const cobraData = formatCobraDownloadData(combinedSectorsEmissionsData);

    dispatch({
      type: "downloads/SET_DOWNLOAD_DATA",
      payload: {
        countyData,
        cobraData,
      },
    });
  };
}

/**
 * Formats monthly emissions data to support downloading the data as a CSV file,
 * for more detailed exploration of the data at a county, state, and regional
 * level.
 */
function formatCountyDownloadData(options: {
  combinedSectorsEmissionsData: CombinedSectorsEmissionsData;
  egusNeedingEmissionsReplacement: EgusNeeingEmissionsReplacement;
}) {
  const { combinedSectorsEmissionsData, egusNeedingEmissionsReplacement } =
    options;

  const result: CountyData[] = [];

  if (!combinedSectorsEmissionsData) return result;

  const { total, regions, states, counties } = combinedSectorsEmissionsData;
  const pollutantsRows = createOrderedPollutantsRows();
  const egusNeedingReplacement = Object.values(egusNeedingEmissionsReplacement);

  /**
   * Conditionally add all affected regions power sector data
   * (will only occur a state was selected that's part of multiple regions)
   */
  if (Object.keys(regions).length > 1) {
    const totalRows = [...pollutantsRows].reduce((array, row) => {
      const { pollutant, unit } = row;

      const pollutantNeedsReplacement = egusNeedingReplacement.some((egu) => {
        return egu.emissionsFlags.includes(pollutant as EmissionsFlagsField);
      });

      const emissionsFields = createEmissionsFields({
        pollutantNeedsReplacement,
        data: total[pollutant],
        unit,
      });

      if (emissionsFields) {
        array.push({
          "Aggregation level": "All Affected Regions",
          State: null,
          County: null,
          "State FIPS Code": null,
          "County FIPS Code": null,
          Pollutant: pollutant.toUpperCase() as Pollutant,
          "Unit of measure": unit,
          ...emissionsFields,
        });
      }

      return array;
    }, [] as CountyData[]);

    result.push(...totalRows);
  }

  /**
   * Add power sector region data
   */
  Object.entries(regions).forEach(([regionId, regionData]) => {
    const regionsRows = [...pollutantsRows].reduce((array, row) => {
      const { pollutant, unit } = row;

      const pollutantNeedsReplacement = egusNeedingReplacement.some((egu) => {
        return (
          egu.emissionsFlags.includes(pollutant as EmissionsFlagsField) &&
          egu.region === regionId
        );
      });

      const emissionsFields = createEmissionsFields({
        pollutantNeedsReplacement,
        data: regionData[pollutant],
        unit,
      });

      if (emissionsFields) {
        array.push({
          "Aggregation level": `${regionsConfig[regionId as RegionId].name} Region`, // prettier-ignore
          State: null,
          County: null,
          "State FIPS Code": null,
          "County FIPS Code": null,
          Pollutant: pollutant.toUpperCase() as Pollutant,
          "Unit of measure": unit,
          ...emissionsFields,
        });
      }

      return array;
    }, [] as CountyData[]);

    result.push(...regionsRows);
  });

  /**
   * Add power sector state data
   */
  Object.entries(states).forEach(([stateId, stateData]) => {
    const fipsCode =
      countyFips
        .find((data) => data["Postal State Code"] === stateId)
        ?.["State and County FIPS Code"]?.toString() || "";

    const statesRows = [...pollutantsRows].reduce((array, row) => {
      const { pollutant, unit } = row;

      const pollutantNeedsReplacement = egusNeedingReplacement.some((egu) => {
        return (
          egu.emissionsFlags.includes(pollutant as EmissionsFlagsField) &&
          egu.state === stateId
        );
      });

      const emissionsFields = createEmissionsFields({
        pollutantNeedsReplacement,
        data: stateData[pollutant],
        unit,
      });

      if (emissionsFields) {
        array.push({
          "Aggregation level": "State",
          State: stateId,
          County: null,
          "State FIPS Code": fipsCode ? fipsCode.substring(0, 2) : null,
          "County FIPS Code": null,
          Pollutant: pollutant.toUpperCase() as Pollutant,
          "Unit of measure": unit,
          ...emissionsFields,
        });
      }

      return array;
    }, [] as CountyData[]);

    result.push(...statesRows);
  });

  /**
   * Add power sector county data
   */
  Object.entries(counties).forEach(([stateId, stateData]) => {
    Object.entries(stateData).forEach(([countyName, countyData]) => {
      const fipsCode =
        countyFips.find(
          (data) =>
            data["Postal State Code"] === stateId &&
            data["County Name Long"] === countyName,
        )?.["State and County FIPS Code"] || "";

      const countiesRows = [...pollutantsRows].reduce((array, row) => {
        const { pollutant, unit } = row;

        const pollutantNeedsReplacement = egusNeedingReplacement.some((egu) => {
          return (
            egu.emissionsFlags.includes(pollutant as EmissionsFlagsField) &&
            egu.state === stateId &&
            egu.county === countyName
          );
        });

        const emissionsFields = createEmissionsFields({
          pollutantNeedsReplacement,
          data: countyData[pollutant],
          unit,
        });

        if (emissionsFields) {
          array.push({
            "Aggregation level": "County",
            State: stateId,
            County: countyName.replace(/city/, "(City)"), // format 'city'
            "State FIPS Code": null,
            "County FIPS Code": fipsCode,
            Pollutant: pollutant.toUpperCase() as Pollutant,
            "Unit of measure": unit,
            ...emissionsFields,
          });
        }

        return array;
      }, [] as CountyData[]);

      result.push(...countiesRows);
    });
  });

  return result;
}

/**
 * Creates an array of pollutants (in a specific order) for first storing
 * emissions data for those pollutants, followed immediately by the same set of
 * pollutants for storing percent data.
 *
 * These sets arrays are created for each level of data returned in the
 * downloadable county data: all affected regions (if data contains multiple
 * regions), each region, each state, and each county.
 */
function createOrderedPollutantsRows() {
  const pollutants = ["so2", "nox", "co2", "pm25", "vocs", "nh3"] as const;

  const emissionsRows = pollutants.map((pollutant) => {
    return {
      pollutant,
      unit: `emissions (${pollutant === "co2" ? "tons" : "pounds"})` as const,
    };
  });

  const percentRows = pollutants.map((pollutant) => {
    return {
      pollutant,
      unit: "percent" as const,
    };
  });

  return [...emissionsRows, ...percentRows];
}

/**
 * Creates annual and monthly power sector data fields for either emissions
 * changes or percentage changes, and transportation sector annual emission
 * changes for use in the downloadable county data.
 */
function createEmissionsFields(options: {
  pollutantNeedsReplacement: boolean;
  data: EmissionsData[keyof EmissionsData];
  unit: "percent" | "emissions (tons)" | "emissions (pounds)";
}) {
  const { pollutantNeedsReplacement, data, unit } = options;

  const powerData = data.power;
  const vehicleData = data.vehicle;

  const result = {
    "Power Sector: Annual": null,
    "Power Sector: January": null,
    "Power Sector: February": null,
    "Power Sector: March": null,
    "Power Sector: April": null,
    "Power Sector: May": null,
    "Power Sector: June": null,
    "Power Sector: July": null,
    "Power Sector: August": null,
    "Power Sector: September": null,
    "Power Sector: October": null,
    "Power Sector: November": null,
    "Power Sector: December": null,
    "Vehicles: Annual": null,
    "Vehicles: January": null,
    "Vehicles: February": null,
    "Vehicles: March": null,
    "Vehicles: April": null,
    "Vehicles: May": null,
    "Vehicles: June": null,
    "Vehicles: July": null,
    "Vehicles: August": null,
    "Vehicles: September": null,
    "Vehicles: October": null,
    "Vehicles: November": null,
    "Vehicles: December": null,
  } as { [field in (typeof emissionsFields)[number]]: number | null };

  if (powerData) {
    const annualData = powerData.annual;
    const annualEmissionsChange = annualData.post - annualData.pre;
    const annualPercentChange = (annualEmissionsChange / annualData.pre) * 100 || 0; // prettier-ignore
    const annualPowerData =
      unit === "percent" ? annualPercentChange : annualEmissionsChange;

    const monthlyPowerData = Object.entries(powerData.monthly).reduce(
      (object, [key, values]) => {
        const month = Number(key);
        const { pre, post } = values;

        const monthlyEmissionsChange = post - pre;
        const monthlyPercentChange = (monthlyEmissionsChange / pre) * 100 || 0;

        object[month] =
          unit === "percent"
            ? pollutantNeedsReplacement
              ? null
              : monthlyPercentChange
            : monthlyEmissionsChange;

        return object;
      },
      {} as { [month: number]: number | null },
    );

    result["Power Sector: Annual"] = annualPowerData;
    result["Power Sector: January"] = monthlyPowerData[1];
    result["Power Sector: February"] = monthlyPowerData[2];
    result["Power Sector: March"] = monthlyPowerData[3];
    result["Power Sector: April"] = monthlyPowerData[4];
    result["Power Sector: May"] = monthlyPowerData[5];
    result["Power Sector: June"] = monthlyPowerData[6];
    result["Power Sector: July"] = monthlyPowerData[7];
    result["Power Sector: August"] = monthlyPowerData[8];
    result["Power Sector: September"] = monthlyPowerData[9];
    result["Power Sector: October"] = monthlyPowerData[10];
    result["Power Sector: November"] = monthlyPowerData[11];
    result["Power Sector: December"] = monthlyPowerData[12];
  }

  if (unit !== "percent") {
    result["Vehicles: Annual"] = vehicleData.annual;

    if (vehicleData.monthly) {
      result["Vehicles: January"] = vehicleData.monthly[1];
      result["Vehicles: February"] = vehicleData.monthly[2];
      result["Vehicles: March"] = vehicleData.monthly[3];
      result["Vehicles: April"] = vehicleData.monthly[4];
      result["Vehicles: May"] = vehicleData.monthly[5];
      result["Vehicles: June"] = vehicleData.monthly[6];
      result["Vehicles: July"] = vehicleData.monthly[7];
      result["Vehicles: August"] = vehicleData.monthly[8];
      result["Vehicles: September"] = vehicleData.monthly[9];
      result["Vehicles: October"] = vehicleData.monthly[10];
      result["Vehicles: November"] = vehicleData.monthly[11];
      result["Vehicles: December"] = vehicleData.monthly[12];
    }
  }

  return result;
}

/**
 * Formats monthly emissions data to support downloading the data as a CSV file,
 * for use within the COBRA application.
 */
function formatCobraDownloadData(
  combinedSectorsEmissionsData: CombinedSectorsEmissionsData,
) {
  const powerData: CobraData[] = [];
  const vehicleData: CobraData[] = [];

  if (!combinedSectorsEmissionsData) {
    return [];
  }

  const countyEmissionsData = combinedSectorsEmissionsData.counties;

  Object.entries(countyEmissionsData).forEach(([key, value]) => {
    Object.entries(value).forEach(([countyName, countyData]) => {
      const stateId = key as keyof typeof countyEmissionsData;
      const state = statesConfig[stateId].name;
      const county = countyName.replace(/city/, "(City)"); // format 'city'
      const fipsCode =
        countyFips.find(
          (data) =>
            data["State Name"] === state &&
            data["County Name Long"] === countyName,
        )?.["State and County FIPS Code"] || "";

      const { power, vehicle } = Object.entries(countyData).reduce(
        (object, [countyDataKey, countyDataValue]) => {
          const pollutant = countyDataKey as keyof typeof countyData;
          const countyPowerData = countyDataValue.power;
          const countyVehicleData = countyDataValue.vehicle;

          if (pollutant !== "generation" && pollutant !== "co2") {
            if (countyPowerData !== null) {
              const monthlyPowerData = countyPowerData.monthly;

              object.power ??= { so2: 0, nox: 0, pm25: 0, vocs: 0, nh3: 0 };
              object.power[pollutant] = Object.values(monthlyPowerData).reduce(
                (total, data) => (total += data.post - data.pre),
                0,
              );
            }

            object.vehicle[pollutant] = countyVehicleData.annual;
          }

          return object;
        },
        {
          power: null,
          vehicle: { so2: 0, nox: 0, pm25: 0, vocs: 0, nh3: 0 },
        } as {
          power: { so2: number; nox: number; pm25: number; vocs: number; nh3: number } | null; // prettier-ignore
          vehicle: { so2: number; nox: number; pm25: number; vocs: number; nh3: number }; // prettier-ignore
        },
      );

      if (power) {
        powerData.push({
          FIPS: fipsCode,
          STATE: state,
          COUNTY: county,
          TIER1NAME: "FUEL COMB. ELEC. UTIL." as const,
          NOx_REDUCTIONS_TONS: Number((power.nox / 2_000).toFixed(3)),
          SO2_REDUCTIONS_TONS: Number((power.so2 / 2_000).toFixed(3)),
          PM25_REDUCTIONS_TONS: Number((power.pm25 / 2_000).toFixed(3)),
          VOCS_REDUCTIONS_TONS: Number((power.vocs / 2_000).toFixed(3)),
          NH3_REDUCTIONS_TONS: Number((power.nh3 / 2_000).toFixed(3)),
        });
      }

      vehicleData.push({
        FIPS: fipsCode,
        STATE: state,
        COUNTY: county,
        TIER1NAME: "Highway Vehicles" as const,
        NOx_REDUCTIONS_TONS: Number((vehicle.nox / 2_000).toFixed(3)),
        SO2_REDUCTIONS_TONS: Number((vehicle.so2 / 2_000).toFixed(3)),
        PM25_REDUCTIONS_TONS: Number((vehicle.pm25 / 2_000).toFixed(3)),
        VOCS_REDUCTIONS_TONS: Number((vehicle.vocs / 2_000).toFixed(3)),
        NH3_REDUCTIONS_TONS: Number((vehicle.nh3 / 2_000).toFixed(3)),
      });
    });
  });

  return [...powerData, ...vehicleData];
}
