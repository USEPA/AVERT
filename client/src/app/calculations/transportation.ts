import { RegionalLoadData } from 'app/redux/reducers/geography';
import type { GeographicFocus } from 'app/redux/reducers/geography';
import type {
  CountiesByGeography,
  RegionalScalingFactors,
  SelectedGeographyRegions,
} from 'app/calculations/geography';
import { sortObjectByKeys } from 'app/calculations/utilities';
import type { RegionId, StateId } from 'app/config';
import { regions, states } from 'app/config';
/**
 * Excel: "MOVESEmissionRates" sheet.
 */
import movesEmissionsRates from 'app/data/moves-emissions-rates.json';
/**
 * Excel: "Table B. View charging profiles or set a manual charging profile
 * for Weekdays" table in the "EV_Detail" sheet (C23:H47), which comes from
 * "Table 9: Default EV load profiles and related values from EVI-Pro Lite"
 * table in the "Library" sheet).
 */
import evChargingProfiles from 'app/data/ev-charging-profiles-hourly-data.json';
/**
 * Excel: "CountyFIPS" sheet.
 */
import countyFips from 'app/data/county-fips.json';
/**
 * Excel: "Table 4: VMT assumptions" table in the "Library" sheet (E177:E180).
 */
import nationalAverageVMTPerYear from 'app/data/national-average-vmt-per-year.json';
/**
 * Excel: "Table 5: EV efficiency assumptions" table in the "Library" sheet
 * (E194:J200).
 */
import evEfficiencyByModelYear from 'app/data/ev-efficiency-by-model-year.json';
/**
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet (B432:C445)
 */
import regionAverageTemperatures from 'app/data/region-average-temperature.json';
/**
 * Excel: "Table 11: LDV Sales and Stock" table in the "Library" sheet
 * (B485:C535).
 */
import stateLightDutyVehiclesSales from 'app/data/state-light-duty-vehicles-sales.json';
/**
 * Excel: "Table 12: Transit and School Bus Sales and Stock" table in the
 * "Library" sheet (B546:F596).
 */
import stateBusSalesAndStock from 'app/data/state-bus-sales-and-stock.json';
/**
 * Excel: "Table 13: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B606:E619).
 */
import regionEereAverages from 'app/data/region-eere-averages.json';
/**
 * Excel: "Table 13: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B626:E674).
 */
import stateEereAverages from 'app/data/state-eere-averages.json';
/**
 * Excel: Second table in the "RegionStateAllocate" sheet (B118:E167)
 */
import vmtAllocationAndRegisteredVehicles from 'app/data/vmt-allocation-and-registered-vehicles.json';

/**
 * Excel: "Table 5: EV efficiency assumptions" table in the "Library" sheet
 * (E202).
 */
const percentageHybridEVMilesDrivenOnElectricity = 0.54;

/**
 * Additional energy consumed in climates with +/-18F differential from
 * St. Louis, MO
 *
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet (F428)
 */
const percentageAdditionalEnergyConsumedFactor = 0.0766194804959222;

/**
 * Ratio of typical weekend energy consumption as a share of typical weekday
 * energy consumption.
 *
 * Excel: "Table C. Set ratio of weekend to weekday energy" table in the
 * "EV_Detail" sheet (D53).
 */
const percentWeekendToWeekdayEVConsumption = 97.3015982802952;

/**
 * Excel: "Table 14: Light-duty vehicle sales by type" table in the "Library"
 * sheet (D727:E727)
 */
const percentageLDVsDisplacedByEVs = {
  cars: 0.276046368502288,
  trucks: 0.723953631497712,
};

type LightDutyVehiclesSalesStateId = keyof typeof stateLightDutyVehiclesSales;
type BusSalesAndStockStateId = keyof typeof stateBusSalesAndStock;

type MovesData = {
  year: string;
  month: string;
  modelYear: string;
  state: string;
  vehicleType: string;
  fuelType: string;
  VMT: number;
  CO2: number;
  NOX: number;
  SO2: number;
  PM25: number;
  VOCs: number;
  NH3: number;
};

const abridgedVehicleTypes = [
  'cars',
  'trucks',
  'transitBuses',
  'schoolBuses',
] as const;

const generalVehicleTypes = [
  'cars',
  'trucks',
  'transitBusesDiesel',
  'transitBusesCNG',
  'transitBusesGasoline',
  'schoolBuses',
] as const;

const expandedVehicleTypes = [
  'batteryEVCars',
  'hybridEVCars',
  'batteryEVTrucks',
  'hybridEVTrucks',
  'transitBusesDiesel',
  'transitBusesCNG',
  'transitBusesGasoline',
  'schoolBuses',
] as const;

const pollutants = ['CO2', 'NOX', 'SO2', 'PM25', 'VOCs', 'NH3'] as const;

type AbridgedVehicleType = typeof abridgedVehicleTypes[number];
type GeneralVehicleType = typeof generalVehicleTypes[number];
type ExpandedVehicleType = typeof expandedVehicleTypes[number];
type Pollutant = typeof pollutants[number];

export type VMTPerVehicleTypeByGeography = ReturnType<
  typeof calculateVMTPerVehicleTypeByGeography
>;
export type VMTAllocationTotalsAndPercentages = ReturnType<
  typeof calculateVMTAllocationTotalsAndPercentages
>;
export type VMTAllocationPerVehicle = ReturnType<
  typeof calculateVMTAllocationPerVehicle
>;
export type MonthlyVMTTotalsAndPercentages = ReturnType<
  typeof calculateMonthlyVMTTotalsAndPercentages
>;
export type HourlyEVChargingPercentages = ReturnType<
  typeof calculateHourlyEVChargingPercentages
>;
export type SelectedRegionsStatesVMTPercentages = ReturnType<
  typeof calculateSelectedRegionsStatesVMTPercentages
>;
export type SelectedRegionsVMTPercentagesPerVehicleType = ReturnType<
  typeof calculateSelectedRegionsVMTPercentagesPerVehicleType
>;
export type SelectedRegionsAverageVMTPerYear = ReturnType<
  typeof calculateSelectedRegionsAverageVMTPerYear
