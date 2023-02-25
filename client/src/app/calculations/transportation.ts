import { RegionalLoadData } from 'app/redux/reducers/geography';
import type { GeographicFocus } from 'app/redux/reducers/geography';
import type {
  CountiesByGeography,
  RegionalScalingFactors,
  SelectedGeographyRegions,
} from 'app/calculations/geography';
import { sortObjectByKeys } from 'app/calculations/utilities';
import type {
  CountyFips,
  MovesEmissionsRates,
  VMTAllocationAndRegisteredVehicles,
  EVChargingProfiles,
  NationalAverageVMTPerYear,
  EVEfficiencyByModelYear,
  RegionAverageTemperatures,
  StateLightDutyVehiclesSales,
  StateBusSalesAndStock,
  RegionId,
  StateId,
} from 'app/config';
import { regions, states } from 'app/config';
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

export type VMTTotalsByGeography = ReturnType<
  typeof calculateVMTTotalsByGeography
>;
export type VMTBillionsAndPercentages = ReturnType<
  typeof calculateVMTBillionsAndPercentages
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
export type SelectedRegionsMonthlyVMTPerVehicleType = ReturnType<
  typeof calculateSelectedRegionsMonthlyVMTPerVehicleType
>;
export type SelectedRegionsEVEfficiencyPerVehicleType = ReturnType<
  typeof calculateSelectedRegionsEVEfficiencyPerVehicleType
>;
export type DailyStats = ReturnType<typeof calculateDailyStats>;
export type MonthlyStats = ReturnType<typeof calculateMonthlyStats>;
export type VehiclesDisplaced = ReturnType<typeof calculateVehiclesDisplaced>;
export type SelectedRegionsMonthlyEVEnergyUsageGW = ReturnType<
  typeof calculateSelectedRegionsMonthlyEVEnergyUsageGW
>;
export type SelectedRegionsMonthlyEVEnergyUsageMW = ReturnType<
  typeof calculateSelectedRegionsMonthlyEVEnergyUsageMW
>;
export type SelectedRegionsMonthlyDailyEVEnergyUsage = ReturnType<
  typeof calculateSelectedRegionsMonthlyDailyEVEnergyUsage
