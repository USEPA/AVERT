% This simple script will output a json version of the AVERT RDF file. 
% Format will include metadata for each data block

% IMPORTANT NOTE: this script requires the "jsonlab" library
% The library must be installed and the path to the library must be added to the install of MATLAB being used

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
    
    %same fetch as in standard formatted version
    unit_id_string = UnitStruct(u).UniqueID;
    state = FacilityStruc(FacLoc).State;
    county = UnitStruct(u).County;
    lat = UnitStruct(u).Lat;
    lon = UnitStruct(u).Lon;
    fuel_type = FacilityStruc(FacLoc).PrimeFuelType;
    orispl_code = UnitStruct(u).ORISPL;
    unit_code = UnitStruct(u).UnitID;
    full_name = UnitStruct(u).Name;
    
    %metadata and medians are both subfields on a per-unit basis
    data.unit(u).unit_id = unit_id_string;
    data.unit(u).state = state;
    data.unit(u).county = county;
    data.unit(u).lat = lat;
    data.unit(u).lon = lon;
    data.unit(u).fuel_type = fuel_type;
    data.unit(u).orispl_code = orispl_code;
    data.unit(u).unit_code = unit_code;
    data.unit(u).full_name = full_name;
    
    %bin medians filled in for each unit
    data.unit(u).generation_medians = EGGrid.FacMeans.Gen(u,:);
    data.unit(u).so2_medians = EGGrid.FacMeans.SO2Ozone(u,:);
    data.unit(u).so2_not_medians = EGGrid.FacMeans.SO2NotOz(u,:);
    data.unit(u).nox_medians = EGGrid.FacMeans.NOxOzone(u,:);
    data.unit(u).nox_not_medians = EGGrid.FacMeans.NOxNotOz(u,:);
    data.unit(u).co2_medians = EGGrid.FacMeans.CO2Ozone(u,:);
    data.unit(u).co2_not_medians = EGGrid.FacMeans.CO2NotOz(u,:);
    data.unit(u).heat_medians = EGGrid.FacMeans.HROzone(u,:);
    data.unit(u).heat_not_medians = EGGrid.FacMeans.HRNotOz(u,:);    
    
end

%building final data structure for export
jsonOutput.region = region;
jsonOutput.run = run;
jsonOutput.limits = limits;
jsonOutput.regional_load = regional_load;
jsonOutput.load_bin_edges = load_bin_edges;
jsonOutput.data = data;

%output filename
jsonOutputFilename = strcat('rdf_',RegionOfInterest.Name,'_',num2str(YearOfAnalysis),'_cond.json');

%export
savejson('',jsonOutput,jsonOutputFilename);