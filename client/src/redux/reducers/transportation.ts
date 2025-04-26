import { type AppThunk } from "@/redux/index";
import { getSelectedGeographyRegions } from "@/calculations/geography";
import {
  type VMTTotalsByGeography,
  type VMTBillionsAndPercentages,
  type StateVMTPercentagesByRegion,
  type VMTAllocationPerVehicle,
  type MonthlyVMTTotals,
  type YearlyVMTTotals,
  type MonthlyVMTPercentages,
  type VMTTotalsByStateRegionCombo,
  type VMTTotalsByRegion,
  type VMTPercentagesByStateRegionCombo,
  type VehicleTypeTotals,
  type VehicleCategoryTotals,
  type VehicleTypePercentagesOfVehicleCategory,
  type VehicleFuelTypePercentagesOfVehicleType,
  type TotalEffectiveVehicles,
  type VMTandStockByState,
  type LDVsFhwaMovesVMTRatioByState,
  type VMTPerVehicleTypeByState,
  type SelectedRegionsVMTPercentagesByState,
  type SelectedRegionsAverageVMTPerYear,
  type SelectedRegionsMonthlyVMT,
  type SelectedRegionsEVEfficiency,
  type SelectedRegionsMonthlyEmissionRates,
  type SelectedRegionsMonthlyElectricityPM25EmissionRates,
  type SelectedRegionsMonthlyTotalNetPM25EmissionRates,
  type SelectedRegionsMonthlySalesChanges,
  type SelectedRegionsYearlySalesChanges,
  type SelectedRegionsMonthlyEmissionChanges,
  type SelectedRegionsMonthlyEmissionChangesPerVehicleCategory,
  type SelectedRegionsMonthlyEmissionChangesTotals,
  type SelectedRegionsYearlyEmissionChangesTotals,
  type SelectedGeographySalesAndStockByState,
  type SelectedGeographySalesAndStockByRegion,
  type HourlyEVChargingPercentages,
  type _SelectedRegionsStatesVMTPercentages,
  type _SelectedRegionsVMTPercentagesPerVehicleType,
  type _SelectedRegionsAverageVMTPerYear,
  type _SelectedRegionsMonthlyVMTPerVehicleType,
  type _SelectedRegionsEVEfficiencyPerVehicleType,
  type DailyStats,
  type MonthlyStats,
  type _VehiclesDisplaced,
  type _SelectedRegionsMonthlyEVEnergyUsageGW,
  type SelectedRegionsMonthlyEVEnergyUsageMW,
  type _SelectedRegionsTotalYearlyEVEnergyUsage,
  type SelectedRegionsMonthlyDailyEVEnergyUsage,
  type _SelectedRegionsMonthlyEmissionRates,
  type _SelectedRegionsMonthlyEmissionChanges,
  type _SelectedRegionsTotalMonthlyEmissionChanges,
  type _SelectedRegionsTotalYearlyEmissionChanges,
  type VehicleEmissionChangesByGeography,
  type SelectedRegionsEEREDefaultsAverages,
  type EVDeploymentLocationHistoricalEERE,
  vehicleTypesByVehicleCategory,
  calculateVMTTotalsByGeography,
  calculateVMTBillionsAndPercentages,
  calculateStateVMTPercentagesByRegion,
  calculateVMTAllocationPerVehicle,
  calculateMonthlyVMTTotals,
  calculateYearlyVMTTotals,
  calculateMonthlyVMTPercentages,
  calculateVMTTotalsByStateRegionCombo,
  calculateVMTTotalsByRegion,
  calculateVMTPercentagesByStateRegionCombo,
  calculateVehicleTypeTotals,
  calculateVehicleCategoryTotals,
  calculateVehicleTypePercentagesOfVehicleCategory,
  calculateVehicleFuelTypePercentagesOfVehicleType,
  calculateTotalEffectiveVehicles,
  storeVMTandStockByState,
  calculateLDVsFhwaMovesVMTRatioByState,
  calculateVMTPerVehicleTypeByState,
  calculateSelectedRegionsVMTPercentagesByState,
  calculateSelectedRegionsAverageVMTPerYear,
  calculateSelectedRegionsMonthlyVMT,
  calculateSelectedRegionsEVEfficiency,
  calculateSelectedRegionsMonthlyEmissionRates,
  calculateSelectedRegionsMonthlyElectricityPM25EmissionRates,
  calculateSelectedRegionsMonthlyTotalNetPM25EmissionRates,
  calculateSelectedRegionsMonthlySalesChanges,
  calculateSelectedRegionsYearlySalesChanges,
  calculateSelectedRegionsMonthlyEmissionChanges,
  calculateSelectedRegionsMonthlyEmissionChangesPerVehicleCategory,
  calculateSelectedRegionsMonthlyEmissionChangesTotals,
  calculateSelectedRegionsYearlyEmissionChangesTotals,
  calculateSelectedGeographySalesAndStockByState,
  calculateSelectedGeographySalesAndStockByRegion,
  calculateHourlyEVChargingPercentages,
  _calculateSelectedRegionsStatesVMTPercentages,
  _calculateSelectedRegionsVMTPercentagesPerVehicleType,
  _calculateSelectedRegionsAverageVMTPerYear,
  _calculateSelectedRegionsMonthlyVMTPerVehicleType,
  _calculateSelectedRegionsEVEfficiencyPerVehicleType,
  calculateDailyStats,
  calculateMonthlyStats,
  _calculateVehiclesDisplaced,
  _calculateSelectedRegionsMonthlyEVEnergyUsageGW,
  calculateSelectedRegionsMonthlyEVEnergyUsageMW,
  _calculateSelectedRegionsTotalYearlyEVEnergyUsage,
  calculateSelectedRegionsMonthlyDailyEVEnergyUsage,
  _calculateSelectedRegionsMonthlyEmissionRates,
  _calculateSelectedRegionsMonthlyEmissionChanges,
  _calculateSelectedRegionsTotalMonthlyEmissionChanges,
  _calculateSelectedRegionsTotalYearlyEmissionChanges,
  calculateVehicleEmissionChangesByGeography,
  calculateSelectedRegionsEEREDefaultsAverages,
  calculateEVDeploymentLocationHistoricalEERE,
} from "@/calculations/transportation";
import { type EmptyObject } from "@/utilities";
import {
  type CountyFIPS,
  type MOVESEmissionRates,
  type RegionId,
  type StateId,
  percentageHybridEVMilesDrivenOnElectricity,
  percentageAdditionalEnergyConsumedFactor,
  regionAverageTemperatures,
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
      type: "transportation/SET_VMT_PERCENTAGES_BY_STATE_REGION_COMBO";
      payload: {
        vmtPercentagesByStateRegionCombo: VMTTotalsByStateRegionCombo;
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
      type: "transportation/SET_TOTAL_EFFECTIVE_VEHICLES";
      payload: {
        totalEffectiveVehicles: TotalEffectiveVehicles;
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
      type: "transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES";
      payload: { hourlyEVChargingPercentages: HourlyEVChargingPercentages };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES";
      payload: {
        _selectedRegionsStatesVMTPercentages: _SelectedRegionsStatesVMTPercentages;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE";
      payload: {
        _selectedRegionsVMTPercentagesPerVehicleType: _SelectedRegionsVMTPercentagesPerVehicleType;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR";
      payload: {
        _selectedRegionsAverageVMTPerYear: _SelectedRegionsAverageVMTPerYear;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE";
      payload: {
        _selectedRegionsMonthlyVMTPerVehicleType: _SelectedRegionsMonthlyVMTPerVehicleType;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_EV_EFFICIENCY_PER_VEHICLE_TYPE";
      payload: {
        _selectedRegionsEVEfficiencyPerVehicleType: _SelectedRegionsEVEfficiencyPerVehicleType;
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
      type: "transportation/_SET_VEHICLES_DISPLACED";
      payload: { _vehiclesDisplaced: _VehiclesDisplaced };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW";
      payload: {
        _selectedRegionsMonthlyEVEnergyUsageGW: _SelectedRegionsMonthlyEVEnergyUsageGW;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_MW";
      payload: {
        selectedRegionsMonthlyEVEnergyUsageMW: SelectedRegionsMonthlyEVEnergyUsageMW;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE";
      payload: {
        _selectedRegionsTotalYearlyEVEnergyUsage: _SelectedRegionsTotalYearlyEVEnergyUsage;
      };
    }
  | {
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_DAILY_EV_ENERGY_USAGE";
      payload: {
        selectedRegionsMonthlyDailyEVEnergyUsage: SelectedRegionsMonthlyDailyEVEnergyUsage;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES";
      payload: {
        _selectedRegionsMonthlyEmissionRates: _SelectedRegionsMonthlyEmissionRates;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES";
      payload: {
        _selectedRegionsMonthlyEmissionChanges: _SelectedRegionsMonthlyEmissionChanges;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES";
      payload: {
        _selectedRegionsTotalMonthlyEmissionChanges: _SelectedRegionsTotalMonthlyEmissionChanges;
      };
    }
  | {
      type: "transportation/_SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES";
      payload: {
        _selectedRegionsTotalYearlyEmissionChanges: _SelectedRegionsTotalYearlyEmissionChanges;
      };
    }
  | {
      type: "transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY";
      payload: {
        vehicleEmissionChangesByGeography: VehicleEmissionChangesByGeography;
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
    };

type State = {
  vmtTotalsByGeography: VMTTotalsByGeography | EmptyObject;
  vmtBillionsAndPercentages: VMTBillionsAndPercentages | EmptyObject;
  stateVMTPercentagesByRegion: StateVMTPercentagesByRegion | EmptyObject;
  vmtAllocationPerVehicle: VMTAllocationPerVehicle | EmptyObject;
  monthlyVMTTotals: MonthlyVMTTotals | EmptyObject;
  yearlyVMTTotals: YearlyVMTTotals | EmptyObject;
  monthlyVMTPercentages: MonthlyVMTPercentages | EmptyObject;
  vmtTotalsByStateRegionCombo: VMTTotalsByStateRegionCombo | EmptyObject;
  vmtTotalsByRegion: VMTTotalsByRegion | EmptyObject;
  vmtPercentagesByStateRegionCombo:
    | VMTPercentagesByStateRegionCombo
    | EmptyObject;
  vehicleTypeTotals: VehicleTypeTotals | EmptyObject;
  vehicleCategoryTotals: VehicleCategoryTotals | EmptyObject;
  vehicleTypePercentagesOfVehicleCategory:
    | VehicleTypePercentagesOfVehicleCategory
    | EmptyObject;
  vehicleFuelTypePercentagesOfVehicleType:
    | VehicleFuelTypePercentagesOfVehicleType
    | EmptyObject;
  totalEffectiveVehicles: TotalEffectiveVehicles | EmptyObject;
  vmtAndStockByState: VMTandStockByState | EmptyObject;
  ldvsFhwaMovesVMTRatioByState: LDVsFhwaMovesVMTRatioByState | EmptyObject;
  vmtPerVehicleTypeByState: VMTPerVehicleTypeByState | EmptyObject;
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
  selectedRegionsMonthlyEmissionChanges:
    | SelectedRegionsMonthlyEmissionChanges
    | EmptyObject;
  selectedRegionsMonthlyEmissionChangesPerVehicleCategory:
    | SelectedRegionsMonthlyEmissionChangesPerVehicleCategory
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
  hourlyEVChargingPercentages: HourlyEVChargingPercentages;
  _selectedRegionsStatesVMTPercentages:
    | _SelectedRegionsStatesVMTPercentages
    | EmptyObject;
  _selectedRegionsVMTPercentagesPerVehicleType:
    | _SelectedRegionsVMTPercentagesPerVehicleType
    | EmptyObject;
  _selectedRegionsAverageVMTPerYear:
    | _SelectedRegionsAverageVMTPerYear
    | EmptyObject;
  _selectedRegionsMonthlyVMTPerVehicleType:
    | _SelectedRegionsMonthlyVMTPerVehicleType
    | EmptyObject;
  _selectedRegionsEVEfficiencyPerVehicleType:
    | _SelectedRegionsEVEfficiencyPerVehicleType
    | EmptyObject;
  dailyStats: DailyStats;
  monthlyStats: MonthlyStats;
  _vehiclesDisplaced: _VehiclesDisplaced;
  _selectedRegionsMonthlyEVEnergyUsageGW:
    | _SelectedRegionsMonthlyEVEnergyUsageGW
    | EmptyObject;
  selectedRegionsMonthlyEVEnergyUsageMW:
    | SelectedRegionsMonthlyEVEnergyUsageMW
    | EmptyObject;
  _selectedRegionsTotalYearlyEVEnergyUsage:
    | _SelectedRegionsTotalYearlyEVEnergyUsage
    | EmptyObject;
  selectedRegionsMonthlyDailyEVEnergyUsage:
    | SelectedRegionsMonthlyDailyEVEnergyUsage
    | EmptyObject;
  _selectedRegionsMonthlyEmissionRates:
    | _SelectedRegionsMonthlyEmissionRates
    | EmptyObject;
  _selectedRegionsMonthlyEmissionChanges:
    | _SelectedRegionsMonthlyEmissionChanges
    | EmptyObject;
  _selectedRegionsTotalMonthlyEmissionChanges:
    | _SelectedRegionsTotalMonthlyEmissionChanges
    | EmptyObject;
  _selectedRegionsTotalYearlyEmissionChanges:
    | _SelectedRegionsTotalYearlyEmissionChanges
    | EmptyObject;
  vehicleEmissionChangesByGeography:
    | VehicleEmissionChangesByGeography
    | EmptyObject;
  selectedRegionsEEREDefaultsAverages: SelectedRegionsEEREDefaultsAverages;
  evDeploymentLocationHistoricalEERE: EVDeploymentLocationHistoricalEERE;
};

const initialState: State = {
  vmtTotalsByGeography: {},
  vmtBillionsAndPercentages: {},
  stateVMTPercentagesByRegion: {},
  vmtAllocationPerVehicle: {},
  monthlyVMTTotals: {},
  yearlyVMTTotals: {},
  monthlyVMTPercentages: {},
  vmtTotalsByStateRegionCombo: {},
  vmtTotalsByRegion: {},
  vmtPercentagesByStateRegionCombo: {},
  vehicleTypeTotals: {},
  vehicleCategoryTotals: {},
  vehicleTypePercentagesOfVehicleCategory: {},
  vehicleFuelTypePercentagesOfVehicleType: {},
  totalEffectiveVehicles: {},
  vmtAndStockByState: {},
  ldvsFhwaMovesVMTRatioByState: {},
  vmtPerVehicleTypeByState: {},
  selectedRegionsVMTPercentagesByState: {},
  selectedRegionsAverageVMTPerYear: {},
  selectedRegionsMonthlyVMT: {},
  selectedRegionsEVEfficiency: {},
  selectedRegionsMonthlyEmissionRates: {},
  selectedRegionsMonthlyElectricityPM25EmissionRates: {},
  selectedRegionsMonthlyTotalNetPM25EmissionRates: {},
  selectedRegionsMonthlySalesChanges: {},
  selectedRegionsYearlySalesChanges: {},
  selectedRegionsMonthlyEmissionChanges: {},
  selectedRegionsMonthlyEmissionChangesPerVehicleCategory: {},
  selectedRegionsMonthlyEmissionChangesTotals: {},
  selectedRegionsYearlyEmissionChangesTotals: {},
  selectedGeographySalesAndStockByState: {},
  selectedGeographySalesAndStockByRegion: {},
  hourlyEVChargingPercentages: {},
  _selectedRegionsStatesVMTPercentages: {},
  _selectedRegionsVMTPercentagesPerVehicleType: {},
  _selectedRegionsAverageVMTPerYear: {},
  _selectedRegionsMonthlyVMTPerVehicleType: {},
  _selectedRegionsEVEfficiencyPerVehicleType: {},
  dailyStats: {},
  monthlyStats: {},
  _vehiclesDisplaced: {
    batteryEVCars: 0,
    hybridEVCars: 0,
    batteryEVTrucks: 0,
    hybridEVTrucks: 0,
    transitBusesDiesel: 0,
    transitBusesCNG: 0,
    transitBusesGasoline: 0,
    schoolBuses: 0,
  },
  _selectedRegionsMonthlyEVEnergyUsageGW: {},
  selectedRegionsMonthlyEVEnergyUsageMW: {},
  _selectedRegionsTotalYearlyEVEnergyUsage: {},
  selectedRegionsMonthlyDailyEVEnergyUsage: {},
  _selectedRegionsMonthlyEmissionRates: {},
  _selectedRegionsMonthlyEmissionChanges: {},
  _selectedRegionsTotalMonthlyEmissionChanges: {},
  _selectedRegionsTotalYearlyEmissionChanges: {},
  vehicleEmissionChangesByGeography: {},
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

    case "transportation/SET_VMT_PERCENTAGES_BY_STATE_REGION_COMBO": {
      const { vmtPercentagesByStateRegionCombo } = action.payload;

      return {
        ...state,
        vmtPercentagesByStateRegionCombo,
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

    case "transportation/SET_TOTAL_EFFECTIVE_VEHICLES": {
      const { totalEffectiveVehicles } = action.payload;

      return {
        ...state,
        totalEffectiveVehicles,
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

    case "transportation/SET_HOURLY_EV_CHARGING_PERCENTAGES": {
      const { hourlyEVChargingPercentages } = action.payload;

      return {
        ...state,
        hourlyEVChargingPercentages,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES": {
      const { _selectedRegionsStatesVMTPercentages } = action.payload;

      return {
        ...state,
        _selectedRegionsStatesVMTPercentages,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE": {
      const { _selectedRegionsVMTPercentagesPerVehicleType } = action.payload;

      return {
        ...state,
        _selectedRegionsVMTPercentagesPerVehicleType,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR": {
      const { _selectedRegionsAverageVMTPerYear } = action.payload;

      return {
        ...state,
        _selectedRegionsAverageVMTPerYear,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE": {
      const { _selectedRegionsMonthlyVMTPerVehicleType } = action.payload;

      return {
        ...state,
        _selectedRegionsMonthlyVMTPerVehicleType,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_EV_EFFICIENCY_PER_VEHICLE_TYPE": {
      const { _selectedRegionsEVEfficiencyPerVehicleType } = action.payload;

      return {
        ...state,
        _selectedRegionsEVEfficiencyPerVehicleType,
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

    case "transportation/_SET_VEHICLES_DISPLACED": {
      const { _vehiclesDisplaced } = action.payload;

      return {
        ...state,
        _vehiclesDisplaced,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW": {
      const { _selectedRegionsMonthlyEVEnergyUsageGW } = action.payload;

      return {
        ...state,
        _selectedRegionsMonthlyEVEnergyUsageGW,
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

    case "transportation/_SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES": {
      const { _selectedRegionsMonthlyEmissionRates } = action.payload;

      return {
        ...state,
        _selectedRegionsMonthlyEmissionRates,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES": {
      const { _selectedRegionsMonthlyEmissionChanges } = action.payload;

      return {
        ...state,
        _selectedRegionsMonthlyEmissionChanges,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES": {
      const { _selectedRegionsTotalMonthlyEmissionChanges } = action.payload;

      return {
        ...state,
        _selectedRegionsTotalMonthlyEmissionChanges,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES": {
      const { _selectedRegionsTotalYearlyEmissionChanges } = action.payload;

      return {
        ...state,
        _selectedRegionsTotalYearlyEmissionChanges,
      };
    }

    case "transportation/SET_VEHICLE_EMISSION_CHANGES_BY_GEOGRAPHY": {
      const { vehicleEmissionChangesByGeography } = action.payload;

      return {
        ...state,
        vehicleEmissionChangesByGeography,
      };
    }

    case "transportation/_SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE": {
      const { _selectedRegionsTotalYearlyEVEnergyUsage } = action.payload;

      return {
        ...state,
        _selectedRegionsTotalYearlyEVEnergyUsage,
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

    const monthlyVMTTotals = calculateMonthlyVMTTotals({ movesEmissionRates });

    const yearlyVMTTotals = calculateYearlyVMTTotals({ monthlyVMTTotals });

    const monthlyVMTPercentages = calculateMonthlyVMTPercentages({
      monthlyVMTTotals,
      yearlyVMTTotals,
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
      type: "transportation/SET_VMT_PERCENTAGES_BY_STATE_REGION_COMBO",
      payload: { vmtPercentagesByStateRegionCombo },
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
export function setHourlyEVChargingPercentages(): AppThunk {
  return (dispatch) => {
    const hourlyEVChargingPercentages = calculateHourlyEVChargingPercentages({
      defaultEVLoadProfiles,
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
    const { regions, regionalScalingFactors } = geography;
    const {
      vmtBillionsAndPercentages,
      vmtAllocationPerVehicle,
      vmtPercentagesByStateRegionCombo,
      monthlyVMTPercentages,
    } = transportation;

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
        vmtPercentagesByStateRegionCombo,
      });

    const _selectedRegionsStatesVMTPercentages =
      _calculateSelectedRegionsStatesVMTPercentages({
        selectedGeographyRegionIds,
        vmtBillionsAndPercentages,
      });

    const _selectedRegionsVMTPercentagesPerVehicleType =
      _calculateSelectedRegionsVMTPercentagesPerVehicleType({
        _selectedRegionsStatesVMTPercentages,
        vmtAllocationPerVehicle,
      });

    const _selectedRegionsAverageVMTPerYear =
      _calculateSelectedRegionsAverageVMTPerYear({
        _selectedRegionsVMTPercentagesPerVehicleType,
      });

    const _selectedRegionsMonthlyVMTPerVehicleType =
      _calculateSelectedRegionsMonthlyVMTPerVehicleType({
        _selectedRegionsAverageVMTPerYear,
        monthlyVMTPercentages,
      });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_VMT_PERCENTAGES_BY_STATE",
      payload: { selectedRegionsVMTPercentagesByState },
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_STATES_VMT_PERCENTAGES",
      payload: { _selectedRegionsStatesVMTPercentages },
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_VMT_PERCENTAGES_PER_VEHICLE_TYPE",
      payload: { _selectedRegionsVMTPercentagesPerVehicleType },
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_AVERAGE_VMT_PER_YEAR",
      payload: { _selectedRegionsAverageVMTPerYear },
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_MONTHLY_VMT_PER_VEHICLE_TYPE",
      payload: { _selectedRegionsMonthlyVMTPerVehicleType },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `_selectedRegionsMonthlyVMTPerVehicleType`
    dispatch(setMonthlyEVEnergyUsage());

    // NOTE: `_selectedRegionsMonthlyEmissionRates` uses `_selectedRegionsStatesVMTPercentages`
    dispatch(setMonthlyEmissionRates());

    // NOTE: `_selectedRegionsMonthlyEmissionChanges` uses `_selectedRegionsMonthlyVMTPerVehicleType`
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
    const { climateAdjustmentFactorByRegion, regionalScalingFactors } =
      geography;
    const { evModelYear } = impacts.inputs;

    const selectedGeographyRegionIds = Object.keys(
      regionalScalingFactors,
    ) as RegionId[];

    const _selectedRegionsEVEfficiencyPerVehicleType =
      _calculateSelectedRegionsEVEfficiencyPerVehicleType({
        percentageAdditionalEnergyConsumedFactor,
        regionAverageTemperatures,
        selectedGeographyRegionIds,
        evModelYear,
      });

    const selectedRegionsEVEfficiency = calculateSelectedRegionsEVEfficiency({
      climateAdjustmentFactorByRegion,
      evEfficiencyAssumptions,
      selectedGeographyRegionIds,
      evModelYear,
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_EV_EFFICIENCY_PER_VEHICLE_TYPE",
      payload: { _selectedRegionsEVEfficiencyPerVehicleType },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_EV_EFFICIENCY",
      payload: { selectedRegionsEVEfficiency },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `_selectedRegionsEVEfficiencyPerVehicleType`
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
 * `runEVHybridEVsCalculations()`, `runEVTransitBusesCalculations()`,
 * `runEVSchoolBusesCalculations()`, `runEVShortHaulTrucksCalculations()`,
 * `runEVComboLongHaulTrucksCalculations()`, or `runEVRefuseTrucksCalculations()`
 * functions are called.
 *
 * _(e.g. onBlur / whenever an EV input loses focus, but only if the input's
 * value has changed since the last time it was used in this calculation)_
 */
export function setEffectiveVehicles(): AppThunk {
  return (dispatch, getState) => {
    const { transportation, impacts } = getState();
    const {
      monthlyVMTTotals,
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

    const totalEffectiveVehicles = calculateTotalEffectiveVehicles({
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

    const _vehiclesDisplaced = _calculateVehiclesDisplaced({
      batteryEVs: Number(batteryEVs),
      hybridEVs: Number(hybridEVs),
      transitBuses: Number(transitBuses),
      schoolBuses: Number(schoolBuses),
      monthlyVMTTotals,
    });

    dispatch({
      type: "transportation/SET_TOTAL_EFFECTIVE_VEHICLES",
      payload: { totalEffectiveVehicles },
    });

    dispatch({
      type: "transportation/_SET_VEHICLES_DISPLACED",
      payload: { _vehiclesDisplaced },
    });

    // NOTE: `monthlyEVEnergyUsageGW` uses `_vehiclesDisplaced`
    dispatch(setMonthlyEVEnergyUsage());

    // NOTE: `_selectedRegionsMonthlyEmissionChanges` uses `_vehiclesDisplaced`
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
      totalEffectiveVehicles,
      selectedRegionsMonthlyVMT,
      selectedRegionsEVEfficiency,
      _selectedRegionsMonthlyVMTPerVehicleType,
      _selectedRegionsEVEfficiencyPerVehicleType,
      _vehiclesDisplaced,
    } = transportation;

    const selectedRegionsMonthlySalesChanges =
      calculateSelectedRegionsMonthlySalesChanges({
        totalEffectiveVehicles,
        selectedRegionsMonthlyVMT,
        selectedRegionsEVEfficiency,
        percentageHybridEVMilesDrivenOnElectricity,
      });

    const selectedRegionsYearlySalesChanges =
      calculateSelectedRegionsYearlySalesChanges({
        selectedRegionsMonthlySalesChanges,
      });

    const _selectedRegionsMonthlyEVEnergyUsageGW =
      _calculateSelectedRegionsMonthlyEVEnergyUsageGW({
        _selectedRegionsMonthlyVMTPerVehicleType,
        _selectedRegionsEVEfficiencyPerVehicleType,
        _vehiclesDisplaced,
        percentageHybridEVMilesDrivenOnElectricity,
      });

    const selectedRegionsMonthlyEVEnergyUsageMW =
      calculateSelectedRegionsMonthlyEVEnergyUsageMW({
        _selectedRegionsMonthlyEVEnergyUsageGW,
      });

    const _selectedRegionsTotalYearlyEVEnergyUsage =
      _calculateSelectedRegionsTotalYearlyEVEnergyUsage({
        _selectedRegionsMonthlyEVEnergyUsageGW,
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
      type: "transportation/_SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_GW",
      payload: { _selectedRegionsMonthlyEVEnergyUsageGW },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EV_ENERGY_USAGE_MW",
      payload: { selectedRegionsMonthlyEVEnergyUsageMW },
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_TOTAL_YEARLY_EV_ENERGY_USAGE",
      payload: { _selectedRegionsTotalYearlyEVEnergyUsage },
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
    const {
      monthlyVMTPercentages,
      vmtPerVehicleTypeByState,
      selectedRegionsVMTPercentagesByState,
      _selectedRegionsStatesVMTPercentages,
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

    const _selectedRegionsMonthlyEmissionRates =
      _calculateSelectedRegionsMonthlyEmissionRates({
        movesEmissionRates,
        _selectedRegionsStatesVMTPercentages,
        evDeploymentLocation,
        evModelYear,
        iceReplacementVehicle,
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

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_MONTHLY_EMISSION_RATES",
      payload: { _selectedRegionsMonthlyEmissionRates },
    });

    // NOTE: `_selectedRegionsMonthlyEmissionChanges` uses `_selectedRegionsMonthlyEmissionRates`
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
      stateVMTPercentagesByRegion,
      totalEffectiveVehicles,
      selectedRegionsMonthlyVMT,
      selectedRegionsMonthlyEmissionRates,
      selectedRegionsMonthlyTotalNetPM25EmissionRates,
      _selectedRegionsMonthlyVMTPerVehicleType,
      _vehiclesDisplaced,
      _selectedRegionsMonthlyEmissionRates,
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
        totalEffectiveVehicles,
        selectedRegionsMonthlyEmissionRates,
        selectedRegionsMonthlyTotalNetPM25EmissionRates,
        selectedRegionsMonthlyVMT,
        percentageHybridEVMilesDrivenOnElectricity,
      });

    const selectedRegionsMonthlyEmissionChangesPerVehicleCategory =
      calculateSelectedRegionsMonthlyEmissionChangesPerVehicleCategory({
        selectedRegionsMonthlyEmissionChanges,
      });

    const selectedRegionsMonthlyEmissionChangesTotals =
      calculateSelectedRegionsMonthlyEmissionChangesTotals({
        selectedRegionsMonthlyEmissionChangesPerVehicleCategory,
      });

    const selectedRegionsYearlyEmissionChangesTotals =
      calculateSelectedRegionsYearlyEmissionChangesTotals({
        selectedRegionsMonthlyEmissionChangesTotals,
      });

    const _selectedRegionsMonthlyEmissionChanges =
      _calculateSelectedRegionsMonthlyEmissionChanges({
        geographicFocus,
        selectedStateId,
        stateVMTPercentagesByRegion,
        _selectedRegionsMonthlyVMTPerVehicleType,
        _vehiclesDisplaced,
        _selectedRegionsMonthlyEmissionRates,
        percentageHybridEVMilesDrivenOnElectricity,
      });

    const _selectedRegionsTotalMonthlyEmissionChanges =
      _calculateSelectedRegionsTotalMonthlyEmissionChanges({
        _selectedRegionsMonthlyEmissionChanges,
      });

    const _selectedRegionsTotalYearlyEmissionChanges =
      _calculateSelectedRegionsTotalYearlyEmissionChanges({
        _selectedRegionsTotalMonthlyEmissionChanges,
      });

    const vehicleEmissionChangesByGeography =
      calculateVehicleEmissionChangesByGeography({
        geographicFocus,
        selectedRegionId,
        selectedStateId,
        countiesByGeography,
        selectedGeographyRegionIds,
        vmtTotalsByGeography,
        _selectedRegionsTotalYearlyEmissionChanges,
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
      type: "transportation/SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES_TOTALS",
      payload: { selectedRegionsMonthlyEmissionChangesTotals },
    });

    dispatch({
      type: "transportation/SET_SELECTED_REGIONS_YEARLY_EMISSION_CHANGES_TOTALS",
      payload: { selectedRegionsYearlyEmissionChangesTotals },
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_MONTHLY_EMISSION_CHANGES",
      payload: { _selectedRegionsMonthlyEmissionChanges },
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_TOTAL_MONTHLY_EMISSION_CHANGES",
      payload: { _selectedRegionsTotalMonthlyEmissionChanges },
    });

    dispatch({
      type: "transportation/_SET_SELECTED_REGIONS_TOTAL_YEARLY_EMISSION_CHANGES",
      payload: { _selectedRegionsTotalYearlyEmissionChanges },
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
