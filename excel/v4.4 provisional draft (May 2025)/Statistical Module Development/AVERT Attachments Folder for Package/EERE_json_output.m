% This script will output a json version of the AVERT RDF.
% File format will include metadata for each data block

% IMPORTANT NOTE: this script requires the "jsonlab" library.
% The library must be installed and the path to the library must be added to the install of matlab being used

%buckets
regional_load = [];
run = [];
region = [];
limits = [];
load_bin_edges = [];
data = [];
jsonOutput = [];

%fossil load data block
for i = 1:length(FirstYearLoad)
    regional_load(i).hour_of_year = i;
    regional_load(i).year = DateArray(i,1);
    regional_load(i).month = DateArray(i,2);
    regional_load(i).day = DateArray(i,3);
    regional_load(i).hour = DateArray(i,4);
    regional_load(i).regional_load_mw = FirstYearLoad(i);
    regional_load(i).hourly_limit = 0.15*FirstYearLoad(i);
end

%regional metadata
region.region_name = RegionOfInterest.LongName;
region.region_abbv = RegionOfInterest.Name;
region.region_states = [sprintf('%s, ',StatesInAnalysis{1:end-1}),StatesInAnalysis{end}];

%run medatata; must recreate same filename as will be used for the xls
run.region_id = RegionOfInterest.Num;
run.year = YearOfAnalysis;
run.file_name = strcat('AVERT RDF',{' '},num2str(YearOfAnalysis),RunName,{' '},'(',region.region_name,')');
run.mc_runs = MCRuns;
run.mc_gen_runs = MCRunsGenOnly;

%limits datablock - used for data validation in Web Avert
limits.id = RegionOfInterest.Num;
limits.region_id = RegionOfInterest.Num;
limits.year = YearOfAnalysis;
limits.max_solar_wind_mwh = min(0.15.*FirstYearLoad);
if YearOfAnalysis == 2012 || YearOfAnalysis == 2016 || YearOfAnalysis == 2020 || YearOfAnalysis == 2024 || YearOfAnalysis == 2028 || YearOfAnalysis == 2032 || YearOfAnalysis == 2036
    limits.max_ee_yearly_gwh = limits.max_solar_wind_mwh*8784/1000;
else 
    limits.max_ee_yearly_gwh = limits.max_solar_wind_mwh*8760/1000;
end
limits.max_ee_percent = 15;
limits.created_at = [];
limits.updated_at = [];

%load bin edges (goes across the top of the page in xls version)
load_bin_edges = EGGrid.LoadMeans;

%this loop fills in metadata and bin data for each unit
for u = 1:length(UnitStruct)
    
    FacLoc = find(ismember(FacIDCellList,UnitStruct(u).UniqueID));
    
    %metadata is fetched once
    unit_id_string = UnitStruct(u).UniqueID;
    state = FacilityStruc(FacLoc).State;
    county = UnitStruct(u).County;
    lat = UnitStruct(u).Lat;
    lon = UnitStruct(u).Lon;
    fuel_type = FacilityStruc(FacLoc).PrimeFuelType;
    orispl_code = UnitStruct(u).ORISPL;
    unit_code = UnitStruct(u).UnitID;
    full_name = UnitStruct(u).Name;
    
    %metadata is dealt to appropriate parts of the data structure
    [data.generation(u).state, data.so2(u).state, data.so2_not(u).state, ...
        data.nox(u).state, data.nox_not(u).state, data.co2(u).state, ...
        data.co2_not(u).state, data.heat(u).state, data.heat_not(u).state] = deal(state);
    
    [data.generation(u).county, data.so2(u).county, data.so2_not(u).county, ...
        data.nox(u).county, data.nox_not(u).county, data.co2(u).county, ...
        data.co2_not(u).county, data.heat(u).county, data.heat_not(u).county] = deal(county);
    
    [data.generation(u).lat, data.so2(u).lat, data.so2_not(u).lat, ...
        data.nox(u).lat, data.nox_not(u).lat, data.co2(u).lat, ...
        data.co2_not(u).lat, data.heat(u).lat, data.heat_not(u).lat] = deal(lat);
    
    [data.generation(u).lon, data.so2(u).lon, data.so2_not(u).lon, ...
        data.nox(u).lon, data.nox_not(u).lon, data.co2(u).lon, ...
        data.co2_not(u).lon, data.heat(u).lon, data.heat_not(u).lon] = deal(lon);
    
    [data.generation(u).fuel_type, data.so2(u).fuel_type, data.so2_not(u).fuel_type, ...
        data.nox(u).fuel_type, data.nox_not(u).fuel_type, data.co2(u).fuel_type, ...
        data.co2_not(u).fuel_type, data.heat(u).fuel_type, data.heat_not(u).fuel_type] = deal(fuel_type);
    
    [data.generation(u).orispl_code, data.so2(u).orispl_code, data.so2_not(u).orispl_code, ...
        data.nox(u).orispl_code, data.nox_not(u).orispl_code, data.co2(u).orispl_code, ...
        data.co2_not(u).orispl_code, data.heat(u).orispl_code, data.heat_not(u).orispl_code] = deal(orispl_code);
    
    [data.generation(u).unit_code, data.so2(u).unit_code, data.so2_not(u).unit_code, ...
        data.nox(u).unit_code, data.nox_not(u).unit_code, data.co2(u).unit_code, ...
        data.co2_not(u).unit_code, data.heat(u).unit_code, data.heat_not(u).unit_code] = deal(unit_code);
    
    [data.generation(u).full_name, data.so2(u).full_name, data.so2_not(u).full_name, ...
        data.nox(u).full_name, data.nox_not(u).full_name, data.co2(u).full_name, ...
        data.co2_not(u).full_name, data.heat(u).full_name, data.heat_not(u).full_name] = deal(full_name);
    
    %medians are fetched
    data.generation(u).medians = EGGrid.FacMeans.Gen(u,:);
    data.so2(u).medians = EGGrid.FacMeans.SO2Ozone(u,:);
    data.so2_not(u).medians = EGGrid.FacMeans.SO2NotOz(u,:);
    data.nox(u).medians = EGGrid.FacMeans.NOxOzone(u,:);
    data.nox_not(u).medians = EGGrid.FacMeans.NOxNotOz(u,:);
    data.co2(u).medians = EGGrid.FacMeans.CO2Ozone(u,:);
    data.co2_not(u).medians = EGGrid.FacMeans.CO2NotOz(u,:);
    data.heat(u).medians = EGGrid.FacMeans.HROzone(u,:);
    data.heat_not(u).medians = EGGrid.FacMeans.HRNotOz(u,:);
    
end

%building output structure
jsonOutput.region = region;
jsonOutput.run = run;
jsonOutput.limits = limits;
jsonOutput.regional_load = regional_load;
jsonOutput.load_bin_edges = load_bin_edges;
jsonOutput.data = data;

%output filename
jsonOutputFilename = strcat('rdf_',RegionOfInterest.Name,'_',num2str(YearOfAnalysis),'.json');

%export
savejson('',jsonOutput,jsonOutputFilename);