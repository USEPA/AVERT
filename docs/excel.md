JavaScript/JSON equivalents of Excel workbook tables

# Excel workbook sheets

## EV_Detail

Part III. Model Year and ICE Replacement  
[evModelYearOptions](../client/src/config.ts#L1065)  
[iceReplacementVehicleOptions](../client/src/config.ts#L1078)  
[initialEVModelYear](../client/src/redux/reducers/impacts.ts#L299)

## ES_Detail

Part II. Charging Characteristics  
[maxAnnualDischargeCyclesOptions](../client/src/config.ts#L1055)

## 11_VehicleCty

"From vehicles" column  
[calculateVMTTotalsByGeography()](../client/src/calculations/transportation.ts#L475)  
[calculateVehicleEmissionChangesByGeography()](../client/src/calculations/transportation.ts#L3587)

## CalculateEERE

Top 0.0% gen (MW) (cell S9)  
[calculateTopPercentGeneration()](../client/src/calculations/impacts.ts#L591)

Charge hrs (cell AG34)  
[batteryStorageDuration](../client/src/config.ts#L305)

Several columns of the left/first table  
[calculateHourlyImpacts()](../client/src/calculations/impacts.ts#L650)

"Wind Energy Profile", "Utility Scale Solar", and "Rooftop Solar" columns of the left/first table  
[calculateHourlyRenewableEnergyProfiles()](../client/src/calculations/impacts.ts#L59)

"Final Distributed" column of the left/first table  
[calculateHourlyTopPercentReduction()](../client/src/calculations/impacts.ts#L614)

"Final (MW)" column of the left/first table  
[hourlyChanges](../client/src/redux/reducers/results.ts#L165)

"Total EV" column of the middle table  
[calculateHourlyEVLoad()](../client/src/calculations/impacts.ts#L458)

Data from the top of the middle table  
[storeHourlyEVLoadProfiles()](../client/src/calculations/transportation.ts#L325)

Data from the middle of the middle table  
[calculateSelectedRegionsMonthlyDailyEnergyUsage()](../client/src/calculations/transportation.ts#L2673)

Data from the bottom of the middle table  
[calculateMonthlyStats()](../client/src/calculations/transportation.ts#L420)  
[calculateSelectedRegionsMonthlyEnergyUsage()](../client/src/calculations/transportation.ts#L2596)

"Utility Scale" and "Distributed" columns of right/last table  
[calculateHourlyEnergyStorageData()](../client/src/calculations/impacts.ts#L97)

## Library
Table 1: Percent of state in each AVERT region  
[states[:stateId].percentageByRegion](../client/src/config.ts#L673)

Table 2: Transmission & Distributuion (T&D) losses  
[lineLoss](../client/src/config.ts#L387)

Table 3: EGUs with infrequent SO2 emission events  
[regions[:regionId].actualEmissions](../client/src/config.ts#L393)

Table 4: VMT per vehicle assumptions  
[calculateSelectedRegionsAverageVMTPerYear()](../client/src/calculations/transportation.ts#L1779)

Table 5: EV efficiency assumptions  
[evEfficiencyAssumptions - ev-efficiency-assumptions.json](../client/src/data/ev-efficiency-assumptions.json)  
[percentageHybridEVMilesDrivenOnElectricity](../client/src/config.ts#L183)

Table 6: Monthly VMT and efficiency adjustments  
[schoolBusMonthlyVMTPercentages](../client/src/config.ts#L189)  
[calculateMonthlyVMTTotals()](../client/src/calculations/transportation.ts#L619)  
[calculateYearlyVMTTotals()](../client/src/calculations/transportation.ts#L701)  
[calculateMonthlyVMTPercentages()](../client/src/calculations/transportation.ts#L749)  
[calculateSelectedRegionsMonthlyVMT()](../client/src/calculations/transportation.ts#L1883)  
[calculateSelectedRegionsEVEfficiency()](../client/src/calculations/transportation.ts#L1972)

Table 7: Emission rates of vehicle types  
[calculateSelectedRegionsMonthlyEmissionRates()](../client/src/calculations/transportation.ts#L2057)  
[calculateSelectedRegionsMonthlyElectricityPM25EmissionRates()](../client/src/calculations/transportation.ts#L2194)  
[calculateSelectedRegionsMonthlyTotalNetPM25EmissionRates()](../client/src/calculations/transportation.ts#L2299)

Table 8: Calculated changes for the transportation sector 
[calculateSelectedRegionsTotalEffectiveVehicles()](../client/src/calculations/transportation.ts#L1541)  
[calculateSelectedRegionsMonthlySalesChanges()](../client/src/calculations/transportation.ts#L2382)  
[calculateSelectedRegionsYearlySalesChanges()](../client/src/calculations/transportation.ts#L2504)  
[calculateSelectedRegionsTotalYearlySalesChanges()](../client/src/calculations/transportation.ts#L2558)  
[calculateSelectedRegionsMonthlyEmissionChanges()](../client/src/calculations/transportation.ts#L2774)  
[calculateSelectedRegionsMonthlyEmissionChangesPerVehicleCategory()](../client/src/calculations/transportation.ts#L2903)  
[calculateSelectedRegionsYearlyEmissionChangesPerVehicleCategory()](../client/src/calculations/transportation.ts#L2999)  
[calculateSelectedRegionsMonthlyEmissionChangesTotals()](../client/src/calculations/transportation.ts#L3076)  
[calculateSelectedRegionsYearlyEmissionChangesTotals()](../client/src/calculations/transportation.ts#L3149)

Table 9: Default EV load profiles and related values from EVI-Pro Lite  
[defaultEVLoadProfiles - default-ev-load-profiles.json](../client/src/data/default-ev-load-profiles.json)  
[weekendToWeekdayEVConsumption](../client/src/config.ts#L212)  
[percentageAdditionalEnergyConsumedFactor](../client/src/config.ts#L229)  
[regionAverageTemperatures](../client/src/config.ts#L238)  
[calculateClimateAdjustmentFactorByRegion()](../client/src/calculations/geography.ts#L135)

Table 10: List of states in region for purposes of calculating vehicle sales and stock  
[calculateSelectedGeographySalesAndStockByState()](../client/src/calculations/transportation.ts#L3208)  
[calculateSelectedGeographySalesAndStockByRegion()](../client/src/calculations/transportation.ts#L3343)

Table 11: Historical renewable and energy efficiency addition data  
[historicalRegionEEREData - historical-region-eere-data.json](../client/src/data/historical-region-eere-data.json)  
[historicalStateEEREData - historical-state-eere-data.json](../client/src/data/historical-state-eere-data.json)  
[calculateEVDeploymentLocationHistoricalEERE()](../client/src/calculations/transportation.ts#L3461)  
[regionAnnualWholesaleImpacts](../client/src/calculations/transportation.ts#L3498)

Table 12: Vehicle sales by type  
[ldvsPercentagesByVehicleCategory](../client/src/config.ts#L262)  
[calculateVehicleTypeTotals()](../client/src/calculations/transportation.ts#L1153)  
[calculateVehicleCategoryTotals()](../client/src/calculations/transportation.ts#L1195)  
[calculateVehicleTypePercentagesOfVehicleCategory()](../client/src/calculations/transportation.ts#L1244)  
[calculateVehicleFuelTypePercentagesOfVehicleType()](../client/src/calculations/transportation.ts#L1331)

Table 13: First-Year ICE to EV PM2.5 brakewear and tirewear emissions rate conversion factors  
[pm25BreakwearTirewearEVICERatios - pm25-breakwear-tirewear-ev-ice-ratios.json](../client/src/data/pm25-breakwear-tirewear-ev-ice-ratios.json)  
[calculateSelectedRegionsEEREDefaultsAverages()](../client/src/calculations/transportation.ts#L3400)

Table 14: Lithium Ion Storage Defaults  
[batteryRoundTripEfficiency](../client/src/config.ts#L300)

## NEI_EmissionRates

[neiEmissionRates - nei-emission-rates.json](../server/app/data/nei-emission-rates.json)

## CountyFIPS

[countyFips - county-fips.json](../client/src/data/county-fips.json)

## MOVESEmissionRates

[movesEmissionRates - moves-emission-rates.json](../client/src/data/moves-emission-rates.json)

## RegionStateAllocate

Top left table  
[calculateVMTTotalsByStateRegionCombo()](../client/src/calculations/transportation.ts#L832)

Top right table  
[calculateVMTRegionPercentagesByStateRegionCombo()](../client/src/calculations/transportation.ts#L1006)  
[calculateVMTStatePercentagesByStateRegionCombo()](../client/src/calculations/transportation.ts#L1079)

Bottom left table  
[calculateVMTTotalsByRegion()](../client/src/calculations/transportation.ts#L896)  
[calculateVMTTotalsByState()](../client/src/calculations/transportation.ts#L952)

## MOVESsupplement

A. State-level VMT per vehicle  
[stateLevelVMT - state-level-vmt.json](../client/src/data/state-level-vmt.json)  
[storeVMTandStockByState()](../client/src/calculations/transportation.ts#L1391)  
[calculateVMTPerVehicleTypeByState()](../client/src/calculations/transportation.ts#L1477)  
[calculateSelectedRegionsVMTPercentagesByState()](../client/src/calculations/transportation.ts#L1696)

B. State-Level Sales  
[stateLevelSales - state-level-sales.json](../client/src/data/state-level-sales.json)

C. FHWA LDV State-Level VMT  
[fhwaLDVStateLevelVMT - fhwa-ldv-state-level-vmt.json](../client/src/data/fhwa-ldv-state-level-vmt.json)  
[calculateLDVsFhwaMovesVMTRatioByState()](../client/src/calculations/transportation.ts#L1437)