>;
export type MonthlyVMTPerVehicleType = ReturnType<
  typeof calculateMonthlyVMTPerVehicleType
>;
export type EVEfficiencyPerVehicleType = ReturnType<
  typeof calculateEVEfficiencyPerVehicleType
>;
export type DailyStats = ReturnType<typeof calculateDailyStats>;
export type MonthlyStats = ReturnType<typeof calculateMonthlyStats>;
export type VehiclesDisplaced = ReturnType<typeof calculateVehiclesDisplaced>;
export type MonthlyEVEnergyUsageGW = ReturnType<
  typeof calculateMonthlyEVEnergyUsageGW
>;
export type MonthlyEVEnergyUsageMW = ReturnType<
  typeof calculateMonthlyEVEnergyUsageMW
>;
export type MonthlyDailyEVEnergyUsage = ReturnType<
  typeof calculateMonthlyDailyEVEnergyUsage
>;
export type MonthlyEmissionRates = ReturnType<
  typeof calculateMonthlyEmissionRates
>;
export type MonthlyEmissionChanges = ReturnType<
  typeof calculateMonthlyEmissionChanges
>;
export type TotalMonthlyEmissionChanges = ReturnType<
  typeof calculateTotalMonthlyEmissionChanges
>;
export type TotalYearlyEmissionChanges = ReturnType<
  typeof calculateTotalYearlyEmissionChanges
>;
export type VehicleEmissionChangesByGeography = ReturnType<
  typeof calculateVehicleEmissionChangesByGeography
>;
export type TotalYearlyEVEnergyUsage = ReturnType<
  typeof calculateTotalYearlyEVEnergyUsage
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
 * Accumulated VMT data per vehicle type by AVERT region, state, and county.
 *
 * Excel: Not stored in any table, but used in calculating values in the "From
 * vehicles" column in the table in the "11_VehicleCty" sheet (column H).
 */
