import {
  type GeographicFocus,
  type RegionalLoadData,
  type RegionState,
} from "@/redux/reducers/geography";
import {
  type RegionalScalingFactors,
  type ClimateAdjustmentFactorByRegion,
  type SelectedGeographyRegions,
} from "@/calculations/geography";
import { type EmptyObject, sortObjectByKeys } from "@/utilities";
import {
  type CountyFIPS,
  type MOVESEmissionRates,
  type StateLevelVMT,
  type StateLevelSales,
  type FHWALDVStateLevelVMT,
  type PM25BreakwearTirewearEVICERatios,
  type DefaultEVLoadProfiles,
  type EVEfficiencyAssumptions,
  type PercentageHybridEVMilesDrivenOnElectricity,
  type SchoolBusMonthlyVMTPercentages,
  type WeekendToWeekdayEVConsumption,
  type LDVsPercentagesByVehicleCategory,
  type HistoricalRegionEEREData,
  type HistoricalStateEEREData,
  type RegionId,
  type RegionName,
  type StateId,
} from "@/config";

const pollutants = ["co2", "nox", "so2", "pm25", "vocs", "nh3"] as const;

/** pollutants with PM2.5 broken out into exhaust, breakwear, and tirewear */
const movesPollutants = [
  "co2",
  "nox",
  "so2",
  "pm25Exhaust",
  "pm25Brakewear",
  "pm25Tirewear",
  "vocs",
  "nh3",
] as const;

const vehicleTypes = [
  "Passenger cars",
  "Passenger trucks",
  "Medium-duty transit buses",
  "Heavy-duty transit buses",
  "Medium-duty school buses",
  "Heavy-duty school buses",
  "Medium-duty other buses",
  "Heavy-duty other buses",
  "Light-duty single unit trucks",
  "Medium-duty single unit trucks",
  "Heavy-duty combination trucks",
  "Combination long-haul trucks",
  "Medium-duty refuse trucks",
  "Heavy-duty refuse trucks",
] as const;

/** vehicle types with passenger cars and trucks broken out into BEV and PHEV */
const expandedVehicleTypes = [
  "BEV passenger cars",
  "BEV passenger trucks",
  "PHEV passenger cars",
  "PHEV passenger trucks",
  "Medium-duty transit buses",
  "Heavy-duty transit buses",
  "Medium-duty school buses",
  "Heavy-duty school buses",
  "Medium-duty other buses",
  "Heavy-duty other buses",
  "Light-duty single unit trucks",
  "Medium-duty single unit trucks",
  "Heavy-duty combination trucks",
  "Combination long-haul trucks",
  "Medium-duty refuse trucks",
  "Heavy-duty refuse trucks",
] as const;

const vehicleTypeFuelTypeCombos = [
  "Passenger cars / Gasoline",
  "Passenger trucks / Gasoline",
  "Medium-duty transit buses / Gasoline",
  "Medium-duty transit buses / Diesel Fuel",
  "Heavy-duty transit buses / Diesel Fuel",
  "Heavy-duty transit buses / Compressed Natural Gas (CNG)",
  "Medium-duty school buses / Gasoline",
  "Medium-duty school buses / Diesel Fuel",
  "Heavy-duty school buses / Diesel Fuel",
  "Medium-duty other buses / Gasoline",
  "Medium-duty other buses / Diesel Fuel",
  "Heavy-duty other buses / Diesel Fuel",
  "Heavy-duty other buses / Compressed Natural Gas (CNG)",
  "Light-duty single unit trucks / Gasoline",
  "Medium-duty single unit trucks / Gasoline",
  "Medium-duty single unit trucks / Diesel Fuel",
  "Heavy-duty combination trucks / Diesel Fuel",
  "Combination long-haul trucks / Diesel Fuel",
  "Medium-duty refuse trucks / Diesel Fuel",
  "Heavy-duty refuse trucks / Diesel Fuel",
] as const;

const vehicleTypeEVFuelTypeCombos = [
  "Passenger cars / Electricity",
  "Passenger trucks / Electricity",
  "Medium-duty transit buses / Electricity",
  "Heavy-duty transit buses / Electricity",
  "Medium-duty school buses / Electricity",
  "Heavy-duty school buses / Electricity",
  "Medium-duty other buses / Electricity",
  "Heavy-duty other buses / Electricity",
  "Light-duty single unit trucks / Electricity",
  "Medium-duty single unit trucks / Electricity",
  "Heavy-duty combination trucks / Electricity",
  "Combination long-haul trucks / Electricity",
  "Medium-duty refuse trucks / Electricity",
  "Heavy-duty refuse trucks / Electricity",
] as const;

export const vehicleTypesByVehicleCategory = {
  "Battery EVs": ["Passenger cars", "Passenger trucks"],
  "Plug-in Hybrid EVs": ["Passenger cars", "Passenger trucks"],
  "Transit buses": ["Medium-duty transit buses", "Heavy-duty transit buses"],
  "School buses": ["Medium-duty school buses", "Heavy-duty school buses"],
  "Other buses": ["Medium-duty other buses", "Heavy-duty other buses"],
  "Short-haul trucks": [
    "Light-duty single unit trucks",
    "Medium-duty single unit trucks",
    "Heavy-duty combination trucks",
  ],
  "Long-haul trucks": ["Combination long-haul trucks"],
  "Refuse trucks": ["Medium-duty refuse trucks", "Heavy-duty refuse trucks"],
} as const;

const vehicleCategoryVehicleTypeCombos = [
  "Battery EVs / Passenger cars",
  "Battery EVs / Passenger trucks",
  "Plug-in Hybrid EVs / Passenger cars",
  "Plug-in Hybrid EVs / Passenger trucks",
  "Transit buses / Medium-duty transit buses",
  "Transit buses / Heavy-duty transit buses",
  "School buses / Medium-duty school buses",
  "School buses / Heavy-duty school buses",
  "Other buses / Medium-duty other buses",
  "Other buses / Heavy-duty other buses",
  "Short-haul trucks / Light-duty single unit trucks",
  "Short-haul trucks / Medium-duty single unit trucks",
  "Short-haul trucks / Heavy-duty combination trucks",
  "Long-haul trucks / Combination long-haul trucks",
  "Refuse trucks / Medium-duty refuse trucks",
  "Refuse trucks / Heavy-duty refuse trucks",
] as const;

const vehicleCategoryVehicleTypeFuelTypeCombos = [
  "Battery EVs / Passenger cars / Gasoline",
  "Plug-in Hybrid EVs / Passenger cars / Gasoline",
  "Battery EVs / Passenger trucks / Gasoline",
  "Plug-in Hybrid EVs / Passenger trucks / Gasoline",
  "Transit buses / Medium-duty transit buses / Gasoline",
  "Transit buses / Medium-duty transit buses / Diesel Fuel",
  "Transit buses / Heavy-duty transit buses / Diesel Fuel",
  "Transit buses / Heavy-duty transit buses / Compressed Natural Gas (CNG)",
  "School buses / Medium-duty school buses / Gasoline",
  "School buses / Medium-duty school buses / Diesel Fuel",
  "School buses / Heavy-duty school buses / Diesel Fuel",
  "Other buses / Medium-duty other buses / Gasoline",
  "Other buses / Medium-duty other buses / Diesel Fuel",
  "Other buses / Heavy-duty other buses / Diesel Fuel",
  "Other buses / Heavy-duty other buses / Compressed Natural Gas (CNG)",
  "Short-haul trucks / Light-duty single unit trucks / Gasoline",
  "Short-haul trucks / Medium-duty single unit trucks / Gasoline",
  "Short-haul trucks / Medium-duty single unit trucks / Diesel Fuel",
  "Short-haul trucks / Heavy-duty combination trucks / Diesel Fuel",
  "Long-haul trucks / Combination long-haul trucks / Diesel Fuel",
  "Refuse trucks / Medium-duty refuse trucks / Diesel Fuel",
  "Refuse trucks / Heavy-duty refuse trucks / Diesel Fuel",
] as const;

type Pollutant = (typeof pollutants)[number];
type MovesPollutant = (typeof movesPollutants)[number];
type VehicleType = (typeof vehicleTypes)[number];
type ExpandedVehicleType = (typeof expandedVehicleTypes)[number];
type VehicleTypeFuelTypeCombo = (typeof vehicleTypeFuelTypeCombos)[number];
type VehicleTypeEVFuelTypeCombo = (typeof vehicleTypeEVFuelTypeCombos)[number];
type VehicleTypesByVehicleCategory = typeof vehicleTypesByVehicleCategory;
type VehicleCategoryKey = keyof typeof vehicleTypesByVehicleCategory;
type VehicleCategoryVehicleTypeCombo = (typeof vehicleCategoryVehicleTypeCombos)[number]; // prettier-ignore
type VehicleCategoryVehicleTypeFuelTypeCombo = (typeof vehicleCategoryVehicleTypeFuelTypeCombos)[number]; // prettier-ignore
/**
 * Vehicle categories with "Battery EVs" and "Plug-in Hybrid EVs" replaced with
 * "Passenger cars" and "Passenger trucks" vehicle types.
 */
type VehicleCategoryWithLDVTypes =
  | Exclude<VehicleCategoryKey, "Battery EVs" | "Plug-in Hybrid EVs">
  | "Passenger cars"
  | "Passenger trucks";
/**
 * Vehicle categories used in the Excel "CalculateEERE" sheet don't include the
 * vehicle category of "Other buses".
 */
type VehicleCategoryExcludingOtherBuses = Exclude<
  VehicleCategoryKey,
  "Other buses"
>;

export type HourlyEVLoadProfiles = ReturnType<typeof storeHourlyEVLoadProfiles>;
export type DailyStats = ReturnType<typeof calculateDailyStats>;
export type MonthlyStats = ReturnType<typeof calculateMonthlyStats>;
export type VMTTotalsByGeography = ReturnType<
  typeof calculateVMTTotalsByGeography
>;
export type MonthlyVMTTotals = ReturnType<typeof calculateMonthlyVMTTotals>;
export type YearlyVMTTotals = ReturnType<typeof calculateYearlyVMTTotals>;
export type MonthlyVMTPercentages = ReturnType<
  typeof calculateMonthlyVMTPercentages
>;
export type VMTTotalsByStateRegionCombo = ReturnType<
  typeof calculateVMTTotalsByStateRegionCombo
>;
export type VMTTotalsByRegion = ReturnType<typeof calculateVMTTotalsByRegion>;
export type VMTPercentagesByStateRegionCombo = ReturnType<
  typeof calculateVMTPercentagesByStateRegionCombo
>;
export type VehicleTypeTotals = ReturnType<typeof calculateVehicleTypeTotals>;
export type VehicleCategoryTotals = ReturnType<
  typeof calculateVehicleCategoryTotals
>;
export type VehicleTypePercentagesOfVehicleCategory = ReturnType<
  typeof calculateVehicleTypePercentagesOfVehicleCategory
>;
export type VehicleFuelTypePercentagesOfVehicleType = ReturnType<
  typeof calculateVehicleFuelTypePercentagesOfVehicleType
>;
export type TotalEffectiveVehicles = ReturnType<
  typeof calculateTotalEffectiveVehicles
>;
export type VMTandStockByState = ReturnType<typeof storeVMTandStockByState>;
export type LDVsFhwaMovesVMTRatioByState = ReturnType<
  typeof calculateLDVsFhwaMovesVMTRatioByState
>;
export type VMTPerVehicleTypeByState = ReturnType<
  typeof calculateVMTPerVehicleTypeByState
>;
export type SelectedRegionsVMTPercentagesByState = ReturnType<
  typeof calculateSelectedRegionsVMTPercentagesByState
>;
export type SelectedRegionsAverageVMTPerYear = ReturnType<
  typeof calculateSelectedRegionsAverageVMTPerYear
>;
export type SelectedRegionsMonthlyVMT = ReturnType<
  typeof calculateSelectedRegionsMonthlyVMT
>;
export type SelectedRegionsEVEfficiency = ReturnType<
  typeof calculateSelectedRegionsEVEfficiency
>;
export type SelectedRegionsMonthlyEmissionRates = ReturnType<
  typeof calculateSelectedRegionsMonthlyEmissionRates
>;
export type SelectedRegionsMonthlyElectricityPM25EmissionRates = ReturnType<
  typeof calculateSelectedRegionsMonthlyElectricityPM25EmissionRates
>;
export type SelectedRegionsMonthlyTotalNetPM25EmissionRates = ReturnType<
  typeof calculateSelectedRegionsMonthlyTotalNetPM25EmissionRates
>;
export type SelectedRegionsMonthlySalesChanges = ReturnType<
  typeof calculateSelectedRegionsMonthlySalesChanges
>;
export type SelectedRegionsYearlySalesChanges = ReturnType<
  typeof calculateSelectedRegionsYearlySalesChanges
>;
export type SelectedRegionsTotalYearlySalesChanges = ReturnType<
  typeof calculateSelectedRegionsTotalYearlySalesChanges
>;
export type SelectedRegionsMonthlyEnergyUsage = ReturnType<
  typeof calculateSelectedRegionsMonthlyEnergyUsage
>;
export type SelectedRegionsMonthlyDailyEnergyUsage = ReturnType<
  typeof calculateSelectedRegionsMonthlyDailyEnergyUsage
>;
export type SelectedRegionsMonthlyEmissionChanges = ReturnType<
  typeof calculateSelectedRegionsMonthlyEmissionChanges
>;
export type SelectedRegionsMonthlyEmissionChangesPerVehicleCategory =
  ReturnType<
    typeof calculateSelectedRegionsMonthlyEmissionChangesPerVehicleCategory
  >;
export type SelectedRegionsYearlyEmissionChangesPerVehicleCategory = ReturnType<
  typeof calculateSelectedRegionsYearlyEmissionChangesPerVehicleCategory
>;
export type SelectedRegionsMonthlyEmissionChangesTotals = ReturnType<
  typeof calculateSelectedRegionsMonthlyEmissionChangesTotals
>;
export type SelectedRegionsYearlyEmissionChangesTotals = ReturnType<
  typeof calculateSelectedRegionsYearlyEmissionChangesTotals
>;
export type SelectedGeographySalesAndStockByState = ReturnType<
  typeof calculateSelectedGeographySalesAndStockByState