>;
export type SelectedRegionsMonthlyEmissionRates = ReturnType<
  typeof calculateSelectedRegionsMonthlyEmissionRates
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
  countyFips: CountyFips;
}) {
  const { countyFips } = options;

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
export function calculateVMTBillionsAndPercentages(options: {
  countyFips: CountyFips;
}) {
  const { countyFips } = options;

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
export function calculateVMTAllocationPerVehicle(options: {
  vmtAllocationAndRegisteredVehicles: VMTAllocationAndRegisteredVehicles;
  stateBusSalesAndStock: StateBusSalesAndStock;
}) {
  const { vmtAllocationAndRegisteredVehicles, stateBusSalesAndStock } = options;

  // initialize result object with state keys and total key
  const result = Object.entries(vmtAllocationAndRegisteredVehicles).reduce(
    (object, [key, data]) => {
      const {
        annualVMTLightDutyVehicles,
        annualVMTBuses,
        registeredLightDutyVehicles,
      } = data;

      const busSalesAndStock =
        stateBusSalesAndStock[key as keyof StateBusSalesAndStock];

      if (busSalesAndStock) {
        const millionRegisteredBuses =
          (busSalesAndStock.transitBuses.stock +
            busSalesAndStock.schoolBuses.stock) /
          1_000_000;

        object[key as StateId] = {
          millionVmtLDVs: annualVMTLightDutyVehicles,
          millionVmtBuses: annualVMTBuses,
          millionRegisteredLDVs: registeredLightDutyVehicles,
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
      [stateId in StateId | 'total']: {
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
    if (key !== 'total') {
      result.total.millionVmtLDVs += data.millionVmtLDVs;
      result.total.millionVmtBuses += data.millionVmtBuses;
      result.total.millionRegisteredLDVs += data.millionRegisteredLDVs;
      result.total.millionRegisteredBuses += data.millionRegisteredBuses;
    }
  });

  // calculate vmt per vehicle totals for each state or totals object
  Object.keys(result).forEach((key) => {
    const item = result[key as StateId | 'total'];
    item.vmtPerLDV.total = item.millionVmtLDVs / item.millionRegisteredLDVs;
    item.vmtPerBus.total = item.millionVmtBuses / item.millionRegisteredBuses;
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
export function calculateMonthlyVMTTotalsAndPercentages(options: {
  movesEmissionsRates: MovesEmissionsRates;
}) {
  const { movesEmissionsRates } = options;

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

  movesEmissionsRates.forEach((data) => {
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
  selectedGeographyRegionIds: RegionId[];
  vmtBillionsAndPercentages: VMTBillionsAndPercentages | {};
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

      if (stateId === 'regionTotals') return object;

      const stateRegionIds = Object.keys(stateValue); // NOTE: also includes 'allRegions' key
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
export function calculateSelectedRegionsVMTPercentagesPerVehicleType(options: {
  selectedRegionsStatesVMTPercentages: SelectedRegionsStatesVMTPercentages | {};
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | {};
}) {
  const { selectedRegionsStatesVMTPercentages, vmtAllocationPerVehicle } =
    options;

  const selectedRegionsVMTData =
    Object.keys(selectedRegionsStatesVMTPercentages).length !== 0
      ? (selectedRegionsStatesVMTPercentages as SelectedRegionsStatesVMTPercentages)
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
export function calculateSelectedRegionsAverageVMTPerYear(options: {
  nationalAverageVMTPerYear: NationalAverageVMTPerYear;
  selectedRegionsVMTPercentagesPerVehicleType: SelectedRegionsVMTPercentagesPerVehicleType | {}; // prettier-ignore
}) {
  const {
    nationalAverageVMTPerYear,
    selectedRegionsVMTPercentagesPerVehicleType,
  } = options;

  const selectedRegionsVMTData =
    Object.keys(selectedRegionsVMTPercentagesPerVehicleType).length !== 0
      ? (selectedRegionsVMTPercentagesPerVehicleType as SelectedRegionsVMTPercentagesPerVehicleType)
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
export function calculateSelectedRegionsMonthlyVMTPerVehicleType(options: {
  selectedRegionsAverageVMTPerYear: SelectedRegionsAverageVMTPerYear | {};
  monthlyVMTTotalsAndPercentages: MonthlyVMTTotalsAndPercentages;
}) {
  const { selectedRegionsAverageVMTPerYear, monthlyVMTTotalsAndPercentages } =
    options;

  const selectedRegionsVMTData =
    Object.keys(selectedRegionsAverageVMTPerYear).length !== 0
      ? (selectedRegionsAverageVMTPerYear as SelectedRegionsAverageVMTPerYear)
      : null;

  if (
    !selectedRegionsVMTData ||
    Object.keys(monthlyVMTTotalsAndPercentages).length === 0
  ) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleType in GeneralVehicleType]: number;
        };
      };
    };
  }

  const result = Object.entries(selectedRegionsVMTData).reduce(
    (object, [regionKey, regionValue]) => {
      const regionId = regionKey as keyof typeof selectedRegionsVMTData;

      object[regionId] ??= {};

      Object.entries(monthlyVMTTotalsAndPercentages).forEach(
        ([vmtKey, vmtValue]) => {
          const month = Number(vmtKey);

          object[regionId][month] ??= {
            cars: 0,
            trucks: 0,
            transitBusesDiesel: 0,
            transitBusesCNG: 0,
            transitBusesGasoline: 0,
            schoolBuses: 0,
          };

          generalVehicleTypes.forEach((vehicleType) => {
            /**
             * NOTE: selectedRegionsVMTData's regions's vehicle types are
             * abridged (don't include transit buses broken out by fuel type)
             */
            const averageVMTPerYearVehicleType =
              vehicleType === 'transitBusesDiesel' ||
              vehicleType === 'transitBusesCNG' ||
              vehicleType === 'transitBusesGasoline'
                ? 'transitBuses'
                : vehicleType;

            object[regionId][month][vehicleType] =
              regionValue[averageVMTPerYearVehicleType] *
              vmtValue[vehicleType].percent;
          });
        },
      );

      return object;
    },
    {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleType in GeneralVehicleType]: number;
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
export function calculateSelectedRegionsEVEfficiencyPerVehicleType(options: {
  evEfficiencyByModelYear: EVEfficiencyByModelYear;
  regionAverageTemperatures: RegionAverageTemperatures;
  selectedGeographyRegionIds: RegionId[];
  evModelYear: string;
}) {
  const {
    evEfficiencyByModelYear,
    regionAverageTemperatures,
    selectedGeographyRegionIds,
    evModelYear,
  } = options;

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

        if (object[regionId].hasOwnProperty(vehicleType)) {
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
export function calculateSelectedRegionsMonthlyEVEnergyUsageGW(options: {
  selectedRegionsMonthlyVMTPerVehicleType: SelectedRegionsMonthlyVMTPerVehicleType | {}; // prettier-ignore
  selectedRegionsEVEfficiencyPerVehicleType: SelectedRegionsEVEfficiencyPerVehicleType | {}; // prettier-ignore
  vehiclesDisplaced: VehiclesDisplaced;
}) {
  const {
    selectedRegionsMonthlyVMTPerVehicleType,
    selectedRegionsEVEfficiencyPerVehicleType,
    vehiclesDisplaced,
  } = options;

  const result = {} as {
    [regionId in RegionId]: {
      [month: number]: {
        [vehicleType in ExpandedVehicleType]: number;
      };
    };
  };

  const selectedRegionsVMTData =
    Object.keys(selectedRegionsMonthlyVMTPerVehicleType).length !== 0
      ? (selectedRegionsMonthlyVMTPerVehicleType as SelectedRegionsMonthlyVMTPerVehicleType)
      : null;

  const selectedRegionsEfficiencyData =
    Object.keys(selectedRegionsEVEfficiencyPerVehicleType).length !== 0
      ? (selectedRegionsEVEfficiencyPerVehicleType as SelectedRegionsEVEfficiencyPerVehicleType)
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
              vehiclesDisplaced.batteryEVCars *
              monthlyVmt.cars *
              regionEVEfficiency.batteryEVCars *
              KWtoGW,
            hybridEVCars:
              vehiclesDisplaced.hybridEVCars *
              monthlyVmt.cars *
              regionEVEfficiency.hybridEVCars *
              KWtoGW *
              percentageHybridEVMilesDrivenOnElectricity,
            batteryEVTrucks:
              vehiclesDisplaced.batteryEVTrucks *
              monthlyVmt.trucks *
              regionEVEfficiency.batteryEVTrucks *
              KWtoGW,
            hybridEVTrucks:
              vehiclesDisplaced.hybridEVTrucks *
              monthlyVmt.trucks *
              regionEVEfficiency.hybridEVTrucks *
              KWtoGW *
              percentageHybridEVMilesDrivenOnElectricity,
            transitBusesDiesel:
              vehiclesDisplaced.transitBusesDiesel *
              monthlyVmt.transitBusesDiesel *
              regionEVEfficiency.transitBuses *
              KWtoGW,
            transitBusesCNG:
              vehiclesDisplaced.transitBusesCNG *
              monthlyVmt.transitBusesCNG *
              regionEVEfficiency.transitBuses *
              KWtoGW,
            transitBusesGasoline:
              vehiclesDisplaced.transitBusesGasoline *
              monthlyVmt.transitBusesGasoline *
              regionEVEfficiency.transitBuses *
              KWtoGW,
            schoolBuses:
              vehiclesDisplaced.schoolBuses *
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
  selectedRegionsMonthlyEVEnergyUsageGW: SelectedRegionsMonthlyEVEnergyUsageGW | {}; // prettier-ignore
}) {
  const { selectedRegionsMonthlyEVEnergyUsageGW } = options;

  const selectedRegionsEnergyData =
    Object.keys(selectedRegionsMonthlyEVEnergyUsageGW).length !== 0
      ? (selectedRegionsMonthlyEVEnergyUsageGW as SelectedRegionsMonthlyEVEnergyUsageGW)
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
  selectedRegionsMonthlyEVEnergyUsageGW: SelectedRegionsMonthlyEVEnergyUsageGW | {}; // prettier-ignore
}) {
  const { selectedRegionsMonthlyEVEnergyUsageGW } = options;

  const selectedRegionsEnergyData =
    Object.keys(selectedRegionsMonthlyEVEnergyUsageGW).length !== 0
      ? (selectedRegionsMonthlyEVEnergyUsageGW as SelectedRegionsMonthlyEVEnergyUsageGW)
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
  selectedRegionsMonthlyEVEnergyUsageMW: SelectedRegionsMonthlyEVEnergyUsageMW | {}; // prettier-ignore
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
export function calculateSelectedRegionsMonthlyEmissionRates(options: {
  movesEmissionsRates: MovesEmissionsRates;
  selectedRegionsStatesVMTPercentages: SelectedRegionsStatesVMTPercentages | {};
  evDeploymentLocation: string;
  evModelYear: string;
  iceReplacementVehicle: string;
}) {
  const {
    movesEmissionsRates,
    selectedRegionsStatesVMTPercentages,
    evDeploymentLocation,
    evModelYear,
    iceReplacementVehicle,
  } = options;

  const result = {} as {
    [regionId in RegionId]: {
      [month: number]: {
        [vehicleType in GeneralVehicleType]: {
          [pollutant in Pollutant]: number;
        };
      };
    };
  };

  const selectedRegionsVMTData =
    Object.keys(selectedRegionsStatesVMTPercentages).length !== 0
      ? (selectedRegionsStatesVMTPercentages as SelectedRegionsStatesVMTPercentages)
      : null;

  if (!selectedRegionsVMTData || evDeploymentLocation === '') {
    return result;
  }

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith('region-');
  const deploymentLocationIsState = evDeploymentLocation.startsWith('state-');

  movesEmissionsRates.forEach((data) => {
    const month = Number(data.month);

    Object.entries(selectedRegionsVMTData).forEach(
      ([regionKey, regionValue]) => {
        const regionId = regionKey as keyof typeof selectedRegionsVMTData;

        result[regionId] ??= {} as {
          [month: number]: {
            [vehicleType in GeneralVehicleType]: {
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
  selectedRegionsMonthlyVMTPerVehicleType: SelectedRegionsMonthlyVMTPerVehicleType | {}; // prettier-ignore
  vehiclesDisplaced: VehiclesDisplaced;
  selectedRegionsMonthlyEmissionRates: SelectedRegionsMonthlyEmissionRates | {};
}) {
  const {
    selectedRegionsMonthlyVMTPerVehicleType,
    vehiclesDisplaced,
    selectedRegionsMonthlyEmissionRates,
  } = options;

  const selectedRegionsVMTData =
    Object.keys(selectedRegionsMonthlyVMTPerVehicleType).length !== 0
      ? (selectedRegionsMonthlyVMTPerVehicleType as SelectedRegionsMonthlyVMTPerVehicleType)
      : null;

  const selectedRegionsRatesData =
    Object.keys(selectedRegionsMonthlyEmissionRates).length !== 0
      ? (selectedRegionsMonthlyEmissionRates as SelectedRegionsMonthlyEmissionRates)
      : null;

  if (!selectedRegionsVMTData || !selectedRegionsRatesData) {
    return {} as {
      [regionId in RegionId]: {
        [month: number]: {
          [vehicleType in ExpandedVehicleType]: {
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
                    regionRatesMonthValue.cars[pollutant] *
                    regionVMTValue[month].cars *
                    vehiclesDisplaced.batteryEVCars;

                  object[regionId][month].hybridEVCars[pollutant] =
                    regionRatesMonthValue.cars[pollutant] *
                    regionVMTValue[month].cars *
                    vehiclesDisplaced.hybridEVCars *
                    percentageHybridEVMilesDrivenOnElectricity;

                  object[regionId][month].batteryEVTrucks[pollutant] =
                    regionRatesMonthValue.trucks[pollutant] *
                    regionVMTValue[month].trucks *
                    vehiclesDisplaced.batteryEVTrucks;

                  object[regionId][month].hybridEVTrucks[pollutant] =
                    regionRatesMonthValue.trucks[pollutant] *
                    regionVMTValue[month].trucks *
                    vehiclesDisplaced.hybridEVTrucks *
                    percentageHybridEVMilesDrivenOnElectricity;

                  object[regionId][month].transitBusesDiesel[pollutant] =
                    regionRatesMonthValue.transitBusesDiesel[pollutant] *
                    regionVMTValue[month].transitBusesDiesel *
                    vehiclesDisplaced.transitBusesDiesel;

                  object[regionId][month].transitBusesCNG[pollutant] =
                    regionRatesMonthValue.transitBusesCNG[pollutant] *
                    regionVMTValue[month].transitBusesCNG *
                    vehiclesDisplaced.transitBusesCNG;

                  object[regionId][month].transitBusesGasoline[pollutant] =
                    regionRatesMonthValue.transitBusesGasoline[pollutant] *
                    regionVMTValue[month].transitBusesGasoline *
                    vehiclesDisplaced.transitBusesGasoline;

                  object[regionId][month].schoolBuses[pollutant] =
                    regionRatesMonthValue.schoolBuses[pollutant] *
                    regionVMTValue[month].schoolBuses *
                    vehiclesDisplaced.schoolBuses;
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
          [vehicleType in ExpandedVehicleType]: {
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
  selectedRegionsMonthlyEmissionChanges: SelectedRegionsMonthlyEmissionChanges | {}; // prettier-ignore
}) {
  const { selectedRegionsMonthlyEmissionChanges } = options;

  type MonthlyData = {
    [key in 'cars' | 'trucks' | 'transitBuses' | 'schoolBuses' | 'total']: {
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
  selectedRegionsTotalMonthlyEmissionChanges: SelectedRegionsTotalMonthlyEmissionChanges | {}; // prettier-ignore
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
  vmtTotalsByGeography: VMTTotalsByGeography | {};
  selectedRegionsTotalYearlyEmissionChanges: SelectedRegionsTotalYearlyEmissionChanges | {}; // prettier-ignore
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

  const regionSelected = geographicFocus === 'regions' && selectedRegionId !== ''; // prettier-ignore
  const stateSelected = geographicFocus === 'states' && selectedStateId !== '';

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
    evDeploymentLocation === ''
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
                const unitFactor = pollutant === 'CO2' ? 2_000 : 1;

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
  countyFips: CountyFips;
  stateLightDutyVehiclesSales: StateLightDutyVehiclesSales;
  stateBusSalesAndStock: StateBusSalesAndStock;
  geographicFocus: GeographicFocus;
  selectedRegionName: string;
  evDeploymentLocations: string[];
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | {};
}) {
  const {
    countyFips,
    stateLightDutyVehiclesSales,
    stateBusSalesAndStock,
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
        stateLightDutyVehiclesSales[id as keyof StateLightDutyVehiclesSales];

      const lightDutyVehiclesStock =
        vmtAllocationData[id as StateId].millionRegisteredLDVs * 1_000_000;

      const busSalesAndStock =
        stateBusSalesAndStock[id as keyof StateBusSalesAndStock];

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