export function calculateVMTPerVehicleTypeByGeography() {
  type VMTPerVehicleType = { [vehicleType in AbridgedVehicleType]: number };

  const regionIds = Object.values(regions).reduce((object, { id, name }) => {
    object[name] = id;
    return object;
  }, {} as { [regionName: string]: RegionId });

  const result = countyFips.reduce(
    (object, data) => {
      const regionId = regionIds[data['AVERT Region']];
      const stateId = data['Postal State Code'] as StateId;
      const county = data['County Name Long'];
      const vmtData = {
        cars: data['Passenger Cars VMT'] || 0,
        trucks: data['Passenger Trucks and Light Commercial Trucks VMT'] || 0,
        transitBuses: data['Transit Buses VMT'] || 0,
        schoolBuses: data['School Buses VMT'] || 0,
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

        abridgedVehicleTypes.forEach((vehicleType) => {
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
export function calculateVMTAllocationTotalsAndPercentages() {
  // initialize result object with state keys and regionTotals key
  const result = Object.keys(states).reduce(
    (data, stateId) => {
      data[stateId as StateId] = {};
      return data;
    },
    { regionTotals: {} } as {
      [stateId in StateId | 'regionTotals']: Partial<{
        [regionId in RegionId | 'allRegions']: {
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

  const regionIds = Object.values(regions).reduce((object, { id, name }) => {
    object[name] = id;
    return object;
  }, {} as { [regionName: string]: RegionId });

  // populate vmt totals data for each state, organized by region, and initialize
  // allRegions object for storing totals of all region data in the state
  countyFips.forEach((data) => {
    const stateId = data['Postal State Code'] as StateId;
    const regionId = regionIds[data['AVERT Region']];
    const carsVMT = data['Passenger Cars VMT'] || 0;
    const trucksVMT = data['Passenger Trucks and Light Commercial Trucks VMT'] || 0; // prettier-ignore
    const transitBusesVMT = data['Transit Buses VMT'] || 0;
    const schoolBusesVMT = data['School Buses VMT'] || 0;

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
    // NOTE: stateData is really 'regionTotals' on the first loop, so skip it
    if (stateId !== 'regionTotals') {
      Object.entries(stateData).forEach(([regionId, regionData]) => {
        // NOTE: regionId is really 'allRegions' on the first loop, so skip it
        if (regionId !== 'allRegions') {
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
  // and build up each state's 'allRegions' data with values from each region
  Object.entries(result).forEach(([stateId, stateData]) => {
    // NOTE: stateData is really 'regionTotals' on the first loop, so skip it
    if (stateId !== 'regionTotals') {
      Object.entries(stateData).forEach(([regionId, regionData]) => {
        // NOTE: regionId is really 'allRegions' on the first loop, so skip it
        if (regionId !== 'allRegions') {
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
 * VMT allocation per vehicle by state.
 *
 * Excel: Second table in the "RegionStateAllocate" sheet (B118:J168)
 */
export function calculateVMTAllocationPerVehicle() {
  // initialize result object with state keys and total key
  const result = Object.entries(vmtAllocationAndRegisteredVehicles).reduce(
    (object, [key, data]) => {
      const {
        annualVMTLightDutyVehicles, // (million miles)
        annualVMTBuses, // (million miles)
        registeredLightDutyVehicles, // (million)
      } = data;

      const busSalesAndStock =
        stateBusSalesAndStock[key as BusSalesAndStockStateId];

      if (busSalesAndStock) {
        const registeredBuses =
          (busSalesAndStock.transitBuses.stock +
            busSalesAndStock.schoolBuses.stock) /
          1_000_000;

        object[key as StateId] = {
          vmtLDVs: annualVMTLightDutyVehicles,
          vmtBuses: annualVMTBuses,
          registeredLDVs: registeredLightDutyVehicles,
          registeredBuses,
          vmtPerLDV: { total: 0, percent: 0 },
          vmtPerBus: { total: 0, percent: 0 },
        };
      }

      return object;
    },
    {
      total: {
        vmtLDVs: 0,
        vmtBuses: 0,
        registeredLDVs: 0,
        registeredBuses: 0,
        vmtPerLDV: { total: 0, percent: 0 },
        vmtPerBus: { total: 0, percent: 0 },
      },
    } as {
      [stateId in StateId | 'total']: {
        vmtLDVs: number;
        vmtBuses: number;
        registeredLDVs: number;
        registeredBuses: number;
        vmtPerLDV: { total: number; percent: number };
        vmtPerBus: { total: number; percent: number };
      };
    },
  );

  // sum totals across states
  Object.entries(result).forEach(([key, data]) => {
    if (key !== 'total') {
      result.total.vmtLDVs += data.vmtLDVs;
      result.total.vmtBuses += data.vmtBuses;
      result.total.registeredLDVs += data.registeredLDVs;
      result.total.registeredBuses += data.registeredBuses;
    }
  });

  // calculate vmt per vehicle totals for each state or totals object
  Object.keys(result).forEach((key) => {
    const item = result[key as StateId | 'total'];
    item.vmtPerLDV.total = item.vmtLDVs / item.registeredLDVs;
    item.vmtPerBus.total = item.vmtBuses / item.registeredBuses;
  });

  // calculate vmt per vehicle percentages for each state
  Object.keys(result).forEach((key) => {
    if (key !== 'total') {
      const item = result[key as StateId];
      item.vmtPerLDV.percent = item.vmtPerLDV.total / result.total.vmtPerLDV.total; // prettier-ignore
      item.vmtPerBus.percent = item.vmtPerBus.total / result.total.vmtPerBus.total; // prettier-ignore
    }
  });

  return result;
}

/**
 * Vehicle miles traveled (VMT) totals for each month from MOVES data, and the
 * percentage/share of the yearly totals each month has, for each vehicle type.
 *
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (totals: E218:P223, percentages: E225:P230).
 */
export function calculateMonthlyVMTTotalsAndPercentages() {
  const result: {
    [month: number]: {
      [vehicleType in GeneralVehicleType]: {
        total: number;
        percent: number;
      };
    };
  } = {};

  /**
   * Yearly total vehicle miles traveled (VMT) for each vehicle type.
   *
   * Excel: Total column of Table 6 in the "Library" sheet (Q218:Q223).
   */
  const yearlyTotals = {
    cars: 0,
    trucks: 0,
    transitBusesDiesel: 0,
    transitBusesCNG: 0,
    transitBusesGasoline: 0,
    schoolBuses: 0,
  };

  // NOTE: explicitly declaring the type with a type assertion because
  // TypeScript isn't able to infer types from large JSON files
  // (https://github.com/microsoft/TypeScript/issues/42761)
  (movesEmissionsRates as MovesData[]).forEach((data) => {
    const month = Number(data.month);

    if (data.year === '2020') {
      result[month] ??= {
        cars: { total: 0, percent: 0 },
        trucks: { total: 0, percent: 0 },
        transitBusesDiesel: { total: 0, percent: 0 },
        transitBusesCNG: { total: 0, percent: 0 },
        transitBusesGasoline: { total: 0, percent: 0 },
        schoolBuses: { total: 0, percent: 0 },
      };

      const generalVehicleType: GeneralVehicleType | null =
        data.vehicleType === 'Passenger Car'
          ? 'cars'
          : data.vehicleType === 'Passenger Truck'
          ? 'trucks'
          : data.vehicleType === 'Transit Bus' && data.fuelType === 'Diesel'
          ? 'transitBusesDiesel'
          : data.vehicleType === 'Transit Bus' && data.fuelType === 'CNG'
          ? 'transitBusesCNG'
          : data.vehicleType === 'Transit Bus' && data.fuelType === 'Gasoline'
          ? 'transitBusesGasoline'
          : data.vehicleType === 'School Bus'
          ? 'schoolBuses'
          : null; // NOTE: fallback (generalVehicleType should never actually be null)

      if (generalVehicleType) {
        result[month][generalVehicleType].total += data.VMT;
        yearlyTotals[generalVehicleType] += data.VMT;
      }
    }
  });

  // console.log(yearlyTotals); // NOTE: for debugging purposes

  Object.values(result).forEach((month) => {
    generalVehicleTypes.forEach((vehicleType) => {
      month[vehicleType].percent =
        month[vehicleType].total / yearlyTotals[vehicleType];
    });
  });

  return result;
}

/**
 * Excel: Data in the first EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P8:X32).
 */
export function calculateHourlyEVChargingPercentages() {
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
        weekday: data.lightDutyVehicles.weekday,
        weekend: data.lightDutyVehicles.weekend,
      },
      hybridEVs: {
        weekday: data.lightDutyVehicles.weekday,
        weekend: data.lightDutyVehicles.weekend,
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
export function calculateSelectedRegionsStatesVMTPercentages(options: {
  geographicFocus: GeographicFocus;
  selectedRegionId: RegionId | '';
  selectedStateId: StateId | '';
  vmtAllocationTotalsAndPercentages: VMTAllocationTotalsAndPercentages | {};
}) {
  const {
    geographicFocus,
    selectedRegionId,
    selectedStateId,
    vmtAllocationTotalsAndPercentages,
  } = options;

  type StateVMTPercentages = {
    cars: number;
    trucks: number;
    transitBuses: number;
    schoolBuses: number;
    allLDVs: number;
    allBuses: number;
  };

  const result = Object.entries(vmtAllocationTotalsAndPercentages).reduce(
    (object, [key, data]) => {
      if (key === 'regionTotals') return object;

      const stateId = key as StateId;
      const stateRegionIds = Object.keys(data); // NOTE: also includes 'allRegions' key

      const vmtStatesData =
        Object.keys(vmtAllocationTotalsAndPercentages).length !== 0
          ? (vmtAllocationTotalsAndPercentages as VMTAllocationTotalsAndPercentages)
          : null;

      const vmtStateData = vmtStatesData?.[stateId];

      if (
        vmtStateData &&
        geographicFocus === 'regions' &&
        selectedRegionId !== '' &&
        stateRegionIds.includes(selectedRegionId)
      ) {
        const selectedRegionData = vmtStateData[selectedRegionId];

        if (selectedRegionData) {
          object[selectedRegionId] ??= {} as {
            [stateId in StateId]: StateVMTPercentages;
          };

          object[selectedRegionId][stateId] = {
            cars: selectedRegionData.cars.percent,
            trucks: selectedRegionData.trucks.percent,
            transitBuses: selectedRegionData.transitBuses.percent,
            schoolBuses: selectedRegionData.schoolBuses.percent,
            allLDVs: selectedRegionData.allLDVs.percent,
            allBuses: selectedRegionData.allBuses.percent,
          };
        }
      }

      if (
        vmtStateData &&
        geographicFocus === 'states' &&
        selectedStateId !== '' &&
        stateId === selectedStateId
      ) {
        Object.entries(vmtStateData).forEach(([stateKey, stateData]) => {
          if (stateKey !== 'allRegions') {
            object[stateKey as RegionId] ??= {} as {
              [stateId in StateId]: StateVMTPercentages;
            };

            object[stateKey as RegionId][stateId] = {
              cars: stateData.cars.percent,
              trucks: stateData.trucks.percent,
              transitBuses: stateData.transitBuses.percent,
              schoolBuses: stateData.schoolBuses.percent,
              allLDVs: stateData.allLDVs.percent,
              allBuses: stateData.allBuses.percent,
            };
          }
        });
      }

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
export function calculateSelectedRegionsVMTPercentagesPerVehicleType(options: {
  selectedRegionsStatesVMTPercentages: SelectedRegionsStatesVMTPercentages | {};
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | {};
}) {
  const { selectedRegionsStatesVMTPercentages, vmtAllocationPerVehicle } =
    options;

  const result = Object.entries(selectedRegionsStatesVMTPercentages).reduce(
    (object, [regionKey, regionData]) => {
      const regionId = regionKey as RegionId;

      Object.entries(regionData).forEach(([stateKey, stateData]) => {
        const stateId = stateKey as StateId;

        const vmtStatesData =
          Object.keys(vmtAllocationPerVehicle).length !== 0
            ? (vmtAllocationPerVehicle as VMTAllocationPerVehicle)
            : null;

        const vmtStateData = vmtStatesData?.[stateId];

        if (vmtStateData) {
          const allLDVsPercent = stateData.allLDVs;
          const allBusesPercent = stateData.allBuses;

          const vmtPerLDVPercent = vmtStateData.vmtPerLDV.percent;
          const vmtPerBusPercent = vmtStateData.vmtPerBus.percent;

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
export function calculateSelectedRegionsAverageVMTPerYear(options: {
  selectedRegionsVMTPercentagesPerVehicleType: SelectedRegionsVMTPercentagesPerVehicleType;
}) {
  const { selectedRegionsVMTPercentagesPerVehicleType } = options;

  const result = Object.entries(
    selectedRegionsVMTPercentagesPerVehicleType,
  ).reduce(
    (object, [key, data]) => {
      const { vmtPerLDVPercent, vmtPerBusPercent } = data;

      object[key as RegionId] = {
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
export function calculateMonthlyVMTPerVehicleType(options: {
  selectedRegionsAverageVMTPerYear: SelectedRegionsAverageVMTPerYear;
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
}) {
  const { selectedRegionsAverageVMTPerYear, monthlyVMTTotalsAndPercentages } =
    options;

  const result: {
    [month: number]: {
      [vehicleType in GeneralVehicleType]: number;
    };
  } = {};

  if (Object.keys(monthlyVMTTotalsAndPercentages).length === 0) {
    return result;
  }

  Object.entries(monthlyVMTTotalsAndPercentages).forEach(([key, data]) => {
    const month = Number(key);

    result[month] ??= {
      cars: 0,
      trucks: 0,
      transitBusesDiesel: 0,
      transitBusesCNG: 0,
      transitBusesGasoline: 0,
      schoolBuses: 0,
    };

    generalVehicleTypes.forEach((vehicleType) => {
      // NOTE: selectedRegionsAverageVMTPerYear's vehicle types are abridged
      // (don't include transit buses broken out by fuel type)
      const averageVMTPerYearVehicleType =
        vehicleType === 'transitBusesDiesel' ||
        vehicleType === 'transitBusesCNG' ||
        vehicleType === 'transitBusesGasoline'
          ? 'transitBuses'
          : vehicleType;

      result[month][vehicleType] =
        selectedRegionsAverageVMTPerYear[averageVMTPerYearVehicleType] *
        data[vehicleType].percent;
    });
  });

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
export function calculateEVEfficiencyPerVehicleType(options: {
  regionalScalingFactors: RegionalScalingFactors;
  evModelYear: string;
}) {
  const { regionalScalingFactors, evModelYear } = options;

  const result = {
    batteryEVCars: 0,
    hybridEVCars: 0,
    batteryEVTrucks: 0,
    hybridEVTrucks: 0,
    transitBuses: 0,
    schoolBuses: 0,
  };

  const resultsByRegion: Partial<{
    [regionId in RegionId]: {
      batteryEVCars: number;
      hybridEVCars: number;
      batteryEVTrucks: number;
      hybridEVTrucks: number;
      transitBuses: number;
      schoolBuses: number;
    };
  }> = {};

  const evEfficiencyModelYear =
    evModelYear as keyof typeof evEfficiencyByModelYear;

  const evEfficiency = evEfficiencyByModelYear[evEfficiencyModelYear];

  if (!evEfficiency) return result;

  // build up results by region, using the regional scaling factor
  Object.entries(regionalScalingFactors).forEach(
    ([id, regionalScalingFactor]) => {
      const regionId = id as RegionId;

      resultsByRegion[regionId] ??= {
        batteryEVCars: regionalScalingFactor,
        hybridEVCars: regionalScalingFactor,
        batteryEVTrucks: regionalScalingFactor,
        hybridEVTrucks: regionalScalingFactor,
        transitBuses: regionalScalingFactor,
        schoolBuses: regionalScalingFactor,
      };

      const regionResult = resultsByRegion[regionId];

      if (!regionResult) return result;

      Object.entries(evEfficiency).forEach(([type, data]) => {
        const vehicleType = type as keyof typeof evEfficiency;

        if (regionResult.hasOwnProperty(vehicleType)) {
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

          regionResult[vehicleType] *= data * climateAdjustmentFactor;
        }
      });
    },
  );

  // console.log(resultsByRegion); // NOTE: for debugging purposes

  // reduce results by region into single result object by combining each
  // region's vehicle type values
  Object.keys(resultsByRegion).forEach((id) => {
    const regionId = id as RegionId;
    const regionResult = resultsByRegion[regionId];

    if (regionResult) {
      Object.keys(regionResult).forEach((type) => {
        const vehicleType = type as keyof typeof regionResult;

        if (result.hasOwnProperty(vehicleType)) {
          result[vehicleType] += regionResult[vehicleType];
        }
      });
    }
  });

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
export function calculateVehiclesDisplaced(options: {
  batteryEVs: number;
  hybridEVs: number;
  transitBuses: number;
  schoolBuses: number;
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
}) {
  const {
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    monthlyVMTTotalsAndPercentages,
  } = options;

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

  if (Object.keys(monthlyVMTTotalsAndPercentages).length === 0) return result;

  const yearlyTransitBusesVMTTotals = Object.values(
    monthlyVMTTotalsAndPercentages,
  ).reduce(
    (data, monthlyData) => {
      data.diesel += monthlyData.transitBusesDiesel.total;
      data.cng += monthlyData.transitBusesCNG.total;
      data.gasoline += monthlyData.transitBusesGasoline.total;
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
export function calculateMonthlyEVEnergyUsageGW(options: {
  monthlyVMTPerVehicleType: MonthlyVMTPerVehicleType;
  evEfficiencyPerVehicleType: EVEfficiencyPerVehicleType;
  vehiclesDisplaced: VehiclesDisplaced;
}) {
  const {
    monthlyVMTPerVehicleType,
    evEfficiencyPerVehicleType,
    vehiclesDisplaced,
  } = options;

  const result: {
    [month: number]: {
      [vehicleType in ExpandedVehicleType]: number;
    };
  } = {};

  if (Object.keys(monthlyVMTPerVehicleType).length === 0) return result;

  const KWtoGW = 0.000_001;

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;
    const monthlyVmt = monthlyVMTPerVehicleType[month];

    if (!monthlyVmt) return result;

    result[month] = {
      batteryEVCars:
        vehiclesDisplaced.batteryEVCars *
        monthlyVmt.cars *
        evEfficiencyPerVehicleType.batteryEVCars *
        KWtoGW,
      hybridEVCars:
        vehiclesDisplaced.hybridEVCars *
        monthlyVmt.cars *
        evEfficiencyPerVehicleType.hybridEVCars *
        KWtoGW *
        percentageHybridEVMilesDrivenOnElectricity,
      batteryEVTrucks:
        vehiclesDisplaced.batteryEVTrucks *
        monthlyVmt.trucks *
        evEfficiencyPerVehicleType.batteryEVTrucks *
        KWtoGW,
      hybridEVTrucks:
        vehiclesDisplaced.hybridEVTrucks *
        monthlyVmt.trucks *
        evEfficiencyPerVehicleType.hybridEVTrucks *
        KWtoGW *
        percentageHybridEVMilesDrivenOnElectricity,
      transitBusesDiesel:
        vehiclesDisplaced.transitBusesDiesel *
        monthlyVmt.transitBusesDiesel *
        evEfficiencyPerVehicleType.transitBuses *
        KWtoGW,
      transitBusesCNG:
        vehiclesDisplaced.transitBusesCNG *
        monthlyVmt.transitBusesCNG *
        evEfficiencyPerVehicleType.transitBuses *
        KWtoGW,
      transitBusesGasoline:
        vehiclesDisplaced.transitBusesGasoline *
        monthlyVmt.transitBusesGasoline *
        evEfficiencyPerVehicleType.transitBuses *
        KWtoGW,
      schoolBuses:
        vehiclesDisplaced.schoolBuses *
        monthlyVmt.schoolBuses *
        evEfficiencyPerVehicleType.schoolBuses *
        KWtoGW,
    };
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
export function calculateMonthlyEVEnergyUsageMW(
  monthlyEVEnergyUsageGW: MonthlyEVEnergyUsageGW,
) {
  const result: {
    [month: number]: {
      batteryEVs: number;
      hybridEVs: number;
      transitBuses: number;
      schoolBuses: number;
    };
  } = {};

  if (Object.keys(monthlyEVEnergyUsageGW).length === 0) {
    return result;
  }

  const GWtoMW = 1_000;

  Object.entries(monthlyEVEnergyUsageGW).forEach(([key, data]) => {
    const month = Number(key);

    result[month] = {
      batteryEVs: (data.batteryEVCars + data.batteryEVTrucks) * GWtoMW,
      hybridEVs: (data.hybridEVCars + data.hybridEVTrucks) * GWtoMW,
      transitBuses:
        (data.transitBusesDiesel +
          data.transitBusesCNG +
          data.transitBusesGasoline) *
        GWtoMW,
      schoolBuses: data.schoolBuses * GWtoMW,
    };
  });

  return result;
}

/**
 * Totals the energy usage from each EV type for all months in the year to a
 * single total EV energy usage value for the year in GW.
 *
 * Excel: "Sales Changes" data from "Table 8: Calculated changes for the
 * transportation sector" table in the "Library" sheet (S309).
 */
export function calculateTotalYearlyEVEnergyUsage(
  monthlyEVEnergyUsageGW: MonthlyEVEnergyUsageGW,
) {
  if (Object.keys(monthlyEVEnergyUsageGW).length === 0) {
    return 0;
  }

  const result = Object.values(monthlyEVEnergyUsageGW).reduce(
    (total, month) => total + Object.values(month).reduce((a, b) => a + b, 0),
    0,
  );

  return result;
}

/**
 * Monthly EV energy usage (MWh) for a typical weekday day or weekend day.
 *
 * Excel: Data in the second EV table (to the right of the "Calculate Changes"
 * table) in the "CalculateEERE" sheet (P35:X47).
 */
export function calculateMonthlyDailyEVEnergyUsage(options: {
  monthlyEVEnergyUsageMW: MonthlyEVEnergyUsageMW;
  monthlyStats: MonthlyStats;
}) {
  const { monthlyEVEnergyUsageMW, monthlyStats } = options;

  const result: {
    [month: number]: {
      batteryEVs: { weekday: number; weekend: number };
      hybridEVs: { weekday: number; weekend: number };
      transitBuses: { weekday: number; weekend: number };
      schoolBuses: { weekday: number; weekend: number };
    };
  } = {};

  if (
    Object.keys(monthlyEVEnergyUsageMW).length === 0 ||
    Object.keys(monthlyStats).length === 0
  ) {
    return result;
  }

  [...Array(12)].forEach((_item, index) => {
    const month = index + 1;

    const weekdayDays = monthlyStats[month].weekdayDays;
    const weekendDays = monthlyStats[month].weekendDays;
    const weekenedToWeekdayRatio = percentWeekendToWeekdayEVConsumption / 100;
    const scaledWeekdayDays =
      weekdayDays + weekenedToWeekdayRatio * weekendDays;

    if (scaledWeekdayDays !== 0) {
      const batteryEVsWeekday =
        monthlyEVEnergyUsageMW[month].batteryEVs / scaledWeekdayDays;

      const hybridEVsWeekday =
        monthlyEVEnergyUsageMW[month].hybridEVs / scaledWeekdayDays;

      const transitBusesWeekday =
        monthlyEVEnergyUsageMW[month].transitBuses / scaledWeekdayDays;

      const schoolBusesWeekday =
        monthlyEVEnergyUsageMW[month].schoolBuses / scaledWeekdayDays;

      result[month] = {
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

  return result;
}

/**
 * Monthly emission rates by vehicle type.
 *
 * Excel: "Table 7: Emission rates of various vehicle types" table in the
 * "Library" sheet (G253:R288).
 */
export function calculateMonthlyEmissionRates(options: {
  selectedRegionsStatesVMTPercentages: SelectedRegionsStatesVMTPercentages | {};
  evDeploymentLocation: string;
  evModelYear: string;
  iceReplacementVehicle: string;
}) {
  const {
    selectedRegionsStatesVMTPercentages,
    evDeploymentLocation,
    evModelYear,
    iceReplacementVehicle,
  } = options;

  const result: {
    [month: number]: {
      [vehicleType in GeneralVehicleType]: {
        [pollutant in Pollutant]: number;
      };
    };
  } = {};

  if (evDeploymentLocation === '') return result;

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith('region-');
  const deploymentLocationIsState = evDeploymentLocation.startsWith('state-');

  // NOTE: explicitly declaring the type with a type assertion because
  // TypeScript isn't able to infer types from large JSON files
  // (https://github.com/microsoft/TypeScript/issues/42761)
  (movesEmissionsRates as MovesData[]).forEach((data) => {
    const month = Number(data.month);

    result[month] ??= {
      cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesDiesel: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesCNG: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesGasoline: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
      schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
    };

    const generalVehicleType: GeneralVehicleType | null =
      data.vehicleType === 'Passenger Car'
        ? 'cars'
        : data.vehicleType === 'Passenger Truck'
        ? 'trucks'
        : data.vehicleType === 'Transit Bus' && data.fuelType === 'Diesel'
        ? 'transitBusesDiesel'
        : data.vehicleType === 'Transit Bus' && data.fuelType === 'CNG'
        ? 'transitBusesCNG'
        : data.vehicleType === 'Transit Bus' && data.fuelType === 'Gasoline'
        ? 'transitBusesGasoline'
        : data.vehicleType === 'School Bus'
        ? 'schoolBuses'
        : null; // NOTE: fallback (generalVehicleType should never actually be null)

    const abridgedVehicleType: AbridgedVehicleType | null =
      data.vehicleType === 'Passenger Car'
        ? 'cars'
        : data.vehicleType === 'Passenger Truck'
        ? 'trucks'
        : data.vehicleType === 'Transit Bus'
        ? 'transitBuses'
        : data.vehicleType === 'School Bus'
        ? 'schoolBuses'
        : null; // NOTE: fallback (abridgedVehicleType should never actually be null)

    if (generalVehicleType && abridgedVehicleType) {
      const modelYearMatch =
        iceReplacementVehicle === 'new'
          ? data.modelYear === evModelYear
          : data.modelYear === 'Fleet Average';

      const conditionalYearMatch =
        iceReplacementVehicle === 'new'
          ? true //
          : data.year === evModelYear;

      const conditionalStateMatch = deploymentLocationIsState
        ? data.state === evDeploymentLocation.replace('state-', '')
        : true;

      const statesVMTPercentages =
        Object.keys(selectedRegionsStatesVMTPercentages).length !== 0
          ? (selectedRegionsStatesVMTPercentages as SelectedRegionsStatesVMTPercentages)
          : null;

      const movesRegionalWeightPercentage =
        statesVMTPercentages?.[data.state as StateId]?.[abridgedVehicleType] || 0; // prettier-ignore

      const locationFactor = deploymentLocationIsRegion
        ? movesRegionalWeightPercentage
        : 1; // location is state, so no MOVES regional weight factor is applied

      if (
        modelYearMatch &&
        conditionalYearMatch &&
        conditionalStateMatch &&
        statesVMTPercentages
      ) {
        result[month][generalVehicleType].CO2 += data.CO2 * locationFactor;
        result[month][generalVehicleType].NOX += data.NOX * locationFactor;
        result[month][generalVehicleType].SO2 += data.SO2 * locationFactor;
        result[month][generalVehicleType].PM25 += data.PM25 * locationFactor;
        result[month][generalVehicleType].VOCs += data.VOCs * locationFactor;
        result[month][generalVehicleType].NH3 += data.NH3 * locationFactor;
      }
    }
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
export function calculateMonthlyEmissionChanges(options: {
  monthlyVMTPerVehicleType: MonthlyVMTPerVehicleType;
  vehiclesDisplaced: VehiclesDisplaced;
  monthlyEmissionRates: MonthlyEmissionRates;
}) {
  const { monthlyVMTPerVehicleType, vehiclesDisplaced, monthlyEmissionRates } =
    options;

  const result: {
    [month: number]: {
      [vehicleType in ExpandedVehicleType]: {
        [pollutant in Pollutant]: number;
      };
    };
  } = {};

  if (
    Object.values(monthlyVMTPerVehicleType).length === 0 ||
    Object.values(monthlyEmissionRates).length === 0
  ) {
    return result;
  }

  Object.entries(monthlyEmissionRates).forEach(([key, data]) => {
    const month = Number(key);

    result[month] ??= {
      batteryEVCars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      hybridEVCars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      batteryEVTrucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      hybridEVTrucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesDiesel: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesCNG: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBusesGasoline: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }, // prettier-ignore
      schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
    };

    pollutants.forEach((pollutant) => {
      result[month].batteryEVCars[pollutant] =
        data.cars[pollutant] *
        monthlyVMTPerVehicleType[month].cars *
        vehiclesDisplaced.batteryEVCars;

      result[month].hybridEVCars[pollutant] =
        data.cars[pollutant] *
        monthlyVMTPerVehicleType[month].cars *
        vehiclesDisplaced.hybridEVCars *
        percentageHybridEVMilesDrivenOnElectricity;

      result[month].batteryEVTrucks[pollutant] =
        data.trucks[pollutant] *
        monthlyVMTPerVehicleType[month].trucks *
        vehiclesDisplaced.batteryEVTrucks;

      result[month].hybridEVTrucks[pollutant] =
        data.trucks[pollutant] *
        monthlyVMTPerVehicleType[month].trucks *
        vehiclesDisplaced.hybridEVTrucks *
        percentageHybridEVMilesDrivenOnElectricity;

      result[month].transitBusesDiesel[pollutant] =
        data.transitBusesDiesel[pollutant] *
        monthlyVMTPerVehicleType[month].transitBusesDiesel *
        vehiclesDisplaced.transitBusesDiesel;

      result[month].transitBusesCNG[pollutant] =
        data.transitBusesCNG[pollutant] *
        monthlyVMTPerVehicleType[month].transitBusesCNG *
        vehiclesDisplaced.transitBusesCNG;

      result[month].transitBusesGasoline[pollutant] =
        data.transitBusesGasoline[pollutant] *
        monthlyVMTPerVehicleType[month].transitBusesGasoline *
        vehiclesDisplaced.transitBusesGasoline;

      result[month].schoolBuses[pollutant] =
        data.schoolBuses[pollutant] *
        monthlyVMTPerVehicleType[month].schoolBuses *
        vehiclesDisplaced.schoolBuses;
    });
  });

  return result;
}

/**
 * Totals monthly emission changes from each EV type.
 *
 * Excel: Bottom half of the "Emission Changes" data from "Table 8: Calculated
 * changes for the transportation sector" table in the "Library" sheet
 * (F363:R392).
 */
export function calculateTotalMonthlyEmissionChanges(
  monthlyEmissionChanges: MonthlyEmissionChanges,
) {
  if (Object.values(monthlyEmissionChanges).length === 0) {
    return {};
  }

  const result = Object.entries(monthlyEmissionChanges).reduce(
    (totals, [key, data]) => {
      const month = Number(key);

      totals[month] ??= {
        cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        transitBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        total: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      };

      pollutants.forEach((pollutant) => {
        const monthlyCars =
          data.batteryEVCars[pollutant] + data.hybridEVCars[pollutant];
        const monthlyTrucks =
          data.batteryEVTrucks[pollutant] + data.hybridEVTrucks[pollutant];
        const monthlyTransitBuses =
          data.transitBusesDiesel[pollutant] +
          data.transitBusesCNG[pollutant] +
          data.transitBusesGasoline[pollutant];
        const monthlySchoolBuses = data.schoolBuses[pollutant];
        const monthlyTotal =
          monthlyCars +
          monthlyTrucks +
          monthlyTransitBuses +
          monthlySchoolBuses;

        totals[month].cars[pollutant] += monthlyCars;
        totals[month].trucks[pollutant] += monthlyTrucks;
        totals[month].transitBuses[pollutant] += monthlyTransitBuses;
        totals[month].schoolBuses[pollutant] += monthlySchoolBuses;
        totals[month].total[pollutant] += monthlyTotal;
      });

      return totals;
    },
    {} as {
      [month: number]: {
        [key in 'cars' | 'trucks' | 'transitBuses' | 'schoolBuses' | 'total']: {
          [pollutant in Pollutant]: number;
        };
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
export function calculateTotalYearlyEmissionChanges(
  totalMonthlyEmissionChanges: TotalMonthlyEmissionChanges,
) {
  if (Object.keys(totalMonthlyEmissionChanges).length === 0) {
    return {
      cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      total: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
    };
  }

  const result = Object.values(totalMonthlyEmissionChanges).reduce(
    (object, monthlyData) => {
      Object.entries(monthlyData).forEach(([key, value]) => {
        const field = key as keyof typeof monthlyData;

        pollutants.forEach((pollutant) => {
          object[field][pollutant] += value[pollutant];
        });
      });

      return object;
    },
    {
      cars: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      trucks: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      transitBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      schoolBuses: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
      total: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
    },
  );

  return result;
}

/**
 * Calculates vehicle emission changes at the county, state, and total levels
 * for the selected geography.
 *
 * Excel: County level data calculations in "From vehicles" column in the table
 * in the "11_VehicleCty" sheet (column H) – we just roll those county level
 * values up to the state, region, and total levels in this same function too,
 * as they're used at those aggregate levels as well.
 */
export function calculateVehicleEmissionChangesByGeography(options: {
  geographicFocus: GeographicFocus;
  selectedRegionId: RegionId | '';
  selectedStateId: StateId | '';
  countiesByGeography: CountiesByGeography | {};
  selectedGeographyRegionIds: RegionId[];
  vmtPerVehicleTypeByGeography: VMTPerVehicleTypeByGeography | {};
  totalYearlyEmissionChanges: TotalYearlyEmissionChanges;
  evDeploymentLocation: string;
}) {
  const {
    geographicFocus,
    selectedRegionId,
    selectedStateId,
    countiesByGeography,
    selectedGeographyRegionIds,
    vmtPerVehicleTypeByGeography,
    totalYearlyEmissionChanges,
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

  const regionSelected = geographicFocus === 'regions' && selectedRegionId !== ''; // prettier-ignore
  const stateSelected = geographicFocus === 'states' && selectedStateId !== '';

  const vmtData =
    Object.keys(vmtPerVehicleTypeByGeography).length !== 0
      ? (vmtPerVehicleTypeByGeography as VMTPerVehicleTypeByGeography)
      : null;

  const countiesByGeographyData =
    Object.keys(countiesByGeography).length !== 0
      ? (countiesByGeography as CountiesByGeography)
      : null;

  if (!countiesByGeographyData || !vmtData || evDeploymentLocation === '') {
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

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith('region-');
  const deploymentLocationIsState = evDeploymentLocation.startsWith('state-');
  const deploymentLocationStateId = evDeploymentLocation.replace('state-', '') as StateId; // prettier-ignore

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
      result.counties[stateId] ??= {};

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
          result.counties[stateId][county] ??= { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 }; // prettier-ignore

          if (
            deploymentLocationIsRegion ||
            (deploymentLocationIsState && deploymentLocationStateId === stateId)
          ) {
            pollutants.forEach((pollutant) => {
              // conditionally convert CO2 tons into pounds
              const unitFactor = pollutant === 'CO2' ? 2_000 : 1;

              const cars =
                (totalYearlyEmissionChanges.cars[pollutant] * countyVMT.cars) /
                locationVMT.cars /
                unitFactor;

              const trucks =
                (totalYearlyEmissionChanges.trucks[pollutant] *
                  countyVMT.trucks) /
                locationVMT.trucks /
                unitFactor;

              const transitBuses =
                (totalYearlyEmissionChanges.transitBuses[pollutant] *
                  countyVMT.transitBuses) /
                locationVMT.transitBuses /
                unitFactor;

              const schoolBuses =
                (totalYearlyEmissionChanges.schoolBuses[pollutant] *
                  countyVMT.schoolBuses) /
                locationVMT.schoolBuses /
                unitFactor;

              const emissionChanges =
                -cars - trucks - transitBuses - schoolBuses;

              result.total[pollutant] += emissionChanges;
              result.regions[regionId][pollutant] += emissionChanges;
              result.states[stateId][pollutant] += emissionChanges;
              result.counties[stateId][county][pollutant] = emissionChanges;
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
  geographicFocus: GeographicFocus;
  selectedRegionName: string;
  evDeploymentLocations: string[];
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | {};
}) {
  const {
    geographicFocus,
    selectedRegionName,
    evDeploymentLocations,
    vmtAllocationPerVehicle,
  } = options;

  const result: {
    [locationId: string]: {
      lightDutyVehicles: { sales: number; stock: number };
      transitBuses: { sales: number; stock: number };
      schoolBuses: { sales: number; stock: number };
    };
  } = {};

  const vmtAllocationData =
    Object.keys(vmtAllocationPerVehicle).length !== 0
      ? (vmtAllocationPerVehicle as VMTAllocationPerVehicle)
      : null;

  if (evDeploymentLocations[0] === '' || !vmtAllocationData) {
    return result;
  }

  // conditionally remove 'region-' option, as it will be added later as the sum
  // of each state's data
  const stateIds = evDeploymentLocations.reduce((ids, id) => {
    return id.startsWith('region-') ? ids : ids.concat(id);
  }, [] as string[]);

  countyFips.forEach((data) => {
    const id = data['Postal State Code'];
    const stateId = `state-${id}`;

    const conditionalRegionMatch =
      geographicFocus === 'regions'
        ? data['AVERT Region'] === selectedRegionName
        : true;

    if (conditionalRegionMatch && stateIds.includes(stateId)) {
      const lightDutyVehiclesVMTShare = data['Share of State VMT - Passenger Cars'] || 0; // prettier-ignore
      const transitBusesVMTShare = data['Share of State VMT - Transit Buses'] || 0; // prettier-ignore
      const schoolBusesVMTShare = data['Share of State VMT - School Buses'] || 0; // prettier-ignore

      const lightDutyVehiclesSales =
        stateLightDutyVehiclesSales[id as LightDutyVehiclesSalesStateId];

      const lightDutyVehiclesStock =
        vmtAllocationData[id as StateId].registeredLDVs * 1_000_000;

      const busSalesAndStock =
        stateBusSalesAndStock[id as BusSalesAndStockStateId];

      // initialize and then increment state data by vehicle type
      result[stateId] ??= {
        lightDutyVehicles: { sales: 0, stock: 0 },
        transitBuses: { sales: 0, stock: 0 },
        schoolBuses: { sales: 0, stock: 0 },
      };

      result[stateId].lightDutyVehicles.sales +=
        lightDutyVehiclesVMTShare * lightDutyVehiclesSales;

      result[stateId].lightDutyVehicles.stock +=
        lightDutyVehiclesVMTShare * lightDutyVehiclesStock;

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

  // conditionally add 'region-' to result as the sum of each state's data
  const resultStateIds = Object.keys(result);
  const regionId = evDeploymentLocations.find((id) => id.startsWith('region-'));

  if (regionId) {
    result[regionId] = {
      lightDutyVehicles: { sales: 0, stock: 0 },
      transitBuses: { sales: 0, stock: 0 },
      schoolBuses: { sales: 0, stock: 0 },
    };

    resultStateIds.forEach((id) => {
      result[regionId].lightDutyVehicles.sales += result[id].lightDutyVehicles.sales; // prettier-ignore
      result[regionId].lightDutyVehicles.stock += result[id].lightDutyVehicles.stock; // prettier-ignore
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
  selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
  evDeploymentLocation: string;
  regionalLineLoss: number;
  selectedRegionId: RegionId | '';
}) {
  const {
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

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith('region-');
  const deploymentLocationStateId = evDeploymentLocation.replace('state-', '') as StateId; // prettier-ignore

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