>;
export type SelectedGeographySalesAndStockByRegion = ReturnType<
  typeof calculateSelectedGeographySalesAndStockByRegion
>;
export type SelectedRegionsEEREDefaultsAverages = ReturnType<
  typeof calculateSelectedRegionsEEREDefaultsAverages
>;
export type EVDeploymentLocationHistoricalEERE = ReturnType<
  typeof calculateEVDeploymentLocationHistoricalEERE
>;
export type VehicleEmissionChangesByGeography = ReturnType<
  typeof calculateVehicleEmissionChangesByGeography
>;

/**
 * Hourly weekday and weekend load profiles for each vehicle category.
 *
 * Excel: Data from the top of the middle table in the "CalculateEERE" sheet
 * (V9:AI32).
 */
export function storeHourlyEVLoadProfiles(options: {
  defaultEVLoadProfiles: DefaultEVLoadProfiles;
}) {
  const { defaultEVLoadProfiles } = options;

  const result = Object.values(defaultEVLoadProfiles).reduce(
    (object, data) => {
      const hour = data["Hour Ending"];

      object[hour] ??= {} as {
        [vehicleCategory in VehicleCategoryExcludingOtherBuses]: {
          weekday: number;
          weekend: number;
        };
      };

      Object.entries(data).forEach(([key, value]) => {
        if (key !== "Hour Ending" && typeof value === "object") {
          const vehicleCategory = key as Exclude<keyof typeof data, "Hour Ending">; // prettier-ignore

          /**
           * NOTE: "Battery EVs" and "Plug-in Hybrid EVs" use a single
           * "LDVs" default EV Load Profile.
           */
          if (vehicleCategory === "LDVs") {
            object[hour]["Battery EVs"] = value;
            object[hour]["Plug-in Hybrid EVs"] = value;
          } else {
            object[hour][vehicleCategory] = value;
          }
        }
      });

      return object;
    },
    {} as {
      [hour: number]: {
        [vehicleCategory in VehicleCategoryExcludingOtherBuses]: {
          weekday: number;
          weekend: number;
        };
      };
    },
  );

  return result;
}

/**
 * Build up daily stats object by looping through every hour of the year,
 * (only creates objects and sets their keys in the first hour of each month).
 *
 * NOTE: Not in Excel, but used to build up the monthly stats object.
 */
export function calculateDailyStats(options: {
  regionalLoad?: RegionalLoadData[];
}) {
  const { regionalLoad } = options;

  const result: {
    [month: number]: {
      [day: number]: {
        dayOfWeek: number;
        isWeekend: boolean;
      };
    };
  } = {};

  if (!regionalLoad || regionalLoad.length === 0) {
    return result;
  }

  regionalLoad.forEach((data) => {
    if (!result[data.month]?.[data.day]) {
      const datetime = new Date(data.year, data.month - 1, data.day, data.hour);
      const dayOfWeek = datetime.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      result[data.month] ??= {};
      result[data.month][data.day] = {
        dayOfWeek,
        isWeekend,
      };
    }
  });

  return result;
}

/**
 * Build up monthly stats object from daily stats object.
 *
 * Excel: Data from the bottom of the middle table in the "CalculateEERE" sheet
 * (U50:X61).
 */
export function calculateMonthlyStats(options: { dailyStats: DailyStats }) {
  const { dailyStats } = options;

  const result: {
    [month: number]: {
      totalDays: number;
      weekdays: number;
      weekends: number;
    };
  } = {};

  if (Object.keys(dailyStats).length === 0) {
    return result;
  }

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    const totalDays = Object.keys(dailyStats[month]).length;
    const weekends = Object.values(dailyStats[month]).reduce(
      (total, day) => (day.isWeekend ? ++total : total),
      0,
    );
    const weekdays = totalDays - weekends;

    result[month] = {
      totalDays,
      weekdays,
      weekends,
    };
  });

  return result;
}

/**
 * Aggregates total county level VMT data per vehicle category by county, state,
 * and AVERT region (region total, as well as state totals within each region)
 * from County FIPS data.
 *
 * Excel: Not stored in any table, but used in calculating values in the "From
 * vehicles" column in the table in the "11_VehicleCty" sheet (column H).
 *
 * The formula for the "From vehicles" column is incredibly long and complex, so
 * this function is used to break out and store the results of lot of those
 * individual of those calculations (which are added, subtracted, multiplied,
 * and divided). For example, the following is a tiny snippet from the Excel
 * formula that sums the VMT of all passenger cars for the AVERT region that the
 * particular county falls within:
 * `SUMIFS(CountyFIPS!$K:$K,CountyFIPS!$E:$E,regionNameLibrary`
 *
 * It's also more efficient to calculate these values once and store them, as
 * there's no reason to loop through the entire County FIPS data set and
 * re-calculate them every time the EV deployment location changes.
 */
