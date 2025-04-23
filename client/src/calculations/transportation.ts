import {
  type GeographicFocus,
  type RegionalLoadData,
} from "@/redux/reducers/geography";
import {
  type CountiesByGeography,
  type RegionalScalingFactors,
  type ClimateAdjustmentFactorByRegion,
  type SelectedGeographyRegions,
} from "@/calculations/geography";
import { type EmptyObject, sortObjectByKeys } from "@/utilities";
import {
  type CountyFIPS,
  type MOVESEmissionRates,
  type StateLevelVMT,
  type FHWALDVStateLevelVMT,
  type PM25BreakwearTirewearEVICERatios,
  type VMTAllocationAndRegisteredVehicles,
  type EVChargingProfiles,
  type EVEfficiencyAssumptions,
  type RegionAverageTemperatures,
  type StateLDVsSales,
  type StateBusSalesAndStock,
  type RegionEereAverages,
  type StateEereAverages,
  type RegionId,
  type RegionName,
  type StateId,
  percentageHybridEVMilesDrivenOnElectricity,
  percentWeekendToWeekdayEVConsumption,
  regions,
  states,
} from "@/config";
/**
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (E272:P274)
 */
import schoolBusMonthlyVMTPercentages from "@/data/school-bus-monthly-vmt-percentages.json";

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
  LDVs: ["Passenger cars", "Passenger trucks"],
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
  "LDVs / Passenger cars",
  "LDVs / Passenger trucks",
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

const _abridgedVehicleTypes = [
  "cars",
  "trucks",
  "transitBuses",
  "schoolBuses",
] as const;

const _generalVehicleTypes = [
  "cars",
  "trucks",
  "transitBusesDiesel",
  "transitBusesCNG",
  "transitBusesGasoline",
  "schoolBuses",
] as const;

/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
const _expandedVehicleTypes = [
  "batteryEVCars",
  "hybridEVCars",
  "batteryEVTrucks",
  "hybridEVTrucks",
  "transitBusesDiesel",
  "transitBusesCNG",
  "transitBusesGasoline",
  "schoolBuses",
] as const;

const pollutants = ["CO2", "NOX", "SO2", "PM25", "VOCs", "NH3"] as const;

type VehicleType = (typeof vehicleTypes)[number];
type ExpandedVehicleType = (typeof expandedVehicleTypes)[number];
type VehicleTypeFuelTypeCombo = (typeof vehicleTypeFuelTypeCombos)[number];
type VehicleTypeEVFuelTypeCombo = (typeof vehicleTypeEVFuelTypeCombos)[number];
type VehicleTypesByVehicleCategory = typeof vehicleTypesByVehicleCategory;
type VehicleCategory = keyof typeof vehicleTypesByVehicleCategory;
type VehicleCategoryVehicleTypeCombo = (typeof vehicleCategoryVehicleTypeCombos)[number]; // prettier-ignore
type VehicleCategoryVehicleTypeFuelTypeCombo = (typeof vehicleCategoryVehicleTypeFuelTypeCombos)[number]; // prettier-ignore

type MovesPollutant = (typeof movesPollutants)[number];

type _AbridgedVehicleType = (typeof _abridgedVehicleTypes)[number];
type _GeneralVehicleType = (typeof _generalVehicleTypes)[number];
type _ExpandedVehicleType = (typeof _expandedVehicleTypes)[number];
type Pollutant = (typeof pollutants)[number];

export type VMTTotalsByGeography = ReturnType<
  typeof calculateVMTTotalsByGeography
>;
export type VMTBillionsAndPercentages = ReturnType<
  typeof calculateVMTBillionsAndPercentages
>;
export type StateVMTPercentagesByRegion = ReturnType<
  typeof calculateStateVMTPercentagesByRegion
>;
export type VMTAllocationPerVehicle = ReturnType<
  typeof calculateVMTAllocationPerVehicle
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
export type HourlyEVChargingPercentages = ReturnType<
  typeof calculateHourlyEVChargingPercentages
>;
export type _SelectedRegionsStatesVMTPercentages = ReturnType<
  typeof _calculateSelectedRegionsStatesVMTPercentages
>;
export type _SelectedRegionsVMTPercentagesPerVehicleType = ReturnType<
  typeof _calculateSelectedRegionsVMTPercentagesPerVehicleType
>;
export type _SelectedRegionsAverageVMTPerYear = ReturnType<
  typeof _calculateSelectedRegionsAverageVMTPerYear
>;
export type _SelectedRegionsMonthlyVMTPerVehicleType = ReturnType<
  typeof _calculateSelectedRegionsMonthlyVMTPerVehicleType
>;
export type _SelectedRegionsEVEfficiencyPerVehicleType = ReturnType<
  typeof _calculateSelectedRegionsEVEfficiencyPerVehicleType
>;
export type DailyStats = ReturnType<typeof calculateDailyStats>;
export type MonthlyStats = ReturnType<typeof calculateMonthlyStats>;
export type _VehiclesDisplaced = ReturnType<typeof _calculateVehiclesDisplaced>;
export type _SelectedRegionsMonthlyEVEnergyUsageGW = ReturnType<
  typeof _calculateSelectedRegionsMonthlyEVEnergyUsageGW
>;
export type SelectedRegionsMonthlyEVEnergyUsageMW = ReturnType<
  typeof calculateSelectedRegionsMonthlyEVEnergyUsageMW
>;
export type SelectedRegionsMonthlyDailyEVEnergyUsage = ReturnType<
  typeof calculateSelectedRegionsMonthlyDailyEVEnergyUsage
>;
export type _SelectedRegionsMonthlyEmissionRates = ReturnType<
  typeof _calculateSelectedRegionsMonthlyEmissionRates
>;
export type SelectedRegionsMonthlyEmissionChanges = ReturnType<
  typeof calculateSelectedRegionsMonthlyEmissionChanges
>;
export type SelectedRegionsTotalMonthlyEmissionChanges = ReturnType<
  typeof calculateSelectedRegionsTotalMonthlyEmissionChanges
>;
export type SelectedRegionsTotalYearlyEmissionChanges = ReturnType<
  typeof calculateSelectedRegionsTotalYearlyEmissionChanges
>;
export type VehicleEmissionChangesByGeography = ReturnType<
  typeof calculateVehicleEmissionChangesByGeography
>;
export type SelectedRegionsTotalYearlyEVEnergyUsage = ReturnType<
  typeof calculateSelectedRegionsTotalYearlyEVEnergyUsage
>;
export type VehicleSalesAndStock = ReturnType<
  typeof calculateVehicleSalesAndStock
>;
export type SelectedRegionsEEREDefaultsAverages = ReturnType<
  typeof calculateSelectedRegionsEEREDefaultsAverages
>;
export type EVDeploymentLocationHistoricalEERE = ReturnType<
  typeof calculateEVDeploymentLocationHistoricalEERE
>;

/**
 * Accumulated county level VMT data per vehicle type by AVERT region, state,
 * and county.
 *
 * Aggregates totals of cars, trucks, transit buses and school buses for each
 * county, state, region (region total, as well as state totals within each
 * region) from County FIPs data.
 *
 * Excel: Not stored in any table, but used in calculating values in the "From
 * vehicles" column in the table in the "11_VehicleCty" sheet (column H).
 */
