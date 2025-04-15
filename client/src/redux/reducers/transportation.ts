import { type AppThunk } from "@/redux/index";
import { getSelectedGeographyRegions } from "@/calculations/geography";
import {
  type VMTTotalsByGeography,
  type VMTBillionsAndPercentages,
  type StateVMTPercentagesByRegion,
  type VMTAllocationPerVehicle,
  type VMTTotalsByStateRegionCombo,
  type VMTTotalsByRegion,
  type VMTPercentagesByStateRegionCombo,
  type VMTandStockByState,
  type LDVsFhwaMovesVMTRatioByState,
  type VMTPerVehicleTypeByState,
  type NationalAverageLDVsVMTPerYear,
  type MonthlyVMTTotals,
  type YearlyVMTTotals,
  type MonthlyVMTPercentages,
  type HourlyEVChargingPercentages,
  type SelectedRegionsStatesVMTPercentages,
  type SelectedRegionsVMTPercentagesPerVehicleType,
  type SelectedRegionsAverageVMTPerYear,
  type SelectedRegionsMonthlyVMTPerVehicleType,
  type SelectedRegionsEVEfficiencyPerVehicleType,
  type DailyStats,
  type MonthlyStats,
  type VehiclesDisplaced,
  type SelectedRegionsMonthlyEVEnergyUsageGW,
  type SelectedRegionsMonthlyEVEnergyUsageMW,
  type SelectedRegionsTotalYearlyEVEnergyUsage,
  type SelectedRegionsMonthlyDailyEVEnergyUsage,
  type SelectedRegionsMonthlyEmissionRates,
  type SelectedRegionsMonthlyEmissionChanges,
  type SelectedRegionsTotalMonthlyEmissionChanges,
  type SelectedRegionsTotalYearlyEmissionChanges,
  type VehicleEmissionChangesByGeography,
  type VehicleSalesAndStock,
  type SelectedRegionsEEREDefaultsAverages,
  type EVDeploymentLocationHistoricalEERE,
  calculateVMTTotalsByGeography,
  calculateVMTBillionsAndPercentages,
  calculateStateVMTPercentagesByRegion,
  calculateVMTAllocationPerVehicle,
  calculateVMTTotalsByStateRegionCombo,
  calculateVMTTotalsByRegion,
  calculateVMTPercentagesByStateRegionCombo,
  storeVMTandStockByState,
  calculateLDVsFhwaMovesVMTRatioByState,
  calculateVMTPerVehicleTypeByState,
  calculateNationalAverageLDVsVMTPerYear,
  calculateMonthlyVMTTotals,
  calculateYearlyVMTTotals,
  calculateMonthlyVMTPercentages,
  calculateHourlyEVChargingPercentages,
  calculateSelectedRegionsStatesVMTPercentages,
  calculateSelectedRegionsVMTPercentagesPerVehicleType,
  calculateSelectedRegionsAverageVMTPerYear,
  calculateSelectedRegionsMonthlyVMTPerVehicleType,
  calculateSelectedRegionsEVEfficiencyPerVehicleType,
  calculateDailyStats,
  calculateMonthlyStats,
  calculateVehiclesDisplaced,
  calculateSelectedRegionsMonthlyEVEnergyUsageGW,
  calculateSelectedRegionsMonthlyEVEnergyUsageMW,
  calculateSelectedRegionsTotalYearlyEVEnergyUsage,
  calculateSelectedRegionsMonthlyDailyEVEnergyUsage,
  calculateSelectedRegionsMonthlyEmissionRates,
  calculateSelectedRegionsMonthlyEmissionChanges,
  calculateSelectedRegionsTotalMonthlyEmissionChanges,
  calculateSelectedRegionsTotalYearlyEmissionChanges,
  calculateVehicleEmissionChangesByGeography,
  calculateVehicleSalesAndStock,
  calculateSelectedRegionsEEREDefaultsAverages,
  calculateEVDeploymentLocationHistoricalEERE,
} from "@/calculations/transportation";
import { type EmptyObject } from "@/utilities";
import {
  type CountyFIPS,
  type MOVESEmissionRates,
  type RegionId,
} from "@/config";
/**
 * Excel: "CountyFIPS" sheet.
 */
import countyFipsData from "@/data/county-fips.json";
/**
 * Excel: "A. State-level VMT per vehicle" table in the "MOVESsupplement" sheet
 * (B6:E720).
 */
import stateLevelVMT from "@/data/state-level-vmt.json";
/**
 * Excel: "C. FHWA LDV State-Level VMT" table in the "MOVESsupplement" sheet
 * (O6:P57).
 */
import fhwaLDVStateLevelVMT from "@/data/fhwa-ldv-state-level-vmt.json";

/**
 * Work around due to TypeScript inability to infer types from large JSON files.
 */
const countyFips = countyFipsData as CountyFIPS;
/**
 * Excel: Second table in the "RegionStateAllocate" sheet (B118:E167)
 */
import vmtAllocationAndRegisteredVehicles from "@/data/vmt-allocation-and-registered-vehicles.json";
/**
 * Excel: "MOVESEmissionRates" sheet.
 */
import movesEmissionRatesData from "@/data/moves-emission-rates.json";
/**
 * Excel: "Table B. View charging profiles or set a manual charging profile
 * for Weekdays" table in the "EV_Detail" sheet (C23:H47), which comes from
 * "Table 9: Default EV load profiles and related values from EVI-Pro Lite"
 * table in the "Library" sheet).
 */
import evChargingProfiles from "@/data/ev-charging-profiles-hourly-data.json";
/**
 * Excel: "Table 5: EV efficiency assumptions" table in the "Library" sheet
 * (E194:J200).
 */
