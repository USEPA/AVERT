import { type AppThunk } from "@/redux/index";
import { getSelectedGeographyRegions } from "@/calculations/geography";
import {
  type HourlyEVLoadProfiles,
  type DailyStats,
  type MonthlyStats,
  type VMTTotalsByGeography,
  type MonthlyVMTTotals,
  type YearlyVMTTotals,
  type MonthlyVMTPercentages,
  type VMTTotalsByStateRegionCombo,
  type VMTTotalsByRegion,
  type VMTTotalsByState,
  type VMTRegionPercentagesByStateRegionCombo,
  type VMTStatePercentagesByStateRegionCombo,
  type VehicleTypeTotals,
  type VehicleCategoryTotals,
  type VehicleTypePercentagesOfVehicleCategory,
  type VehicleFuelTypePercentagesOfVehicleType,
  type VMTandStockByState,
  type LDVsFhwaMovesVMTRatioByState,
  type VMTPerVehicleTypeByState,
  type SelectedRegionsTotalEffectiveVehicles,
  type SelectedRegionsVMTPercentagesByState,
  type SelectedRegionsAverageVMTPerYear,
  type SelectedRegionsMonthlyVMT,
  type SelectedRegionsEVEfficiency,
  type SelectedRegionsMonthlyEmissionRates,
  type SelectedRegionsMonthlyElectricityPM25EmissionRates,
  type SelectedRegionsMonthlyTotalNetPM25EmissionRates,
  type SelectedRegionsMonthlySalesChanges,
  type SelectedRegionsYearlySalesChanges,
  type SelectedRegionsTotalYearlySalesChanges,
  type SelectedRegionsMonthlyEnergyUsage,
  type SelectedRegionsMonthlyDailyEnergyUsage,
  type SelectedRegionsMonthlyEmissionChanges,
  type SelectedRegionsMonthlyEmissionChangesPerVehicleCategory,
  type SelectedRegionsYearlyEmissionChangesPerVehicleCategory,
  type SelectedRegionsMonthlyEmissionChangesTotals,
  type SelectedRegionsYearlyEmissionChangesTotals,
  type SelectedGeographySalesAndStockByState,
  type SelectedGeographySalesAndStockByRegion,
  type SelectedRegionsEEREDefaultsAverages,
  type EVDeploymentLocationHistoricalEERE,
  type VehicleEmissionChangesByGeography,
  vehicleTypesByVehicleCategory,
  storeHourlyEVLoadProfiles,
  calculateDailyStats,
  calculateMonthlyStats,
  calculateVMTTotalsByGeography,
  calculateMonthlyVMTTotals,
  calculateYearlyVMTTotals,
  calculateMonthlyVMTPercentages,
  calculateVMTTotalsByStateRegionCombo,
  calculateVMTTotalsByRegion,
  calculateVMTTotalsByState,
  calculateVMTRegionPercentagesByStateRegionCombo,
  calculateVMTStatePercentagesByStateRegionCombo,
  calculateVehicleTypeTotals,
  calculateVehicleCategoryTotals,
  calculateVehicleTypePercentagesOfVehicleCategory,
  calculateVehicleFuelTypePercentagesOfVehicleType,
  storeVMTandStockByState,
  calculateLDVsFhwaMovesVMTRatioByState,
  calculateVMTPerVehicleTypeByState,
  calculateSelectedRegionsTotalEffectiveVehicles,
  calculateSelectedRegionsVMTPercentagesByState,
  calculateSelectedRegionsAverageVMTPerYear,
  calculateSelectedRegionsMonthlyVMT,
  calculateSelectedRegionsEVEfficiency,
  calculateSelectedRegionsMonthlyEmissionRates,
  calculateSelectedRegionsMonthlyElectricityPM25EmissionRates,
  calculateSelectedRegionsMonthlyTotalNetPM25EmissionRates,
  calculateSelectedRegionsMonthlySalesChanges,
  calculateSelectedRegionsYearlySalesChanges,
  calculateSelectedRegionsTotalYearlySalesChanges,
  calculateSelectedRegionsMonthlyEnergyUsage,
  calculateSelectedRegionsMonthlyDailyEnergyUsage,
  calculateSelectedRegionsMonthlyEmissionChanges,
  calculateSelectedRegionsMonthlyEmissionChangesPerVehicleCategory,
  calculateSelectedRegionsYearlyEmissionChangesPerVehicleCategory,
  calculateSelectedRegionsMonthlyEmissionChangesTotals,
  calculateSelectedRegionsYearlyEmissionChangesTotals,
  calculateSelectedGeographySalesAndStockByState,
  calculateSelectedGeographySalesAndStockByRegion,
  calculateSelectedRegionsEEREDefaultsAverages,
  calculateEVDeploymentLocationHistoricalEERE,
  calculateVehicleEmissionChangesByGeography,
} from "@/calculations/transportation";
import { type EmptyObject } from "@/utilities";
import {
  type CountyFIPS,
  type MOVESEmissionRates,
  type RegionId,
  type StateId,
  percentageHybridEVMilesDrivenOnElectricity,
  schoolBusMonthlyVMTPercentages,
  weekendToWeekdayEVConsumption,
  ldvsPercentagesByVehicleCategory,
  regions,
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
 * Excel: "B. State-Level Sales" table in the "MOVESsupplement" sheet (J6:M516).
 */
import stateLevelSales from "@/data/state-level-sales.json"; /**
 * Excel: "C. FHWA LDV State-Level VMT" table in the "MOVESsupplement" sheet
 * (O6:P57).
 */
import fhwaLDVStateLevelVMT from "@/data/fhwa-ldv-state-level-vmt.json";
/**
 * Excel: "Table 13: First-Year ICE to EV PM2.5 brakewear and tirewear emissions
 * rate conversion factors" table in the "Library" sheet (B990:G1130).
 */
import pm25BreakwearTirewearEVICERatios from "@/data/pm25-breakwear-tirewear-ev-ice-ratios.json";
/**
 * Excel: "MOVESEmissionRates" sheet.
 */
import movesEmissionRatesData from "@/data/moves-emission-rates.json";
/**
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet (B782:N807).
 */
import defaultEVLoadProfiles from "@/data/default-ev-load-profiles.json";
/**
 * Excel: "Table 5: EV efficiency assumptions" table in the "Library" sheet
 * (E201:J217).
 */
import evEfficiencyAssumptions from "@/data/ev-efficiency-assumptions.json";
/**
 * Excel: "Table 11: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B882:J895).
 */
import historicalRegionEEREData from "@/data/historical-region-eere-data.json";
/**
 * Excel: "Table 11: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B902:H950).
 */
import historicalStateEEREData from "@/data/historical-state-eere-data.json";

/**
 * Work around due to TypeScript inability to infer types from large JSON files.
 */
const countyFips = countyFipsData as CountyFIPS;
/**
 * Work around due to TypeScript inability to infer types from large JSON files.
 */
const movesEmissionRates = movesEmissionRatesData as MOVESEmissionRates;

type Action =
  | {
      type: "transportation/SET_HOURLY_EV_LOAD_PROFILES";
      payload: { hourlyEVLoadProfiles: HourlyEVLoadProfiles };
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
      type: "transportation/SET_VMT_TOTALS_BY_GEOGRAPHY";
      payload: { vmtTotalsByGeography: VMTTotalsByGeography };
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
      type: "transportation/SET_VMT_TOTALS_BY_STATE_REGION_COMBO";
      payload: { vmtTotalsByStateRegionCombo: VMTTotalsByStateRegionCombo };
    }
  | {
      type: "transportation/SET_VMT_TOTALS_BY_REGION";
      payload: { vmtTotalsByRegion: VMTTotalsByRegion };
    }
  | {
      type: "transportation/SET_VMT_TOTALS_BY_STATE";
      payload: { vmtTotalsByState: VMTTotalsByState };
    }
  | {
      type: "transportation/SET_VMT_REGION_PERCENTAGES_BY_STATE_REGION_COMBO";
      payload: {
        vmtRegionPercentagesByStateRegionCombo: VMTRegionPercentagesByStateRegionCombo;
      };
    }
  | {
      type: "transportation/SET_VMT_STATE_PERCENTAGES_BY_STATE_REGION_COMBO";
      payload: {
        vmtStatePercentagesByStateRegionCombo: VMTStatePercentagesByStateRegionCombo;
      };
    }
  | {
      type: "transportation/SET_VEHICLE_TYPE_TOTALS";
      payload: {
        vehicleTypeTotals: VehicleTypeTotals;
      };
    }
  | {
      type: "transportation/SET_VEHICLE_CATEGORY_TOTALS";
      payload: {
        vehicleCategoryTotals: VehicleCategoryTotals;
      };
    }
  | {
      type: "transportation/SET_VEHICLE_TYPE_PERCENTAGES_OF_VEHICLE_CATEGORY";
      payload: {
        vehicleTypePercentagesOfVehicleCategory: VehicleTypePercentagesOfVehicleCategory;
      };
    }
  | {
      type: "transportation/SET_VEHICLE_FUEL_TYPE_PERCENTAGES_OF_VEHICLE_TYPE";
      payload: {
        vehicleFuelTypePercentagesOfVehicleType: VehicleFuelTypePercentagesOfVehicleType;
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
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_EFFECTIVE_VEHICLES";
      payload: {
        selectedRegionsTotalEffectiveVehicles: SelectedRegionsTotalEffectiveVehicles;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_BY_STATE";
      payload: {
        selectedRegionsVMTPercentagesByState: SelectedRegionsVMTPercentagesByState;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR";
      payload: {
        selectedRegionsAverageVMTPerYear: SelectedRegionsAverageVMTPerYear;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_VMT";
      payload: {
        selectedRegionsMonthlyVMT: SelectedRegionsMonthlyVMT;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_EV_EFFICIENCY";
      payload: {
        selectedRegionsEVEfficiency: SelectedRegionsEVEfficiency;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES";
      payload: {
        selectedRegionsMonthlyEmissionRates: SelectedRegionsMonthlyEmissionRates;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_ELECTRICITY_PM25_EMISSION_RATES";
      payload: {
        selectedRegionsMonthlyElectricityPM25EmissionRates: SelectedRegionsMonthlyElectricityPM25EmissionRates;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_TOTAL_NET_PM25_EMISSION_RATES";
      payload: {
        selectedRegionsMonthlyTotalNetPM25EmissionRates: SelectedRegionsMonthlyTotalNetPM25EmissionRates;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_SALES_CHANGES";
      payload: {
        selectedRegionsMonthlySalesChanges: SelectedRegionsMonthlySalesChanges;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_YEARLY_SALES_CHANGES";
      payload: {
        selectedRegionsYearlySalesChanges: SelectedRegionsYearlySalesChanges;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_SALES_CHANGES";
      payload: {
        selectedRegionsTotalYearlySalesChanges: SelectedRegionsTotalYearlySalesChanges;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_ENERGY_USAGE";
      payload: {
        selectedRegionsMonthlyEnergyUsage: SelectedRegionsMonthlyEnergyUsage;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_ENERGY_USAGE";
      payload: {
        selectedRegionsMonthlyDailyEnergyUsage: SelectedRegionsMonthlyDailyEnergyUsage;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES";
      payload: {
        selectedRegionsMonthlyEmissionChanges: SelectedRegionsMonthlyEmissionChanges;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES_PER_VEHICLE_CATEGORY";
      payload: {
        selectedRegionsMonthlyEmissionChangesPerVehicleCategory: SelectedRegionsMonthlyEmissionChangesPerVehicleCategory;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_YEARLY_EMISSION_CHANGES_PER_VEHICLE_CATEGORY";
      payload: {
        selectedRegionsYearlyEmissionChangesPerVehicleCategory: SelectedRegionsYearlyEmissionChangesPerVehicleCategory;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES_TOTALS";
      payload: {
        selectedRegionsMonthlyEmissionChangesTotals: SelectedRegionsMonthlyEmissionChangesTotals;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_YEARLY_EMISSION_CHANGES_TOTALS";
      payload: {
        selectedRegionsYearlyEmissionChangesTotals: SelectedRegionsYearlyEmissionChangesTotals;
      };
    }
  | {
      type: "transportation/SET_SELECTED_GEOGRAPHY_SALES_AND_STOCK_BY_STATE";
      payload: {
        selectedGeographySalesAndStockByState: SelectedGeographySalesAndStockByState;
      };
    }
  | {
      type: "transportation/SET_SELECTED_GEOGRAPHY_SALES_AND_STOCK_BY_REGION";
      payload: {
        selectedGeographySalesAndStockByRegion: SelectedGeographySalesAndStockByRegion;
      };
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
    }
  | {
      type: "transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY";
      payload: {
        vehicleEmissionChangesByGeography: VehicleEmissionChangesByGeography;
      };
    };

type State = {
  hourlyEVLoadProfiles: HourlyEVLoadProfiles;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  vmtTotalsByGeography: VMTTotalsByGeography | EmptyObject;
  monthlyVMTTotals: MonthlyVMTTotals | EmptyObject;
  yearlyVMTTotals: YearlyVMTTotals | EmptyObject;
  monthlyVMTPercentages: MonthlyVMTPercentages | EmptyObject;
  vmtTotalsByStateRegionCombo: VMTTotalsByStateRegionCombo | EmptyObject;
  vmtTotalsByRegion: VMTTotalsByRegion | EmptyObject;
  vmtTotalsByState: VMTTotalsByState | EmptyObject;
  vmtRegionPercentagesByStateRegionCombo:
    | VMTRegionPercentagesByStateRegionCombo
    | EmptyObject;
  vmtStatePercentagesByStateRegionCombo:
    | VMTStatePercentagesByStateRegionCombo
    | EmptyObject;
  vehicleTypeTotals: VehicleTypeTotals | EmptyObject;
  vehicleCategoryTotals: VehicleCategoryTotals | EmptyObject;
  vehicleTypePercentagesOfVehicleCategory:
    | VehicleTypePercentagesOfVehicleCategory
    | EmptyObject;
  vehicleFuelTypePercentagesOfVehicleType:
    | VehicleFuelTypePercentagesOfVehicleType
    | EmptyObject;
  vmtAndStockByState: VMTandStockByState | EmptyObject;
  ldvsFhwaMovesVMTRatioByState: LDVsFhwaMovesVMTRatioByState | EmptyObject;
  vmtPerVehicleTypeByState: VMTPerVehicleTypeByState | EmptyObject;
  selectedRegionsTotalEffectiveVehicles:
    | SelectedRegionsTotalEffectiveVehicles
    | EmptyObject;
  selectedRegionsVMTPercentagesByState:
    | SelectedRegionsVMTPercentagesByState
    | EmptyObject;
  selectedRegionsAverageVMTPerYear:
    | SelectedRegionsAverageVMTPerYear
    | EmptyObject;
  selectedRegionsMonthlyVMT: SelectedRegionsMonthlyVMT | EmptyObject;
  selectedRegionsEVEfficiency: SelectedRegionsEVEfficiency | EmptyObject;
  selectedRegionsMonthlyEmissionRates:
    | SelectedRegionsMonthlyEmissionRates
    | EmptyObject;
  selectedRegionsMonthlyElectricityPM25EmissionRates:
    | SelectedRegionsMonthlyElectricityPM25EmissionRates
    | EmptyObject;
  selectedRegionsMonthlyTotalNetPM25EmissionRates:
    | SelectedRegionsMonthlyTotalNetPM25EmissionRates
    | EmptyObject;
  selectedRegionsMonthlySalesChanges:
    | SelectedRegionsMonthlySalesChanges
    | EmptyObject;
  selectedRegionsYearlySalesChanges:
    | SelectedRegionsYearlySalesChanges
    | EmptyObject;
  selectedRegionsTotalYearlySalesChanges:
    | SelectedRegionsTotalYearlySalesChanges
    | EmptyObject;
  selectedRegionsMonthlyEnergyUsage:
    | SelectedRegionsMonthlyEnergyUsage
    | EmptyObject;
  selectedRegionsMonthlyDailyEnergyUsage:
    | SelectedRegionsMonthlyDailyEnergyUsage
    | EmptyObject;
  selectedRegionsMonthlyEmissionChanges:
    | SelectedRegionsMonthlyEmissionChanges
    | EmptyObject;
  selectedRegionsMonthlyEmissionChangesPerVehicleCategory:
    | SelectedRegionsMonthlyEmissionChangesPerVehicleCategory
    | EmptyObject;
  selectedRegionsYearlyEmissionChangesPerVehicleCategory:
    | SelectedRegionsYearlyEmissionChangesPerVehicleCategory
    | EmptyObject;
  selectedRegionsMonthlyEmissionChangesTotals:
    | SelectedRegionsMonthlyEmissionChangesTotals
    | EmptyObject;
  selectedRegionsYearlyEmissionChangesTotals:
    | SelectedRegionsYearlyEmissionChangesTotals
    | EmptyObject;
  selectedGeographySalesAndStockByState:
    | SelectedGeographySalesAndStockByState
    | EmptyObject;
  selectedGeographySalesAndStockByRegion:
    | SelectedGeographySalesAndStockByRegion
    | EmptyObject;
  selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
  evDeploymentLocationHistoricalEERE: EVDeploymentLocationHistoricalEERE;
  vehicleEmissionChangesByGeography:
    | VehicleEmissionChangesByGeography
    | EmptyObject;
};

const initialState: State = {
  hourlyEVLoadProfiles: {},
  dailyStats: {},
  monthlyStats: {},
  vmtTotalsByGeography: {},
  monthlyVMTTotals: {},
  yearlyVMTTotals: {},
  monthlyVMTPercentages: {},
  vmtTotalsByStateRegionCombo: {},
  vmtTotalsByRegion: {},
  vmtTotalsByState: {},
  vmtRegionPercentagesByStateRegionCombo: {},
  vmtStatePercentagesByStateRegionCombo: {},
  vehicleTypeTotals: {},
  vehicleCategoryTotals: {},
  vehicleTypePercentagesOfVehicleCategory: {},
  vehicleFuelTypePercentagesOfVehicleType: {},
  vmtAndStockByState: {},
  ldvsFhwaMovesVMTRatioByState: {},
  vmtPerVehicleTypeByState: {},
  selectedRegionsTotalEffectiveVehicles: {},
  selectedRegionsVMTPercentagesByState: {},
  selectedRegionsAverageVMTPerYear: {},
  selectedRegionsMonthlyVMT: {},
  selectedRegionsEVEfficiency: {},
  selectedRegionsMonthlyEmissionRates: {},
  selectedRegionsMonthlyElectricityPM25EmissionRates: {},
  selectedRegionsMonthlyTotalNetPM25EmissionRates: {},
  selectedRegionsMonthlySalesChanges: {},
  selectedRegionsYearlySalesChanges: {},
  selectedRegionsTotalYearlySalesChanges: {},
  selectedRegionsMonthlyEnergyUsage: {},
  selectedRegionsMonthlyDailyEnergyUsage: {},
  selectedRegionsMonthlyEmissionChanges: {},
  selectedRegionsMonthlyEmissionChangesPerVehicleCategory: {},
  selectedRegionsYearlyEmissionChangesPerVehicleCategory: {},
  selectedRegionsMonthlyEmissionChangesTotals: {},
  selectedRegionsYearlyEmissionChangesTotals: {},
  selectedGeographySalesAndStockByState: {},
  selectedGeographySalesAndStockByRegion: {},
  selectedRegionsEEREDefaultsAverages: {},
  evDeploymentLocationHistoricalEERE: {
    averageAnnualCapacityAddedMW: { wind: 0, upv: 0, eeRetail: 0 },
    estimatedAnnualImpactsGWh: { wind: 0, upv: 0, eeRetail: 0 },
  },
  vehicleEmissionChangesByGeography: {},
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case "transportation/SET_HOURLY_EV_LOAD_PROFILES": {
      const { hourlyEVLoadProfiles } = action.payload;

      return {
        ...state,
        hourlyEVLoadProfiles,
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

    case "transportation/SET_VMT_TOTALS_BY_GEOGRAPHY": {
      const { vmtTotalsByGeography } = action.payload;

      return {
        ...state,
        vmtTotalsByGeography,
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

    case "transportation/SET_VMT_TOTALS_BY_STATE": {
      const { vmtTotalsByState } = action.payload;

      return {
        ...state,
        vmtTotalsByState,
      };
    }

    case "transportation/SET_VMT_REGION_PERCENTAGES_BY_STATE_REGION_COMBO": {
      const { vmtRegionPercentagesByStateRegionCombo } = action.payload;

      return {
        ...state,
        vmtRegionPercentagesByStateRegionCombo,
      };
    }

    case "transportation/SET_VMT_STATE_PERCENTAGES_BY_STATE_REGION_COMBO": {
      const { vmtStatePercentagesByStateRegionCombo } = action.payload;

      return {
        ...state,
        vmtStatePercentagesByStateRegionCombo,
      };
    }

    case "transportation/SET_VEHICLE_TYPE_TOTALS": {
      const { vehicleTypeTotals } = action.payload;

      return {
        ...state,
        vehicleTypeTotals,
      };
    }

    case "transportation/SET_VEHICLE_CATEGORY_TOTALS": {
      const { vehicleCategoryTotals } = action.payload;

      return {
        ...state,
        vehicleCategoryTotals,
      };
    }

    case "transportation/SET_VEHICLE_TYPE_PERCENTAGES_OF_VEHICLE_CATEGORY": {
      const { vehicleTypePercentagesOfVehicleCategory } = action.payload;

      return {
        ...state,
        vehicleTypePercentagesOfVehicleCategory,
      };
    }

    case "transportation/SET_VEHICLE_FUEL_TYPE_PERCENTAGES_OF_VEHICLE_TYPE": {
      const { vehicleFuelTypePercentagesOfVehicleType } = action.payload;

      return {
        ...state,
        vehicleFuelTypePercentagesOfVehicleType,
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

    case "transportation/SET_SELECTED_REGIONS_TOTAL_EFFECTIVE_VEHICLES": {
      const { selectedRegionsTotalEffectiveVehicles } = action.payload;

      return {
        ...state,
        selectedRegionsTotalEffectiveVehicles,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_BY_STATE": {
      const { selectedRegionsVMTPercentagesByState } = action.payload;

      return {
        ...state,
        selectedRegionsVMTPercentagesByState,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR": {
      const { selectedRegionsAverageVMTPerYear } = action.payload;

      return {
        ...state,
        selectedRegionsAverageVMTPerYear,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_VMT": {
      const { selectedRegionsMonthlyVMT } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyVMT,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_EV_EFFICIENCY": {
      const { selectedRegionsEVEfficiency } = action.payload;

      return {
        ...state,
        selectedRegionsEVEfficiency,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES": {
      const { selectedRegionsMonthlyEmissionRates } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEmissionRates,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_ELECTRICITY_PM25_EMISSION_RATES": {
      const { selectedRegionsMonthlyElectricityPM25EmissionRates } =
        action.payload;

      return {
        ...state,
        selectedRegionsMonthlyElectricityPM25EmissionRates,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_TOTAL_NET_PM25_EMISSION_RATES": {
      const { selectedRegionsMonthlyTotalNetPM25EmissionRates } =
        action.payload;

      return {
        ...state,
        selectedRegionsMonthlyTotalNetPM25EmissionRates,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_SALES_CHANGES": {
      const { selectedRegionsMonthlySalesChanges } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlySalesChanges,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_YEARLY_SALES_CHANGES": {
      const { selectedRegionsYearlySalesChanges } = action.payload;

      return {
        ...state,
        selectedRegionsYearlySalesChanges,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_SALES_CHANGES": {
      const { selectedRegionsTotalYearlySalesChanges } = action.payload;

      return {
        ...state,
        selectedRegionsTotalYearlySalesChanges,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_ENERGY_USAGE": {
      const { selectedRegionsMonthlyEnergyUsage } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEnergyUsage,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_ENERGY_USAGE": {
      const { selectedRegionsMonthlyDailyEnergyUsage } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyDailyEnergyUsage,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES": {
      const { selectedRegionsMonthlyEmissionChanges } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEmissionChanges,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES_PER_VEHICLE_CATEGORY": {
      const { selectedRegionsMonthlyEmissionChangesPerVehicleCategory } =
        action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEmissionChangesPerVehicleCategory,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_YEARLY_EMISSION_CHANGES_PER_VEHICLE_CATEGORY": {
      const { selectedRegionsYearlyEmissionChangesPerVehicleCategory } =
        action.payload;

      return {
        ...state,
        selectedRegionsYearlyEmissionChangesPerVehicleCategory,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES_TOTALS": {
      const { selectedRegionsMonthlyEmissionChangesTotals } = action.payload;

      return {
        ...state,
        selectedRegionsMonthlyEmissionChangesTotals,
      };
    }

    case "transportation/SET_SELECTED_REGIONS_YEARLY_EMISSION_CHANGES_TOTALS": {
      const { selectedRegionsYearlyEmissionChangesTotals } = action.payload;

      return {
        ...state,
        selectedRegionsYearlyEmissionChangesTotals,
      };
    }

    case "transportation/SET_SELECTED_GEOGRAPHY_SALES_AND_STOCK_BY_STATE": {
      const { selectedGeographySalesAndStockByState } = action.payload;

      return {
        ...state,
        selectedGeographySalesAndStockByState,
      };
    }

    case "transportation/SET_SELECTED_GEOGRAPHY_SALES_AND_STOCK_BY_REGION": {
      const { selectedGeographySalesAndStockByRegion } = action.payload;

      return {
        ...state,
        selectedGeographySalesAndStockByRegion,
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

    case "transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY": {
      const { vehicleEmissionChangesByGeography } = action.payload;

      return {
        ...state,
        vehicleEmissionChangesByGeography,
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
    const regionIdsByRegionName = Object.values(regions).reduce(
      (object, { id, name }) => {
        object[name] = id;
        return object;
      },
      {} as {
        [regionName: string]: RegionId;
      },
    );

    const vmtTotalsByGeography = calculateVMTTotalsByGeography({
      regionIdsByRegionName,
      countyFips,
    });

    const monthlyVMTTotals = calculateMonthlyVMTTotals({ movesEmissionRates });

    const yearlyVMTTotals = calculateYearlyVMTTotals({ monthlyVMTTotals });

    const monthlyVMTPercentages = calculateMonthlyVMTPercentages({
      monthlyVMTTotals,
      yearlyVMTTotals,
      schoolBusMonthlyVMTPercentages,
    });

    const vmtTotalsByStateRegionCombo = calculateVMTTotalsByStateRegionCombo({
      countyFips,
    });

    const vmtTotalsByRegion = calculateVMTTotalsByRegion({
      vmtTotalsByStateRegionCombo,
    });

    const vmtTotalsByState = calculateVMTTotalsByState({
      vmtTotalsByStateRegionCombo,
    });

    const vmtRegionPercentagesByStateRegionCombo =
      calculateVMTRegionPercentagesByStateRegionCombo({
        vmtTotalsByStateRegionCombo,
        vmtTotalsByRegion,
      });

    const vmtStatePercentagesByStateRegionCombo =
      calculateVMTStatePercentagesByStateRegionCombo({
        vmtTotalsByStateRegionCombo,
        vmtTotalsByState,
      });

    const vehicleTypeTotals = calculateVehicleTypeTotals({
      stateLevelVMT,
    });

    const vehicleCategoryTotals = calculateVehicleCategoryTotals({
      vehicleTypeTotals,
      vehicleTypesByVehicleCategory,
    });

    const vehicleTypePercentagesOfVehicleCategory =
      calculateVehicleTypePercentagesOfVehicleCategory({
        vehicleTypeTotals,
        vehicleCategoryTotals,
        vehicleTypesByVehicleCategory,
        ldvsPercentagesByVehicleCategory,
      });

    const vehicleFuelTypePercentagesOfVehicleType =
      calculateVehicleFuelTypePercentagesOfVehicleType({
        movesEmissionRates,
      });

    const vmtAndStockByState = storeVMTandStockByState({
      stateLevelVMT,
    });

    const ldvsFhwaMovesVMTRatioByState = calculateLDVsFhwaMovesVMTRatioByState({
      fhwaLDVStateLevelVMT,
      vmtAndStockByState,
    });

    const vmtPerVehicleTypeByState = calculateVMTPerVehicleTypeByState({
      vmtAndStockByState,
      ldvsFhwaMovesVMTRatioByState,
    });

    dispatch({
      type: "transportation/SET_VMT_TOTALS_BY_GEOGRAPHY",
      payload: { vmtTotalsByGeography },
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

    dispatch({
      type: "transportation/SET_VMT_TOTALS_BY_STATE_REGION_COMBO",
      payload: { vmtTotalsByStateRegionCombo },
    });

    dispatch({
      type: "transportation/SET_VMT_TOTALS_BY_REGION",
      payload: { vmtTotalsByRegion },
    });

    dispatch({
      type: "transportation/SET_VMT_TOTALS_BY_STATE",
      payload: { vmtTotalsByState },
    });

    dispatch({
      type: "transportation/SET_VMT_REGION_PERCENTAGES_BY_STATE_REGION_COMBO",
      payload: { vmtRegionPercentagesByStateRegionCombo },
    });

    dispatch({
      type: "transportation/SET_VMT_STATE_PERCENTAGES_BY_STATE_REGION_COMBO",
      payload: { vmtStatePercentagesByStateRegionCombo },
    });

    dispatch({
      type: "transportation/SET_VEHICLE_TYPE_TOTALS",
      payload: { vehicleTypeTotals },
    });

    dispatch({
      type: "transportation/SET_VEHICLE_CATEGORY_TOTALS",
      payload: { vehicleCategoryTotals },
    });

    dispatch({
      type: "transportation/SET_VEHICLE_TYPE_PERCENTAGES_OF_VEHICLE_CATEGORY",
      payload: { vehicleTypePercentagesOfVehicleCategory },
    });

    dispatch({
      type: "transportation/SET_VEHICLE_FUEL_TYPE_PERCENTAGES_OF_VEHICLE_TYPE",
      payload: { vehicleFuelTypePercentagesOfVehicleType },
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
  };
}

/**
 * Called when the app starts.
 */
export function setHourlyEVLoadProfiles(): AppThunk {
  return (dispatch) => {
    const hourlyEVLoadProfiles = storeHourlyEVLoadProfiles({
      defaultEVLoadProfiles,
    });

    dispatch({
      type: "transportation/SET_HOURLY_EV_LOAD_PROFILES",
      payload: { hourlyEVLoadProfiles },
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
    const { regions, regionalScalingFactors } = geography;
    const { vmtRegionPercentagesByStateRegionCombo } = transportation;

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const selectedGeographyRegions = getSelectedGeographyRegions({
      regions,
      selectedGeographyRegionIds,
    });

    const selectedRegionsVMTPercentagesByState =
      calculateSelectedRegionsVMTPercentagesByState({
        selectedGeographyRegions,
        vmtRegionPercentagesByStateRegionCombo,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_BY_STATE",
      payload: { selectedRegionsVMTPercentagesByState },
    });

    // NOTE: `selectedRegionsMonthlyEmissionRates` uses `selectedRegionsVMTPercentagesByState`
    dispatch(setMonthlyEmissionRates());
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
    const { climateAdjustmentFactorByRegion, regionalScalingFactors } =
      geography;
    const { evModelYear } = impacts.inputs;

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const selectedRegionsEVEfficiency = calculateSelectedRegionsEVEfficiency({
      climateAdjustmentFactorByRegion,
      evEfficiencyAssumptions,
      selectedGeographyRegionIds,
      evModelYear,
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_EV_EFFICIENCY",
      payload: { selectedRegionsEVEfficiency },
    });

    // NOTE: `selectedRegionsMonthlySalesChanges` uses `selectedRegionsEVEfficiency`
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
    if (Object.keys(transportation.dailyStats).length !== 0) {
      return;
    }

    const dailyStats = calculateDailyStats({ regionalLoad });
    const monthlyStats = calculateMonthlyStats({ dailyStats });

    dispatch({
      type: "transportation/SET_DAILY_STATS",
      payload: { dailyStats },
    });

    dispatch({
      type: "transportation/SET_MONTHLY_STATS",
      payload: { monthlyStats },
    });

    // NOTE: `selectedRegionsMonthlyDailyEnergyUsage` uses `monthlyStats`
    dispatch(setMonthlyDailyEnergyUsage());
  };
}

/**
 * Called every time the `geography` reducer's `selectGeography()`,
 * `selectRegion()`, or `selectState()` functions are called and every time the
 * `impacts` reducer's `runEVBatteryEVsCalculations()`,
 * `runEVHybridEVsCalculations()`, `runEVTransitBusesCalculations()`,
 * `runEVSchoolBusesCalculations()`, `runEVShortHaulTrucksCalculations()`,
 * `runEVComboLongHaulTrucksCalculations()`, or `runEVRefuseTrucksCalculations()`
 * functions are called.
 *
 * _(e.g. anytime the selected geography changes, and onBlur / whenever an EV
 * input loses focus, but only if the input's value has changed since the last
 * time it was used in this calculation)_
 */
export function setEffectiveVehicles(): AppThunk {
  return (dispatch, getState) => {
    const { geography, transportation, impacts } = getState();
    const { regions, regionalScalingFactors } = geography;
    const {
      vmtStatePercentagesByStateRegionCombo,
      vehicleTypePercentagesOfVehicleCategory,
      vehicleFuelTypePercentagesOfVehicleType,
    } = transportation;
    const {
      batteryEVs,
      hybridEVs,
      transitBuses,
      schoolBuses,
      shortHaulTrucks,
      comboLongHaulTrucks,
      refuseTrucks,
    } = impacts.inputs;

    const geographicFocus = geography.focus;

    const selectedStateId =
      Object.values(geography.states).find((s) => s.selected)?.id || "";

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const selectedGeographyRegions = getSelectedGeographyRegions({
      regions,
      selectedGeographyRegionIds,
    });

    const selectedRegionsTotalEffectiveVehicles =
      calculateSelectedRegionsTotalEffectiveVehicles({
        geographicFocus,
        selectedStateId,
        selectedGeographyRegions,
        vmtStatePercentagesByStateRegionCombo,
        vehicleTypePercentagesOfVehicleCategory,
        vehicleFuelTypePercentagesOfVehicleType,
        batteryEVs: Number(batteryEVs),
        hybridEVs: Number(hybridEVs),
        transitBuses: Number(transitBuses),
        schoolBuses: Number(schoolBuses),
        shortHaulTrucks: Number(shortHaulTrucks),
        comboLongHaulTrucks: Number(comboLongHaulTrucks),
        refuseTrucks: Number(refuseTrucks),
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_EFFECTIVE_VEHICLES",
      payload: { selectedRegionsTotalEffectiveVehicles },
    });

    // NOTE: `selectedRegionsMonthlySalesChanges` uses `selectedRegionsTotalEffectiveVehicles`
    dispatch(setMonthlyEVEnergyUsage());

    // NOTE: `selectedRegionsMonthlyEmissionChanges` uses `selectedRegionsTotalEffectiveVehicles`
    dispatch(setEmissionChanges());
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedGeographyVMTData()`, `setEVEfficiency()`, or
 * `setEffectiveVehicles()` functions are called.
 *
 * _(e.g. anytime the selected geography, EV model year, or an EV input number
 * changes)_
 */
export function setMonthlyEVEnergyUsage(): AppThunk {
  return (dispatch, getState) => {
    const { transportation } = getState();
    const {
      selectedRegionsTotalEffectiveVehicles,
      selectedRegionsMonthlyVMT,
      selectedRegionsEVEfficiency,
    } = transportation;

    const selectedRegionsMonthlySalesChanges =
      calculateSelectedRegionsMonthlySalesChanges({
        selectedRegionsTotalEffectiveVehicles,
        selectedRegionsMonthlyVMT,
        selectedRegionsEVEfficiency,
        percentageHybridEVMilesDrivenOnElectricity,
      });

    const selectedRegionsYearlySalesChanges =
      calculateSelectedRegionsYearlySalesChanges({
        selectedRegionsMonthlySalesChanges,
      });

    const selectedRegionsTotalYearlySalesChanges =
      calculateSelectedRegionsTotalYearlySalesChanges({
        selectedRegionsYearlySalesChanges,
      });

    const selectedRegionsMonthlyEnergyUsage =
      calculateSelectedRegionsMonthlyEnergyUsage({
        selectedRegionsMonthlySalesChanges,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_SALES_CHANGES",
      payload: { selectedRegionsMonthlySalesChanges },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_YEARLY_SALES_CHANGES",
      payload: { selectedRegionsYearlySalesChanges },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_TOTAL_YEARLY_SALES_CHANGES",
      payload: { selectedRegionsTotalYearlySalesChanges },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_ENERGY_USAGE",
      payload: { selectedRegionsMonthlyEnergyUsage },
    });

    // NOTE: `selectedRegionsMonthlyDailyEnergyUsage` uses `selectedRegionsMonthlyEnergyUsage`
    dispatch(setMonthlyDailyEnergyUsage());
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
export function setMonthlyDailyEnergyUsage(): AppThunk {
  return (dispatch, getState) => {
    const { transportation } = getState();
    const { monthlyStats, selectedRegionsMonthlyEnergyUsage } = transportation;

    const selectedRegionsMonthlyDailyEnergyUsage =
      calculateSelectedRegionsMonthlyDailyEnergyUsage({
        selectedRegionsMonthlyEnergyUsage,
        weekendToWeekdayEVConsumption,
        monthlyStats,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_ENERGY_USAGE",
      payload: { selectedRegionsMonthlyDailyEnergyUsage },
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
    const {
      monthlyVMTPercentages,
      vmtPerVehicleTypeByState,
      selectedRegionsVMTPercentagesByState,
    } = transportation;
    const { evDeploymentLocation, evModelYear, iceReplacementVehicle } =
      impacts.inputs;

    const selectedRegionsAverageVMTPerYear =
      calculateSelectedRegionsAverageVMTPerYear({
        evDeploymentLocation,
        vmtPerVehicleTypeByState,
        selectedRegionsVMTPercentagesByState,
      });

    const selectedRegionsMonthlyVMT = calculateSelectedRegionsMonthlyVMT({
      selectedRegionsAverageVMTPerYear,
      monthlyVMTPercentages,
    });

    const selectedRegionsMonthlyEmissionRates =
      calculateSelectedRegionsMonthlyEmissionRates({
        selectedRegionsVMTPercentagesByState,
        movesEmissionRates,
        evDeploymentLocation,
        evModelYear,
        iceReplacementVehicle,
      });

    const selectedRegionsMonthlyElectricityPM25EmissionRates =
      calculateSelectedRegionsMonthlyElectricityPM25EmissionRates({
        selectedRegionsMonthlyEmissionRates,
        pm25BreakwearTirewearEVICERatios,
        evModelYear,
      });

    const selectedRegionsMonthlyTotalNetPM25EmissionRates =
      calculateSelectedRegionsMonthlyTotalNetPM25EmissionRates({
        selectedRegionsMonthlyEmissionRates,
        selectedRegionsMonthlyElectricityPM25EmissionRates,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR",
      payload: { selectedRegionsAverageVMTPerYear },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_VMT",
      payload: { selectedRegionsMonthlyVMT },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES",
      payload: { selectedRegionsMonthlyEmissionRates },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_ELECTRICITY_PM25_EMISSION_RATES",
      payload: { selectedRegionsMonthlyElectricityPM25EmissionRates },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_TOTAL_NET_PM25_EMISSION_RATES",
      payload: { selectedRegionsMonthlyTotalNetPM25EmissionRates },
    });

    // NOTE: `selectedRegionsMonthlySalesChanges` uses `selectedRegionsMonthlyVMT`
    dispatch(setMonthlyEVEnergyUsage());

    /**
     * NOTE: `selectedRegionsMonthlyEmissionChanges` uses `selectedRegionsMonthlyVMT`,
     * `selectedRegionsMonthlyEmissionRates`, and `selectedRegionsMonthlyTotalNetPM25EmissionRates`
     */
    dispatch(setEmissionChanges());
  };
}

/**
 * Called every time this `transportation` reducer's
 * `setSelectedGeographyVMTData()`, `setEffectiveVehicles()`, or
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
      vmtTotalsByGeography,
      selectedRegionsTotalEffectiveVehicles,
      selectedRegionsMonthlyVMT,
      selectedRegionsMonthlyEmissionRates,
      selectedRegionsMonthlyTotalNetPM25EmissionRates,
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
        selectedRegionsTotalEffectiveVehicles,
        selectedRegionsMonthlyEmissionRates,
        selectedRegionsMonthlyTotalNetPM25EmissionRates,
        selectedRegionsMonthlyVMT,
        percentageHybridEVMilesDrivenOnElectricity,
      });

    const selectedRegionsMonthlyEmissionChangesPerVehicleCategory =
      calculateSelectedRegionsMonthlyEmissionChangesPerVehicleCategory({
        selectedRegionsMonthlyEmissionChanges,
      });

    const selectedRegionsYearlyEmissionChangesPerVehicleCategory =
      calculateSelectedRegionsYearlyEmissionChangesPerVehicleCategory({
        selectedRegionsMonthlyEmissionChangesPerVehicleCategory,
      });

    const selectedRegionsMonthlyEmissionChangesTotals =
      calculateSelectedRegionsMonthlyEmissionChangesTotals({
        selectedRegionsMonthlyEmissionChangesPerVehicleCategory,
      });

    const selectedRegionsYearlyEmissionChangesTotals =
      calculateSelectedRegionsYearlyEmissionChangesTotals({
        selectedRegionsMonthlyEmissionChangesTotals,
      });

    const countiesByRegions = countiesByGeography?.regions || {};

    const selectedRegionsCounties = Object.entries(countiesByRegions).reduce(
      (object, [countiesByRegionKey, countiesByRegionValue]) => {
        const regionId = countiesByRegionKey as keyof typeof countiesByRegions;

        if (selectedGeographyRegionIds.includes(regionId)) {
          object[regionId] = countiesByRegionValue;
        }

        return object;
      },
      {} as Partial<{
        [regionId in RegionId]: Partial<{
          [stateId in StateId]: string[];
        }>;
      }>,
    );

    const vehicleEmissionChangesByGeography =
      calculateVehicleEmissionChangesByGeography({
        geographicFocus,
        selectedRegionId,
        selectedStateId,
        selectedRegionsCounties,
        vmtTotalsByGeography,
        selectedRegionsYearlyEmissionChangesPerVehicleCategory,
        evDeploymentLocation,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES",
      payload: { selectedRegionsMonthlyEmissionChanges },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES_PER_VEHICLE_CATEGORY",
      payload: { selectedRegionsMonthlyEmissionChangesPerVehicleCategory },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_YEARLY_EMISSION_CHANGES_PER_VEHICLE_CATEGORY",
      payload: { selectedRegionsYearlyEmissionChangesPerVehicleCategory },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES_TOTALS",
      payload: { selectedRegionsMonthlyEmissionChangesTotals },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_YEARLY_EMISSION_CHANGES_TOTALS",
      payload: { selectedRegionsYearlyEmissionChangesTotals },
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
    const { geography, impacts } = getState();
    const { regions } = geography;
    const { evDeploymentLocationOptions } = impacts.selectOptions;

    const geographicFocus = geography.focus;

    const selectedRegion = Object.values(regions).find((r) => r.selected);

    const selectedRegionName =
      geographicFocus === "regions" ? selectedRegion?.name || "" : "";

    const selectedGeographyStates = evDeploymentLocationOptions.reduce(
      (array, option) => {
        const stateId = option.id.split("state-")[1] as StateId;
        if (stateId) array.push(stateId);
        return array;
      },
      [] as StateId[],
    );

    const selectedGeographySalesAndStockByState =
      calculateSelectedGeographySalesAndStockByState({
        countyFips,
        stateLevelSales,
        geographicFocus,
        selectedRegionName,
        selectedGeographyStates,
      });

    const selectedGeographySalesAndStockByRegion =
      calculateSelectedGeographySalesAndStockByRegion({
        geographicFocus,
        selectedGeographySalesAndStockByState,
      });

    dispatch({
      type: "transportation/SET_SELECTED_GEOGRAPHY_SALES_AND_STOCK_BY_STATE",
      payload: { selectedGeographySalesAndStockByState },
    });

    dispatch({
      type: "transportation/SET_SELECTED_GEOGRAPHY_SALES_AND_STOCK_BY_REGION",
      payload: { selectedGeographySalesAndStockByRegion },
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
        selectedGeographyRegions,
        regionalScalingFactors,
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
    const { regions, regionalLineLoss } = geography;
    const { evDeploymentLocation } = impacts.inputs;
    const { selectedRegionsEEREDefaultsAverages } = transportation;

    const evDeploymentLocationHistoricalEERE =
      calculateEVDeploymentLocationHistoricalEERE({
        selectedRegionsEEREDefaultsAverages,
        historicalRegionEEREData,
        historicalStateEEREData,
        evDeploymentLocation,
        regionalLineLoss,
        regions,
      });

    dispatch({
      type: "transportation/SET_EV_DEPLOYMENT_LOCATION_HISTORICAL_EERE",
      payload: { evDeploymentLocationHistoricalEERE },
    });
  };
}