export function calculateVMTTotalsByGeography(options: {
  countyFips: CountyFIPS;
}) {
  const { countyFips } = options;

  type VMTPerVehicleType = { [vehicleType in _AbridgedVehicleType]: number };

  const regionIds = Object.values(regions).reduce(
    (object, { id, name }) => {
      object[name] = id;
      return object;
    },
    {} as { [regionName: string]: RegionId },
  );

  const result = countyFips.reduce(
    (object, data) => {
      const regionId = regionIds[data["AVERT Region"]];
      const stateId = data["Postal State Code"] as StateId;
      const county = data["County Name Long"];
      const vmtData = {
        cars: data["Passenger Cars VMT"] || 0,
        trucks: data["Passenger Trucks and Light Commercial Trucks VMT"] || 0,
        transitBuses: data["Transit Buses VMT"] || 0,
        schoolBuses: data["School Buses VMT"] || 0,
      };

      if (regionId) {
        object.regions[regionId] ??= {
          total: { cars: 0, trucks: 0, transitBuses: 0, schoolBuses: 0 },
          states: {} as { [stateId in StateId]: VMTPerVehicleType },
        };
        object.regions[regionId].states[stateId] ??= { cars: 0, trucks: 0, transitBuses: 0, schoolBuses: 0 } // prettier-ignore
        object.states[stateId] ??= { cars: 0, trucks: 0, transitBuses: 0, schoolBuses: 0 }; // prettier-ignore
        object.counties[stateId] ??= {};
        object.counties[stateId][county] ??= { cars: 0, trucks: 0, transitBuses: 0, schoolBuses: 0 }; // prettier-ignore

        _abridgedVehicleTypes.forEach((vehicleType) => {
          object.regions[regionId].total[vehicleType] += vmtData[vehicleType];
          object.regions[regionId].states[stateId][vehicleType] += vmtData[vehicleType]; // prettier-ignore
          object.states[stateId][vehicleType] += vmtData[vehicleType];
          object.counties[stateId][county][vehicleType] += vmtData[vehicleType];
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
          total: VMTPerVehicleType;
          states: {
            [stateId in StateId]: VMTPerVehicleType;
          };
        };
      };
      states: {
        [stateId in StateId]: VMTPerVehicleType;
      };
      counties: {
        [stateId in StateId]: {
          [county: string]: VMTPerVehicleType;
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
 * VMT allocation by state and AVERT region (in billions and percentages).
 *
 * Excel: First table in the "RegionStateAllocate" sheet (B6:BF108)
 */
export function calculateVMTBillionsAndPercentages(options: {
  countyFips: CountyFIPS;
}) {
  const { countyFips } = options;

  // initialize result object with state keys and regionTotals key
  const result = Object.keys(states).reduce(
    (data, stateId) => {
      data[stateId as StateId] = {};
      return data;
    },
    { regionTotals: {} } as {
      [stateId in StateId | "regionTotals"]: Partial<{
        [regionId in RegionId | "allRegions"]: {
          cars: { total: number; percent: number };
          trucks: { total: number; percent: number };
          transitBuses: { total: number; percent: number };
          schoolBuses: { total: number; percent: number };
          allLDVs: { total: number; percent: number };
          allBuses: { total: number; percent: number };
        };
      }>;
    },
  );

  const regionIds = Object.values(regions).reduce(
    (object, { id, name }) => {
      object[name] = id;
      return object;
    },
    {} as { [regionName: string]: RegionId },
  );

  // populate vmt totals data for each state, organized by region, and initialize
  // allRegions object for storing totals of all region data in the state
  countyFips.forEach((data) => {
    const stateId = data["Postal State Code"] as StateId;
    const regionId = regionIds[data["AVERT Region"]];
    const carsVMT = data["Passenger Cars VMT"] || 0;
    const trucksVMT = data["Passenger Trucks and Light Commercial Trucks VMT"] || 0; // prettier-ignore
    const transitBusesVMT = data["Transit Buses VMT"] || 0;
    const schoolBusesVMT = data["School Buses VMT"] || 0;

    if (result[stateId]) {
      result[stateId].allRegions ??= {
        cars: { total: 0, percent: 0 },
        trucks: { total: 0, percent: 0 },
        transitBuses: { total: 0, percent: 0 },
        schoolBuses: { total: 0, percent: 0 },
        allLDVs: { total: 0, percent: 0 },
        allBuses: { total: 0, percent: 0 },
      };

      result[stateId][regionId] ??= {
        cars: { total: 0, percent: 0 },
        trucks: { total: 0, percent: 0 },
        transitBuses: { total: 0, percent: 0 },
        schoolBuses: { total: 0, percent: 0 },
        allLDVs: { total: 0, percent: 0 },
        allBuses: { total: 0, percent: 0 },
      };

      const regionValues = result[stateId][regionId];

      if (regionValues) {
        const cars = carsVMT / 1_000_000_000;
        const trucks = trucksVMT / 1_000_000_000;
        const transitBuses = transitBusesVMT / 1_000_000_000;
        const schoolBuses = schoolBusesVMT / 1_000_000_000;

        regionValues.cars.total += cars;
        regionValues.trucks.total += trucks;
        regionValues.transitBuses.total += transitBuses;
        regionValues.schoolBuses.total += schoolBuses;
        regionValues.allLDVs.total += cars + trucks;
        regionValues.allBuses.total += transitBuses + schoolBuses;
      }
    }
  });

  // build up the currently empty result.regionTotals object to be the total vmt
  // data for each region, across all states
  Object.entries(result).forEach(([stateId, stateData]) => {
    // NOTE: stateData is really "regionTotals" on the first loop, so skip it
    if (stateId !== "regionTotals") {
      Object.entries(stateData).forEach(([regionId, regionData]) => {
        // NOTE: regionId is really "allRegions" on the first loop, so skip it
        if (regionId !== "allRegions") {
          result.regionTotals[regionId as RegionId] ??= {
            cars: { total: 0, percent: 1 },
            trucks: { total: 0, percent: 1 },
            transitBuses: { total: 0, percent: 1 },
            schoolBuses: { total: 0, percent: 1 },
            allLDVs: { total: 0, percent: 1 },
            allBuses: { total: 0, percent: 1 },
          };

          const regionTotalData = result.regionTotals[regionId as RegionId];

          if (regionTotalData) {
            regionTotalData.cars.total += regionData.cars.total;
            regionTotalData.trucks.total += regionData.trucks.total;
            regionTotalData.transitBuses.total += regionData.transitBuses.total;
            regionTotalData.schoolBuses.total += regionData.schoolBuses.total;
            regionTotalData.allLDVs.total += regionData.allLDVs.total;
            regionTotalData.allBuses.total += regionData.allBuses.total;
          }
        }
      });
    }
  });

  // calculate percentages of vmt data for each state across all states,
  // and build up each state's "allRegions" data with values from each region
  Object.entries(result).forEach(([stateId, stateData]) => {
    // NOTE: stateData is really "regionTotals" on the first loop, so skip it
    if (stateId !== "regionTotals") {
      Object.entries(stateData).forEach(([regionId, regionData]) => {
        // NOTE: regionId is really "allRegions" on the first loop, so skip it
        if (regionId !== "allRegions") {
          const regionTotalData = result.regionTotals[regionId as RegionId];
          const allRegionsData = result[stateId as StateId].allRegions;

          if (regionTotalData && allRegionsData) {
            const carsTotal = regionData.cars.total;
            const trucksTotal = regionData.trucks.total;
            const transitBusesTotal = regionData.transitBuses.total;
            const schoolBusesTotal = regionData.schoolBuses.total;
            const allLDVsTotal = regionData.allLDVs.total;
            const allBusesTotal = regionData.allBuses.total;

            const carsPercent = carsTotal / regionTotalData.cars.total;
            const trucksPercent = trucksTotal / regionTotalData.trucks.total;
            const transitBusesPercent = transitBusesTotal / regionTotalData.transitBuses.total; // prettier-ignore
            const schoolBusesPercent = schoolBusesTotal / regionTotalData.schoolBuses.total; // prettier-ignore
            const allLDVsPercent = allLDVsTotal / regionTotalData.allLDVs.total;
            const allBusesPercent = allBusesTotal / regionTotalData.allBuses.total; // prettier-ignore

            regionData.cars.percent = carsPercent;
            regionData.trucks.percent = trucksPercent;
            regionData.transitBuses.percent = transitBusesPercent;
            regionData.schoolBuses.percent = schoolBusesPercent;
            regionData.allLDVs.percent = allLDVsPercent;
            regionData.allBuses.percent = allBusesPercent;

            allRegionsData.cars.total += carsTotal;
            allRegionsData.trucks.total += trucksTotal;
            allRegionsData.transitBuses.total += transitBusesTotal;
            allRegionsData.schoolBuses.total += schoolBusesTotal;
            allRegionsData.allLDVs.total += allLDVsTotal;
            allRegionsData.allBuses.total += allBusesTotal;

            allRegionsData.cars.percent += carsPercent;
            allRegionsData.trucks.percent += trucksPercent;
            allRegionsData.transitBuses.percent += transitBusesPercent;
            allRegionsData.schoolBuses.percent += schoolBusesPercent;
            allRegionsData.allLDVs.percent += allLDVsPercent;
            allRegionsData.allBuses.percent += allBusesPercent;
          }
        }
      });
    }
  });

  return result;
}

/**
 * Regional share of state VMT per vehicle type.
 *
 * (NOTE: not in the Excel version, but derived from `vmtBillionsAndPercentages`
 * which is data from the first table in the "RegionStateAllocate" sheet).
 */
export function calculateStateVMTPercentagesByRegion(options: {
  vmtBillionsAndPercentages: VMTBillionsAndPercentages | EmptyObject;
}) {
  const { vmtBillionsAndPercentages } = options;

  const vmtData =
    Object.keys(vmtBillionsAndPercentages).length !== 0
      ? (vmtBillionsAndPercentages as VMTBillionsAndPercentages)
      : null;

  if (!vmtData) {
    return {} as {
      [stateId in StateId]: Partial<{
        [regionId in RegionId]: {
          cars: number;
          trucks: number;
          transitBuses: number;
          schoolBuses: number;
        };
      }>;
    };
  }

  const result = Object.entries(vmtData).reduce(
    (object, [stateKey, stateValue]) => {
      const stateId = stateKey as keyof typeof vmtData;
      // NOTE: stateData is really "regionTotals" on the first loop, so skip it
      if (stateId !== "regionTotals") {
        Object.entries(stateValue).forEach(([regionKey, regionValue]) => {
          const regionId = regionKey as keyof typeof stateValue;
          // NOTE: regionId is really "allRegions" on the first loop, so skip it
          if (regionId !== "allRegions") {
            object[stateId] ??= {};
            object[stateId][regionId] ??= {
              cars: 0,
              trucks: 0,
              transitBuses: 0,
              schoolBuses: 0,
            };

            const stateTotals = stateValue.allRegions;
            const stateRegionData = object[stateId][regionId];

            if (stateTotals && stateRegionData) {
              Object.keys(regionValue).forEach((key) => {
                const vehicleType = key as keyof typeof regionValue;

                if (vehicleType !== "allLDVs" && vehicleType !== "allBuses") {
                  stateRegionData[vehicleType] =
                    regionValue[vehicleType].total /
                    stateTotals[vehicleType].total;
                }
              });
            }
          }
        });
      }

      return object;
    },
    {} as {
      [stateId in StateId]: Partial<{
        [regionId in RegionId]: {
          cars: number;
          trucks: number;
          transitBuses: number;
          schoolBuses: number;
        };
      }>;
    },
  );

  return result;
}

/**
 * VMT allocation per vehicle by state.
 *
 * Excel: Second table in the "RegionStateAllocate" sheet (B118:J168)
 */
export function calculateVMTAllocationPerVehicle(options: {
  vmtAllocationAndRegisteredVehicles: VMTAllocationAndRegisteredVehicles;
  stateBusSalesAndStock: StateBusSalesAndStock;
}) {
  const { vmtAllocationAndRegisteredVehicles, stateBusSalesAndStock } = options;

  // initialize result object with state keys and total key
  const result = Object.entries(vmtAllocationAndRegisteredVehicles).reduce(
    (object, [key, data]) => {
      const { annualVMTofLDVs, annualVMTofBuses, registeredLDVs } = data;

      const busSalesAndStock =
        stateBusSalesAndStock[key as keyof StateBusSalesAndStock];

      if (busSalesAndStock) {
        const millionRegisteredBuses =
          (busSalesAndStock.transitBuses.stock +
            busSalesAndStock.schoolBuses.stock) /
          1_000_000;

        object[key as StateId] = {
          millionVmtLDVs: annualVMTofLDVs,
          millionVmtBuses: annualVMTofBuses,
          millionRegisteredLDVs: registeredLDVs,
          millionRegisteredBuses,
          vmtPerLDV: { total: 0, percent: 0 },
          vmtPerBus: { total: 0, percent: 0 },
        };
      }

      return object;
    },
    {
      total: {
        millionVmtLDVs: 0,
        millionVmtBuses: 0,
        millionRegisteredLDVs: 0,
        millionRegisteredBuses: 0,
        vmtPerLDV: { total: 0, percent: 0 },
        vmtPerBus: { total: 0, percent: 0 },
      },
    } as {
      [stateId in StateId | "total"]: {
        millionVmtLDVs: number;
        millionVmtBuses: number;
        millionRegisteredLDVs: number;
        millionRegisteredBuses: number;
        vmtPerLDV: { total: number; percent: number };
        vmtPerBus: { total: number; percent: number };
      };
    },
  );

  // sum totals across states
  Object.entries(result).forEach(([key, data]) => {
    if (key !== "total") {
      result.total.millionVmtLDVs += data.millionVmtLDVs;
      result.total.millionVmtBuses += data.millionVmtBuses;
      result.total.millionRegisteredLDVs += data.millionRegisteredLDVs;
      result.total.millionRegisteredBuses += data.millionRegisteredBuses;
    }
  });

  // calculate vmt per vehicle totals for each state or totals object
  Object.keys(result).forEach((key) => {
    const item = result[key as StateId | "total"];
    item.vmtPerLDV.total = item.millionVmtLDVs / item.millionRegisteredLDVs;
    item.vmtPerBus.total = item.millionVmtBuses / item.millionRegisteredBuses;
  });

  // calculate vmt per vehicle percentages for each state
  Object.keys(result).forEach((key) => {
    if (key !== "total") {
      const item = result[key as StateId];
      item.vmtPerLDV.percent = item.vmtPerLDV.total / result.total.vmtPerLDV.total; // prettier-ignore
      item.vmtPerBus.percent = item.vmtPerBus.total / result.total.vmtPerBus.total; // prettier-ignore
    }
  });

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
      const vehicleFuelCombo = key as VehicleTypeFuelTypeCombo;

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
}) {
  const { monthlyVMTTotals, yearlyVMTTotals } = options;

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
      const vehicleFuelCombo = key as VehicleTypeFuelTypeCombo;

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
          const monthKey = month.toString() as keyof typeof schoolBusMonthlyVMTPercentages; // prettier-ignore
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
        const vehicle = vmtKey as VehicleType;

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
      const region = data.region as RegionName;

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
        const vehicle = vmtKey as VehicleType;

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
      const state = stateRegionValue.state as StateId;
      const region = stateRegionValue.region as RegionName;

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
          const vehicle = vmtKey as VehicleType;

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
 * Excel: "Population" column of "Table 12: Light-duty vehicle sales by type"
 * table in the "Library" sheet (C965:C983).
 */
export function calculateVehicleTypeTotals(options: {
  stateLevelVMT: StateLevelVMT;
}) {
  const { stateLevelVMT } = options;

  const result = stateLevelVMT.reduce(
    (object, data) => {
      const vehicle = data["Vehicle Type"] as VehicleType;
      const stock = data["2023 Stock (million vehicles)"];

      if (!object[vehicle]) {
        object[vehicle] = 0;
      }

      object[vehicle] += stock;

      return object;
    },
    {} as {
      [vehicle in VehicleType]: number;
    },
  );

  return result;
}

/**
 * Total sales/stock (in millions) for each vehicle category.
 *
 * Excel: "Population" column of "Table 12: Light-duty vehicle sales by type"
 * table in the "Library" sheet (C964:C983).
 */
export function calculateVehicleCategoryTotals(options: {
  vehicleTypeTotals: VehicleTypeTotals | EmptyObject;
  vehicleTypesByVehicleCategory: VehicleTypesByVehicleCategory | EmptyObject;
}) {
  const { vehicleTypeTotals, vehicleTypesByVehicleCategory } = options;

  const result = Object.entries(vehicleTypesByVehicleCategory).reduce(
    (object, [categoryKey, categoryValue]) => {
      const category = categoryKey as VehicleCategory;

      const total = categoryValue.reduce((number, vehicle) => {
        if (vehicle in vehicleTypeTotals) {
          return number + vehicleTypeTotals[vehicle];
        }

        return number;
      }, 0);

      object[category] = total;

      return object;
    },
    {} as {
      [vehicleCategory in VehicleCategory]: number;
    },
  );

  return result;
}

/**
 * Percentage/share of the total vehicle sales/stock each vehicle type makes up
 * of its vehicle category (e.g. "LDVs", "Transit Buses", "School Buses", etc.).
 *
 * Excel: "Vehicle Allocation" column of "Table 12: Light-duty vehicle sales by
 * type" table in the "Library" sheet (D965:D983).
 */
export function calculateVehicleTypePercentagesOfVehicleCategory(options: {
  vehicleTypeTotals: VehicleTypeTotals | EmptyObject;
  vehicleCategoryTotals: VehicleCategoryTotals | EmptyObject;
  vehicleTypesByVehicleCategory: VehicleTypesByVehicleCategory;
}) {
  const {
    vehicleTypeTotals,
    vehicleCategoryTotals,
    vehicleTypesByVehicleCategory,
  } = options;

  const result = Object.entries(vehicleTypeTotals).reduce(
    (object, [vehicleKey, vehicleValue]) => {
      const vehicle = vehicleKey as VehicleType;

      const category = Object.keys(vehicleTypesByVehicleCategory).find(
        (categoryKey) => {
          const categories = vehicleTypesByVehicleCategory[categoryKey as VehicleCategory]; // prettier-ignore
          return (categories as unknown as VehicleType[]).includes(vehicle);
        },
      ) as VehicleCategory;

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

  return result;
}

/**
 * Percentage/share of the total VMT each vehicle type / fuel type combo makes
 * up of the vehicle type's total VMT (regardless of fuel type).
 *
 * Excel: "Vehicle Allocation" column of "Table 12: Light-duty vehicle sales by
 * type" table in the "Library" sheet (E965:G983).
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
      const vehicleFuelCombo = vehicleFuelComboKey as VehicleTypeFuelTypeCombo;
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

  if (
    Object.keys(vehicleTypePercentagesOfVehicleCategory).length === 0 ||
    Object.keys(vehicleFuelTypePercentagesOfVehicleType).length === 0
  ) {
    return {} as {
      [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
    };
  }

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

  Object.keys(result).forEach((key) => {
    const categoryVehicleFuelCombo =
      key as VehicleCategoryVehicleTypeFuelTypeCombo;

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

    /**
     * NOTE: We use "LDVs" as the vehicle category in the
     * `vehicleTypePercentagesOfVehicleCategory` data, so we'll need to map any
     * "Battery EVs" and "Plug-in Hybrid EVs" vehicle categories to "LDVs" in
     * order to get the correct vehicle type percentage value.
     */
    const generalizedVehicleCategory =
      vehicleCategory === "Battery EVs" ||
      vehicleCategory === "Plug-in Hybrid EVs"
        ? "LDVs"
        : vehicleCategory;

    const categoryVehicleCombo =
      `${generalizedVehicleCategory} / ${vehicleType}` as VehicleCategoryVehicleTypeCombo;

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
      const state = vmtKey as StateId;

      if (!object[state]) {
        object[state] = {} as {
          [vehicle in VehicleType]: {
            vmtPerVehicle: number;
            vmtPerVehicleAdjustedByFHWA: number;
          };
        };
      }

      Object.entries(vmtValue).forEach(([vehicleKey, vehicleValue]) => {
        const vehicle = vehicleKey as VehicleType;
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
      const regionId = geographyKey as RegionId;
      const regionName = geographyValue.name as RegionName;

      const regionResult = Object.values(
        vmtPercentagesByStateRegionCombo,
      ).reduce(
        (statesObject, vmtValue) => {
          const stateId = vmtValue.state as StateId;

          if (vmtValue.region === regionName) {
            if (!statesObject[stateId]) {
              statesObject[stateId] = {} as {
                [vehicle in VehicleType]: number;
              };
            }

            Object.entries(vmtValue.vehicleTypes).forEach(
              ([vehicleKey, vehicleValue]) => {
                const vehicle = vehicleKey as VehicleType;

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
      const regionId = vmtPercentagesRegionKey as RegionId;

      object[regionId] ??= {} as {
        [vehicle in VehicleType]: number;
      };

      Object.entries(vmtPercentagesRegionValue).forEach(
        ([vmtPercentagesStateKey, vmtPercentagesStateValue]) => {
          const stateId = vmtPercentagesStateKey as StateId;

          const deploymentLocationIncludesState =
            deploymentLocationIsRegion ||
            (deploymentLocationIsState &&
              deploymentLocationStateId === stateId);

          if (stateId in vmtPerVehicleTypeByState) {
            Object.entries(vmtPerVehicleTypeByState[stateId]).forEach(
              ([vehicleKey, vehicleValue]) => {
                const vehicle = vehicleKey as VehicleType;

                const stateAdjustedVMT =
                  vehicleValue.vmtPerVehicleAdjustedByFHWA;

                const stateVMTFactor = deploymentLocationIncludesState
                  ? vmtPercentagesStateValue?.[vehicle]
                  : 0;

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
      const regionId = averageVMTKey as RegionId;

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
          const vehicleFuelCombo = key as VehicleTypeFuelTypeCombo;
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
          const expandedVehicleType = vehicleKey as ExpandedVehicleType;
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
          const regionId = vmtPercentagesRegionKey as RegionId;

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
              const movesPollutant = key as MovesPollutant;

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
      const regionId = regionKey as RegionId;

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
      const regionId = regionKey as RegionId;

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
            const vehicleFuelCombo = vehicleFuelComboKey as VehicleTypeFuelTypeCombo; // prettier-ignore
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
  totalEffectiveVehicles: TotalEffectiveVehicles | EmptyObject;
  selectedRegionsMonthlyVMT: SelectedRegionsMonthlyVMT | EmptyObject;
  selectedRegionsEVEfficiency: SelectedRegionsEVEfficiency | EmptyObject;
}) {
  const {
    totalEffectiveVehicles,
    selectedRegionsMonthlyVMT,
    selectedRegionsEVEfficiency,
  } = options;

  if (
    Object.keys(totalEffectiveVehicles).length === 0 ||
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
      const regionId = regionKey as RegionId;

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
            const categoryVehicleFuelCombo = vehicleKey as VehicleCategoryVehicleTypeFuelTypeCombo; // prettier-ignore
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

            object[regionId][month][categoryVehicleFuelCombo] =
              vehicleValue * vmt * efficiency * KWtoGW;
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
      const regionId = regionKey as RegionId;

      object[regionId] ??= {} as {
        [categoryVehicleFuelCombo in VehicleCategoryVehicleTypeFuelTypeCombo]: number;
      };

      Object.values(regionValue).forEach((monthValue) => {
        Object.entries(monthValue).forEach(([key, value]) => {
          const categoryVehicleFuelCombo = key as VehicleCategoryVehicleTypeFuelTypeCombo; // prettier-ignore

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
 * Excel: Data in the first EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P8:X32).
 */
export function calculateHourlyEVChargingPercentages(options: {
  evChargingProfiles: EVChargingProfiles;
}) {
  const { evChargingProfiles } = options;

  const result: {
    [hour: number]: {
      batteryEVs: { weekday: number; weekend: number };
      hybridEVs: { weekday: number; weekend: number };
      transitBuses: { weekday: number; weekend: number };
      schoolBuses: { weekday: number; weekend: number };
    };
  } = {};

  evChargingProfiles.forEach((data) => {
    result[data.hour] = {
      batteryEVs: {
        weekday: data.ldvs.weekday,
        weekend: data.ldvs.weekend,
      },
      hybridEVs: {
        weekday: data.ldvs.weekday,
        weekend: data.ldvs.weekend,
      },
      transitBuses: {
        weekday: data.buses.weekday,
        weekend: data.buses.weekend,
      },
      schoolBuses: {
        weekday: data.buses.weekday,
        weekend: data.buses.weekend,
      },
    };
  });

  return result;
}

/**
 * VMT allocation percentages for the selected state or the selected region's
 * states.
 *
 * Excel: First table in the "RegionStateAllocate" sheet (CI58:CN107)
 */
export function _calculateSelectedRegionsStatesVMTPercentages(options: {
  selectedGeographyRegionIds: RegionId[];
  vmtBillionsAndPercentages: VMTBillionsAndPercentages | EmptyObject;
}) {
  const { selectedGeographyRegionIds, vmtBillionsAndPercentages } = options;

  type StateVMTPercentages = {
    cars: number;
    trucks: number;
    transitBuses: number;
    schoolBuses: number;
    allLDVs: number;
    allBuses: number;
  };

  const vmtData =
    Object.keys(vmtBillionsAndPercentages).length !== 0
      ? (vmtBillionsAndPercentages as VMTBillionsAndPercentages)
      : null;

  if (selectedGeographyRegionIds.length === 0 || !vmtData) {
    return {} as {
      [regionId in RegionId]: {
        [stateId in StateId]: StateVMTPercentages;
      };
    };
  }

  const result = Object.entries(vmtData).reduce(
    (object, [stateKey, stateValue]) => {
      const stateId = stateKey as keyof typeof vmtData;

      if (stateId === "regionTotals") return object;

      const stateRegionIds = Object.keys(stateValue); // NOTE: also includes "allRegions" key
      const stateVMTData = vmtData?.[stateId];

      selectedGeographyRegionIds.forEach((regionId) => {
        if (stateVMTData && stateRegionIds.includes(regionId)) {
          const selectedRegionData = stateVMTData[regionId];

          if (selectedRegionData) {
            object[regionId] ??= {} as {
              [stateId in StateId]: StateVMTPercentages;
            };

            object[regionId][stateId] = {
              cars: selectedRegionData.cars.percent,
              trucks: selectedRegionData.trucks.percent,
              transitBuses: selectedRegionData.transitBuses.percent,
              schoolBuses: selectedRegionData.schoolBuses.percent,
              allLDVs: selectedRegionData.allLDVs.percent,
              allBuses: selectedRegionData.allBuses.percent,
            };
          }
        }
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [stateId in StateId]: StateVMTPercentages;
      };
    },
  );

  return result;
}

/**
 * VMT allocation percentages per vehicle type for the selected regions.
 *
 * Excel: Second table in the "RegionStateAllocate" sheet (H169 and J169)
 */
export function _calculateSelectedRegionsVMTPercentagesPerVehicleType(options: {
  _selectedRegionsStatesVMTPercentages:
    | _SelectedRegionsStatesVMTPercentages
    | EmptyObject;
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | EmptyObject;
}) {
  const { _selectedRegionsStatesVMTPercentages, vmtAllocationPerVehicle } =
    options;

  const selectedRegionsVMTData =
    Object.keys(_selectedRegionsStatesVMTPercentages).length !== 0
      ? (_selectedRegionsStatesVMTPercentages as _SelectedRegionsStatesVMTPercentages)
      : null;

  const statesVMTData =
    Object.keys(vmtAllocationPerVehicle).length !== 0
      ? (vmtAllocationPerVehicle as VMTAllocationPerVehicle)
      : null;

  if (!selectedRegionsVMTData) {
    return {} as {
      [regionId in RegionId]: {
        vmtPerLDVPercent: 0;
        vmtPerBusPercent: 0;
      };
    };
  }

  const result = Object.entries(selectedRegionsVMTData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsVMTData;

      Object.entries(regionValue).forEach(([stateKey, stateValue]) => {
        const stateId = stateKey as StateId;
        const stateVMTData = statesVMTData?.[stateId];

        if (stateVMTData) {
          const allLDVsPercent = stateValue.allLDVs;
          const allBusesPercent = stateValue.allBuses;

          const vmtPerLDVPercent = stateVMTData.vmtPerLDV.percent;
          const vmtPerBusPercent = stateVMTData.vmtPerBus.percent;

          object[regionId] ??= { vmtPerLDVPercent: 0, vmtPerBusPercent: 0 };

          object[regionId].vmtPerLDVPercent += allLDVsPercent * vmtPerLDVPercent; // prettier-ignore
          object[regionId].vmtPerBusPercent += allBusesPercent * vmtPerBusPercent; // prettier-ignore
        }
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        vmtPerLDVPercent: 0;
        vmtPerBusPercent: 0;
      };
    },
  );

  return result;
}

/**
 * Average vehicle miles traveled (VMT) per vehicle type per year for the
 * selected regions.
 *
 * Excel: "Table 4: VMT assumptions" table in the "Library" sheet (E183:E186).
 */
export function _calculateSelectedRegionsAverageVMTPerYear(options: {
  _selectedRegionsVMTPercentagesPerVehicleType:
    | _SelectedRegionsVMTPercentagesPerVehicleType
    | EmptyObject;
}) {
  const { _selectedRegionsVMTPercentagesPerVehicleType } = options;

  const selectedRegionsVMTData =
    Object.keys(_selectedRegionsVMTPercentagesPerVehicleType).length !== 0
      ? (_selectedRegionsVMTPercentagesPerVehicleType as _SelectedRegionsVMTPercentagesPerVehicleType)
      : null;

  if (!selectedRegionsVMTData) {
    return {} as {
      [regionId in RegionId]: {
        cars: number;
        trucks: number;
        transitBuses: number;
        schoolBuses: number;
      };
    };
  }

  // NOTE: temporarily hard-coded values from Excel, until this function can be removed
  const nationalAverageVMTPerYear = {
    cars: 10916,
    trucks: 10916,
    transitBuses: 43647,
    schoolBuses: 12000,
  };

  const result = Object.entries(selectedRegionsVMTData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsVMTData;

      const { vmtPerLDVPercent, vmtPerBusPercent } = regionValue;

      object[regionId] = {
        cars: nationalAverageVMTPerYear.cars * vmtPerLDVPercent,
        trucks: nationalAverageVMTPerYear.trucks * vmtPerLDVPercent,
        transitBuses: nationalAverageVMTPerYear.transitBuses * vmtPerBusPercent,
        schoolBuses: nationalAverageVMTPerYear.schoolBuses * vmtPerBusPercent,
      };

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        cars: number;
        trucks: number;
        transitBuses: number;
        schoolBuses: number;
      };
    },
  );

  return result;
}

/**
 * Monthly vehicle miles traveled (VMT) for each vehicle type.
 *
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (E232:P237).
 */
export function _calculateSelectedRegionsMonthlyVMTPerVehicleType(options: {
  _selectedRegionsAverageVMTPerYear:
    | _SelectedRegionsAverageVMTPerYear
    | EmptyObject;
  monthlyVMTPercentages: MonthlyVMTPercentages;
}) {
  const { _selectedRegionsAverageVMTPerYear, monthlyVMTPercentages } = options;

  const selectedRegionsVMTData =
    Object.keys(_selectedRegionsAverageVMTPerYear).length !== 0
      ? (_selectedRegionsAverageVMTPerYear as _SelectedRegionsAverageVMTPerYear)
      : null;

  if (
    !selectedRegionsVMTData ||
    Object.keys(monthlyVMTPercentages).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleType in _GeneralVehicleType]: number;
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsVMTData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsVMTData;

      object[regionId] ??= {};

      Object.entries(monthlyVMTPercentages).forEach(([vmtKey, vmtValue]) => {
        const month = Number(vmtKey);

        object[regionId][month] ??= {
          cars: 0,
          trucks: 0,
          transitBusesDiesel: 0,
          transitBusesCNG: 0,
          transitBusesGasoline: 0,
          schoolBuses: 0,
        };

        _generalVehicleTypes.forEach((vehicleType) => {
          /**
           * NOTE: selectedRegionsVMTData's regions's vehicle types are
           * abridged (don't include transit buses broken out by fuel type)
           */
          const averageVMTPerYearVehicleType =
            vehicleType === "transitBusesDiesel" ||
            vehicleType === "transitBusesCNG" ||
            vehicleType === "transitBusesGasoline"
              ? "transitBuses"
              : vehicleType;

          object[regionId][month][vehicleType] =
            regionValue[averageVMTPerYearVehicleType] * vmtValue[vehicleType];
        });
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleType in _GeneralVehicleType]: number;
        };
      };
    },
  );

  return result;
}

/**
 * Efficiency factor for each vehicle type for the selected geography and EV
 * model year.
 *
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (E210:E215). NOTE: the Excel version duplicates these
 * values in the columns to the right for each month, but they're the same
 * value for all months.
 */
export function _calculateSelectedRegionsEVEfficiencyPerVehicleType(options: {
  percentageAdditionalEnergyConsumedFactor: number;
  regionAverageTemperatures: RegionAverageTemperatures;
  selectedGeographyRegionIds: RegionId[];
  evModelYear: string;
}) {
  const {
    percentageAdditionalEnergyConsumedFactor,
    regionAverageTemperatures,
    selectedGeographyRegionIds,
    evModelYear,
  } = options;

  // NOTE: temporarily hard-coded values from Excel, until this function is updated
  const evEfficiencyByModelYear = {
    "2023": {
      batteryEVCars: 0.18638644896375,
      hybridEVCars: 0.218301335826973,
      batteryEVTrucks: 0.250866618661348,
      hybridEVTrucks: 0.285954798275249,
      transitBuses: 1.95236469969444,
      schoolBuses: 1.17177273791504,
    },
    "2024": {
      batteryEVCars: 0.167588811794783,
      hybridEVCars: 0.196394882825251,
      batteryEVTrucks: 0.225442775972418,
      hybridEVTrucks: 0.257044712095876,
      transitBuses: 1.95236469969444,
      schoolBuses: 1.17177273791504,
    },
    "2025": {
      batteryEVCars: 0.148791174625815,
      hybridEVCars: 0.174488429823529,
      batteryEVTrucks: 0.200018933283488,
      hybridEVTrucks: 0.228134625916503,
      transitBuses: 1.95236469969444,
      schoolBuses: 1.17177273791504,
    },
    "2026": {
      batteryEVCars: 0.147619927345788,
      hybridEVCars: 0.173630798294424,
      batteryEVTrucks: 0.198525387541494,
      hybridEVTrucks: 0.227084482810589,
      transitBuses: 1.95236469969444,
      schoolBuses: 1.17177273791504,
    },
    "2027": {
      batteryEVCars: 0.146448680065761,
      hybridEVCars: 0.172773166765318,
      batteryEVTrucks: 0.1970318417995,
      hybridEVTrucks: 0.226034339704676,
      transitBuses: 1.95236469969444,
      schoolBuses: 1.17177273791504,
    },
    "2028": {
      batteryEVCars: 0.145277432785733,
      hybridEVCars: 0.171915535236212,
      batteryEVTrucks: 0.195538296057506,
      hybridEVTrucks: 0.224984196598763,
      transitBuses: 1.95236469969444,
      schoolBuses: 1.17177273791504,
    },
  };

  const evEfficiencyModelYear =
    evModelYear as keyof typeof evEfficiencyByModelYear;

  const evEfficiency = evEfficiencyByModelYear[evEfficiencyModelYear];

  if (selectedGeographyRegionIds.length === 0 || !evEfficiency) {
    return {} as {
      [regionId in RegionId]: {
        batteryEVCars: number;
        hybridEVCars: number;
        batteryEVTrucks: number;
        hybridEVTrucks: number;
        transitBuses: number;
        schoolBuses: number;
      };
    };
  }

  const result = selectedGeographyRegionIds.reduce(
    (object, regionId) => {
      object[regionId] ??= {
        batteryEVCars: 1,
        hybridEVCars: 1,
        batteryEVTrucks: 1,
        hybridEVTrucks: 1,
        transitBuses: 1,
        schoolBuses: 1,
      };

      Object.entries(evEfficiency).forEach(([type, data]) => {
        const vehicleType = type as keyof typeof evEfficiency;

        if (Object.hasOwn(object[regionId], vehicleType)) {
          const regionAverageTemperature = regionAverageTemperatures[regionId];

          /**
           * Climate adjustment factor for regions whose climate is more than
           * +/-18F different from St. Louis, MO
           *
           * Excel: "Table 9: Default EV load profiles and related values from
           * EVI-Pro Lite" table in the "Library" sheet (D432:D445)
           */
          const climateAdjustmentFactor =
            regionAverageTemperature === 68
              ? 1
              : regionAverageTemperature === 50 ||
                  regionAverageTemperature === 86
                ? 1 + percentageAdditionalEnergyConsumedFactor
                : 1 + percentageAdditionalEnergyConsumedFactor / 2;

          object[regionId][vehicleType] = data * climateAdjustmentFactor;
        }
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        batteryEVCars: number;
        hybridEVCars: number;
        batteryEVTrucks: number;
        hybridEVTrucks: number;
        transitBuses: number;
        schoolBuses: number;
      };
    },
  );

  return result;
}

/**
 * Build up daily stats object by looping through every hour of the year,
 * (only creates objects and sets their keys in the first hour of each month).
 */
export function calculateDailyStats(regionalLoad?: RegionalLoadData[]) {
  const result: {
    [month: number]: {
      [day: number]: { _done: boolean; dayOfWeek: number; isWeekend: boolean };
    };
  } = {};

  if (!regionalLoad || regionalLoad.length === 0) return result;

  regionalLoad.forEach((data) => {
    result[data.month] ??= {};
    // NOTE: initial values to keep same object shape – will be mutated next
    result[data.month][data.day] ??= {
      _done: false,
      dayOfWeek: -1,
      isWeekend: false,
    };

    if (result[data.month][data.day]._done === false) {
      const datetime = new Date(data.year, data.month - 1, data.day, data.hour);
      const dayOfWeek = datetime.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      result[data.month][data.day] = { _done: true, dayOfWeek, isWeekend };
    }
  });

  return result;
}

/**
 * Build up monthly stats object from daily stats object.
 *
 * Excel: Data in the third EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P49:S61).
 */
export function calculateMonthlyStats(dailyStats: DailyStats) {
  const result: {
    [month: number]: {
      totalDays: number;
      weekdayDays: number;
      weekendDays: number;
    };
  } = {};

  if (Object.keys(dailyStats).length === 0) return result;

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    const totalDays = Object.keys(dailyStats[month]).length;
    const weekendDays = Object.values(dailyStats[month]).reduce(
      (total, day) => (day.isWeekend ? ++total : total),
      0,
    );
    const weekdayDays = totalDays - weekendDays;

    result[month] = {
      totalDays,
      weekdayDays,
      weekendDays,
    };
  });

  return result;
}

/**
 * Number of vehicles displaced by new EVs.
 *
 * Excel: "Sales Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (E297:E304), which uses
 * "Part II. Vehicle Composition" table in the "EV_Detail" sheet (L63:O67).
 */
export function _calculateVehiclesDisplaced(options: {
  batteryEVs: number;
  hybridEVs: number;
  transitBuses: number;
  schoolBuses: number;
  monthlyVMTTotals: MonthlyVMTTotals;
}) {
  const { batteryEVs, hybridEVs, transitBuses, schoolBuses, monthlyVMTTotals } =
    options;

  const result = {
    batteryEVCars: 0,
    hybridEVCars: 0,
    batteryEVTrucks: 0,
    hybridEVTrucks: 0,
    transitBusesDiesel: 0,
    transitBusesCNG: 0,
    transitBusesGasoline: 0,
    schoolBuses: 0,
  };

  if (Object.keys(monthlyVMTTotals).length === 0) return result;

  const yearlyTransitBusesVMTTotals = Object.values(monthlyVMTTotals).reduce(
    (data, monthlyData) => {
      data.diesel += monthlyData.transitBusesDiesel;
      data.cng += monthlyData.transitBusesCNG;
      data.gasoline += monthlyData.transitBusesGasoline;
      return data;
    },
    { diesel: 0, cng: 0, gasoline: 0 },
  );

  // console.log(yearlyTransitBusesVMTTotals); // NOTE: for debugging purposes

  const totalYearlyTransitBusesVMT =
    yearlyTransitBusesVMTTotals.diesel +
    yearlyTransitBusesVMTTotals.cng +
    yearlyTransitBusesVMTTotals.gasoline;

  if (totalYearlyTransitBusesVMT === 0) return result;

  /**
   * Excel: "Part II. Vehicle Composition" table in the "EV_Detail" sheet
   * (F65:F67), which comes from "Table 6: Monthly VMT and efficiency
   * adjustments" (Q220:Q222)
   */
  const percentageTransitBusesDisplacedByEVs = {
    diesel: yearlyTransitBusesVMTTotals.diesel / totalYearlyTransitBusesVMT,
    cng: yearlyTransitBusesVMTTotals.cng / totalYearlyTransitBusesVMT,
    gasoline: yearlyTransitBusesVMTTotals.gasoline / totalYearlyTransitBusesVMT,
  };

  // console.log(percentageTransitBusesDisplacedByEVs); // NOTE: for debugging purposes

  /**
   * Excel: "Table 14: Light-duty vehicle sales by type" table in the "Library"
   * sheet (D727:E727)
   */
  const percentageLDVsDisplacedByEVs = {
    cars: 0.210961149193232,
    trucks: 0.789038850806768,
  };

  result.batteryEVCars = batteryEVs * percentageLDVsDisplacedByEVs.cars;
  result.hybridEVCars = hybridEVs * percentageLDVsDisplacedByEVs.cars;
  result.batteryEVTrucks = batteryEVs * percentageLDVsDisplacedByEVs.trucks;
  result.hybridEVTrucks = hybridEVs * percentageLDVsDisplacedByEVs.trucks;
  result.transitBusesDiesel = transitBuses * percentageTransitBusesDisplacedByEVs.diesel; // prettier-ignore
  result.transitBusesCNG = transitBuses * percentageTransitBusesDisplacedByEVs.cng; // prettier-ignore
  result.transitBusesGasoline = transitBuses * percentageTransitBusesDisplacedByEVs.gasoline; // prettier-ignore
  result.schoolBuses = schoolBuses * 1;

  return result;
}

/**
 * Monthly EV energy use in GW for all the EV types we have data for.
 *
 * Excel: "Sales Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (G297:R304).
 */
export function _calculateSelectedRegionsMonthlyEVEnergyUsageGW(options: {
  _selectedRegionsMonthlyVMTPerVehicleType:
    | _SelectedRegionsMonthlyVMTPerVehicleType
    | EmptyObject;
  _selectedRegionsEVEfficiencyPerVehicleType:
    | _SelectedRegionsEVEfficiencyPerVehicleType
    | EmptyObject;
  _vehiclesDisplaced: _VehiclesDisplaced;
}) {
  const {
    _selectedRegionsMonthlyVMTPerVehicleType,
    _selectedRegionsEVEfficiencyPerVehicleType,
    _vehiclesDisplaced,
  } = options;

  const result = {} as {
    [regionId in RegionId]: {
      [month: number]: {
        [vehicleType in _ExpandedVehicleType]: number;
      };
    };
  };

  const selectedRegionsVMTData =
    Object.keys(_selectedRegionsMonthlyVMTPerVehicleType).length !== 0
      ? (_selectedRegionsMonthlyVMTPerVehicleType as _SelectedRegionsMonthlyVMTPerVehicleType)
      : null;

  const selectedRegionsEfficiencyData =
    Object.keys(_selectedRegionsEVEfficiencyPerVehicleType).length !== 0
      ? (_selectedRegionsEVEfficiencyPerVehicleType as _SelectedRegionsEVEfficiencyPerVehicleType)
      : null;

  if (!selectedRegionsVMTData || !selectedRegionsEfficiencyData) {
    return result;
  }

  const KWtoGW = 0.000_001;

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    Object.entries(selectedRegionsVMTData).forEach(
      ([regionKey, regionValue]) => {
        const regionId = regionKey as keyof typeof selectedRegionsVMTData;
        const monthlyVmt = regionValue[month];
        const regionEVEfficiency = selectedRegionsEfficiencyData[regionId];

        if (monthlyVmt && regionEVEfficiency) {
          result[regionId] ??= {};
          result[regionId][month] = {
            batteryEVCars:
              _vehiclesDisplaced.batteryEVCars *
              monthlyVmt.cars *
              regionEVEfficiency.batteryEVCars *
              KWtoGW,
            hybridEVCars:
              _vehiclesDisplaced.hybridEVCars *
              monthlyVmt.cars *
              regionEVEfficiency.hybridEVCars *
              KWtoGW *
              percentageHybridEVMilesDrivenOnElectricity,
            batteryEVTrucks:
              _vehiclesDisplaced.batteryEVTrucks *
              monthlyVmt.trucks *
              regionEVEfficiency.batteryEVTrucks *
              KWtoGW,
            hybridEVTrucks:
              _vehiclesDisplaced.hybridEVTrucks *
              monthlyVmt.trucks *
              regionEVEfficiency.hybridEVTrucks *
              KWtoGW *
              percentageHybridEVMilesDrivenOnElectricity,
            transitBusesDiesel:
              _vehiclesDisplaced.transitBusesDiesel *
              monthlyVmt.transitBusesDiesel *
              regionEVEfficiency.transitBuses *
              KWtoGW,
            transitBusesCNG:
              _vehiclesDisplaced.transitBusesCNG *
              monthlyVmt.transitBusesCNG *
              regionEVEfficiency.transitBuses *
              KWtoGW,
            transitBusesGasoline:
              _vehiclesDisplaced.transitBusesGasoline *
              monthlyVmt.transitBusesGasoline *
              regionEVEfficiency.transitBuses *
              KWtoGW,
            schoolBuses:
              _vehiclesDisplaced.schoolBuses *
              monthlyVmt.schoolBuses *
              regionEVEfficiency.schoolBuses *
              KWtoGW,
          };
        }
      },
    );
  });

  return result;
}

/**
 * Monthly EV energy usage (total for each month) in MW, combined into the four
 * AVERT EV input types.
 *
 * Excel: Data in the third EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (T49:W61).
 */
export function calculateSelectedRegionsMonthlyEVEnergyUsageMW(options: {
  _selectedRegionsMonthlyEVEnergyUsageGW:
    | _SelectedRegionsMonthlyEVEnergyUsageGW
    | EmptyObject;
}) {
  const { _selectedRegionsMonthlyEVEnergyUsageGW } = options;

  const selectedRegionsEnergyData =
    Object.keys(_selectedRegionsMonthlyEVEnergyUsageGW).length !== 0
      ? (_selectedRegionsMonthlyEVEnergyUsageGW as _SelectedRegionsMonthlyEVEnergyUsageGW)
      : null;

  if (!selectedRegionsEnergyData) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          batteryEVs: number;
          hybridEVs: number;
          transitBuses: number;
          schoolBuses: number;
        };
      };
    };
  }

  const GWtoMW = 1_000;

  const result = Object.entries(selectedRegionsEnergyData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsEnergyData;

      object[regionId] ??= {};

      Object.entries(regionValue).forEach(
        ([regionMonthKey, regionMonthValue]) => {
          const month = Number(regionMonthKey);
          const {
            batteryEVCars,
            batteryEVTrucks,
            hybridEVCars,
            hybridEVTrucks,
            transitBusesDiesel,
            transitBusesCNG,
            transitBusesGasoline,
            schoolBuses,
          } = regionMonthValue;

          object[regionId][month] = {
            batteryEVs: (batteryEVCars + batteryEVTrucks) * GWtoMW,
            hybridEVs: (hybridEVCars + hybridEVTrucks) * GWtoMW,
            transitBuses: (transitBusesDiesel + transitBusesCNG + transitBusesGasoline) * GWtoMW, // prettier-ignore
            schoolBuses: schoolBuses * GWtoMW,
          };
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          batteryEVs: number;
          hybridEVs: number;
          transitBuses: number;
          schoolBuses: number;
        };
      };
    },
  );

  return result;
}

/**
 * Totals the energy usage from each EV type for all months in the year to a
 * single total EV energy usage value for the year in GW.
 *
 * Excel: "Sales Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (S309).
 */
export function calculateSelectedRegionsTotalYearlyEVEnergyUsage(options: {
  _selectedRegionsMonthlyEVEnergyUsageGW:
    | _SelectedRegionsMonthlyEVEnergyUsageGW
    | EmptyObject;
}) {
  const { _selectedRegionsMonthlyEVEnergyUsageGW } = options;

  const selectedRegionsEnergyData =
    Object.keys(_selectedRegionsMonthlyEVEnergyUsageGW).length !== 0
      ? (_selectedRegionsMonthlyEVEnergyUsageGW as _SelectedRegionsMonthlyEVEnergyUsageGW)
      : null;

  if (!selectedRegionsEnergyData) {
    return {} as {
      [regionId in RegionId]: number;
    };
  }

  const result = Object.entries(selectedRegionsEnergyData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsEnergyData;

      object[regionId] = Object.values(regionValue).reduce(
        (number, regionMonthValue) =>
          number + Object.values(regionMonthValue).reduce((a, b) => a + b, 0),
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
 * Monthly EV energy usage (MWh) for a typical weekday day or weekend day.
 *
 * Excel: Data in the second EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P35:X47).
 */
export function calculateSelectedRegionsMonthlyDailyEVEnergyUsage(options: {
  selectedRegionsMonthlyEVEnergyUsageMW:
    | SelectedRegionsMonthlyEVEnergyUsageMW
    | EmptyObject;
  monthlyStats: MonthlyStats;
}) {
  const { selectedRegionsMonthlyEVEnergyUsageMW, monthlyStats } = options;

  const selectedRegionsEnergyData =
    Object.keys(selectedRegionsMonthlyEVEnergyUsageMW).length !== 0
      ? (selectedRegionsMonthlyEVEnergyUsageMW as SelectedRegionsMonthlyEVEnergyUsageMW)
      : null;

  if (!selectedRegionsEnergyData || Object.keys(monthlyStats).length === 0) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          batteryEVs: { weekday: number; weekend: number };
          hybridEVs: { weekday: number; weekend: number };
          transitBuses: { weekday: number; weekend: number };
          schoolBuses: { weekday: number; weekend: number };
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsEnergyData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsEnergyData;

      object[regionId] ??= {};

      [...Array(12)].forEach((_item, index) => {
        const month = index + 1;

        const weekdayDays = monthlyStats[month].weekdayDays;
        const weekendDays = monthlyStats[month].weekendDays;
        const weekenedToWeekdayRatio =
          percentWeekendToWeekdayEVConsumption / 100;
        const scaledWeekdayDays =
          weekdayDays + weekenedToWeekdayRatio * weekendDays;

        if (scaledWeekdayDays !== 0) {
          const batteryEVsWeekday =
            regionValue[month].batteryEVs / scaledWeekdayDays;

          const hybridEVsWeekday =
            regionValue[month].hybridEVs / scaledWeekdayDays;

          const transitBusesWeekday =
            regionValue[month].transitBuses / scaledWeekdayDays;

          const schoolBusesWeekday =
            regionValue[month].schoolBuses / scaledWeekdayDays;

          object[regionId][month] = {
            batteryEVs: {
              weekday: batteryEVsWeekday,
              weekend: batteryEVsWeekday * weekenedToWeekdayRatio,
            },
            hybridEVs: {
              weekday: hybridEVsWeekday,
              weekend: hybridEVsWeekday * weekenedToWeekdayRatio,
            },
            transitBuses: {
              weekday: transitBusesWeekday,
              weekend: transitBusesWeekday * weekenedToWeekdayRatio,
            },
            schoolBuses: {
              weekday: schoolBusesWeekday,
              weekend: schoolBusesWeekday * weekenedToWeekdayRatio,
            },
          };
        }
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          batteryEVs: { weekday: number; weekend: number };
          hybridEVs: { weekday: number; weekend: number };
          transitBuses: { weekday: number; weekend: number };
          schoolBuses: { weekday: number; weekend: number };
        };
      };
    },
  );

  return result;
}

/**
 * Monthly emission rates by vehicle type.
 *
 * Excel: "Table 7: Emission rates of various vehicle types" table in the
 * "Library" sheet (G253:R288).
 */
export function _calculateSelectedRegionsMonthlyEmissionRates(options: {
  movesEmissionRates: MOVESEmissionRates;
  _selectedRegionsStatesVMTPercentages:
    | _SelectedRegionsStatesVMTPercentages
    | EmptyObject;
  evDeploymentLocation: string;
  evModelYear: string;
  iceReplacementVehicle: string;
}) {
  const {
    movesEmissionRates,
    _selectedRegionsStatesVMTPercentages,
    evDeploymentLocation,
    evModelYear,
    iceReplacementVehicle,
  } = options;

  const result = {} as {
    [regionId in RegionId]: {
      [month: number]: {
        [vehicleType in _GeneralVehicleType]: {
          [pollutant in Pollutant]: number;
        };
      };
    };
  };

  const selectedRegionsVMTData =
    Object.keys(_selectedRegionsStatesVMTPercentages).length !== 0
      ? (_selectedRegionsStatesVMTPercentages as _SelectedRegionsStatesVMTPercentages)
      : null;

  if (!selectedRegionsVMTData || evDeploymentLocation === "") {
    return result;
  }

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith("region-");
  const deploymentLocationIsState = evDeploymentLocation.startsWith("state-");

  movesEmissionRates.forEach((data) => {
    const month = Number(data.month);

    Object.entries(selectedRegionsVMTData).forEach(
      ([regionKey, regionValue]) => {
        const regionId = regionKey as keyof typeof selectedRegionsVMTData;

        result[regionId] ??= {} as {
          [month: number]: {
            [vehicleType in _GeneralVehicleType]: {
              [pollutant in Pollutant]: number;
            };
          };
        };

        result[regionId][month] ??= {
          cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
          trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
          transitBusesDiesel: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
          transitBusesCNG: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
          transitBusesGasoline: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
          schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        };

        const generalVehicleType: _GeneralVehicleType | null =
          data.vehicleType === "Passenger Car"
            ? "cars"
            : data.vehicleType === "Passenger Truck"
              ? "trucks"
              : data.vehicleType === "Transit Bus" && data.fuelType === "Diesel Fuel" // prettier-ignore
                ? "transitBusesDiesel"
                : data.vehicleType === "Transit Bus" && data.fuelType === "Compressed Natural Gas (CNG)" // prettier-ignore
                  ? "transitBusesCNG"
                  : data.vehicleType === "Transit Bus" &&
                      data.fuelType === "Gasoline"
                    ? "transitBusesGasoline"
                    : data.vehicleType === "School Bus"
                      ? "schoolBuses"
                      : null; // NOTE: fallback (generalVehicleType should never actually be null)

        const abridgedVehicleType: _AbridgedVehicleType | null =
          data.vehicleType === "Passenger Car"
            ? "cars"
            : data.vehicleType === "Passenger Truck"
              ? "trucks"
              : data.vehicleType === "Transit Bus"
                ? "transitBuses"
                : data.vehicleType === "School Bus"
                  ? "schoolBuses"
                  : null; // NOTE: fallback (abridgedVehicleType should never actually be null)

        if (generalVehicleType && abridgedVehicleType) {
          const modelYearMatch =
            iceReplacementVehicle === "new"
              ? data.modelYear === evModelYear
              : data.modelYear === "Fleet Average";

          const conditionalYearMatch =
            iceReplacementVehicle === "new"
              ? true //
              : data.year === evModelYear;

          const conditionalStateMatch = deploymentLocationIsState
            ? data.state === evDeploymentLocation.replace("state-", "")
            : true;

          const movesRegionalWeightPercentage =
            regionValue?.[data.state as StateId]?.[abridgedVehicleType] || 0;

          const locationFactor = deploymentLocationIsRegion
            ? movesRegionalWeightPercentage
            : 1; // location is state, so no MOVES regional weight factor is applied

          if (modelYearMatch && conditionalYearMatch && conditionalStateMatch) {
            result[regionId][month][generalVehicleType].CO2 += data.CO2 * locationFactor; // prettier-ignore
            result[regionId][month][generalVehicleType].NOX += data.NOX * locationFactor; // prettier-ignore
            result[regionId][month][generalVehicleType].SO2 += data.SO2 * locationFactor; // prettier-ignore
            result[regionId][month][generalVehicleType].PM25 += data.PM25 * locationFactor; // prettier-ignore
            result[regionId][month][generalVehicleType].VOCs += data.VOCs * locationFactor; // prettier-ignore
            result[regionId][month][generalVehicleType].NH3 += data.NH3 * locationFactor; // prettier-ignore
          }
        }
      },
    );
  });

  return result;
}

/**
 * Monthly emission changes by EV type.
 *
 * Excel: Top half of the "Emission Changes" data from "Table 8: Calculated
 * changes for the transportation sector" table in the "Library" sheet
 * (F314:R361).
 */
export function calculateSelectedRegionsMonthlyEmissionChanges(options: {
  geographicFocus: GeographicFocus;
  stateVMTPercentagesByRegion: StateVMTPercentagesByRegion | EmptyObject;
  selectedStateId: StateId | "";
  _selectedRegionsMonthlyVMTPerVehicleType:
    | _SelectedRegionsMonthlyVMTPerVehicleType
    | EmptyObject;
  _vehiclesDisplaced: _VehiclesDisplaced;
  _selectedRegionsMonthlyEmissionRates:
    | _SelectedRegionsMonthlyEmissionRates
    | EmptyObject;
}) {
  const {
    geographicFocus,
    stateVMTPercentagesByRegion,
    selectedStateId,
    _selectedRegionsMonthlyVMTPerVehicleType,
    _vehiclesDisplaced,
    _selectedRegionsMonthlyEmissionRates,
  } = options;

  const stateVMTPercentages =
    Object.keys(stateVMTPercentagesByRegion).length !== 0
      ? (stateVMTPercentagesByRegion as StateVMTPercentagesByRegion)
      : null;

  const selectedRegionsVMTData =
    Object.keys(_selectedRegionsMonthlyVMTPerVehicleType).length !== 0
      ? (_selectedRegionsMonthlyVMTPerVehicleType as _SelectedRegionsMonthlyVMTPerVehicleType)
      : null;

  const selectedRegionsRatesData =
    Object.keys(_selectedRegionsMonthlyEmissionRates).length !== 0
      ? (_selectedRegionsMonthlyEmissionRates as _SelectedRegionsMonthlyEmissionRates)
      : null;

  if (!selectedRegionsVMTData || !selectedRegionsRatesData) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleType in _ExpandedVehicleType]: {
            [pollutant in Pollutant]: number;
          };
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsVMTData).reduce(
    (object, [regionVMTKey, regionVMTValue]) => {
      const regionId = regionVMTKey as keyof typeof selectedRegionsVMTData;

      object[regionId] ??= {};

      /**
       * NOTE: if a state is selected, we'll need to multiply each monthly
       * result by the percentage of that state's VMT in the given region
       */
      const stateVMTFactors =
        geographicFocus === "states" && selectedStateId !== ""
          ? stateVMTPercentages?.[selectedStateId][regionId] || null
          : null;

      Object.entries(selectedRegionsRatesData).forEach(
        ([regionRatesKey, regionRatesValue]) => {
          if (regionRatesKey === regionVMTKey) {
            Object.entries(regionRatesValue).forEach(
              ([regionRatesMonthkey, regionRatesMonthValue]) => {
                const month = Number(regionRatesMonthkey);

                object[regionId][month] ??= {
                  batteryEVCars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
                  hybridEVCars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
                  batteryEVTrucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
                  hybridEVTrucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
                  transitBusesDiesel: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
                  transitBusesCNG: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
                  transitBusesGasoline: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
                  schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
                };

                pollutants.forEach((pollutant) => {
                  object[regionId][month].batteryEVCars[pollutant] =
                    (stateVMTFactors ? stateVMTFactors.cars : 1) *
                    regionRatesMonthValue.cars[pollutant] *
                    regionVMTValue[month].cars *
                    _vehiclesDisplaced.batteryEVCars;

                  object[regionId][month].hybridEVCars[pollutant] =
                    (stateVMTFactors ? stateVMTFactors.cars : 1) *
                    regionRatesMonthValue.cars[pollutant] *
                    regionVMTValue[month].cars *
                    _vehiclesDisplaced.hybridEVCars *
                    percentageHybridEVMilesDrivenOnElectricity;

                  object[regionId][month].batteryEVTrucks[pollutant] =
                    (stateVMTFactors ? stateVMTFactors.trucks : 1) *
                    regionRatesMonthValue.trucks[pollutant] *
                    regionVMTValue[month].trucks *
                    _vehiclesDisplaced.batteryEVTrucks;

                  object[regionId][month].hybridEVTrucks[pollutant] =
                    (stateVMTFactors ? stateVMTFactors.trucks : 1) *
                    regionRatesMonthValue.trucks[pollutant] *
                    regionVMTValue[month].trucks *
                    _vehiclesDisplaced.hybridEVTrucks *
                    percentageHybridEVMilesDrivenOnElectricity;

                  object[regionId][month].transitBusesDiesel[pollutant] =
                    (stateVMTFactors ? stateVMTFactors.transitBuses : 1) *
                    regionRatesMonthValue.transitBusesDiesel[pollutant] *
                    regionVMTValue[month].transitBusesDiesel *
                    _vehiclesDisplaced.transitBusesDiesel;

                  object[regionId][month].transitBusesCNG[pollutant] =
                    (stateVMTFactors ? stateVMTFactors.transitBuses : 1) *
                    regionRatesMonthValue.transitBusesCNG[pollutant] *
                    regionVMTValue[month].transitBusesCNG *
                    _vehiclesDisplaced.transitBusesCNG;

                  object[regionId][month].transitBusesGasoline[pollutant] =
                    (stateVMTFactors ? stateVMTFactors.transitBuses : 1) *
                    regionRatesMonthValue.transitBusesGasoline[pollutant] *
                    regionVMTValue[month].transitBusesGasoline *
                    _vehiclesDisplaced.transitBusesGasoline;

                  object[regionId][month].schoolBuses[pollutant] =
                    (stateVMTFactors ? stateVMTFactors.schoolBuses : 1) *
                    regionRatesMonthValue.schoolBuses[pollutant] *
                    regionVMTValue[month].schoolBuses *
                    _vehiclesDisplaced.schoolBuses;
                });
              },
            );
          }
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleType in _ExpandedVehicleType]: {
            [pollutant in Pollutant]: number;
          };
        };
      };
    },
  );

  return result;
}

/**
 * Totals monthly emission changes from each EV type.
 *
 * Excel: Bottom half of the "Emission Changes" data from "Table 8: Calculated
 * changes for the transportation sector" table in the "Library" sheet
 * (F363:R392).
 */
export function calculateSelectedRegionsTotalMonthlyEmissionChanges(options: {
  selectedRegionsMonthlyEmissionChanges:
    | SelectedRegionsMonthlyEmissionChanges
    | EmptyObject;
}) {
  const { selectedRegionsMonthlyEmissionChanges } = options;

  type MonthlyData = {
    [field in "cars" | "trucks" | "transitBuses" | "schoolBuses" | "total"]: {
      [pollutant in Pollutant]: number;
    };
  };

  const selectedRegionsChangesData =
    Object.keys(selectedRegionsMonthlyEmissionChanges).length !== 0
      ? (selectedRegionsMonthlyEmissionChanges as SelectedRegionsMonthlyEmissionChanges)
      : null;

  if (!selectedRegionsChangesData) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: MonthlyData;
      };
    };
  }

  const result = Object.entries(selectedRegionsChangesData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsChangesData;

      object[regionId] ??= {};

      Object.entries(regionValue).forEach(
        ([regionMonthKey, regionMonthValue]) => {
          const month = Number(regionMonthKey);

          object[regionId][month] ??= {
            cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
            trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
            transitBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
            schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
            total: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
          };

          pollutants.forEach((pollutant) => {
            const monthlyCars =
              regionMonthValue.batteryEVCars[pollutant] +
              regionMonthValue.hybridEVCars[pollutant];
            const monthlyTrucks =
              regionMonthValue.batteryEVTrucks[pollutant] +
              regionMonthValue.hybridEVTrucks[pollutant];
            const monthlyTransitBuses =
              regionMonthValue.transitBusesDiesel[pollutant] +
              regionMonthValue.transitBusesCNG[pollutant] +
              regionMonthValue.transitBusesGasoline[pollutant];
            const monthlySchoolBuses = regionMonthValue.schoolBuses[pollutant];
            const monthlyTotal =
              monthlyCars +
              monthlyTrucks +
              monthlyTransitBuses +
              monthlySchoolBuses;

            object[regionId][month].cars[pollutant] += monthlyCars;
            object[regionId][month].trucks[pollutant] += monthlyTrucks;
            object[regionId][month].transitBuses[pollutant] += monthlyTransitBuses; // prettier-ignore
            object[regionId][month].schoolBuses[pollutant] += monthlySchoolBuses; // prettier-ignore
            object[regionId][month].total[pollutant] += monthlyTotal;
          });
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: MonthlyData;
      };
    },
  );

  return result;
}

/**
 * Totals monthly emission changes to yearly total values for each EV type and
 * each pollutant, and also an overall yearly total value for each pollutant
 * (across all EV types).
 *
 * Excel: Yearly pollutant totals from the "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (S363:S392).
 */
export function calculateSelectedRegionsTotalYearlyEmissionChanges(options: {
  selectedRegionsTotalMonthlyEmissionChanges:
    | SelectedRegionsTotalMonthlyEmissionChanges
    | EmptyObject;
}) {
  const { selectedRegionsTotalMonthlyEmissionChanges } = options;

  const selectedRegionsChangesData =
    Object.keys(selectedRegionsTotalMonthlyEmissionChanges).length !== 0
      ? (selectedRegionsTotalMonthlyEmissionChanges as SelectedRegionsTotalMonthlyEmissionChanges)
      : null;

  if (!selectedRegionsChangesData) {
    return {} as {
      [regionId in RegionId]: {
        cars: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
        trucks: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
        transitBuses: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
        schoolBuses: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
        total: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
      };
    };
  }

  const result = Object.entries(selectedRegionsChangesData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsChangesData;

      object[regionId] ??= {
        cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        transitBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        total: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      };

      Object.values(regionValue).forEach((regionMonthData) => {
        Object.entries(regionMonthData).forEach(
          ([regionMonthKey, regionMonthValue]) => {
            const field = regionMonthKey as keyof typeof regionMonthData;

            pollutants.forEach((pollutant) => {
              object[regionId][field][pollutant] += regionMonthValue[pollutant];
            });
          },
        );
      });

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        cars: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
        trucks: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
        transitBuses: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
        schoolBuses: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
        total: { CO2: 0; NOX: 0; SO2: 0; PM25: 0; VOCs: 0; NH3: 0 };
      };
    },
  );

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
  countiesByGeography: CountiesByGeography | EmptyObject;
  selectedGeographyRegionIds: RegionId[];
  vmtTotalsByGeography: VMTTotalsByGeography | EmptyObject;
  selectedRegionsTotalYearlyEmissionChanges:
    | SelectedRegionsTotalYearlyEmissionChanges
    | EmptyObject;
  evDeploymentLocation: string;
}) {
  const {
    geographicFocus,
    selectedRegionId,
    selectedStateId,
    countiesByGeography,
    selectedGeographyRegionIds,
    vmtTotalsByGeography,
    selectedRegionsTotalYearlyEmissionChanges,
    evDeploymentLocation,
  } = options;

  const result = {
    total: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
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

  const regionSelected = geographicFocus === "regions" && selectedRegionId !== ""; // prettier-ignore
  const stateSelected = geographicFocus === "states" && selectedStateId !== "";

  const countiesByGeographyData =
    Object.keys(countiesByGeography).length !== 0
      ? (countiesByGeography as CountiesByGeography)
      : null;

  const vmtData =
    Object.keys(vmtTotalsByGeography).length !== 0
      ? (vmtTotalsByGeography as VMTTotalsByGeography)
      : null;

  const selectedRegionsChangesData =
    Object.keys(selectedRegionsTotalYearlyEmissionChanges).length !== 0
      ? (selectedRegionsTotalYearlyEmissionChanges as SelectedRegionsTotalYearlyEmissionChanges)
      : null;

  if (
    !countiesByGeographyData ||
    !vmtData ||
    !selectedRegionsChangesData ||
    evDeploymentLocation === ""
  ) {
    return result;
  }

  const countiesByRegion = countiesByGeographyData.regions;

  const selectedRegionsCounties = Object.entries(countiesByRegion).reduce(
    (object, [key, value]) => {
      const regionId = key as keyof typeof countiesByRegion;

      if (selectedGeographyRegionIds.includes(regionId)) {
        object[regionId] = value;
      }

      return object;
    },
    {} as Partial<{
      [regionId in RegionId]: Partial<{
        [stateId in StateId]: string[];
      }>;
    }>,
  );

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith("region-");
  const deploymentLocationIsState = evDeploymentLocation.startsWith("state-");
  const deploymentLocationStateId = evDeploymentLocation.replace("state-", "") as StateId; // prettier-ignore

  const locationVMT = regionSelected
    ? deploymentLocationIsRegion
      ? vmtData.regions[selectedRegionId].total
      : vmtData.regions[selectedRegionId].states?.[deploymentLocationStateId]
    : stateSelected
      ? vmtData.states[selectedStateId]
      : null;

  Object.entries(vmtData.counties).forEach(([key, stateCountiesVMT]) => {
    const stateId = key as keyof typeof vmtData.counties;

    if (
      locationVMT &&
      (regionSelected || (stateSelected && selectedStateId === stateId))
    ) {
      Object.entries(stateCountiesVMT).forEach(([county, countyVMT]) => {
        /** determine which region the county falls within */
        const regionId = Object.entries(selectedRegionsCounties).find(
          ([_, regionData]) => {
            return Object.entries(regionData).some(([key, value]) => {
              return (key as StateId) === stateId && value.includes(county);
            });
          },
        )?.[0] as RegionId | undefined;

        if (
          regionId &&
          selectedRegionsCounties[regionId]?.[stateId]?.includes(county)
        ) {
          // initialize each region, state, and county's values for each pollutant
          result.regions[regionId] ??= { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }; // prettier-ignore
          result.states[stateId] ??= { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }; // prettier-ignore
          result.counties[stateId] ??= {};
          result.counties[stateId][county] ??= { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }; // prettier-ignore

          if (
            deploymentLocationIsRegion ||
            (deploymentLocationIsState && deploymentLocationStateId === stateId)
          ) {
            Object.values(selectedRegionsChangesData).forEach((changes) => {
              pollutants.forEach((pollutant) => {
                // conditionally convert CO2 pounds into tons
                const unitFactor = pollutant === "CO2" ? 2_000 : 1;

                const cars =
                  (changes.cars[pollutant] * countyVMT.cars) /
                  locationVMT.cars /
                  unitFactor;

                const trucks =
                  (changes.trucks[pollutant] * countyVMT.trucks) /
                  locationVMT.trucks /
                  unitFactor;

                const transitBuses =
                  (changes.transitBuses[pollutant] * countyVMT.transitBuses) /
                  locationVMT.transitBuses /
                  unitFactor;

                const schoolBuses =
                  (changes.schoolBuses[pollutant] * countyVMT.schoolBuses) /
                  locationVMT.schoolBuses /
                  unitFactor;

                const emissionChanges =
                  -cars - trucks - transitBuses - schoolBuses;

                result.total[pollutant] += emissionChanges;
                result.regions[regionId][pollutant] += emissionChanges;
                result.states[stateId][pollutant] += emissionChanges;
                result.counties[stateId][county][pollutant] = emissionChanges;
              });
            });
          }
        }
      });
    }
  });

  return result;
}

/**
 * Vehicle sales and stock for each state in the selected region, and the region
 * as a whole (sum of each state's sales and stock), for each vehicle type.
 *
 * Excel: "Table 10: List of states in region for purposes of calculating
 * vehicle sales and stock" table in the "Library" sheet (C457:I474).
 */
export function calculateVehicleSalesAndStock(options: {
  countyFips: CountyFIPS;
  stateLDVsSales: StateLDVsSales;
  stateBusSalesAndStock: StateBusSalesAndStock;
  geographicFocus: GeographicFocus;
  selectedRegionName: string;
  evDeploymentLocations: string[];
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | EmptyObject;
}) {
  const {
    countyFips,
    stateLDVsSales,
    stateBusSalesAndStock,
    geographicFocus,
    selectedRegionName,
    evDeploymentLocations,
    vmtAllocationPerVehicle,
  } = options;

  const result: {
    [locationId: string]: {
      ldvs: { sales: number; stock: number };
      transitBuses: { sales: number; stock: number };
      schoolBuses: { sales: number; stock: number };
    };
  } = {};

  const vmtAllocationData =
    Object.keys(vmtAllocationPerVehicle).length !== 0
      ? (vmtAllocationPerVehicle as VMTAllocationPerVehicle)
      : null;

  if (evDeploymentLocations[0] === "" || !vmtAllocationData) {
    return result;
  }

  // conditionally remove "region-"" option, as it will be added later as the sum
  // of each state's data
  const stateIds = evDeploymentLocations.reduce((ids, id) => {
    return id.startsWith("region-") ? ids : ids.concat(id);
  }, [] as string[]);

  countyFips.forEach((data) => {
    const id = data["Postal State Code"];
    const stateId = `state-${id}`;

    const conditionalRegionMatch =
      geographicFocus === "regions"
        ? data["AVERT Region"] === selectedRegionName
        : true;

    if (conditionalRegionMatch && stateIds.includes(stateId)) {
      const ldvsVMTShare = data["Share of State VMT - Passenger Cars"] || 0;
      const transitBusesVMTShare = data["Share of State VMT - Transit Buses"] || 0; // prettier-ignore
      const schoolBusesVMTShare = data["Share of State VMT - School Buses"] || 0; // prettier-ignore

      const ldvsSales = stateLDVsSales[id as keyof StateLDVsSales];

      const ldvsStock =
        vmtAllocationData[id as StateId].millionRegisteredLDVs * 1_000_000;

      const busSalesAndStock =
        stateBusSalesAndStock[id as keyof StateBusSalesAndStock];

      // initialize and then increment state data by vehicle type
      result[stateId] ??= {
        ldvs: { sales: 0, stock: 0 },
        transitBuses: { sales: 0, stock: 0 },
        schoolBuses: { sales: 0, stock: 0 },
      };

      result[stateId].ldvs.sales += ldvsVMTShare * ldvsSales;

      result[stateId].ldvs.stock += ldvsVMTShare * ldvsStock;

      result[stateId].transitBuses.sales +=
        transitBusesVMTShare * busSalesAndStock.transitBuses.sales;

      result[stateId].transitBuses.stock +=
        transitBusesVMTShare * busSalesAndStock.transitBuses.stock;

      result[stateId].schoolBuses.sales +=
        schoolBusesVMTShare * busSalesAndStock.schoolBuses.sales;

      result[stateId].schoolBuses.stock +=
        schoolBusesVMTShare * busSalesAndStock.schoolBuses.stock;
    }
  });

  // conditionally add "region-" to result as the sum of each state's data
  const resultStateIds = Object.keys(result);
  const regionId = evDeploymentLocations.find((id) => id.startsWith("region-"));

  if (regionId) {
    result[regionId] = {
      ldvs: { sales: 0, stock: 0 },
      transitBuses: { sales: 0, stock: 0 },
      schoolBuses: { sales: 0, stock: 0 },
    };

    resultStateIds.forEach((id) => {
      result[regionId].ldvs.sales += result[id].ldvs.sales;
      result[regionId].ldvs.stock += result[id].ldvs.stock;
      result[regionId].transitBuses.sales += result[id].transitBuses.sales;
      result[regionId].transitBuses.stock += result[id].transitBuses.stock;
      result[regionId].schoolBuses.sales += result[id].schoolBuses.sales;
      result[regionId].schoolBuses.stock += result[id].schoolBuses.stock;
    });
  }

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
  regionalScalingFactors: RegionalScalingFactors;
  selectedGeographyRegions: SelectedGeographyRegions;
}) {
  const { regionalScalingFactors, selectedGeographyRegions } = options;

  const result: Partial<{
    [regionId in RegionId]: {
      onshore_wind: number;
      utility_pv: number;
    };
  }> = {};

  if (Object.keys(selectedGeographyRegions).length === 0) return result;

  // build up results by region, using the regional scaling factor
  Object.entries(regionalScalingFactors).forEach(
    ([id, regionalScalingFactor]) => {
      const regionId = id as RegionId;

      result[regionId] ??= {
        onshore_wind: regionalScalingFactor,
        utility_pv: regionalScalingFactor,
      };

      const regionResult = result[regionId];

      const regionEEREDefaults =
        selectedGeographyRegions[regionId]?.eereDefaults.data;

      if (!regionResult || !regionEEREDefaults) return result;

      const renewableEnergyDefaultsTotals = regionEEREDefaults.reduce(
        (total, hourlyEereDefault) => {
          total.onshore_wind += hourlyEereDefault.onshore_wind;
          total.utility_pv += hourlyEereDefault.utility_pv;
          return total;
        },
        { onshore_wind: 0, utility_pv: 0 },
      );

      const totalHours = regionEEREDefaults.length;

      regionResult.onshore_wind *= renewableEnergyDefaultsTotals.onshore_wind / totalHours; // prettier-ignore
      regionResult.utility_pv *= renewableEnergyDefaultsTotals.utility_pv / totalHours; // prettier-ignore
    },
  );

  return result;
}

/**
 * Historical EERE data for the EV deployment location (entire region or state).
 *
 * Excel: "Table 13: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (C680:H680).
 */
export function calculateEVDeploymentLocationHistoricalEERE(options: {
  regionEereAverages: RegionEereAverages;
  stateEereAverages: StateEereAverages;
  selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
  evDeploymentLocation: string;
  regionalLineLoss: number;
  selectedRegionId: RegionId | "";
}) {
  const {
    regionEereAverages,
    stateEereAverages,
    selectedRegionsEEREDefaultsAverages,
    evDeploymentLocation,
    regionalLineLoss,
    selectedRegionId,
  } = options;

  const result = {
    onshoreWind: { mw: 0, gwh: 0 },
    utilitySolar: { mw: 0, gwh: 0 },
    eeRetail: { mw: 0, gwh: 0 },
  };

  if (
    Object.keys(selectedRegionsEEREDefaultsAverages).length === 0 ||
    !evDeploymentLocation
  ) {
    return result;
  }

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith("region-");
  const deploymentLocationStateId = evDeploymentLocation.replace("state-", "") as StateId; // prettier-ignore

  const fallbackEereAverage = {
    capacity_added_mw: { onshore_wind: 0, utility_pv: 0 },
    retail_impacts_gwh: { ee_retail: 0 },
  };

  const regionEereAverage = regionEereAverages[selectedRegionId as RegionId] || fallbackEereAverage; // prettier-ignore
  const stateEereAverage = stateEereAverages[deploymentLocationStateId] || fallbackEereAverage; // prettier-ignore

  const GWtoMW = 1_000;
  const hoursInYear = 8_760;

  result.onshoreWind.mw = deploymentLocationIsRegion
    ? regionEereAverage.capacity_added_mw.onshore_wind
    : stateEereAverage.capacity_added_mw.onshore_wind;

  result.utilitySolar.mw = deploymentLocationIsRegion
    ? regionEereAverage.capacity_added_mw.utility_pv
    : stateEereAverage.capacity_added_mw.utility_pv;

  // prettier-ignore
  result.eeRetail.mw = deploymentLocationIsRegion
    ? (regionEereAverage.retail_impacts_gwh.ee_retail * GWtoMW) / hoursInYear * 1 - regionalLineLoss
    : (stateEereAverage.retail_impacts_gwh.ee_retail * GWtoMW) / hoursInYear;

  // prettier-ignore
  result.onshoreWind.gwh = Object.entries(selectedRegionsEEREDefaultsAverages).reduce(
    (total, [regionId, { onshore_wind }]) => {
      const eereAverage = regionEereAverages[regionId as RegionId] || fallbackEereAverage;
      const regionTotal = onshore_wind * hoursInYear * eereAverage.capacity_added_mw.onshore_wind / GWtoMW;
      total += regionTotal;
      return total;
    },
    0,
  );

  // prettier-ignore
  result.utilitySolar.gwh = Object.entries(selectedRegionsEEREDefaultsAverages).reduce(
    (total, [regionId, { utility_pv }]) => {
      const eereAverage = regionEereAverages[regionId as RegionId] || fallbackEereAverage;
      const regionTotal = utility_pv * hoursInYear * eereAverage.capacity_added_mw.utility_pv / GWtoMW;
      total += regionTotal;
      return total;
    },
    0,
  );

  result.eeRetail.gwh = deploymentLocationIsRegion
    ? regionEereAverage.retail_impacts_gwh.ee_retail
    : stateEereAverage.retail_impacts_gwh.ee_retail;

  return result;
}