import evEfficiencyByModelYear from "@/data/ev-efficiency-by-model-year.json";
/**
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet (B432:C445)
 */
import regionAverageTemperatures from "@/data/region-average-temperature.json";
/**
 * Excel: "Table 11: LDV Sales and Stock" table in the "Library" sheet
 * (B485:C535).
 */
import stateLDVsSales from "@/data/state-light-duty-vehicles-sales.json";
/**
 * Excel: "Table 12: Transit and School Bus Sales and Stock" table in the
 * "Library" sheet (B546:F596).
 */
import stateBusSalesAndStock from "@/data/state-bus-sales-and-stock.json";
/**
 * Excel: "Table 13: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B606:E619).
 */
import regionEereAverages from "@/data/region-eere-averages.json";
/**
 * Excel: "Table 13: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B626:E674).
 */
import stateEereAverages from "@/data/state-eere-averages.json";

/**
 * Work around due to TypeScript inability to infer types from large JSON files.
 */
const movesEmissionRates = movesEmissionRatesData as MOVESEmissionRates;

type Action =
  | {
      type: "transportation/SET_VMT_TOTALS_BY_GEOGRAPHY";
      payload: { vmtTotalsByGeography: VMTTotalsByGeography };
    }
  | {
      type: "transportation/SET_VMT_BILLIONS_AND_PERCENTAGES";
      payload: {
        vmtBillionsAndPercentages: VMTBillionsAndPercentages;
      };
    }
  | {
      type: "transportation/SET_STATE_VMT_PERCENTAGES_BY_REGION";
      payload: {
        stateVMTPercentagesByRegion: StateVMTPercentagesByRegion;
      };
    }
  | {
      type: "transportation/SET_VMT_ALLOCATION_PER_VEHICLE";
      payload: { vmtAllocationPerVehicle: VMTAllocationPerVehicle };
    }
  | {
      type: "transportation/SET_VMT_TOTALS_BY_STATE_REGION_COMBO";
      payload: { vmtTotalsByStateRegionCombo: VMTTotalsByStateRegionCombo };
    }
  | {
      type: "transportation/SET_VMT_TOTALS_BY_REGION";
      payload: { vmtTotalsByRegion: VMTTotalsByRegion };
    }
  | {
      type: "transportation/SET_VMT_PERCENTAGES_BY_STATE_REGION_COMBO";
      payload: {
        vmtPercentagesByStateRegionCombo: VMTTotalsByStateRegionCombo;
      };
    }
  | {
      type: "transportation/SET_VMT_AND_STOCK_BY_STATE";
      payload: {
        vmtAndStockByState: VMTandStockByState;
      };
    }
  | {
      type: "transportation/SET_LDVS_FHWA_MOVES_VMT_RATIO_BY_STATE";
      payload: {
        ldvsFhwaMovesVMTRatioByState: LDVsFhwaMovesVMTRatioByState;
      };
    }
  | {
      type: "transportation/SET_VMT_PER_VEHICLE_TYPE_BY_STATE";
      payload: {
        vmtPerVehicleTypeByState: VMTPerVehicleTypeByState;
      };
    }
  | {
      type: "transportation/SET_NATIONAL_AVERAGE_LDVS_VMT_PER_YEAR";
      payload: { nationalAverageLDVsVMTPerYear: NationalAverageLDVsVMTPerYear };
    }
  | {
      type: "transportation/SET_MONTHLY_VMT_TOTALS";
      payload: {
        monthlyVMTTotals: MonthlyVMTTotals;
      };
    }
  | {
      type: "transportation/SET_YEARLY_VMT_TOTALS";
      payload: {
        yearlyVMTTotals: YearlyVMTTotals;
      };
    }
  | {
      type: "transportation/SET_MONTHLY_VMT_PERCENTAGES";
      payload: {
        monthlyVMTPercentages: MonthlyVMTPercentages;
      };
    }
  | {
      type: "transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES";
      payload: { hourlyEVChargingPercentages: HourlyEVChargingPercentages };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES";
      payload: {
        selectedRegionsStatesVMTPercentages: SelectedRegionsStatesVMTPercentages;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE";
      payload: {
        selectedRegionsVMTPercentagesPerVehicleType: SelectedRegionsVMTPercentagesPerVehicleType;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR";
      payload: {
        selectedRegionsAverageVMTPerYear: SelectedRegionsAverageVMTPerYear;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE";
      payload: {
        selectedRegionsMonthlyVMTPerVehicleType: SelectedRegionsMonthlyVMTPerVehicleType;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_EV_EFFICIENCY_PER_VEHICLE_TYPE";
      payload: {
        selectedRegionsEVEfficiencyPerVehicleType: SelectedRegionsEVEfficiencyPerVehicleType;
      };
    }
  | {
      type: "transportation/SET_DAILY_STATS";
      payload: { dailyStats: DailyStats };
    }
  | {
      type: "transportation/SET_MONTHLY_STATS";
      payload: { monthlyStats: MonthlyStats };
    }
  | {
      type: "transportation/SET_VEHICLES_DISPLACED";
      payload: { vehiclesDisplaced: VehiclesDisplaced };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW";
      payload: {
        selectedRegionsMonthlyEVEnergyUsageGW: SelectedRegionsMonthlyEVEnergyUsageGW;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_MW";
      payload: {
        selectedRegionsMonthlyEVEnergyUsageMW: SelectedRegionsMonthlyEVEnergyUsageMW;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE";
      payload: {
        selectedRegionsTotalYearlyEVEnergyUsage: SelectedRegionsTotalYearlyEVEnergyUsage;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_EV_ENERGY_USAGE";
      payload: {
        selectedRegionsMonthlyDailyEVEnergyUsage: SelectedRegionsMonthlyDailyEVEnergyUsage;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES";
      payload: {
        selectedRegionsMonthlyEmissionRates: SelectedRegionsMonthlyEmissionRates;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES";
      payload: {
        selectedRegionsMonthlyEmissionChanges: SelectedRegionsMonthlyEmissionChanges;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES";
      payload: {
        selectedRegionsTotalMonthlyEmissionChanges: SelectedRegionsTotalMonthlyEmissionChanges;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES";
      payload: {
        selectedRegionsTotalYearlyEmissionChanges: SelectedRegionsTotalYearlyEmissionChanges;
      };
    }
  | {
      type: "transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY";
      payload: {
        vehicleEmissionChangesByGeography: VehicleEmissionChangesByGeography;
      };
    }
  | {
      type: "transportation/SET_VEHICLE_SALES_AND_STOCK";
      payload: { vehicleSalesAndStock: VehicleSalesAndStock };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_EERE_DEFAULTS_AVERAGES";
      payload: {
        selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
      };
    }
  | {
      type: "transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE";
      payload: {
        evDeploymentLocationHistoricalEERE: EVDeploymentLocationHistoricalEERE;
      };
    };

type State = {
  vmtTotalsByGeography: VMTTotalsByGeography | EmptyObject;
  vmtBillionsAndPercentages: VMTBillionsAndPercentages | EmptyObject;
  stateVMTPercentagesByRegion: StateVMTPercentagesByRegion | EmptyObject;
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | EmptyObject;
  vmtTotalsByStateRegionCombo: VMTTotalsByStateRegionCombo | EmptyObject;
  vmtTotalsByRegion: VMTTotalsByRegion | EmptyObject;
  vmtPercentagesByStateRegionCombo:
    | VMTPercentagesByStateRegionCombo
    | EmptyObject;
  vmtAndStockByState: VMTandStockByState | EmptyObject;
  ldvsFhwaMovesVMTRatioByState: LDVsFhwaMovesVMTRatioByState | EmptyObject;
  vmtPerVehicleTypeByState: VMTPerVehicleTypeByState | EmptyObject;
  nationalAverageLDVsVMTPerYear: NationalAverageLDVsVMTPerYear;
  monthlyVMTTotals: MonthlyVMTTotals;
  yearlyVMTTotals: YearlyVMTTotals | EmptyObject;
  monthlyVMTPercentages: MonthlyVMTPercentages;
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  selectedRegionsStatesVMTPercentages:
    | SelectedRegionsStatesVMTPercentages
    | EmptyObject;
  selectedRegionsVMTPercentagesPerVehicleType:
    | SelectedRegionsVMTPercentagesPerVehicleType
    | EmptyObject;
  selectedRegionsAverageVMTPerYear:
    | SelectedRegionsAverageVMTPerYear
    | EmptyObject;
  selectedRegionsMonthlyVMTPerVehicleType:
    | SelectedRegionsMonthlyVMTPerVehicleType
    | EmptyObject;
  selectedRegionsEVEfficiencyPerVehicleType:
    | SelectedRegionsEVEfficiencyPerVehicleType
    | EmptyObject;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  vehiclesDisplaced: VehiclesDisplaced;
  selectedRegionsMonthlyEVEnergyUsageGW:
    | SelectedRegionsMonthlyEVEnergyUsageGW
    | EmptyObject;
  selectedRegionsMonthlyEVEnergyUsageMW:
    | SelectedRegionsMonthlyEVEnergyUsageMW
    | EmptyObject;
  selectedRegionsTotalYearlyEVEnergyUsage:
    | SelectedRegionsTotalYearlyEVEnergyUsage
    | EmptyObject;
  selectedRegionsMonthlyDailyEVEnergyUsage:
    | SelectedRegionsMonthlyDailyEVEnergyUsage
    | EmptyObject;
  selectedRegionsMonthlyEmissionRates:
    | SelectedRegionsMonthlyEmissionRates
    | EmptyObject;
  selectedRegionsMonthlyEmissionChanges:
    | SelectedRegionsMonthlyEmissionChanges
    | EmptyObject;
  selectedRegionsTotalMonthlyEmissionChanges:
    | SelectedRegionsTotalMonthlyEmissionChanges
    | EmptyObject;
  selectedRegionsTotalYearlyEmissionChanges:
    | SelectedRegionsTotalYearlyEmissionChanges
    | EmptyObject;
  vehicleEmissionChangesByGeography:
    | VehicleEmissionChangesByGeography
    | EmptyObject;
  vehicleSalesAndStock: VehicleSalesAndStock;
  selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
  evDeploymentLocationHistoricalEERE: EVDeploymentLocationHistoricalEERE;
};

const initialState: State = {
  vmtTotalsByGeography: {},
  vmtBillionsAndPercentages: {},
  stateVMTPercentagesByRegion: {},
  vmtAllocationPerVehicle: {},
  vmtTotalsByStateRegionCombo: {},
  vmtTotalsByRegion: {},
  vmtPercentagesByStateRegionCombo: {},
  vmtAndStockByState: {},
  ldvsFhwaMovesVMTRatioByState: {},
  vmtPerVehicleTypeByState: {},
  nationalAverageLDVsVMTPerYear: 0,
  monthlyVMTTotals: {},
  yearlyVMTTotals: {},
  monthlyVMTPercentages: {},
  hourlyEVChargingPercentages: {},
  selectedRegionsStatesVMTPercentages: {},
  selectedRegionsVMTPercentagesPerVehicleType: {},
  selectedRegionsAverageVMTPerYear: {},
  selectedRegionsMonthlyVMTPerVehicleType: {},
  selectedRegionsEVEfficiencyPerVehicleType: {},
  dailyStats: {},
  monthlyStats: {},
  vehiclesDisplaced: {
    batteryEVCars: 0,
    hybridEVCars: 0,
    batteryEVTrucks: 0,
    hybridEVTrucks: 0,
    transitBusesDiesel: 0,
    transitBusesCNG: 0,
    transitBusesGasoline: 0,
    schoolBuses: 0,
  },
  selectedRegionsMonthlyEVEnergyUsageGW: {},
  selectedRegionsMonthlyEVEnergyUsageMW: {},
  selectedRegionsTotalYearlyEVEnergyUsage: {},
  selectedRegionsMonthlyDailyEVEnergyUsage: {},
  selectedRegionsMonthlyEmissionRates: {},
  selectedRegionsMonthlyEmissionChanges: {},
  selectedRegionsTotalMonthlyEmissionChanges: {},
  selectedRegionsTotalYearlyEmissionChanges: {},
  vehicleEmissionChangesByGeography: {},
  vehicleSalesAndStock: {},
  selectedRegionsEEREDefaultsAverages: {},
  evDeploymentLocationHistoricalEERE: {
    eeRetail: { mw: 0, gwh: 0 },
    onshoreWind: { mw: 0, gwh: 0 },
    utilitySolar: { mw: 0, gwh: 0 },
  },
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case "transportation/SET_VMT_TOTALS_BY_GEOGRAPHY": {
      const { vmtTotalsByGeography } = action.payload;

      return {
        ...state,
        vmtTotalsByGeography,
      };
    }

    case "transportation/SET_VMT_BILLIONS_AND_PERCENTAGES": {
      const { vmtBillionsAndPercentages } = action.payload;

      return {
        ...state,
        vmtBillionsAndPercentages,
      };
    }

    case "transportation/SET_STATE_VMT_PERCENTAGES_BY_REGION": {
      const { stateVMTPercentagesByRegion } = action.payload;

      return {
        ...state,
        stateVMTPercentagesByRegion,
      };
    }

    case "transportation/SET_VMT_ALLOCATION_PER_VEHICLE": {
      const { vmtAllocationPerVehicle } = action.payload;

      return {
        ...state,
        vmtAllocationPerVehicle,
      };
    }

    case "transportation/SET_VMT_TOTALS_BY_STATE_REGION_COMBO": {
      const { vmtTotalsByStateRegionCombo } = action.payload;

      return {
        ...state,
        vmtTotalsByStateRegionCombo,
      };
    }

    case "transportation/SET_VMT_TOTALS_BY_REGION": {
      const { vmtTotalsByRegion } = action.payload;

      return {
        ...state,
        vmtTotalsByRegion,
      };
    }

    case "transportation/SET_VMT_PERCENTAGES_BY_STATE_REGION_COMBO": {
      const { vmtPercentagesByStateRegionCombo } = action.payload;

      return {
        ...state,
        vmtPercentagesByStateRegionCombo,
      };
    }

    case "transportation/SET_VMT_AND_STOCK_BY_STATE": {
      const { vmtAndStockByState } = action.payload;

      return {
        ...state,
        vmtAndStockByState,
      };
    }

    case "transportation/SET_LDVS_FHWA_MOVES_VMT_RATIO_BY_STATE": {
      const { ldvsFhwaMovesVMTRatioByState } = action.payload;

      return {
        ...state,
        ldvsFhwaMovesVMTRatioByState,
      };
    }

    case "transportation/SET_VMT_PER_VEHICLE_TYPE_BY_STATE": {
      const { vmtPerVehicleTypeByState } = action.payload;

      return {
        ...state,
        vmtPerVehicleTypeByState,
      };
    }

    case "transportation/SET_NATIONAL_AVERAGE_LDVS_VMT_PER_YEAR": {
      const { nationalAverageLDVsVMTPerYear } = action.payload;

      return {
        ...state,
        nationalAverageLDVsVMTPerYear,
      };
    }

    case "transportation/SET_MONTHLY_VMT_TOTALS": {
      const { monthlyVMTTotals } = action.payload;

      return {
        ...state,
        monthlyVMTTotals,
      };
    }

    case "transportation/SET_YEARLY_VMT_TOTALS": {
      const { yearlyVMTTotals } = action.payload;

      return {
        ...state,
        yearlyVMTTotals,
      };
    }

    case "transportation/SET_MONTHLY_VMT_PERCENTAGES": {
      const { monthlyVMTPercentages } = action.payload;

      return {
        ...state,
        monthlyVMTPercentages,
      };
    }

    case "transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES": {
      const { hourlyEVChargingPercentages } = action.payload;

      return {
        ...state,
        hourlyEVChargingPercentages,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES": {
      const { selectedRegionsStatesVMTPercentages } = action.payload;

      return {
        ...state,
        selectedRegionsStatesVMTPercentages,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE": {
      const { selectedRegionsVMTPercentagesPerVehicleType } = action.payload;

      return {
        ...state,
        selectedRegionsVMTPercentagesPerVehicleType,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR": {
      const { selectedRegionsAverageVMTPerYear } = action.payload;

      return {
        ...state,
        selectedRegionsAverageVMTPerYear,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE": {
      const { selectedRegionsMonthlyVMTPerVehicleType } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyVMTPerVehicleType,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_EV_EFFICIENCY_PER_VEHICLE_TYPE": {
      const { selectedRegionsEVEfficiencyPerVehicleType } = action.payload;

      return {
        ...state,
        selectedRegionsEVEfficiencyPerVehicleType,
      };
    }

    case "transportation/SET_DAILY_STATS": {
      const { dailyStats } = action.payload;

      return {
        ...state,
        dailyStats,
      };
    }

    case "transportation/SET_MONTHLY_STATS": {
      const { monthlyStats } = action.payload;

      return {
        ...state,
        monthlyStats,
      };
    }

    case "transportation/SET_VEHICLES_DISPLACED": {
      const { vehiclesDisplaced } = action.payload;

      return {
        ...state,
        vehiclesDisplaced,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW": {
      const { selectedRegionsMonthlyEVEnergyUsageGW } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEVEnergyUsageGW,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_MW": {
      const { selectedRegionsMonthlyEVEnergyUsageMW } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEVEnergyUsageMW,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_EV_ENERGY_USAGE": {
      const { selectedRegionsMonthlyDailyEVEnergyUsage } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyDailyEVEnergyUsage,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES": {
      const { selectedRegionsMonthlyEmissionRates } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEmissionRates,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES": {
      const { selectedRegionsMonthlyEmissionChanges } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEmissionChanges,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES": {
      const { selectedRegionsTotalMonthlyEmissionChanges } = action.payload;

      return {
        ...state,
        selectedRegionsTotalMonthlyEmissionChanges,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES": {
      const { selectedRegionsTotalYearlyEmissionChanges } = action.payload;

      return {
        ...state,
        selectedRegionsTotalYearlyEmissionChanges,
      };
    }

    case "transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY": {
      const { vehicleEmissionChangesByGeography } = action.payload;

      return {
        ...state,
        vehicleEmissionChangesByGeography,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE": {
      const { selectedRegionsTotalYearlyEVEnergyUsage } = action.payload;

      return {
        ...state,
        selectedRegionsTotalYearlyEVEnergyUsage,
      };
    }

    case "transportation/SET_VEHICLE_SALES_AND_STOCK": {
      const { vehicleSalesAndStock } = action.payload;

      return {
        ...state,
        vehicleSalesAndStock,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_EERE_DEFAULTS_AVERAGES": {
      const { selectedRegionsEEREDefaultsAverages } = action.payload;

      return {
        ...state,
        selectedRegionsEEREDefaultsAverages,
      };
    }

    case "transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE": {
      const { evDeploymentLocationHistoricalEERE } = action.payload;

      return {
        ...state,
        evDeploymentLocationHistoricalEERE,
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Called when the app starts.
 */
export function setVMTData(): AppThunk {
  return (dispatch) => {
    const vmtTotalsByGeography = calculateVMTTotalsByGeography({ countyFips });

    const vmtBillionsAndPercentages = calculateVMTBillionsAndPercentages({
      countyFips,
    });

    const stateVMTPercentagesByRegion = calculateStateVMTPercentagesByRegion({
      vmtBillionsAndPercentages,
    });

    const vmtAllocationPerVehicle = calculateVMTAllocationPerVehicle({
      vmtAllocationAndRegisteredVehicles,
      stateBusSalesAndStock,
    });

    const vmtTotalsByStateRegionCombo = calculateVMTTotalsByStateRegionCombo({
      countyFips,
    });

    const vmtTotalsByRegion = calculateVMTTotalsByRegion({
      vmtTotalsByStateRegionCombo,
    });

    const vmtPercentagesByStateRegionCombo =
      calculateVMTPercentagesByStateRegionCombo({
        vmtTotalsByStateRegionCombo,
        vmtTotalsByRegion,
      });

    const vmtAndStockByState = storeVMTandStockByState({
      stateLevelVMT,
    });

    const ldvsFhwaMovesVMTRatioByState = calculateLDVsFhwaMovesVMTRatioByState({
      fhwaLDVStateLevelVMT,
      vmtAndStockByState,
    });

    const vmtPerVehicleTypeByState = calculateVMTPerVehicleTypeByState({
      stateLevelVMT,
    });

    const nationalAverageLDVsVMTPerYear =
      calculateNationalAverageLDVsVMTPerYear({
        vmtAllocationAndRegisteredVehicles,
      });

    const monthlyVMTTotals = calculateMonthlyVMTTotals({ movesEmissionRates });

    const yearlyVMTTotals = calculateYearlyVMTTotals({ monthlyVMTTotals });

    const monthlyVMTPercentages = calculateMonthlyVMTPercentages({
      monthlyVMTTotals,
      yearlyVMTTotals,
    });

    dispatch({
      type: "transportation/SET_VMT_TOTALS_BY_GEOGRAPHY",
      payload: { vmtTotalsByGeography },
    });

    dispatch({
      type: "transportation/SET_VMT_BILLIONS_AND_PERCENTAGES",
      payload: { vmtBillionsAndPercentages },
    });

    dispatch({
      type: "transportation/SET_STATE_VMT_PERCENTAGES_BY_REGION",
      payload: { stateVMTPercentagesByRegion },
    });

    dispatch({
      type: "transportation/SET_VMT_ALLOCATION_PER_VEHICLE",
      payload: { vmtAllocationPerVehicle },
    });

    dispatch({
      type: "transportation/SET_VMT_TOTALS_BY_STATE_REGION_COMBO",
      payload: { vmtTotalsByStateRegionCombo },
    });

    dispatch({
      type: "transportation/SET_VMT_TOTALS_BY_REGION",
      payload: { vmtTotalsByRegion },
    });

    dispatch({
      type: "transportation/SET_VMT_PERCENTAGES_BY_STATE_REGION_COMBO",
      payload: { vmtPercentagesByStateRegionCombo },
    });

    dispatch({
      type: "transportation/SET_VMT_AND_STOCK_BY_STATE",
      payload: { vmtAndStockByState },
    });

    dispatch({
      type: "transportation/SET_LDVS_FHWA_MOVES_VMT_RATIO_BY_STATE",
      payload: { ldvsFhwaMovesVMTRatioByState },
    });

    dispatch({
      type: "transportation/SET_VMT_PER_VEHICLE_TYPE_BY_STATE",
      payload: { vmtPerVehicleTypeByState },
    });

    dispatch({
      type: "transportation/SET_NATIONAL_AVERAGE_LDVS_VMT_PER_YEAR",
      payload: { nationalAverageLDVsVMTPerYear },
    });

    dispatch({
      type: "transportation/SET_MONTHLY_VMT_TOTALS",
      payload: { monthlyVMTTotals },
    });

    dispatch({
      type: "transportation/SET_YEARLY_VMT_TOTALS",
      payload: { yearlyVMTTotals },
    });

    dispatch({
      type: "transportation/SET_MONTHLY_VMT_PERCENTAGES",
      payload: { monthlyVMTPercentages },
    });

    // NOTE: `vehicleSalesAndStock` uses `vmtAllocationPerVehicle`
    dispatch(setVehicleSalesAndStock());
  };
}

/**
 * Called when the app starts.
 */
export function setHourlyEVChargingPercentages(): AppThunk {
  return (dispatch) => {
    const hourlyEVChargingPercentages = calculateHourlyEVChargingPercentages({
      evChargingProfiles,
    });

    dispatch({
      type: "transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES",
      payload: { hourlyEVChargingPercentages },
    });
  };
}

/**
 * Called every time the `geography` reducer's `selectGeography()`,
 * `selectRegion()`, or `selectState()` functions are called.
 *
 * _(e.g. anytime the selected geography changes)_
 */
export function setSelectedGeographyVMTData(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation } = getState();
    const { regionalScalingFactors } = geography;
    const {
      vmtBillionsAndPercentages,
      vmtAllocationPerVehicle,
      nationalAverageLDVsVMTPerYear,
      monthlyVMTPercentages,
    } = transportation;

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const selectedRegionsStatesVMTPercentages =
      calculateSelectedRegionsStatesVMTPercentages({
        selectedGeographyRegionIds,
        vmtBillionsAndPercentages,
      });

    const selectedRegionsVMTPercentagesPerVehicleType =
      calculateSelectedRegionsVMTPercentagesPerVehicleType({
        selectedRegionsStatesVMTPercentages,
        vmtAllocationPerVehicle,
      });

    const selectedRegionsAverageVMTPerYear =
      calculateSelectedRegionsAverageVMTPerYear({
        nationalAverageLDVsVMTPerYear,
        selectedRegionsVMTPercentagesPerVehicleType,
      });

    const selectedRegionsMonthlyVMTPerVehicleType =
      calculateSelectedRegionsMonthlyVMTPerVehicleType({
        selectedRegionsAverageVMTPerYear,
        monthlyVMTPercentages,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES",
      payload: { selectedRegionsStatesVMTPercentages },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE",
      payload: { selectedRegionsVMTPercentagesPerVehicleType },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR",
      payload: { selectedRegionsAverageVMTPerYear },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE",
      payload: { selectedRegionsMonthlyVMTPerVehicleType },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `selectedRegionsMonthlyVMTPerVehicleType`
    dispatch(setMonthlyEVEnergyUsage());

    // NOTE: `selectedRegionsMonthlyEmissionRates` uses `selectedRegionsStatesVMTPercentages`
    dispatch(setMonthlyEmissionRates());

    // NOTE: `selectedRegionsMonthlyEmissionChanges` uses `selectedRegionsMonthlyVMTPerVehicleType`
    dispatch(setEmissionChanges());
  };
}

/**
 * Called every time the `geography` reducer's `selectGeography()`,
 * `selectRegion()`, or `selectState()` functions, or the `impacts` reducer's
 * `updateEVModelYear()` function is called.
 *
 * _(e.g. anytime the selected geography or EV model year changes)_
 */
export function setEVEfficiency(): AppThunk {
  return (dispatch, getState) => {
    const { geography, impacts } = getState();
    const { regionalScalingFactors } = geography;
    const { evModelYear } = impacts.inputs;

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const selectedRegionsEVEfficiencyPerVehicleType =
      calculateSelectedRegionsEVEfficiencyPerVehicleType({
        evEfficiencyByModelYear,
        regionAverageTemperatures,
        selectedGeographyRegionIds,
        evModelYear,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_EV_EFFICIENCY_PER_VEHICLE_TYPE",
      payload: { selectedRegionsEVEfficiencyPerVehicleType },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `selectedRegionsEVEfficiencyPerVehicleType`
    dispatch(setMonthlyEVEnergyUsage());
  };
}

/**
 * Called every time the `geography` reducer's `fetchRegionsData()` function is
 * called.
 *
 * _(e.g. whenever the "Set Energy Impacts" button is clicked  on the "Select
 * Geography" page)_
 */
export function setDailyAndMonthlyStats(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation } = getState();
    const { regions, regionalScalingFactors } = geography;

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    /**
     * NOTE: the `regionalLoad` data passed to `calculateDailyStats()` is only
     * concerned with the year, month, day, and hour values, which will be the
     * same for all RDFs, so it really doesn't matter which RDF is passed (if a
     * region is selected, it will always be that region's RDF, but if a state
     * is selected, it will be one of the region's the state falls within).
     */
    const regionalLoad = Object.values(regions).find((region) => {
      return selectedGeographyRegionIds.includes(region.id);
    })?.rdf.regional_load;

    // all RDFs for a given year have the same number of hours, so no need to
    // re-calculate daily and monthly stats again if it's already been set
    if (Object.keys(transportation.dailyStats).length !== 0) return;

    const dailyStats = calculateDailyStats(regionalLoad);
    const monthlyStats = calculateMonthlyStats(dailyStats);

    dispatch({
      type: "transportation/SET_DAILY_STATS",
      payload: { dailyStats },
    });

    dispatch({
      type: "transportation/SET_MONTHLY_STATS",
      payload: { monthlyStats },
    });

    // NOTE: `selectedRegionsMonthlyDailyEVEnergyUsage` uses `monthlyStats`
    dispatch(setMonthlyDailyEVEnergyUsage());
  };
}

/**
 * Called every time the `impacts` reducer's `runEVBatteryEVsCalculations()`,
 * `runEVHybridEVsCalculations()`, `runEVTransitBusesCalculations()`, or
 * `runEVSchoolBusesCalculations()` function are called.
 *
 * _(e.g. onBlur / whenever an EV input loses focus, but only if the input's
 * value has changed since the last time it was used in this calculation)_
 */
export function setVehiclesDisplaced(): AppThunk {
  return (dispatch, getState) => {
    const { transportation, impacts } = getState();
    const { monthlyVMTTotals } = transportation;
    const { batteryEVs, hybridEVs, transitBuses, schoolBuses } = impacts.inputs;

    const vehiclesDisplaced = calculateVehiclesDisplaced({
      batteryEVs: Number(batteryEVs),
      hybridEVs: Number(hybridEVs),
      transitBuses: Number(transitBuses),
      schoolBuses: Number(schoolBuses),
      monthlyVMTTotals,
    });

    dispatch({
      type: "transportation/SET_VEHICLES_DISPLACED",
      payload: { vehiclesDisplaced },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `vehiclesDisplaced`
    dispatch(setMonthlyEVEnergyUsage());

    // NOTE: `selectedRegionsMonthlyEmissionChanges` uses `vehiclesDisplaced`
    dispatch(setEmissionChanges());
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedGeographyVMTData()`, `setEVEfficiency()`, or
 * `setVehiclesDisplaced()` functions are called.
 *
 * _(e.g. anytime the selected geography, EV model year, or an EV input number
 * changes)_
 */
export function setMonthlyEVEnergyUsage(): AppThunk {
  return (dispatch, getState) => {
    const { transportation } = getState();
    const {
      selectedRegionsMonthlyVMTPerVehicleType,
      selectedRegionsEVEfficiencyPerVehicleType,
      vehiclesDisplaced,
    } = transportation;

    const selectedRegionsMonthlyEVEnergyUsageGW =
      calculateSelectedRegionsMonthlyEVEnergyUsageGW({
        selectedRegionsMonthlyVMTPerVehicleType,
        selectedRegionsEVEfficiencyPerVehicleType,
        vehiclesDisplaced,
      });

    const selectedRegionsMonthlyEVEnergyUsageMW =
      calculateSelectedRegionsMonthlyEVEnergyUsageMW({
        selectedRegionsMonthlyEVEnergyUsageGW,
      });

    const selectedRegionsTotalYearlyEVEnergyUsage =
      calculateSelectedRegionsTotalYearlyEVEnergyUsage({
        selectedRegionsMonthlyEVEnergyUsageGW,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW",
      payload: { selectedRegionsMonthlyEVEnergyUsageGW },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_MW",
      payload: { selectedRegionsMonthlyEVEnergyUsageMW },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE",
      payload: { selectedRegionsTotalYearlyEVEnergyUsage },
    });

    // NOTE: `selectedRegionsMonthlyDailyEVEnergyUsage` uses `selectedRegionsMonthlyEVEnergyUsageMW`
    dispatch(setMonthlyDailyEVEnergyUsage());
  };
}

/**
 * Called the first time this `transportation` reducer's
 * `setDailyAndMonthlyStats()` function is called (will only be called from
 * there once, due to the early return in that function, preventing it from
 * re-setting monthlyStats), or anytime this `transportation` reducer's
 * `setMonthlyEVEnergyUsage()` function is called.
 *
 * _(e.g. whenever the "Set Energy Impacts" button is clicked  on the "Select
 * Geography" page or anytime the selected geography, EV model year, or an EV
 * input number changes)_
 */
export function setMonthlyDailyEVEnergyUsage(): AppThunk {
  return (dispatch, getState) => {
    const { transportation } = getState();
    const { monthlyStats, selectedRegionsMonthlyEVEnergyUsageMW } =
      transportation;

    const selectedRegionsMonthlyDailyEVEnergyUsage =
      calculateSelectedRegionsMonthlyDailyEVEnergyUsage({
        selectedRegionsMonthlyEVEnergyUsageMW,
        monthlyStats,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_EV_ENERGY_USAGE",
      payload: { selectedRegionsMonthlyDailyEVEnergyUsage },
    });
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedGeographyVMTData()` function is called, or anytime the `impacts`
 * reducer's `updateEVDeploymentLocation()`, `updateEVModelYear()`, or
 * `updateEVICEReplacementVehicle` function is called.
 *
 * _(e.g. anytime the selected geography, EV deployment location, EV model year,
 * or ICE replacement vehicle changes)_
 */
export function setMonthlyEmissionRates(): AppThunk {
  return (dispatch, getState) => {
    const { transportation, impacts } = getState();
    const { selectedRegionsStatesVMTPercentages } = transportation;
    const { evDeploymentLocation, evModelYear, iceReplacementVehicle } =
      impacts.inputs;

    const selectedRegionsMonthlyEmissionRates =
      calculateSelectedRegionsMonthlyEmissionRates({
        movesEmissionRates,
        selectedRegionsStatesVMTPercentages,
        evDeploymentLocation,
        evModelYear,
        iceReplacementVehicle,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES",
      payload: { selectedRegionsMonthlyEmissionRates },
    });

    // NOTE: `selectedRegionsMonthlyEmissionChanges` uses `selectedRegionsMonthlyEmissionRates`
    dispatch(setEmissionChanges());
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedGeographyVMTData()`, `setVehiclesDisplaced()`, or
 * `setMonthlyEmissionRates()` function is called.
 *
 * _(e.g. anytime the selected geography, an EV input number, the EV deployment
 * location, EV model year, or ICE replacement vehicle changes)_
 */
export function setEmissionChanges(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation, impacts } = getState();
    const { countiesByGeography, regionalScalingFactors } = geography;
    const {
      stateVMTPercentagesByRegion,
      vmtTotalsByGeography,
      selectedRegionsMonthlyVMTPerVehicleType,
      vehiclesDisplaced,
      selectedRegionsMonthlyEmissionRates,
    } = transportation;

    const geographicFocus = geography.focus;

    const selectedRegionId =
      Object.values(geography.regions).find((r) => r.selected)?.id || "";

    const selectedStateId =
      Object.values(geography.states).find((s) => s.selected)?.id || "";

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const { evDeploymentLocation } = impacts.inputs;

    const selectedRegionsMonthlyEmissionChanges =
      calculateSelectedRegionsMonthlyEmissionChanges({
        geographicFocus,
        selectedStateId,
        stateVMTPercentagesByRegion,
        selectedRegionsMonthlyVMTPerVehicleType,
        vehiclesDisplaced,
        selectedRegionsMonthlyEmissionRates,
      });

    const selectedRegionsTotalMonthlyEmissionChanges =
      calculateSelectedRegionsTotalMonthlyEmissionChanges({
        selectedRegionsMonthlyEmissionChanges,
      });

    const selectedRegionsTotalYearlyEmissionChanges =
      calculateSelectedRegionsTotalYearlyEmissionChanges({
        selectedRegionsTotalMonthlyEmissionChanges,
      });

    const vehicleEmissionChangesByGeography =
      calculateVehicleEmissionChangesByGeography({
        geographicFocus,
        selectedRegionId,
        selectedStateId,
        countiesByGeography,
        selectedGeographyRegionIds,
        vmtTotalsByGeography,
        selectedRegionsTotalYearlyEmissionChanges,
        evDeploymentLocation,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES",
      payload: { selectedRegionsMonthlyEmissionChanges },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES",
      payload: { selectedRegionsTotalMonthlyEmissionChanges },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES",
      payload: { selectedRegionsTotalYearlyEmissionChanges },
    });

    dispatch({
      type: "transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY",
      payload: { vehicleEmissionChangesByGeography },
    });
  };
}

/**
 * Called when this `transportation` reducer's `setVMTData()` function is called
 * or every time the `impacts` reducer's `setEVDeploymentLocationOptions()`
 * function is called.
 *
 * _(e.g. when the app starts or anytime the selected geography or the EV
 * deployment location changes)_
 */
export function setVehicleSalesAndStock(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation, impacts } = getState();
    const { regions } = geography;
    const { vmtAllocationPerVehicle } = transportation;
    const { evDeploymentLocationOptions } = impacts.selectOptions;

    const geographicFocus = geography.focus;

    const selectedRegion = Object.values(regions).find((r) => r.selected);
    const evDeploymentLocations = evDeploymentLocationOptions.map((o) => o.id);

    const selectedRegionName =
      geographicFocus === "regions" ? selectedRegion?.name || "" : "";

    const vehicleSalesAndStock = calculateVehicleSalesAndStock({
      countyFips,
      stateLDVsSales,
      stateBusSalesAndStock,
      geographicFocus,
      selectedRegionName,
      evDeploymentLocations,
      vmtAllocationPerVehicle,
    });

    dispatch({
      type: "transportation/SET_VEHICLE_SALES_AND_STOCK",
      payload: { vehicleSalesAndStock },
    });
  };
}

/**
 * Called every time the `geography` reducer's `fetchRegionsData()` function is
 * called.
 *
 * _(e.g. whenever the "Set Energy Impacts" button is clicked  on the "Select
 * Geography" page)_
 */
export function setSelectedRegionsEEREDefaultsAverages(): AppThunk {
  return (dispatch, getState) => {
    const { geography } = getState();
    const { regions, regionalScalingFactors } = geography;

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const selectedGeographyRegions = getSelectedGeographyRegions({
      regions,
      selectedGeographyRegionIds,
    });

    const selectedRegionsEEREDefaultsAverages =
      calculateSelectedRegionsEEREDefaultsAverages({
        regionalScalingFactors,
        selectedGeographyRegions,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_EERE_DEFAULTS_AVERAGES",
      payload: { selectedRegionsEEREDefaultsAverages },
    });

    // NOTE: `evDeploymentLocationHistoricalEERE` uses `selectedRegionsEEREDefaultsAverages`
    dispatch(setEVDeploymentLocationHistoricalEERE());
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedRegionsEEREDefaultsAverages()` function is called or anytime the
 * `impacts` reducer's `updateEVDeploymentLocation()` function is called.
 *
 * _(e.g. whenever the "Set Energy Impacts" button is clicked  on the "Select
 * Geography" page or anytime the EV deployment location changes)_
 */
export function setEVDeploymentLocationHistoricalEERE(): AppThunk {
  return (dispatch, getState) => {
    const { geography, impacts, transportation } = getState();
    const { regionalLineLoss } = geography;
    const { evDeploymentLocation } = impacts.inputs;
    const { selectedRegionsEEREDefaultsAverages } = transportation;

    const selectedRegionId =
      Object.values(geography.regions).find((r) => r.selected)?.id || "";

    const evDeploymentLocationHistoricalEERE =
      calculateEVDeploymentLocationHistoricalEERE({
        regionEereAverages,
        stateEereAverages,
        selectedRegionsEEREDefaultsAverages,
        evDeploymentLocation,
        regionalLineLoss,
        selectedRegionId,
      });

    dispatch({
      type: "transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE",
      payload: { evDeploymentLocationHistoricalEERE },
    });
  };
}