export function calculateVMTTotalsByGeography(options: {
  regionIdsByRegionName: {
    [regionName: string]: RegionId;
  };
  countyFips: CountyFIPS;
}) {
  const { regionIdsByRegionName, countyFips } = options;

  const result = countyFips.reduce(
    (object, data) => {
      const regionId = regionIdsByRegionName[data["AVERT Region"]];
      const stateId = data["Postal State Code"] as StateId;
      const county = data["County Name Long"];

      const vmtData = {
        "Passenger cars": data["VMT"]["Passenger cars"] || 0,
        "Passenger trucks": data["VMT"]["Passenger trucks"] || 0,
        "Transit buses": data["VMT - Collapsed"]["Transit buses"] || 0,
        "School buses": data["VMT - Collapsed"]["School buses"] || 0,
        "Other buses": data["VMT - Collapsed"]["Other buses"] || 0,
        "Short-haul trucks": data["VMT - Collapsed"]["Short-haul trucks"] || 0,
        "Long-haul trucks": data["VMT"]["Combination long-haul trucks"] || 0,
        "Refuse trucks": data["VMT - Collapsed"]["Refuse trucks"] || 0,
      };

      if (regionId) {
        object.regions[regionId] ??= {
          total: {
            "Passenger cars": 0,
            "Passenger trucks": 0,
            "Transit buses": 0,
            "School buses": 0,
            "Other buses": 0,
            "Short-haul trucks": 0,
            "Long-haul trucks": 0,
            "Refuse trucks": 0,
          },
          states: {} as {
            [stateId in StateId]: {
              [vehicleCategory in VehicleCategoryWithLDVTypes]: number;
            };
          },
        };

        object.regions[regionId].states[stateId] ??= {
          "Passenger cars": 0,
          "Passenger trucks": 0,
          "Transit buses": 0,
          "School buses": 0,
          "Other buses": 0,
          "Short-haul trucks": 0,
          "Long-haul trucks": 0,
          "Refuse trucks": 0,
        };

        object.states[stateId] ??= {
          "Passenger cars": 0,
          "Passenger trucks": 0,
          "Transit buses": 0,
          "School buses": 0,
          "Other buses": 0,
          "Short-haul trucks": 0,
          "Long-haul trucks": 0,
          "Refuse trucks": 0,
        };

        object.counties[stateId] ??= {};
        object.counties[stateId][county] ??= {
          "Passenger cars": 0,
          "Passenger trucks": 0,
          "Transit buses": 0,
          "School buses": 0,
          "Other buses": 0,
          "Short-haul trucks": 0,
          "Long-haul trucks": 0,
          "Refuse trucks": 0,
        };

        Object.entries(vmtData).forEach(([vmtDataKey, vmtDataValue]) => {
          const vehicleType = vmtDataKey as keyof typeof vmtData;

          object.regions[regionId].total[vehicleType] += vmtDataValue;
          object.regions[regionId].states[stateId][vehicleType] += vmtDataValue;
          object.states[stateId][vehicleType] += vmtDataValue;
          object.counties[stateId][county][vehicleType] += vmtDataValue;
        });
      }

      return object;
    },
    {
      regions: {},
      states: {},
      counties: {},
    } as {
      regions: {
        [regionId in RegionId]: {
          total: {
            [vehicleCategory in VehicleCategoryWithLDVTypes]: number;
          };
          states: {
            [stateId in StateId]: {
              [vehicleCategory in VehicleCategoryWithLDVTypes]: number;
            };
          };
        };
      };
      states: {
        [stateId in StateId]: {
          [vehicleCategory in VehicleCategoryWithLDVTypes]: number;
        };
      };
      counties: {
        [stateId in StateId]: {
          [county: string]: {
            [vehicleCategory in VehicleCategoryWithLDVTypes]: number;
          };
        };
      };
    },
  );

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

/**
 * Total vehicle miles traveled (VMT) for each month for each vehicle type /
 * fuel type combo.
 *
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (E245:P264).
 */
export function calculateMonthlyVMTTotals(options: {
  movesEmissionRates: MOVESEmissionRates;
}) {
  const { movesEmissionRates } = options;

  /**
   * The Excel formula uses the following columns from the "MOVESEmissionRates"
   * sheet's "ICE vehicle emission rates" table:
   * - column B: Year
   * - column C: Month
   * - column F: Vehicle Type
   * - column G: Fuel Type
   * - column H: First-Year State Data – VMT (miles)
   * - column R: Fleet Average State Data – VMT (miles)
   *
   * For each month of the initial year, we'll build up the sum of the two VMT
   * (vehicle miles traveled) values (both first-year and fleet average) for
   * each vehicle type (e.g., "Passenger Car") and fuel type (e.g., "Gasoline")
   * combo.
   *
   * Each row in the Excel table is a state's data for that vehicle type / fuel
   * type combo, so we're getting the monthly sum of the two VMT values for each
   * vehicle type / fuel type combo across all states for the initial year.
   */
  const result: {
    [month: number]: {
      [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
    };
  } = {};

  const initialYear = movesEmissionRates[0].year;

  movesEmissionRates.forEach((data) => {
    const { year, vehicleType, fuelType, firstYear, fleetAverage } = data;

    const month = Number(data.month);

    const vehicleFuelCombo =
      `${vehicleType} / ${fuelType}` as VehicleTypeFuelTypeCombo;

    const vmt = firstYear.vmt + fleetAverage.vmt;

    if (year === initialYear) {
      result[month] ??= {
        "Passenger cars / Gasoline": 0,
        "Passenger trucks / Gasoline": 0,
        "Medium-duty transit buses / Gasoline": 0,
        "Medium-duty transit buses / Diesel Fuel": 0,
        "Heavy-duty transit buses / Diesel Fuel": 0,
        "Heavy-duty transit buses / Compressed Natural Gas (CNG)": 0,
        "Medium-duty school buses / Gasoline": 0,
        "Medium-duty school buses / Diesel Fuel": 0,
        "Heavy-duty school buses / Diesel Fuel": 0,
        "Medium-duty other buses / Gasoline": 0,
        "Medium-duty other buses / Diesel Fuel": 0,
        "Heavy-duty other buses / Diesel Fuel": 0,
        "Heavy-duty other buses / Compressed Natural Gas (CNG)": 0,
        "Light-duty single unit trucks / Gasoline": 0,
        "Medium-duty single unit trucks / Gasoline": 0,
        "Medium-duty single unit trucks / Diesel Fuel": 0,
        "Heavy-duty combination trucks / Diesel Fuel": 0,
        "Combination long-haul trucks / Diesel Fuel": 0,
        "Medium-duty refuse trucks / Diesel Fuel": 0,
        "Heavy-duty refuse trucks / Diesel Fuel": 0,
      };

      if (vehicleFuelCombo in result[month]) {
        result[month][vehicleFuelCombo] += vmt;
      }
    }
  });

  return result;
}

/**
 * Total vehicle miles traveled (VMT) for the year for each vehicle type / fuel
 * type combo.
 *
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (Q245:Q264).
 */
export function calculateYearlyVMTTotals(options: {
  monthlyVMTTotals: MonthlyVMTTotals | EmptyObject;
}) {
  const { monthlyVMTTotals } = options;

  const result = {
    "Passenger cars / Gasoline": 0,
    "Passenger trucks / Gasoline": 0,
    "Medium-duty transit buses / Gasoline": 0,
    "Medium-duty transit buses / Diesel Fuel": 0,
    "Heavy-duty transit buses / Diesel Fuel": 0,
    "Heavy-duty transit buses / Compressed Natural Gas (CNG)": 0,
    "Medium-duty school buses / Gasoline": 0,
    "Medium-duty school buses / Diesel Fuel": 0,
    "Heavy-duty school buses / Diesel Fuel": 0,
    "Medium-duty other buses / Gasoline": 0,
    "Medium-duty other buses / Diesel Fuel": 0,
    "Heavy-duty other buses / Diesel Fuel": 0,
    "Heavy-duty other buses / Compressed Natural Gas (CNG)": 0,
    "Light-duty single unit trucks / Gasoline": 0,
    "Medium-duty single unit trucks / Gasoline": 0,
    "Medium-duty single unit trucks / Diesel Fuel": 0,
    "Heavy-duty combination trucks / Diesel Fuel": 0,
    "Combination long-haul trucks / Diesel Fuel": 0,
    "Medium-duty refuse trucks / Diesel Fuel": 0,
    "Heavy-duty refuse trucks / Diesel Fuel": 0,
  };

  Object.values(monthlyVMTTotals).forEach((monthValue) => {
    for (const key in monthValue) {
      const vehicleFuelCombo = key as keyof typeof monthValue;

      if (vehicleFuelCombo in result) {
        result[vehicleFuelCombo] += monthValue[vehicleFuelCombo];
      }
    }
  });

  return result;
}

/**
 * Percentage/share of the yearly VMT totals each month has, for each vehicle
 * type / fuel type combo.
 *
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (E266:P285).
 */
export function calculateMonthlyVMTPercentages(options: {
  monthlyVMTTotals: MonthlyVMTTotals | EmptyObject;
  yearlyVMTTotals: YearlyVMTTotals;
  schoolBusMonthlyVMTPercentages: SchoolBusMonthlyVMTPercentages;
}) {
  const { monthlyVMTTotals, yearlyVMTTotals, schoolBusMonthlyVMTPercentages } =
    options;

  const result: {
    [month: number]: {
      [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
    };
  } = {};

  Object.entries(monthlyVMTTotals).forEach(([vmtKey, vmtValue]) => {
    const month = Number(vmtKey);

    result[month] ??= {
      "Passenger cars / Gasoline": 0,
      "Passenger trucks / Gasoline": 0,
      "Medium-duty transit buses / Gasoline": 0,
      "Medium-duty transit buses / Diesel Fuel": 0,
      "Heavy-duty transit buses / Diesel Fuel": 0,
      "Heavy-duty transit buses / Compressed Natural Gas (CNG)": 0,
      "Medium-duty school buses / Gasoline": 0,
      "Medium-duty school buses / Diesel Fuel": 0,
      "Heavy-duty school buses / Diesel Fuel": 0,
      "Medium-duty other buses / Gasoline": 0,
      "Medium-duty other buses / Diesel Fuel": 0,
      "Heavy-duty other buses / Diesel Fuel": 0,
      "Heavy-duty other buses / Compressed Natural Gas (CNG)": 0,
      "Light-duty single unit trucks / Gasoline": 0,
      "Medium-duty single unit trucks / Gasoline": 0,
      "Medium-duty single unit trucks / Diesel Fuel": 0,
      "Heavy-duty combination trucks / Diesel Fuel": 0,
      "Combination long-haul trucks / Diesel Fuel": 0,
      "Medium-duty refuse trucks / Diesel Fuel": 0,
      "Heavy-duty refuse trucks / Diesel Fuel": 0,
    };

    for (const key in vmtValue) {
      const vehicleFuelCombo = key as keyof typeof vmtValue;

      const vehicleIsPassengerVehicle =
        vehicleFuelCombo === "Passenger cars / Gasoline" ||
        vehicleFuelCombo === "Passenger trucks / Gasoline";

      const vehicleIsSchoolBus =
        vehicleFuelCombo === "Medium-duty school buses / Gasoline" ||
        vehicleFuelCombo === "Medium-duty school buses / Diesel Fuel" ||
        vehicleFuelCombo === "Heavy-duty school buses / Diesel Fuel";

      if (vehicleFuelCombo in result[month]) {
        /**
         * Only passenger vehicle percentages are derived from MOVES data.
         */
        if (vehicleIsPassengerVehicle && vehicleFuelCombo in yearlyVMTTotals) {
          result[month][vehicleFuelCombo] = vmtValue[vehicleFuelCombo] / yearlyVMTTotals[vehicleFuelCombo]; // prettier-ignore
          /**
           * School bus percentages are derived from ISO New England's EV forecast.
           */
        } else if (vehicleIsSchoolBus) {
          const monthKey = month.toString() as keyof SchoolBusMonthlyVMTPercentages; // prettier-ignore
          result[month][vehicleFuelCombo] = schoolBusMonthlyVMTPercentages[monthKey]; // prettier-ignore
          /**
           * All other vehicle types assume an equal spread throughout the year.
           */
        } else {
          result[month][vehicleFuelCombo] = 1 / 12;
        }
      }
    }
  });

  return result;
}

/**
 * Total vehicle miles traveled (VMT) in billions by state and AVERT region
 * combo for each vehicle type.
 *
 * Excel: Top left table in the "RegionStateAllocate" sheet (B4:R85)
 */
export function calculateVMTTotalsByStateRegionCombo(options: {
  countyFips: CountyFIPS;
}) {
  const { countyFips } = options;

  const result = countyFips.reduce(
    (object, data) => {
      const stateId = data["Postal State Code"] as StateId;
      const regionName = data["AVERT Region"] as RegionName;
      const stateRegionKey = `${stateId} / ${regionName}`;

      if (!object[stateRegionKey]) {
        object[stateRegionKey] = {
          state: stateId,
          region: regionName,
          vehicleTypes: {
            "Passenger cars": 0,
            "Passenger trucks": 0,
            "Medium-duty transit buses": 0,
            "Heavy-duty transit buses": 0,
            "Medium-duty school buses": 0,
            "Heavy-duty school buses": 0,
            "Medium-duty other buses": 0,
            "Heavy-duty other buses": 0,
            "Light-duty single unit trucks": 0,
            "Medium-duty single unit trucks": 0,
            "Heavy-duty combination trucks": 0,
            "Combination long-haul trucks": 0,
            "Medium-duty refuse trucks": 0,
            "Heavy-duty refuse trucks": 0,
          },
        };
      }

      Object.entries(data["VMT"]).forEach(([vmtKey, vmtValue]) => {
        const vehicle = vmtKey as keyof (typeof data)["VMT"];

        if (vehicle in object[stateRegionKey].vehicleTypes) {
          object[stateRegionKey].vehicleTypes[vehicle] += vmtValue / 1_000_000_000; // prettier-ignore
        }
      });

      return object;
    },
    {} as {
      [stateRegionKey: string]: {
        state: StateId;
        region: RegionName;
        vehicleTypes: {
          [vehicle in VehicleType]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Total vehicle miles traveled (VMT) in billions by AVERT region for each
 * vehicle type.
 *
 * Excel: Bottom left table in the "RegionStateAllocate" sheet (B87:R100)
 */
export function calculateVMTTotalsByRegion(options: {
  vmtTotalsByStateRegionCombo: VMTTotalsByStateRegionCombo;
}) {
  const { vmtTotalsByStateRegionCombo } = options;

  const result = Object.values(vmtTotalsByStateRegionCombo).reduce(
    (object, data) => {
      const region = data.region;

      if (!object[region]) {
        object[region] = {
          "Passenger cars": 0,
          "Passenger trucks": 0,
          "Medium-duty transit buses": 0,
          "Heavy-duty transit buses": 0,
          "Medium-duty school buses": 0,
          "Heavy-duty school buses": 0,
          "Medium-duty other buses": 0,
          "Heavy-duty other buses": 0,
          "Light-duty single unit trucks": 0,
          "Medium-duty single unit trucks": 0,
          "Heavy-duty combination trucks": 0,
          "Combination long-haul trucks": 0,
          "Medium-duty refuse trucks": 0,
          "Heavy-duty refuse trucks": 0,
        };
      }

      Object.entries(data.vehicleTypes).forEach(([vmtKey, vmtValue]) => {
        const vehicle = vmtKey as keyof typeof data.vehicleTypes;

        if (vehicle in object[region]) {
          object[region][vehicle] += vmtValue;
        }
      });

      return object;
    },
    {} as {
      [region in RegionName]: {
        [vehicle in VehicleType]: number;
      };
    },
  );

  return result;
}

/**
 * Percentage/share of each AVERT region's total VMT by state for each vehicle
 * type.
 *
 * Excel: Top right table in the "RegionStateAllocate" sheet (T4:AG85)
 */
export function calculateVMTPercentagesByStateRegionCombo(options: {
  vmtTotalsByStateRegionCombo: VMTTotalsByStateRegionCombo;
  vmtTotalsByRegion: VMTTotalsByRegion;
}) {
  const { vmtTotalsByStateRegionCombo, vmtTotalsByRegion } = options;

  const result = Object.entries(vmtTotalsByStateRegionCombo).reduce(
    (object, [stateRegionKey, stateRegionValue]) => {
      const { state, region } = stateRegionValue;

      if (!object[stateRegionKey]) {
        object[stateRegionKey] = {
          state,
          region,
          vehicleTypes: {
            "Passenger cars": 0,
            "Passenger trucks": 0,
            "Medium-duty transit buses": 0,
            "Heavy-duty transit buses": 0,
            "Medium-duty school buses": 0,
            "Heavy-duty school buses": 0,
            "Medium-duty other buses": 0,
            "Heavy-duty other buses": 0,
            "Light-duty single unit trucks": 0,
            "Medium-duty single unit trucks": 0,
            "Heavy-duty combination trucks": 0,
            "Combination long-haul trucks": 0,
            "Medium-duty refuse trucks": 0,
            "Heavy-duty refuse trucks": 0,
          },
        };
      }

      Object.entries(stateRegionValue.vehicleTypes).forEach(
        ([vmtKey, vmtValue]) => {
          const vehicle = vmtKey as keyof typeof stateRegionValue.vehicleTypes;

          if (
            vehicle in object[stateRegionKey].vehicleTypes &&
            vehicle in vmtTotalsByRegion[region]
          ) {
            const regionTotal = vmtTotalsByRegion[region][vehicle];
            const vmtPercentage = vmtValue / regionTotal;

            object[stateRegionKey].vehicleTypes[vehicle] = vmtPercentage;
          }
        },
      );

      return object;
    },
    {} as {
      [stateRegionKey: string]: {
        state: StateId;
        region: RegionName;
        vehicleTypes: {
          [vehicle in VehicleType]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Total sales/stock (in millions) for each vehicle type.
 *
 * Excel: "Population" column of "Table 12: Vehicle sales by type" table in the
 * "Library" sheet (C965:C983).
 *
 * NOTE: In the Excel file, values for "Passenger cars" and "Passenger trucks"
 * under "Battery EVs" and "Plug-in Hybrid EVs" (C965:C970) are omitted.
 */
export function calculateVehicleTypeTotals(options: {
  stateLevelVMT: StateLevelVMT;
}) {
  const { stateLevelVMT } = options;

  const result = stateLevelVMT.reduce(
    (object, data) => {
      const vehicle = data["Vehicle Type"] as VehicleType;
      const stock = data["2023 Stock (million vehicles)"];

      if (vehicle === "Passenger cars" || vehicle === "Passenger trucks") {
        return object;
      }

      if (!object[vehicle]) {
        object[vehicle] = 0;
      }

      object[vehicle] += stock;

      return object;
    },
    {} as {
      [vehicle in Exclude<
        VehicleType,
        "Passenger cars" | "Passenger trucks"
      >]: number;
    },
  );

  return result;
}

/**
 * Total sales/stock (in millions) for each vehicle category.
 *
 * Excel: "Population" column of "Table 12: Vehicle sales by type" table in the
 * "Library" sheet (C964:C983).
 *
 * NOTE: In the Excel file, values for "Passenger cars" and "Passenger trucks"
 * under "Battery EVs" and "Plug-in Hybrid EVs" (C965:C970) are omitted.
 */
export function calculateVehicleCategoryTotals(options: {
  vehicleTypeTotals: VehicleTypeTotals | EmptyObject;
  vehicleTypesByVehicleCategory: VehicleTypesByVehicleCategory | EmptyObject;
}) {
  const { vehicleTypeTotals, vehicleTypesByVehicleCategory } = options;

  const result = Object.entries(vehicleTypesByVehicleCategory).reduce(
    (object, [categoryKey, categoryValue]) => {
      const category = categoryKey as keyof typeof vehicleTypesByVehicleCategory; // prettier-ignore

      if (category === "Battery EVs" || category === "Plug-in Hybrid EVs") {
        return object;
      }

      const total = categoryValue.reduce((number, vehicle) => {
        if (vehicle === "Passenger cars" || vehicle === "Passenger trucks") {
          return number;
        }

        if (vehicle in vehicleTypeTotals) {
          return number + vehicleTypeTotals[vehicle];
        }

        return number;
      }, 0);

      object[category] = total;

      return object;
    },
    {} as {
      [vehicleCategory in Exclude<
        keyof typeof vehicleTypesByVehicleCategory,
        "Battery EVs" | "Plug-in Hybrid EVs"
      >]: number;
    },
  );

  return result;
}

/**
 * Percentage/share of the total vehicle sales/stock each vehicle type makes up
 * of its vehicle category (e.g. "Battery EVs", "Plug-in Hybrid EVs", "Transit
 * Buses", "School Buses", etc.).
 *
 * Excel: "Vehicle Allocation" column of "Table 12: Vehicle sales by type" table
 * in the "Library" sheet (D965:D983).
 */
export function calculateVehicleTypePercentagesOfVehicleCategory(options: {
  vehicleTypeTotals: VehicleTypeTotals | EmptyObject;
  vehicleCategoryTotals: VehicleCategoryTotals | EmptyObject;
  vehicleTypesByVehicleCategory: VehicleTypesByVehicleCategory;
  ldvsPercentagesByVehicleCategory: LDVsPercentagesByVehicleCategory;
}) {
  const {
    vehicleTypeTotals,
    vehicleCategoryTotals,
    vehicleTypesByVehicleCategory,
    ldvsPercentagesByVehicleCategory,
  } = options;

  const ldvsResult = Object.entries(ldvsPercentagesByVehicleCategory).reduce(
    (object, [categoryKey, categoryValue]) => {
      const category = categoryKey as keyof typeof ldvsPercentagesByVehicleCategory; // prettier-ignore

      Object.entries(categoryValue).forEach(([vehicleKey, vehicleValue]) => {
        const vehicle = vehicleKey as keyof typeof categoryValue;

        const categoryVehicleCombo = `${category} / ${vehicle}` as keyof typeof object; // prettier-ignore

        if (categoryVehicleCombo in object) {
          object[categoryVehicleCombo] = vehicleValue;
        }
      });

      return object;
    },
    {
      "Battery EVs / Passenger cars": 0,
      "Battery EVs / Passenger trucks": 0,
      "Plug-in Hybrid EVs / Passenger cars": 0,
      "Plug-in Hybrid EVs / Passenger trucks": 0,
    },
  );

  const otherVehicleCategoriesResult = Object.entries(vehicleTypeTotals).reduce(
    (object, [vehicleKey, vehicleValue]) => {
      const vehicle = vehicleKey as keyof typeof vehicleTypeTotals;

      const category = Object.keys(vehicleTypesByVehicleCategory).find(
        (categoryKey) => {
          const vehicleCategory = categoryKey as VehicleCategoryKey;

          if (
            vehicleCategory === "Battery EVs" ||
            vehicleCategory === "Plug-in Hybrid EVs"
          ) {
            return false;
          }

          const vehicleTypes = vehicleTypesByVehicleCategory[vehicleCategory];
          return (vehicleTypes as unknown as VehicleType[]).includes(vehicle);
        },
      ) as Exclude<VehicleCategoryKey, "Battery EVs" | "Plug-in Hybrid EVs">;

      const categoryVehicleCombo = `${category} / ${vehicle}` as VehicleCategoryVehicleTypeCombo; // prettier-ignore

      const categoryTotal = vehicleCategoryTotals[category];

      object[categoryVehicleCombo] = categoryTotal
        ? vehicleValue / categoryTotal
        : vehicleValue;

      return object;
    },
    {} as {
      [categoryVehicleCombo in VehicleCategoryVehicleTypeCombo]: number;
    },
  );

  const result = {
    ...ldvsResult,
    ...otherVehicleCategoriesResult,
  };

  return result;
}

/**
 * Percentage/share of the total VMT each vehicle type / fuel type combo makes
 * up of the vehicle type's total VMT (regardless of fuel type).
 *
 * Excel: "Vehicle Allocation" column of "Table 12: Vehicle sales by type" table
 * in the "Library" sheet (E965:G983).
 */
export function calculateVehicleFuelTypePercentagesOfVehicleType(options: {
  movesEmissionRates: MOVESEmissionRates;
}) {
  const { movesEmissionRates } = options;

  const initialYear = movesEmissionRates[0].year;

  const vmtTotalsByVehicleType = {} as {
    [vehicle in VehicleType]: number;
  };

  const vmtTotalsByVehicleTypeFuelTypeCombo = {} as {
    [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
  };

  movesEmissionRates.forEach((data) => {
    const { year, vehicleType, fuelType, firstYear } = data;

    const vehicleFuelCombo =
      `${vehicleType} / ${fuelType}` as VehicleTypeFuelTypeCombo;

    if (year === initialYear) {
      vmtTotalsByVehicleType[vehicleType as VehicleType] ??= 0;
      vmtTotalsByVehicleType[vehicleType as VehicleType] += firstYear.vmt;

      vmtTotalsByVehicleTypeFuelTypeCombo[vehicleFuelCombo] ??= 0;
      vmtTotalsByVehicleTypeFuelTypeCombo[vehicleFuelCombo] += firstYear.vmt;
    }
  });

  const result = Object.entries(vmtTotalsByVehicleTypeFuelTypeCombo).reduce(
    (object, [vehicleFuelComboKey, vehicleFuelComboValue]) => {
      const vehicleFuelCombo = vehicleFuelComboKey as keyof typeof vmtTotalsByVehicleTypeFuelTypeCombo; // prettier-ignore
      const vehicleType = vehicleFuelCombo.split(" / ")[0] as VehicleType;

      object[vehicleFuelCombo] ??= 0;

      const vehicleTypeTotal = vmtTotalsByVehicleType?.[vehicleType];

      if (vehicleTypeTotal) {
        object[vehicleFuelCombo] = vehicleFuelComboValue / vehicleTypeTotal;
      }

      return object;
    },
    {} as {
      [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
    },
  );

  return result;
}

/**
 * Total number of effective vehicles by vehicle category / vehicle type / fuel
 * type combo.
 *
 * Excel: "Sales Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (E546:E567).
 */
export function calculateTotalEffectiveVehicles(options: {
  vehicleTypePercentagesOfVehicleCategory:
    | VehicleTypePercentagesOfVehicleCategory
    | EmptyObject;
  vehicleFuelTypePercentagesOfVehicleType:
    | VehicleFuelTypePercentagesOfVehicleType
    | EmptyObject;
  batteryEVs: number;
  hybridEVs: number;
  transitBuses: number;
  schoolBuses: number;
  shortHaulTrucks: number;
  comboLongHaulTrucks: number;
  refuseTrucks: number;
}) {
  const {
    vehicleTypePercentagesOfVehicleCategory,
    vehicleFuelTypePercentagesOfVehicleType,
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    shortHaulTrucks,
    comboLongHaulTrucks,
    refuseTrucks,
  } = options;

  const result = {
    "Battery EVs / Passenger cars / Gasoline": 0,
    "Plug-in Hybrid EVs / Passenger cars / Gasoline": 0,
    "Battery EVs / Passenger trucks / Gasoline": 0,
    "Plug-in Hybrid EVs / Passenger trucks / Gasoline": 0,
    "Transit buses / Medium-duty transit buses / Gasoline": 0,
    "Transit buses / Medium-duty transit buses / Diesel Fuel": 0,
    "Transit buses / Heavy-duty transit buses / Diesel Fuel": 0,
    "Transit buses / Heavy-duty transit buses / Compressed Natural Gas (CNG)": 0,
    "School buses / Medium-duty school buses / Gasoline": 0,
    "School buses / Medium-duty school buses / Diesel Fuel": 0,
    "School buses / Heavy-duty school buses / Diesel Fuel": 0,
    "Other buses / Medium-duty other buses / Gasoline": 0,
    "Other buses / Medium-duty other buses / Diesel Fuel": 0,
    "Other buses / Heavy-duty other buses / Diesel Fuel": 0,
    "Other buses / Heavy-duty other buses / Compressed Natural Gas (CNG)": 0,
    "Short-haul trucks / Light-duty single unit trucks / Gasoline": 0,
    "Short-haul trucks / Medium-duty single unit trucks / Gasoline": 0,
    "Short-haul trucks / Medium-duty single unit trucks / Diesel Fuel": 0,
    "Short-haul trucks / Heavy-duty combination trucks / Diesel Fuel": 0,
    "Long-haul trucks / Combination long-haul trucks / Diesel Fuel": 0,
    "Refuse trucks / Medium-duty refuse trucks / Diesel Fuel": 0,
    "Refuse trucks / Heavy-duty refuse trucks / Diesel Fuel": 0,
  };

  if (
    Object.keys(vehicleTypePercentagesOfVehicleCategory).length === 0 ||
    Object.keys(vehicleFuelTypePercentagesOfVehicleType).length === 0
  ) {
    return result;
  }

  Object.keys(result).forEach((key) => {
    const categoryVehicleFuelCombo = key as keyof typeof result;

    const [vehicleCategory, vehicleType, fuelType] = key.split(" / ");

    const vehicleInputValue =
      vehicleCategory === "Battery EVs"
        ? batteryEVs
        : vehicleCategory === "Plug-in Hybrid EVs"
          ? hybridEVs
          : vehicleCategory === "Transit buses"
            ? transitBuses
            : vehicleCategory === "School buses"
              ? schoolBuses
              : vehicleCategory === "Short-haul trucks"
                ? shortHaulTrucks
                : vehicleCategory === "Long-haul trucks"
                  ? comboLongHaulTrucks
                  : vehicleCategory === "Refuse trucks"
                    ? refuseTrucks
                    : 0;

    const categoryVehicleCombo =
      `${vehicleCategory} / ${vehicleType}` as VehicleCategoryVehicleTypeCombo;

    const vehicleFuelCombo =
      `${vehicleType} / ${fuelType}` as VehicleTypeFuelTypeCombo;

    const vehicleTypePercentage =
      vehicleTypePercentagesOfVehicleCategory?.[categoryVehicleCombo] || 0;

    const vehicleFuelPercengage =
      vehicleFuelTypePercentagesOfVehicleType?.[vehicleFuelCombo] || 0;

    result[categoryVehicleFuelCombo] =
      vehicleInputValue * vehicleTypePercentage * vehicleFuelPercengage;
  });

  return result;
}

/**
 * Stores 2023 annual vehicle miles traveled (VMT) and 2023 stock (both in
 * millions) by state for each vehicle type.
 *
 * Excel: "A. State-level VMT per vehicle" table in the "MOVESsupplement" sheet
 * (B6:E720)
 */
export function storeVMTandStockByState(options: {
  stateLevelVMT: StateLevelVMT;
}) {
  const { stateLevelVMT } = options;

  const result = stateLevelVMT.reduce(
    (object, data) => {
      const state = data["State"] as StateId;
      const vehicle = data["Vehicle Type"] as VehicleType;
      const vmt = data["2023 Annual VMT (million miles)"];
      const stock = data["2023 Stock (million vehicles)"];

      if (!object[state]) {
        object[state] = {} as {
          [vehicle in VehicleType]: {
            vmt: number;
            stock: number;
          };
        };
      }

      if (!object[state][vehicle]) {
        object[state][vehicle] = { vmt, stock };
      }

      return object;
    },
    {} as {
      [stateId in StateId]: {
        [vehicle in VehicleType]: {
          vmt: number;
          stock: number;
        };
      };
    },
  );

  return result;
}

/**
 * Ratio of FHWA to MOVES VMT for light duty vehicles (LDV) by state.
 *
 * Excel: "C. FHWA LDV State-Level VMT" table in the "MOVESsupplement" sheet
 * (O6:P57)
 */
export function calculateLDVsFhwaMovesVMTRatioByState(options: {
  fhwaLDVStateLevelVMT: FHWALDVStateLevelVMT;
  vmtAndStockByState: VMTandStockByState;
}) {
  const { fhwaLDVStateLevelVMT, vmtAndStockByState } = options;

  const results = Object.values(fhwaLDVStateLevelVMT).reduce(
    (object, data) => {
      const stateId = data["State"] as StateId;
      const vmtFHWA = data["2023 Annual VMT (million miles) - FHWA"];
      const vmtMOVES =
        stateId in vmtAndStockByState
          ? vmtAndStockByState[stateId]["Passenger cars"].vmt +
            vmtAndStockByState[stateId]["Passenger trucks"].vmt
          : 0;

      if (!object[stateId]) {
        object[stateId] = { vmtFHWA, vmtMOVES, ratio: vmtFHWA / vmtMOVES };
      }

      return object;
    },
    {} as {
      [stateId in StateId]: {
        vmtFHWA: number;
        vmtMOVES: number;
        ratio: number;
      };
    },
  );

  return results;
}

/**
 * VMT per vehicle type (both MOVES data and FHWA adjusted data) by state.
 *
 * Excel: "A. State-level VMT per vehicle" table in the "MOVESsupplement" sheet
 * (F6:G720)
 */
export function calculateVMTPerVehicleTypeByState(options: {
  vmtAndStockByState: VMTandStockByState;
  ldvsFhwaMovesVMTRatioByState: LDVsFhwaMovesVMTRatioByState;
}) {
  const { vmtAndStockByState, ldvsFhwaMovesVMTRatioByState } = options;

  const result = Object.entries(vmtAndStockByState).reduce(
    (object, [vmtKey, vmtValue]) => {
      const state = vmtKey as keyof typeof vmtAndStockByState;

      if (!object[state]) {
        object[state] = {} as {
          [vehicle in VehicleType]: {
            vmtPerVehicle: number;
            vmtPerVehicleAdjustedByFHWA: number;
          };
        };
      }

      Object.entries(vmtValue).forEach(([vehicleKey, vehicleValue]) => {
        const vehicle = vehicleKey as keyof typeof vmtValue;
        const { vmt, stock } = vehicleValue;
        const vmtPerVehicle = vmt / stock;

        const ldvsFhwaMovesVMTRatio =
          state in ldvsFhwaMovesVMTRatioByState
            ? ldvsFhwaMovesVMTRatioByState[state].ratio
            : 1;

        const vmtPerVehicleAdjustedByFHWA =
          vehicle === "Passenger cars" || vehicle === "Passenger trucks"
            ? vmtPerVehicle * ldvsFhwaMovesVMTRatio
            : vmtPerVehicle;

        if (!object[state][vehicle]) {
          object[state][vehicle] = {
            vmtPerVehicle,
            vmtPerVehicleAdjustedByFHWA,
          };
        }
      });

      return object;
    },
    {} as {
      [stateId in StateId]: {
        [vehicle in VehicleType]: {
          vmtPerVehicle: number;
          vmtPerVehicleAdjustedByFHWA: number;
        };
      };
    },
  );

  return result;
}

/**
 * Percentage/share of selected AVERT region's total VMT by state for each
 * vehicle type.
 *
 * Excel: "A. State-level VMT per vehicle" table in the "MOVESsupplement" sheet
 * (H6:H720)
 */
export function calculateSelectedRegionsVMTPercentagesByState(options: {
  selectedGeographyRegions: SelectedGeographyRegions;
  vmtPercentagesByStateRegionCombo:
    | VMTPercentagesByStateRegionCombo
    | EmptyObject;
}) {
  const { selectedGeographyRegions, vmtPercentagesByStateRegionCombo } =
    options;

  if (
    Object.keys(selectedGeographyRegions).length === 0 ||
    Object.keys(vmtPercentagesByStateRegionCombo).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [stateId in StateId]: {
          [vehicle in VehicleType]: number;
        };
      };
    };
  }

  const result = Object.entries(selectedGeographyRegions).reduce(
    (regionsObject, [geographyKey, geographyValue]) => {
      const regionId = geographyKey as keyof typeof selectedGeographyRegions;
      const regionName = geographyValue.name;

      const regionResult = Object.values(
        vmtPercentagesByStateRegionCombo,
      ).reduce(
        (statesObject, vmtValue) => {
          const stateId = vmtValue.state;

          if (vmtValue.region === regionName) {
            if (!statesObject[stateId]) {
              statesObject[stateId] = {} as {
                [vehicle in VehicleType]: number;
              };
            }

            Object.entries(vmtValue.vehicleTypes).forEach(
              ([vehicleKey, vehicleValue]) => {
                const vehicle = vehicleKey as keyof typeof vmtValue.vehicleTypes; // prettier-ignore

                if (!statesObject[stateId][vehicle]) {
                  statesObject[stateId][vehicle] = vehicleValue;
                }
              },
            );
          }

          return statesObject;
        },
        {} as {
          [stateId in StateId]: {
            [vehicle in VehicleType]: number;
          };
        },
      );

      regionsObject[regionId] = regionResult;

      return regionsObject;
    },
    {} as {
      [regionId in RegionId]: {
        [stateId in StateId]: {
          [vehicle in VehicleType]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's average vehicle miles traveled (VMT) per year for
 * each vehicle type for the selected location of EV deployment.
 *
 * Excel: "Table 4: VMT per vehicle assumptions" table in the "Library" sheet
 * (E179:E192).
 */
export function calculateSelectedRegionsAverageVMTPerYear(options: {
  evDeploymentLocation: string;
  vmtPerVehicleTypeByState: VMTPerVehicleTypeByState | EmptyObject;
  selectedRegionsVMTPercentagesByState:
    | SelectedRegionsVMTPercentagesByState
    | EmptyObject;
}) {
  const {
    evDeploymentLocation,
    vmtPerVehicleTypeByState,
    selectedRegionsVMTPercentagesByState,
  } = options;

  if (
    evDeploymentLocation === "" ||
    Object.keys(vmtPerVehicleTypeByState).length === 0 ||
    Object.keys(selectedRegionsVMTPercentagesByState).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [vehicle in VehicleType]: number;
      };
    };
  }

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith("region-");
  const deploymentLocationIsState = evDeploymentLocation.startsWith("state-");
  const deploymentLocationStateId = evDeploymentLocation.replace("state-", "") as StateId; // prettier-ignore

  const result = Object.entries(selectedRegionsVMTPercentagesByState).reduce(
    (object, [vmtPercentagesRegionKey, vmtPercentagesRegionValue]) => {
      const regionId = vmtPercentagesRegionKey as keyof typeof selectedRegionsVMTPercentagesByState; // prettier-ignore

      object[regionId] ??= {} as {
        [vehicle in VehicleType]: number;
      };

      Object.entries(vmtPercentagesRegionValue).forEach(
        ([vmtPercentagesStateKey, vmtPercentagesStateValue]) => {
          const stateId = vmtPercentagesStateKey as keyof typeof vmtPercentagesRegionValue; // prettier-ignore

          if (stateId in vmtPerVehicleTypeByState) {
            Object.entries(vmtPerVehicleTypeByState[stateId]).forEach(
              ([vehicleKey, vehicleValue]) => {
                const vehicle = vehicleKey as keyof (typeof vmtPerVehicleTypeByState)[typeof stateId]; // prettier-ignore

                const stateAdjustedVMT =
                  vehicleValue.vmtPerVehicleAdjustedByFHWA;

                /** If the EV deployment location is an AVERT region **/
                const stateVMTFactor = deploymentLocationIsRegion
                  ? /**
                     * Use the state/vehicle type row's "Share of Selected AVERT
                     * Region" (column H) value (from the "A. State-level VMT
                     * per vehicle" table in the "MOVESsupplement" sheet)
                     */
                    vmtPercentagesStateValue[vehicle]
                  : /** Else, the EV deployment location is a state */
                    deploymentLocationIsState
                    ? /**
                       * If the EV deployment location is the state, use 1.
                       * Otherwise use 0 (as the state is in the AVERT region,
                       * but wasn't selected for EV deployment). This ensures we
                       * only use the stateAdjustedVMT value for the state that
                       * was selected for EV deployment.
                       */
                      deploymentLocationStateId === stateId
                      ? 1
                      : 0
                    : /** Fallback (EV deployment location will always be an AVERT region or state) */
                      0;

                const stateAverageVMT = stateAdjustedVMT * stateVMTFactor;

                if (!object[regionId][vehicle]) {
                  object[regionId][vehicle] = 0;
                }

                object[regionId][vehicle] += stateAverageVMT;
              },
            );
          }
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [vehicle in VehicleType]: number;
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's vehicle miles traveled (VMT) for each month for each
 * vehicle type / fuel type combo.
 *
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (E287:P306).
 */
export function calculateSelectedRegionsMonthlyVMT(options: {
  selectedRegionsAverageVMTPerYear:
    | SelectedRegionsAverageVMTPerYear
    | EmptyObject;
  monthlyVMTPercentages: MonthlyVMTPercentages | EmptyObject;
}) {
  const { selectedRegionsAverageVMTPerYear, monthlyVMTPercentages } = options;

  if (
    Object.keys(selectedRegionsAverageVMTPerYear).length === 0 ||
    Object.keys(monthlyVMTPercentages).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsAverageVMTPerYear).reduce(
    (object, [averageVMTKey, averageVMTValue]) => {
      const regionId = averageVMTKey as keyof typeof selectedRegionsAverageVMTPerYear; // prettier-ignore

      object[regionId] ??= {};

      Object.entries(monthlyVMTPercentages).forEach(([vmtKey, vmtValue]) => {
        const month = Number(vmtKey);

        object[regionId][month] ??= {
          "Passenger cars / Gasoline": 0,
          "Passenger trucks / Gasoline": 0,
          "Medium-duty transit buses / Gasoline": 0,
          "Medium-duty transit buses / Diesel Fuel": 0,
          "Heavy-duty transit buses / Diesel Fuel": 0,
          "Heavy-duty transit buses / Compressed Natural Gas (CNG)": 0,
          "Medium-duty school buses / Gasoline": 0,
          "Medium-duty school buses / Diesel Fuel": 0,
          "Heavy-duty school buses / Diesel Fuel": 0,
          "Medium-duty other buses / Gasoline": 0,
          "Medium-duty other buses / Diesel Fuel": 0,
          "Heavy-duty other buses / Diesel Fuel": 0,
          "Heavy-duty other buses / Compressed Natural Gas (CNG)": 0,
          "Light-duty single unit trucks / Gasoline": 0,
          "Medium-duty single unit trucks / Gasoline": 0,
          "Medium-duty single unit trucks / Diesel Fuel": 0,
          "Heavy-duty combination trucks / Diesel Fuel": 0,
          "Combination long-haul trucks / Diesel Fuel": 0,
          "Medium-duty refuse trucks / Diesel Fuel": 0,
          "Heavy-duty refuse trucks / Diesel Fuel": 0,
        };

        for (const key in vmtValue) {
          const vehicleFuelCombo = key as keyof typeof vmtValue;
          const vehicle = vehicleFuelCombo.split(" / ")[0] as VehicleType;

          if (
            vehicleFuelCombo in object[regionId][month] &&
            vehicle in averageVMTValue
          ) {
            const vmt = averageVMTValue[vehicle] * vmtValue[vehicleFuelCombo];
            object[regionId][month][vehicleFuelCombo] = vmt;
          }
        }
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's EV efficiency (kWh/VMT) for each vehicle type.
 *
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (E227:E242). NOTE: the Excel version duplicates these values
 * in the columns to the right for each month, but they're the same value for
 * all months.
 */
export function calculateSelectedRegionsEVEfficiency(options: {
  climateAdjustmentFactorByRegion:
    | ClimateAdjustmentFactorByRegion
    | EmptyObject;
  evEfficiencyAssumptions: EVEfficiencyAssumptions;
  selectedGeographyRegionIds: RegionId[];
  evModelYear: string;
}) {
  const {
    climateAdjustmentFactorByRegion,
    evEfficiencyAssumptions,
    selectedGeographyRegionIds,
    evModelYear,
  } = options;

  if (
    Object.keys(climateAdjustmentFactorByRegion).length === 0 ||
    selectedGeographyRegionIds.length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [expandedVehicleType in ExpandedVehicleType]: number;
      };
    };
  }

  const result = selectedGeographyRegionIds.reduce(
    (object, regionId) => {
      object[regionId] ??= {
        "BEV passenger cars": 0,
        "BEV passenger trucks": 0,
        "PHEV passenger cars": 0,
        "PHEV passenger trucks": 0,
        "Medium-duty transit buses": 0,
        "Heavy-duty transit buses": 0,
        "Medium-duty school buses": 0,
        "Heavy-duty school buses": 0,
        "Medium-duty other buses": 0,
        "Heavy-duty other buses": 0,
        "Light-duty single unit trucks": 0,
        "Medium-duty single unit trucks": 0,
        "Heavy-duty combination trucks": 0,
        "Combination long-haul trucks": 0,
        "Medium-duty refuse trucks": 0,
        "Heavy-duty refuse trucks": 0,
      };

      const regionClimateFactor =
        regionId in climateAdjustmentFactorByRegion
          ? climateAdjustmentFactorByRegion[regionId]
          : 0;

      Object.entries(evEfficiencyAssumptions).forEach(
        ([vehicleKey, vehicleValue]) => {
          const expandedVehicleType = vehicleKey as keyof typeof evEfficiencyAssumptions; // prettier-ignore
          const year = evModelYear as keyof typeof vehicleValue;

          const evEfficiency = year in vehicleValue ? vehicleValue[year] : 0;

          if (expandedVehicleType in object[regionId]) {
            object[regionId][expandedVehicleType] = evEfficiency * regionClimateFactor; // prettier-ignore
          }
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [expandedVehicleType in ExpandedVehicleType]: number;
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's monthly emission rates for each vehicle type / fuel
 * type combo.
 *
 * Excel: "Table 7: Emission rates of vehicle types" table in the "Library"
 * sheet (G320:R537, excluding rows 446–495, which are PM2.5 electricity values
 * and total PM2.5 values for each vehicle type / fuel type combo).
 */
export function calculateSelectedRegionsMonthlyEmissionRates(options: {
  selectedRegionsVMTPercentagesByState:
    | SelectedRegionsVMTPercentagesByState
    | EmptyObject;
  movesEmissionRates: MOVESEmissionRates;
  evDeploymentLocation: string;
  evModelYear: string;
  iceReplacementVehicle: string;
}) {
  const {
    selectedRegionsVMTPercentagesByState,
    movesEmissionRates,
    evDeploymentLocation,
    evModelYear,
    iceReplacementVehicle,
  } = options;

  if (Object.keys(selectedRegionsVMTPercentagesByState).length === 0) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: {
            [movesPollutant in MovesPollutant]: number;
          };
        };
      };
    };
  }

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith("region-");
  const deploymentLocationIsState = evDeploymentLocation.startsWith("state-");
  const deploymentLocationStateId = evDeploymentLocation.replace("state-", "") as StateId; // prettier-ignore

  const result = movesEmissionRates.reduce(
    (object, data) => {
      const { year, state, vehicleType, fuelType, firstYear, fleetAverage } =
        data;

      if (evModelYear !== year.toString()) {
        return object;
      }

      const month = Number(data.month);

      const vehicleFuelCombo =
        `${vehicleType} / ${fuelType}` as VehicleTypeFuelTypeCombo;

      Object.entries(selectedRegionsVMTPercentagesByState).forEach(
        ([vmtPercentagesRegionKey, vmtPercentagesRegionValue]) => {
          const regionId = vmtPercentagesRegionKey as keyof typeof selectedRegionsVMTPercentagesByState; // prettier-ignore

          const stateVMTPercentages =
            state in vmtPercentagesRegionValue
              ? vmtPercentagesRegionValue[state as StateId]
              : null;

          const movesRegionalWeight =
            stateVMTPercentages && vehicleType in stateVMTPercentages
              ? stateVMTPercentages[vehicleType as VehicleType]
              : 0;

          object[regionId] ??= {} as {
            [month: number]: {
              [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: {
                [movesPollutant in MovesPollutant]: number;
              };
            };
          };

          object[regionId][month] ??= {} as {
            [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: {
              [movesPollutant in MovesPollutant]: number;
            };
          };

          object[regionId][month][vehicleFuelCombo] ??= {
            co2: 0,
            nox: 0,
            so2: 0,
            pm25Exhaust: 0,
            pm25Brakewear: 0,
            pm25Tirewear: 0,
            vocs: 0,
            nh3: 0,
          };

          if (
            deploymentLocationIsRegion ||
            (deploymentLocationIsState && deploymentLocationStateId === state)
          ) {
            for (const key in object[regionId][month][vehicleFuelCombo]) {
              const movesPollutant = key as keyof (typeof object)[typeof regionId][typeof month][typeof vehicleFuelCombo]; // prettier-ignore

              const movesPollutantValue =
                iceReplacementVehicle === "new"
                  ? firstYear?.[movesPollutant] || 0
                  : fleetAverage?.[movesPollutant] || 0;

              /**
               * If the EV deployment location is an AVERT region, the MOVES
               * pollutant value needs to be multiplied by the MOVES "Regional
               * Weight" for the state and vehicle type.
               */
              const emissionRate = deploymentLocationIsRegion
                ? movesPollutantValue * movesRegionalWeight
                : movesPollutantValue;

              object[regionId][month][vehicleFuelCombo][movesPollutant] +=
                emissionRate;
            }
          }
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: {
            [movesPollutant in MovesPollutant]: number;
          };
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's monthly electricity PM2.5 emission rates for each
 * vehicle type / electricity fuel type combo.
 *
 * Excel: "Table 7: Emission rates of vehicle types" table in the "Library"
 * sheet (G446:R474).
 */
export function calculateSelectedRegionsMonthlyElectricityPM25EmissionRates(options: {
  selectedRegionsMonthlyEmissionRates: SelectedRegionsMonthlyEmissionRates;
  pm25BreakwearTirewearEVICERatios: PM25BreakwearTirewearEVICERatios;
  evModelYear: string;
}) {
  const {
    selectedRegionsMonthlyEmissionRates,
    pm25BreakwearTirewearEVICERatios,
    evModelYear,
  } = options;

  if (Object.keys(selectedRegionsMonthlyEmissionRates).length === 0) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleEVFuelCombo in VehicleTypeEVFuelTypeCombo]: {
            pm25Brakeware: number;
            pm25Tirewear: number;
          };
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsMonthlyEmissionRates).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEmissionRates; // prettier-ignore

      object[regionId] ??= {} as {
        [month: number]: {
          [vehicleEVFuelCombo in VehicleTypeEVFuelTypeCombo]: {
            pm25Brakeware: number;
            pm25Tirewear: number;
          };
        };
      };

      Object.entries(regionValue).forEach(([monthKey, monthValue]) => {
        const month = Number(monthKey);

        object[regionId][month] ??= {} as {
          [vehicleEVFuelCombo in VehicleTypeEVFuelTypeCombo]: {
            pm25Brakeware: number;
            pm25Tirewear: number;
          };
        };

        Object.entries(monthValue).forEach(
          ([vehicleFuelComboKey, vehicleFuelComboValue]) => {
            const [vehicleType, fuelType] = vehicleFuelComboKey.split(" / ");
            const vehicleEVFuelCombo = `${vehicleType} / Electricity` as VehicleTypeEVFuelTypeCombo; // prettier-ignore

            object[regionId][month][vehicleEVFuelCombo] = {
              pm25Brakeware: 0,
              pm25Tirewear: 0,
            };

            const ratios = pm25BreakwearTirewearEVICERatios.find((data) => {
              return (
                evModelYear === data["Year"].toString() &&
                vehicleType === data["Vehicle Type"] &&
                fuelType === data["Fuel Type"]
              );
            });

            if (ratios) {
              const brakewear = ratios["Primary PM2.5 Brakewear Emissions Rate: EV/ICE Ratio"]; // prettier-ignore
              const tirewear = ratios["Primary PM2.5 Tirewear Emissions Rate: EV/ICE Ratio"]; // prettier-ignore

              const brakewearRatio = typeof brakewear === "number" ? brakewear : 0; // prettier-ignore
              const tirewearRatio = typeof tirewear === "number" ? tirewear : 0;

              object[regionId][month][vehicleEVFuelCombo] = {
                pm25Brakeware: -1 * vehicleFuelComboValue.pm25Brakewear * brakewearRatio, // prettier-ignore
                pm25Tirewear: -1 * vehicleFuelComboValue.pm25Tirewear * tirewearRatio, // prettier-ignore
              };
            }
          },
        );
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleEVFuelCombo in VehicleTypeEVFuelTypeCombo]: {
            pm25Brakeware: number;
            pm25Tirewear: number;
          };
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's monthly total net PM2.5 emission rates for each
 * vehicle type / fuel type combo.
 *
 * Excel: "Table 7: Emission rates of vehicle types" table in the "Library"
 * sheet (G476:R495).
 */
export function calculateSelectedRegionsMonthlyTotalNetPM25EmissionRates(options: {
  selectedRegionsMonthlyEmissionRates: SelectedRegionsMonthlyEmissionRates;
  selectedRegionsMonthlyElectricityPM25EmissionRates: SelectedRegionsMonthlyElectricityPM25EmissionRates;
}) {
  const {
    selectedRegionsMonthlyEmissionRates,
    selectedRegionsMonthlyElectricityPM25EmissionRates,
  } = options;

  if (
    Object.keys(selectedRegionsMonthlyEmissionRates).length === 0 ||
    Object.keys(selectedRegionsMonthlyElectricityPM25EmissionRates).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsMonthlyEmissionRates).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEmissionRates; // prettier-ignore

      object[regionId] ??= {} as {
        [month: number]: {
          [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
        };
      };

      Object.entries(regionValue).forEach(([monthKey, monthValue]) => {
        const month = Number(monthKey);

        object[regionId][month] ??= {} as {
          [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
        };

        Object.entries(monthValue).forEach(
          ([vehicleFuelComboKey, vehicleFuelComboValue]) => {
            const vehicleFuelCombo = vehicleFuelComboKey as keyof typeof monthValue; // prettier-ignore
            const vehicleType = vehicleFuelCombo.split(" / ")[0] as VehicleType;
            const vehicleEVFuelCombo = `${vehicleType} / Electricity` as VehicleTypeEVFuelTypeCombo; // prettier-ignore

            const electricityPM25EmissionRates =
              selectedRegionsMonthlyElectricityPM25EmissionRates?.[regionId]?.[
                month
              ]?.[vehicleEVFuelCombo] || null;

            const emissionRate =
              vehicleFuelComboValue.pm25Exhaust +
              vehicleFuelComboValue.pm25Brakewear +
              vehicleFuelComboValue.pm25Tirewear +
              (electricityPM25EmissionRates?.pm25Brakeware || 0) +
              (electricityPM25EmissionRates?.pm25Tirewear || 0);

            object[regionId][month][vehicleFuelCombo] = emissionRate;
          },
        );
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleFuelCombo in VehicleTypeFuelTypeCombo]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's retail sales (GWh) for each month for each vehicle
 * category / vehicle type / fuel type combo.
 *
 * Excel: "Sales Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (G546:R567).
 */
export function calculateSelectedRegionsMonthlySalesChanges(options: {
  totalEffectiveVehicles: TotalEffectiveVehicles;
  selectedRegionsMonthlyVMT: SelectedRegionsMonthlyVMT | EmptyObject;
  selectedRegionsEVEfficiency: SelectedRegionsEVEfficiency | EmptyObject;
  percentageHybridEVMilesDrivenOnElectricity: PercentageHybridEVMilesDrivenOnElectricity;
}) {
  const {
    totalEffectiveVehicles,
    selectedRegionsMonthlyVMT,
    selectedRegionsEVEfficiency,
    percentageHybridEVMilesDrivenOnElectricity,
  } = options;

  if (
    Object.keys(selectedRegionsMonthlyVMT).length === 0 ||
    Object.keys(selectedRegionsEVEfficiency).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
        };
      };
    };
  }

  const KWtoGW = 0.000_001;

  const result = Object.entries(selectedRegionsMonthlyVMT).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyVMT;

      object[regionId] ??= {} as {
        [month: number]: {
          [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
        };
      };

      Object.entries(regionValue).forEach(([monthKey, monthValue]) => {
        const month = Number(monthKey);

        object[regionId][month] ??= {} as {
          [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
        };

        Object.entries(totalEffectiveVehicles).forEach(
          ([vehicleKey, vehicleValue]) => {
            const categoryVehicleFuelCombo = vehicleKey as keyof typeof totalEffectiveVehicles; // prettier-ignore
            const [vehicleCategory, vehicleType, fuelType] = vehicleKey.split(" / "); // prettier-ignore
            const vehicleFuelCombo = `${vehicleType} / ${fuelType}` as VehicleTypeFuelTypeCombo; // prettier-ignore

            /**
             * NOTE: We use different values as the vehicle type for battery EVs
             * and plug-in hybrid EVs in the `selectedRegionsEVEfficiency` data,
             * so we'll need to map any "Battery EVs" and "Plug-in Hybrid EVs"
             * vehicle categories to their respective "expanded" vehicle types
             * in order to get the correct EV efficiency value.
             */
            const expandedVehicleType =
              vehicleCategory === "Battery EVs" &&
              vehicleType === "Passenger cars"
                ? "BEV passenger cars"
                : vehicleCategory === "Battery EVs" &&
                    vehicleType === "Passenger trucks"
                  ? "BEV passenger trucks"
                  : vehicleCategory === "Plug-in Hybrid EVs" &&
                      vehicleType === "Passenger cars"
                    ? "PHEV passenger cars"
                    : vehicleCategory === "Plug-in Hybrid EVs" &&
                        vehicleType === "Passenger trucks"
                      ? "PHEV passenger trucks"
                      : (vehicleType as ExpandedVehicleType);

            const vmt = monthValue?.[vehicleFuelCombo] || 0;

            const efficiency =
              selectedRegionsEVEfficiency?.[regionId]?.[expandedVehicleType] ||
              0;

            /** NOTE: Additional factor applied to plug-in hybrid EVs */
            const vehicleCategoryFactor =
              vehicleCategory === "Plug-in Hybrid EVs"
                ? percentageHybridEVMilesDrivenOnElectricity
                : 1;

            object[regionId][month][categoryVehicleFuelCombo] =
              vehicleValue * vmt * efficiency * KWtoGW * vehicleCategoryFactor;
          },
        );
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's retail sales (GWh) for the year for each vehicle
 * category / vehicle type / fuel type combo.
 *
 * Excel: "Sales Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (S546:S567).
 */
export function calculateSelectedRegionsYearlySalesChanges(options: {
  selectedRegionsMonthlySalesChanges:
    | SelectedRegionsMonthlySalesChanges
    | EmptyObject;
}) {
  const { selectedRegionsMonthlySalesChanges } = options;

  if (Object.keys(selectedRegionsMonthlySalesChanges).length === 0) {
    return {} as {
      [regionId in RegionId]: {
        [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
      };
    };
  }

  const result = Object.entries(selectedRegionsMonthlySalesChanges).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlySalesChanges; // prettier-ignore

      object[regionId] ??= {} as {
        [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
      };

      Object.values(regionValue).forEach((monthValue) => {
        Object.entries(monthValue).forEach(([key, value]) => {
          const categoryVehicleFuelCombo = key as keyof typeof monthValue;

          if (!object[regionId][categoryVehicleFuelCombo]) {
            object[regionId][categoryVehicleFuelCombo] = 0;
          }

          object[regionId][categoryVehicleFuelCombo] += value;
        });
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's retail sales (GWh) for the year – total of all
 * vehicle category / vehicle type / fuel type combos combined.
 *
 * Excel: "Sales Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (S577).
 */
export function calculateSelectedRegionsTotalYearlySalesChanges(options: {
  selectedRegionsYearlySalesChanges:
    | SelectedRegionsYearlySalesChanges
    | EmptyObject;
}) {
  const { selectedRegionsYearlySalesChanges } = options;

  if (Object.keys(selectedRegionsYearlySalesChanges).length === 0) {
    return {} as {
      [regionId in RegionId]: number;
    };
  }

  const result = Object.entries(selectedRegionsYearlySalesChanges).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsYearlySalesChanges; // prettier-ignore

      object[regionId] = Object.values(regionValue).reduce(
        (sum, value) => sum + value,
        0,
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: number;
    },
  );

  return result;
}

/**
 * Selected AVERT region's energy usage for each month for each vehicle category.
 *
 * Excel: Data from the bottom of the middle table in the "CalculateEERE" sheet
 * (Y50:AE61).
 */
export function calculateSelectedRegionsMonthlyEnergyUsage(options: {
  selectedRegionsMonthlySalesChanges:
    | SelectedRegionsMonthlySalesChanges
    | EmptyObject;
}) {
  const { selectedRegionsMonthlySalesChanges } = options;

  if (Object.keys(selectedRegionsMonthlySalesChanges).length === 0) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleCategory in VehicleCategoryExcludingOtherBuses]: number;
        };
      };
    };
  }

  const GWtoMW = 1_000;

  const result = Object.entries(selectedRegionsMonthlySalesChanges).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlySalesChanges; // prettier-ignore

      object[regionId] ??= {} as {
        [month: number]: {
          [vehicleCategory in VehicleCategoryExcludingOtherBuses]: number;
        };
      };

      Object.entries(regionValue).forEach(
        ([regionMonthKey, regionMonthValue]) => {
          const month = Number(regionMonthKey);

          object[regionId][month] ??= {
            "Battery EVs": 0,
            "Plug-in Hybrid EVs": 0,
            "Transit buses": 0,
            "School buses": 0,
            "Short-haul trucks": 0,
            "Long-haul trucks": 0,
            "Refuse trucks": 0,
          };

          Object.entries(regionMonthValue).forEach(
            ([vehicleKey, vehicleValue]) => {
              const vehicleCategory = vehicleKey.split(" / ")[0] as VehicleCategoryExcludingOtherBuses; // prettier-ignore

              if (vehicleCategory in object[regionId][month]) {
                object[regionId][month][vehicleCategory] +=
                  vehicleValue * GWtoMW;
              }
            },
          );
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleCategory in VehicleCategoryExcludingOtherBuses]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's energy usage for a typical weekday day or weekend day
 * for each month for each vehicle category.
 *
 * Excel: Data from the middle of the middle table in the "CalculateEERE" sheet
 * (V36:AI47).
 */
export function calculateSelectedRegionsMonthlyDailyEnergyUsage(options: {
  selectedRegionsMonthlyEnergyUsage:
    | SelectedRegionsMonthlyEnergyUsage
    | EmptyObject;
  weekendToWeekdayEVConsumption: WeekendToWeekdayEVConsumption;
  monthlyStats: MonthlyStats;
}) {
  const {
    selectedRegionsMonthlyEnergyUsage,
    weekendToWeekdayEVConsumption,
    monthlyStats,
  } = options;

  if (
    Object.keys(selectedRegionsMonthlyEnergyUsage).length === 0 ||
    Object.keys(monthlyStats).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleCategory in VehicleCategoryExcludingOtherBuses]: {
            weekday: number;
            weekend: number;
          };
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsMonthlyEnergyUsage).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEnergyUsage; // prettier-ignore

      object[regionId] ??= {};

      Object.entries(regionValue).forEach(
        ([regionMonthKey, regionMonthValue]) => {
          const month = Number(regionMonthKey);
          const weekdays = monthlyStats[month]?.weekdays || 0;
          const weekends = monthlyStats[month]?.weekends || 0;

          object[regionId][month] ??= {} as {
            [vehicleCategory in VehicleCategoryExcludingOtherBuses]: {
              weekday: number;
              weekend: number;
            };
          };

          Object.entries(regionMonthValue).forEach(
            ([vehicleKey, vehicleValue]) => {
              const vehicleCategory = vehicleKey as keyof typeof regionMonthValue; // prettier-ignore

              /**
               * NOTE: "Battery EVs" and "Plug-in Hybrid EVs" use a single
               * "LDVs" weekend to weekday EV consumption ratio.
               */
              const ratioVehicleCategory =
                vehicleCategory === "Battery EVs" ||
                vehicleCategory === "Plug-in Hybrid EVs"
                  ? "LDVs"
                  : vehicleCategory;

              const weekendWeekdayRatio =
                weekendToWeekdayEVConsumption[ratioVehicleCategory] || 0;

              const weekday = vehicleValue / (weekdays + weekends * weekendWeekdayRatio); // prettier-ignore
              const weekend = weekday * weekendWeekdayRatio;

              object[regionId][month][vehicleCategory] = {
                weekday,
                weekend,
              };
            },
          );
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleCategory in VehicleCategoryExcludingOtherBuses]: {
            weekday: number;
            weekend: number;
          };
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's avoided emissions (lbs) for each month for each
 * vehicle category / vehicle type / fuel type combo.
 *
 * Excel: "Emission Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (G546:R567).
 */
export function calculateSelectedRegionsMonthlyEmissionChanges(options: {
  totalEffectiveVehicles: TotalEffectiveVehicles;
  selectedRegionsMonthlyEmissionRates:
    | SelectedRegionsMonthlyEmissionRates
    | EmptyObject;
  selectedRegionsMonthlyTotalNetPM25EmissionRates:
    | SelectedRegionsMonthlyTotalNetPM25EmissionRates
    | EmptyObject;
  selectedRegionsMonthlyVMT: SelectedRegionsMonthlyVMT | EmptyObject;
  percentageHybridEVMilesDrivenOnElectricity: PercentageHybridEVMilesDrivenOnElectricity;
}) {
  const {
    totalEffectiveVehicles,
    selectedRegionsMonthlyEmissionRates,
    selectedRegionsMonthlyTotalNetPM25EmissionRates,
    selectedRegionsMonthlyVMT,
    percentageHybridEVMilesDrivenOnElectricity,
  } = options;

  if (
    Object.keys(selectedRegionsMonthlyEmissionRates).length === 0 ||
    Object.keys(selectedRegionsMonthlyTotalNetPM25EmissionRates).length === 0 ||
    Object.keys(selectedRegionsMonthlyVMT).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: {
            [pollutant in Pollutant]: number;
          };
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsMonthlyVMT).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyVMT;

      object[regionId] ??= {} as {
        [month: number]: {
          [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: {
            [pollutant in Pollutant]: number;
          };
        };
      };

      Object.entries(regionValue).forEach(([monthKey, monthValue]) => {
        const month = Number(monthKey);

        object[regionId][month] ??= {} as {
          [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: {
            [pollutant in Pollutant]: number;
          };
        };

        Object.entries(totalEffectiveVehicles).forEach(
          ([vehicleKey, vehicleValue]) => {
            const categoryVehicleFuelCombo = vehicleKey as keyof typeof totalEffectiveVehicles; // prettier-ignore
            const [vehicleCategory, vehicleType, fuelType] = vehicleKey.split(" / "); // prettier-ignore
            const vehicleFuelCombo = `${vehicleType} / ${fuelType}` as VehicleTypeFuelTypeCombo; // prettier-ignore

            /** NOTE: Additional factor applied to plug-in hybrid EVs */
            const vehicleCategoryFactor =
              vehicleCategory === "Plug-in Hybrid EVs"
                ? percentageHybridEVMilesDrivenOnElectricity
                : 1;

            object[regionId][month][categoryVehicleFuelCombo] ??= {
              co2: 0,
              nox: 0,
              so2: 0,
              pm25: 0,
              vocs: 0,
              nh3: 0,
            };

            for (const key in object[regionId][month][
              categoryVehicleFuelCombo
            ]) {
              const pollutant = key as keyof (typeof object)[typeof regionId][typeof month][typeof categoryVehicleFuelCombo]; // prettier-ignore

              const vmt = monthValue?.[vehicleFuelCombo] || 0;

              const emissionRate =
                pollutant === "pm25"
                  ? selectedRegionsMonthlyTotalNetPM25EmissionRates?.[regionId]?.[month]?.[vehicleFuelCombo] || 0
                  : selectedRegionsMonthlyEmissionRates?.[regionId]?.[month]?.[vehicleFuelCombo]?.[pollutant] || 0; // prettier-ignore

              object[regionId][month][categoryVehicleFuelCombo][pollutant] =
                vehicleValue * vmt * emissionRate * vehicleCategoryFactor;
            }
          },
        );
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: {
            [pollutant in Pollutant]: number;
          };
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's avoided emissions (lbs) for each month for each
 * vehicle category.
 *
 * Excel: "Emission Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (G720:R767).
 */
export function calculateSelectedRegionsMonthlyEmissionChangesPerVehicleCategory(options: {
  selectedRegionsMonthlyEmissionChanges:
    | SelectedRegionsMonthlyEmissionChanges
    | EmptyObject;
}) {
  const { selectedRegionsMonthlyEmissionChanges } = options;

  if (Object.keys(selectedRegionsMonthlyEmissionChanges).length === 0) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleCategory in VehicleCategoryWithLDVTypes]: {
            [pollutant in Pollutant]: number;
          };
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsMonthlyEmissionChanges).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEmissionChanges; // prettier-ignore

      object[regionId] ??= {} as {
        [month: number]: {
          [vehicleCategory in VehicleCategoryWithLDVTypes]: {
            [pollutant in Pollutant]: number;
          };
        };
      };

      Object.entries(regionValue).forEach(([monthKey, monthValue]) => {
        const month = Number(monthKey);

        object[regionId][month] ??= {} as {
          [vehicleCategory in VehicleCategoryWithLDVTypes]: {
            [pollutant in Pollutant]: number;
          };
        };

        Object.entries(monthValue).forEach(([key, value]) => {
          const [category, vehicleType, _fuelType] = key.split(" / ");

          /**
           * For these results, we want vehicle categories with LDV vehicle
           * types, so we'll use "Passenger cars" and "Passenger trucks" as the
           * vehicle category instead of "Battery EVs" or "Plug-in Hybrid EVs".
           */
          const vehicleCategory = (
            vehicleType === "Passenger cars" ||
            vehicleType === "Passenger trucks"
              ? vehicleType
              : category
          ) as VehicleCategoryWithLDVTypes;

          object[regionId][month][vehicleCategory] ??= {
            co2: 0,
            nox: 0,
            so2: 0,
            pm25: 0,
            vocs: 0,
            nh3: 0,
          };

          Object.entries(value).forEach(([pollutantKey, pollutantValue]) => {
            const pollutant = pollutantKey as keyof typeof value;

            object[regionId][month][vehicleCategory][pollutant] +=
              pollutantValue;
          });
        });
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleCategory in VehicleCategoryWithLDVTypes]: {
            [pollutant in Pollutant]: number;
          };
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's avoided emissions (lbs) for the year for each
 * vehicle category.
 *
 * Excel: "Emission Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (S720:S767).
 */
export function calculateSelectedRegionsYearlyEmissionChangesPerVehicleCategory(options: {
  selectedRegionsMonthlyEmissionChangesPerVehicleCategory:
    | SelectedRegionsMonthlyEmissionChangesPerVehicleCategory
    | EmptyObject;
}) {
  const { selectedRegionsMonthlyEmissionChangesPerVehicleCategory } = options;

  if (
    Object.keys(selectedRegionsMonthlyEmissionChangesPerVehicleCategory)
      .length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [vehicleCategory in VehicleCategoryWithLDVTypes]: {
          [pollutant in Pollutant]: number;
        };
      };
    };
  }

  const result = Object.entries(
    selectedRegionsMonthlyEmissionChangesPerVehicleCategory,
  ).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEmissionChangesPerVehicleCategory; // prettier-ignore

      object[regionId] ??= {} as {
        [vehicleCategory in VehicleCategoryWithLDVTypes]: {
          [pollutant in Pollutant]: number;
        };
      };

      Object.values(regionValue).forEach((monthValue) => {
        Object.entries(monthValue).forEach(
          ([vehicleCategoryKey, vehicleCategoryValue]) => {
            const vehicleCategory = vehicleCategoryKey as keyof typeof monthValue; // prettier-ignore

            object[regionId][vehicleCategory] ??= {
              co2: 0,
              nox: 0,
              so2: 0,
              pm25: 0,
              vocs: 0,
              nh3: 0,
            };

            Object.entries(vehicleCategoryValue).forEach(
              ([pollutantKey, pollutantValue]) => {
                const pollutant = pollutantKey as keyof typeof vehicleCategoryValue; // prettier-ignore

                object[regionId][vehicleCategory][pollutant] += pollutantValue;
              },
            );
          },
        );
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [vehicleCategory in VehicleCategoryWithLDVTypes]: {
          [pollutant in Pollutant]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's total avoided emissions (lbs) for each month.
 *
 * Excel: "Emission Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (G768:R773).
 */
export function calculateSelectedRegionsMonthlyEmissionChangesTotals(options: {
  selectedRegionsMonthlyEmissionChangesPerVehicleCategory:
    | SelectedRegionsMonthlyEmissionChangesPerVehicleCategory
    | EmptyObject;
}) {
  const { selectedRegionsMonthlyEmissionChangesPerVehicleCategory } = options;

  if (
    Object.keys(selectedRegionsMonthlyEmissionChangesPerVehicleCategory)
      .length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [pollutant in Pollutant]: number;
        };
      };
    };
  }

  const result = Object.entries(
    selectedRegionsMonthlyEmissionChangesPerVehicleCategory,
  ).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEmissionChangesPerVehicleCategory; // prettier-ignore

      object[regionId] ??= {} as {
        [month: number]: {
          [pollutant in Pollutant]: number;
        };
      };

      Object.entries(regionValue).forEach(([monthKey, monthValue]) => {
        const month = Number(monthKey);

        object[regionId][month] ??= {
          co2: 0,
          nox: 0,
          so2: 0,
          pm25: 0,
          vocs: 0,
          nh3: 0,
        };

        Object.values(monthValue).forEach((value) => {
          Object.entries(value).forEach(([pollutantKey, pollutantValue]) => {
            const pollutant = pollutantKey as keyof typeof value;

            object[regionId][month][pollutant] += pollutantValue;
          });
        });
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [pollutant in Pollutant]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Selected AVERT region's total avoided emissions (lbs) for the year.
 *
 * Excel: "Emission Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (S768:S773).
 */
export function calculateSelectedRegionsYearlyEmissionChangesTotals(options: {
  selectedRegionsMonthlyEmissionChangesTotals:
    | SelectedRegionsMonthlyEmissionChangesTotals
    | EmptyObject;
}) {
  const { selectedRegionsMonthlyEmissionChangesTotals } = options;

  if (Object.keys(selectedRegionsMonthlyEmissionChangesTotals).length === 0) {
    return {} as {
      [regionId in RegionId]: {
        [pollutant in Pollutant]: number;
      };
    };
  }

  const result = Object.entries(
    selectedRegionsMonthlyEmissionChangesTotals,
  ).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsMonthlyEmissionChangesTotals; // prettier-ignore

      object[regionId] ??= {
        co2: 0,
        nox: 0,
        so2: 0,
        pm25: 0,
        vocs: 0,
        nh3: 0,
      };

      Object.values(regionValue).forEach((monthValue) => {
        Object.entries(monthValue).forEach(([pollutantKey, pollutantValue]) => {
          const pollutant = pollutantKey as keyof typeof monthValue;

          object[regionId][pollutant] += pollutantValue;
        });
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [pollutant in Pollutant]: number;
      };
    },
  );

  return result;
}

/**
 * Total vehicle sales and stock for each state in the selected region (or the
 * single state if a state is selected).
 *
 * Excel: "Table 10: List of states in region for purposes of calculating
 * vehicle sales and stock" table in the "Library" sheet (C857:Q857 and down
 * as many rows as needed, as the table is dynamically populated with a row
 * for each state within the selected region).
 */
export function calculateSelectedGeographySalesAndStockByState(options: {
  countyFips: CountyFIPS;
  stateLevelSales: StateLevelSales;
  geographicFocus: GeographicFocus;
  selectedRegionName: RegionName | "";
  selectedGeographyStates: StateId[];
}) {
  const {
    countyFips,
    stateLevelSales,
    geographicFocus,
    selectedRegionName,
    selectedGeographyStates,
  } = options;

  /**
   * When accessing vehicle categories in the `stateLevelSales` data, instead of
   * using "Long-haul trucks" we'll use "Combination long-haul trucks" as that's
   * the value used in the data.
   */
  type StateLevelSalesVehicleCategory =
    | Exclude<VehicleCategoryWithLDVTypes, "Long-haul trucks">
    | "Combination long-haul trucks";

  /**
   * The vehicle categories used in the Excel Table 10 are slightly different
   * than the values used elsewhere. So for the returned data, in addition to
   * using "Combination long-haul trucks" instead of "Long-haul trucks" (see
   * above) we'll also use a single "LDVs" vehicle category instead of
   * "Passenger cars" and "Passenger trucks".
   */
  type SalesAndStockVehicleCategory =
    | Exclude<
        StateLevelSalesVehicleCategory,
        "Passenger cars" | "Passenger trucks"
      >
    | "LDVs";

  const result = countyFips.reduce(
    (object, countyData) => {
      const regionName = countyData["AVERT Region"] as RegionName;
      const stateId = countyData["Postal State Code"] as StateId;

      /**
       * If an AVERT region is selected, limit the matched county level data to
       * be within the selected AVERT region.
       */
      const conditionalRegionMatch =
        geographicFocus === "regions"
          ? selectedRegionName === regionName
          : true;

      /**
       * Regardless of the geographic focus (selected AVERT region or a selected
       * state) limit the matched county level data to be within one of the
       * selected states.
       */
      const stateMatch = selectedGeographyStates.includes(stateId);

      if (conditionalRegionMatch && stateMatch) {
        object[stateId] ??= {} as {
          [vehicleCategory in SalesAndStockVehicleCategory]: {
            sales: number;
            stock: number;
          };
        };

        stateLevelSales.forEach((stateData) => {
          if (stateId === stateData["State"]) {
            const stateCategory = stateData["Vehicle Category"] as StateLevelSalesVehicleCategory; // prettier-ignore

            /**
             * Depending on the state level sales vehicle category, we'll access
             * the VMT factor data from either the "Share of State VMT" or
             * "Share of State VMT - Collapsed" fields from the countyFIPS data.
             */
            const vmtFactor =
              stateCategory === "Passenger cars" ||
              stateCategory === "Passenger trucks" ||
              stateCategory === "Combination long-haul trucks"
                ? countyData["Share of State VMT"][stateCategory]
                : stateCategory === "Transit buses" ||
                    stateCategory === "School buses" ||
                    stateCategory === "Other buses" ||
                    stateCategory === "Short-haul trucks" ||
                    stateCategory === "Refuse trucks"
                  ? countyData["Share of State VMT - Collapsed"][stateCategory]
                  : 0;

            const sales = vmtFactor * stateData["Sales (2023)"];
            const stock = vmtFactor * stateData["Stock (2023)"];

            /**
             * For the data returned, we'll combine "Passenger cars" and
             * "Passenger trucks" results into a common "LDVs" vehicle category.
             */
            const vehicleCategory =
              stateCategory === "Passenger cars" ||
              stateCategory === "Passenger trucks"
                ? "LDVs"
                : stateCategory;

            object[stateId][vehicleCategory] ??= {
              sales: 0,
              stock: 0,
            };

            object[stateId][vehicleCategory].sales += sales;
            object[stateId][vehicleCategory].stock += stock;
          }
        });
      }

      return object;
    },
    {} as {
      [stateId in StateId]: {
        [vehicleCategory in SalesAndStockVehicleCategory]: {
          sales: number;
          stock: number;
        };
      };
    },
  );

  return result;
}

/**
 * Total vehicle sales and stock for the selected region (empty if a single
 * state is selected).
 *
 * Excel: "Table 10: List of states in region for purposes of calculating
 * vehicle sales and stock" table in the "Library" sheet (C856:Q856).
 */
export function calculateSelectedGeographySalesAndStockByRegion(options: {
  geographicFocus: GeographicFocus;
  selectedGeographySalesAndStockByState: SelectedGeographySalesAndStockByState;
}) {
  const { geographicFocus, selectedGeographySalesAndStockByState } = options;

  type SalesAndStockVehicleCategory = keyof SelectedGeographySalesAndStockByState[StateId]; // prettier-ignore

  if (
    geographicFocus === "states" ||
    Object.keys(selectedGeographySalesAndStockByState).length === 0
  ) {
    return {} as {
      [vehicleCategory in SalesAndStockVehicleCategory]: {
        sales: number;
        stock: number;
      };
    };
  }

  const result = Object.values(selectedGeographySalesAndStockByState).reduce(
    (object, stateData) => {
      Object.entries(stateData).forEach(([key, value]) => {
        const vehicleCategory = key as keyof typeof stateData;

        object[vehicleCategory] ??= {
          sales: 0,
          stock: 0,
        };

        object[vehicleCategory].sales += value.sales;
        object[vehicleCategory].stock += value.stock;
      });

      return object;
    },
    {} as {
      [vehicleCategory in SalesAndStockVehicleCategory]: {
        sales: number;
        stock: number;
      };
    },
  );

  return result;
}

/**
 * Calculates averages of the selected region(s)' hourly EERE Defaults for both
 * onshore wind and utility solar. These average RE values are used in setting
 * the historical RE data for Onshore Wind and Unitity Solar's GWh values in the
 * `EEREEVComparisonTable` component.
 *
 * Excel: Used in calculating values for cells F680 and G680 of the "Table 13:
 * Historical renewable and energy efficiency addition data" table in the
 * "Library" sheet.
 */
export function calculateSelectedRegionsEEREDefaultsAverages(options: {
  selectedGeographyRegions: SelectedGeographyRegions;
  regionalScalingFactors: RegionalScalingFactors;
}) {
  const { selectedGeographyRegions, regionalScalingFactors } = options;

  const result: Partial<{
    [regionId in RegionId]: {
      wind: number;
      upv: number;
    };
  }> = {};

  if (Object.keys(selectedGeographyRegions).length === 0) {
    return result;
  }

  /**
   * Build up results by region, using the regional scaling factor.
   */
  Object.entries(regionalScalingFactors).forEach(
    ([scalingFactorKey, scalingFactorValue]) => {
      const regionId = scalingFactorKey as keyof typeof regionalScalingFactors;

      result[regionId] ??= {
        wind: scalingFactorValue,
        upv: scalingFactorValue,
      };

      const regionEEREDefaults =
        selectedGeographyRegions[regionId]?.eereDefaults.data;

      if (!regionEEREDefaults) {
        return result;
      }

      const totalHours = regionEEREDefaults.length;

      const eereDefaultsTotals = regionEEREDefaults.reduce(
        (total, hourlyEereDefault) => {
          total.wind += hourlyEereDefault.onshore_wind;
          total.upv += hourlyEereDefault.utility_pv;
          return total;
        },
        { wind: 0, upv: 0 },
      );

      result[regionId].wind *= eereDefaultsTotals.wind / totalHours;
      result[regionId].upv *= eereDefaultsTotals.upv / totalHours;
    },
  );

  return result;
}

/**
 * Historical EERE data for the EV deployment location (entire region or state).
 *
 * Excel: "Table 11: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (C956:H956).
 */
export function calculateEVDeploymentLocationHistoricalEERE(options: {
  selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
  historicalRegionEEREData: HistoricalRegionEEREData;
  historicalStateEEREData: HistoricalStateEEREData;
  evDeploymentLocation: string;
  regionalLineLoss: number;
  regions: { [regionId in RegionId]: RegionState };
}) {
  const {
    selectedRegionsEEREDefaultsAverages,
    historicalRegionEEREData,
    historicalStateEEREData,
    evDeploymentLocation,
    regionalLineLoss,
    regions,
  } = options;

  const result = {
    averageAnnualCapacityAddedMW: { wind: 0, upv: 0, eeRetail: 0 },
    estimatedAnnualImpactsGWh: { wind: 0, upv: 0, eeRetail: 0 },
  };

  if (Object.keys(selectedRegionsEEREDefaultsAverages).length === 0) {
    return result;
  }

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith("region-");
  const deploymentLocationStateId = evDeploymentLocation.replace("state-", "") as StateId; // prettier-ignore

  const GWtoMW = 1_000;
  const hoursInYear = 8_760;

  /**
   * Excel: "Wind" column (F) and "UPV" column (G) from the "Table 11:
   * Historical renewable and energy efficiency addition data" table in the
   * "Library" sheet (F822:G895).
   */
  const regionAnnualWholesaleImpacts = Object.entries(
    selectedRegionsEEREDefaultsAverages,
  ).reduce(
    (object, [eereDefaultsKey, eereDefaultsValue]) => {
      const regionId = eereDefaultsKey as keyof typeof selectedRegionsEEREDefaultsAverages; // prettier-ignore
      const { wind, upv } = eereDefaultsValue;

      const regionName = Object.values(regions).find((region) => {
        return region.id === regionId;
      })?.name;

      const regionEEREAverage = historicalRegionEEREData.find((data) => {
        return data["AVERT Regions: Totals"] === regionName;
      });

      const regionCapacityAdded = regionEEREAverage?.["Avg. Annual Capacity added 2021-2023 (MW)"]; // prettier-ignore

      const regionEEREAverageWind = regionCapacityAdded?.["Wind"] || 0;
      const regionEEREAverageUPV = regionCapacityAdded?.["UPV"] || 0;

      object.Wind += (wind * hoursInYear * regionEEREAverageWind) / GWtoMW;
      object.UPV += (upv * hoursInYear * regionEEREAverageUPV) / GWtoMW;

      return object;
    },
    { Wind: 0, UPV: 0 },
  );

  const selectedRegion = Object.values(regions).find((r) => r.selected);
  const selectedRegionName = selectedRegion?.name || "";

  const regionEEREAverage = historicalRegionEEREData.find((data) => {
    return data["AVERT Regions: Totals"] === selectedRegionName;
  });

  const regionCapacityAdded = regionEEREAverage?.["Avg. Annual Capacity added 2021-2023 (MW)"]; // prettier-ignore
  const regionRetailImpacts = regionEEREAverage?.["Retail Impacts (GWh)"];

  const stateEEREAverage = historicalStateEEREData.find((data) => {
    return data["States: Totals"] === deploymentLocationStateId;
  });

  const stateCapacityAdded = stateEEREAverage?.["Avg. Annual Capacity added 2021-2023 (MW)"]; // prettier-ignore
  const stateImpacts = stateEEREAverage?.["Estimated Annual Impacts (GWh)"];

  const windCapacityAdded = deploymentLocationIsRegion
    ? regionCapacityAdded?.["Wind"] || 0
    : stateCapacityAdded?.["Wind"] || 0;

  const upvCapacityAdded = deploymentLocationIsRegion
    ? regionCapacityAdded?.["UPV"] || 0
    : stateCapacityAdded?.["UPV"] || 0;

  const windImpacts = deploymentLocationIsRegion
    ? regionAnnualWholesaleImpacts["Wind"]
    : stateImpacts?.["Wind"] || 0;

  const upvImpacts = deploymentLocationIsRegion
    ? regionAnnualWholesaleImpacts["UPV"]
    : stateImpacts?.["UPV"] || 0;

  const eeRetailImpacts = deploymentLocationIsRegion
    ? regionRetailImpacts?.["EE"] || 0
    : stateImpacts?.["EE (Retail)"] || 0;

  const eeRetailCapacityAdded = deploymentLocationIsRegion
    ? ((eeRetailImpacts / 1 - regionalLineLoss) * GWtoMW) / hoursInYear
    : (eeRetailImpacts * GWtoMW) / hoursInYear;

  result.averageAnnualCapacityAddedMW.wind = windCapacityAdded;
  result.averageAnnualCapacityAddedMW.upv = upvCapacityAdded;
  result.averageAnnualCapacityAddedMW.eeRetail = eeRetailCapacityAdded;

  result.estimatedAnnualImpactsGWh.wind = windImpacts;
  result.estimatedAnnualImpactsGWh.upv = upvImpacts;
  result.estimatedAnnualImpactsGWh.eeRetail = eeRetailImpacts;

  return result;
}

/**
 * Calculates vehicle emission changes at the county, state, and total levels
 * for the selected geography.
 *
 * Excel: County level data calculations in "From vehicles" column in the table
 * in the "11_VehicleCty" sheet (column H) – we just roll those county level
 * values up to the state, region, and total levels in this same function too,
 * as they're used at those aggregate levels as well.
 */
export function calculateVehicleEmissionChangesByGeography(options: {
  geographicFocus: GeographicFocus;
  selectedRegionId: RegionId | "";
  selectedStateId: StateId | "";
  selectedRegionsCounties: Partial<{
    [regionId in RegionId]: Partial<{
      [stateId in StateId]: string[];
    }>;
  }>;
  vmtTotalsByGeography: VMTTotalsByGeography | EmptyObject;
  selectedRegionsYearlyEmissionChangesPerVehicleCategory:
    | SelectedRegionsYearlyEmissionChangesPerVehicleCategory
    | EmptyObject;
  evDeploymentLocation: string;
}) {
  const {
    geographicFocus,
    selectedRegionId,
    selectedStateId,
    selectedRegionsCounties,
    vmtTotalsByGeography,
    selectedRegionsYearlyEmissionChangesPerVehicleCategory,
    evDeploymentLocation,
  } = options;

  const result = {
    total: { co2: 0, nox: 0, so2: 0, pm25: 0, vocs: 0, nh3: 0 },
    regions: {},
    states: {},
    counties: {},
  } as {
    total: {
      [pollutant in Pollutant]: number;
    };
    regions: {
      [regionId in RegionId]: {
        [pollutant in Pollutant]: number;
      };
    };
    states: {
      [stateId in StateId]: {
        [pollutant in Pollutant]: number;
      };
    };
    counties: {
      [stateId in StateId]: {
        [county: string]: {
          [pollutant in Pollutant]: number;
        };
      };
    };
  };

  if (
    Object.keys(selectedRegionsCounties).length === 0 ||
    Object.keys(vmtTotalsByGeography).length === 0 ||
    Object.keys(selectedRegionsYearlyEmissionChangesPerVehicleCategory)
      .length === 0 ||
    evDeploymentLocation === ""
  ) {
    return result;
  }

  const regionSelected = geographicFocus === "regions" && selectedRegionId !== ""; // prettier-ignore
  const stateSelected = geographicFocus === "states" && selectedStateId !== "";

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith("region-");
  const deploymentLocationIsState = evDeploymentLocation.startsWith("state-");
  const deploymentLocationStateId = evDeploymentLocation.replace("state-", "") as StateId; // prettier-ignore

  /**
   * Determine which VMT totals to use as the denominator in the calculations
   * below, based on the selected geography and EV deployment location.
   */
  const vmtTotalsDivisor = regionSelected
    ? deploymentLocationIsRegion
      ? vmtTotalsByGeography.regions[selectedRegionId].total
      : vmtTotalsByGeography.regions[selectedRegionId].states?.[deploymentLocationStateId] // prettier-ignore
    : stateSelected
      ? vmtTotalsByGeography.states[selectedStateId]
      : null;

  if (!vmtTotalsDivisor) {
    return result;
  }

  const vmtTotalsByCounties = vmtTotalsByGeography.counties;

  statesLoop: for (const statesEntries of Object.entries(vmtTotalsByCounties)) {
    const [stateVMTTotalsKey, stateVMTTotalsValue] = statesEntries;

    const stateId = stateVMTTotalsKey as keyof typeof vmtTotalsByCounties;

    /** If a state is selected, skip any county VMT totals data not within it. */
    if (stateSelected && selectedStateId !== stateId) continue statesLoop;

    countiesLoop: for (const entries of Object.entries(stateVMTTotalsValue)) {
      const [county, countyVMTTotals] = entries;

      /** Determine which region the county falls within. */
      const regionId = Object.entries(selectedRegionsCounties).find(
        ([_regionKey, regionValue]) => {
          return Object.entries(regionValue).some(([key, value]) => {
            return (key as StateId) === stateId && value.includes(county);
          });
        },
      )?.[0] as RegionId | undefined;

      /** Ensure the county is within the selected AVERT region. */
      if (
        !regionId ||
        !selectedRegionsCounties[regionId]?.[stateId]?.includes(county)
      ) {
        continue countiesLoop;
      }

      /** Ensure the county is within the EV deployment location. */
      if (deploymentLocationIsState && deploymentLocationStateId !== stateId) {
        continue countiesLoop;
      }

      /** Initialize each region, state, and county's pollutants values. */
      result.regions[regionId] ??= { co2: 0, nox: 0, so2: 0, pm25: 0, vocs: 0, nh3: 0 }; // prettier-ignore
      result.states[stateId] ??= { co2: 0, nox: 0, so2: 0, pm25: 0, vocs: 0, nh3: 0 }; // prettier-ignore
      result.counties[stateId] ??= {};
      result.counties[stateId][county] ??= { co2: 0, nox: 0, so2: 0, pm25: 0, vocs: 0, nh3: 0 }; // prettier-ignore

      Object.values(
        selectedRegionsYearlyEmissionChangesPerVehicleCategory,
      ).forEach((regionEmissionChanges) => {
        Object.entries(regionEmissionChanges).forEach(([key, value]) => {
          const vehicleCategory = key as keyof typeof regionEmissionChanges;

          const countyVMTTotal = countyVMTTotals?.[vehicleCategory];
          const vmtTotalDivisor = vmtTotalsDivisor?.[vehicleCategory];

          if (countyVMTTotal && vmtTotalDivisor) {
            Object.entries(value).forEach(([pollutantKey, pollutantValue]) => {
              const pollutant = pollutantKey as keyof typeof value;

              /* Conditionally convert CO2 pounds into tons. */
              const pollutantUnitFactor = pollutant === "co2" ? 2000 : 1;

              const emissionChanges =
                (-1 * pollutantValue * countyVMTTotal) /
                vmtTotalDivisor /
                pollutantUnitFactor;

              result.total[pollutant] += emissionChanges;
              result.regions[regionId][pollutant] += emissionChanges;
              result.states[stateId][pollutant] += emissionChanges;
              result.counties[stateId][county][pollutant] += emissionChanges;
            });
          }
        });
      });
    }
  }

  return result;
}
