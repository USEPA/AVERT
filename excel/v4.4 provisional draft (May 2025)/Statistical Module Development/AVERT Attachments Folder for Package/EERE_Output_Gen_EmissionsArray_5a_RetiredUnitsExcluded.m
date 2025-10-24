% Ouptuts Additional Information Columns
% Col H ORISPL
% Col I Unit Code
% Col J Lat
% Col K Lon
% Col L County
% Col M Fuel
% Col N Unit Name
% Col O Data

warning off MATLAB:xlswrite:AddSheet

MidPoints = [LoadStruct.MidPoint];

BlockSize = 2000;

%% Final Sorting for Output
AGen =EGGrid.FacMeans(1).Gen;

% Identify generators that are retired so we can pull them out
RetireStatus = [UnitStruct.Retired]';
RetireFacs = find(RetireStatus == 1);
AGen(RetireFacs,:)=-9999;

Astderror = std(AGen')'./sum(AGen')';
[SortedError,SortedErrorIX]=sort(Astderror,'ascend');

SortedError(find(RetireStatus(SortedErrorIX)))=[];
SortedErrorIX(find(RetireStatus(SortedErrorIX)))=[];

%% Output File

DateNow = datestr(clock,'yyyymmdd');
TimeNow = datestr(clock,'HHMM');
RegionOfInterestTempName = RegionOfInterest.LongName;
RegionOfInterestTempName(strfind(RegionOfInterestTempName,'/'))='-';

XLS_LocalFileName = ...
    sprintf('AVERT RDF %d %s (%s) %s %s.xlsx',...
    DateArray(1,1),...
    char(RunName),...
    RegionOfInterestTempName,DateNow,TimeNow);

XLS_DisplayFileName =  XLS_LocalFileName;
XLS_Filename = ...
    sprintf('.\\AVERT Output\\%s',XLS_LocalFileName);

NumNonRetiredUnits = length(find([UnitStruct.Retired]==0));

FacIDCellList = {};

for i = 1:length(FacilityStruc)
    FacIDCellList{i} = FacilityStruc(i).UniqueID;
end

LUT_Unit_to_FacilityStruc = zeros(length(UnitStruct),1);
for UnitCyc = 1:length(UnitStruct)
    FacLoc = find(ismember(FacIDCellList,UnitStruct(UnitCyc).UniqueID)); 
    LUT_Unit_to_FacilityStruc(UnitCyc)=FacLoc(1);
end

q= sprintf('Writing timeseries data\ninto\n%s',XLS_DisplayFileName);
DoneMessegeWaitBar = waitbar(0,q,'Name','Output','color','w');

xlswrite(XLS_Filename,[{'Load bin edge'} {'Load bin edge value (MW)'}]','Data','O1'); %Shifted
xlswrite(XLS_Filename,[1:NumLoadCatsAnnual; EGGrid.LoadMeans],'Data','P1'); %Shifted

% Time series of annual load for region
xlswrite(XLS_Filename,{'Hour of Year','Year','Month','Day','Hour','Regional Load (MW)'},'Data','A3'); %No change
xlswrite(XLS_Filename,[[1:length(Load_Annual)]' DateArray(:,1:4) Load_Annual],'Data','A4'); %No Change

%% Generation - Output to Excel Spreadhseet

for BlockCyc=0:8
    
    StartRow = BlockCyc*BlockSize;
    
    % Table Labels
    switch BlockCyc
        case 0
            SectionTitle = sprintf('%s: %s','Data','Generation (MW)');
        case 1
            SectionTitle = sprintf('%s: %s','Data','SO2 Ozone Season (lbs)');
        case 2
            SectionTitle = sprintf('%s: %s','Data','SO2 Not Ozone Season (lbs)');
        case 3
            SectionTitle = sprintf('%s: %s','Data','NOx Ozone Season (lbs)');
        case 4
            SectionTitle = sprintf('%s: %s','Data','NOx Not Ozone Season (lbs)');
        case 5
            SectionTitle = sprintf('%s: %s','Data','CO2 Ozone Season (Tons)');
        case 6
            SectionTitle = sprintf('%s: %s','Data','CO2 Not Ozone Season (Tons)');
        case 7
            SectionTitle = sprintf('%s: %s','Data','Heat Input Ozone Season (MMBtu)');
        case 8
            SectionTitle = sprintf('%s: %s','Data','Heat Input Not Ozone Season (MMBtu)');
    end
    
    q=sprintf('Now writing out "%s"\ninto\n"%s"',SectionTitle,XLS_DisplayFileName);
    waitbar((BlockCyc+1)/11,DoneMessegeWaitBar,q);
    
    xlswrite(XLS_Filename,...
        {SectionTitle},...
        'Data',sprintf('H%d',StartRow + 2));
    
    % Y Lable Sets
    % H: State
    xlswrite(XLS_Filename,{'State'},'Data',sprintf('H%d',StartRow + 4));
    temparray = {UnitStruct.State}';
    xlswrite(XLS_Filename,temparray(SortedErrorIX),'Data',sprintf('H%d',StartRow + 5));
    
    % I: County
    xlswrite(XLS_Filename,{'County'},'Data',sprintf('I%d',StartRow + 4));
    temparray = {UnitStruct.County}';
    xlswrite(XLS_Filename,temparray(SortedErrorIX),'Data',sprintf('I%d',StartRow + 5));
    
    % J: Lat
    xlswrite(XLS_Filename,{'Lat'},'Data',sprintf('J%d',StartRow + 4));
    temparray = {UnitStruct.Lat}';
    xlswrite(XLS_Filename,temparray(SortedErrorIX),'Data',sprintf('J%d',StartRow + 5));
    
    % K: Lon
    xlswrite(XLS_Filename,{'Lon'},'Data',sprintf('K%d',StartRow + 4));
    temparray = {UnitStruct.Lon}';
    xlswrite(XLS_Filename,temparray(SortedErrorIX),'Data',sprintf('K%d',StartRow + 5));
    
    % L: FuelType
    xlswrite(XLS_Filename,{'FuelType'},'Data',sprintf('L%d',StartRow + 4));
    temparray = {FacilityStruc(LUT_Unit_to_FacilityStruc).PrimeFuelType}';
    xlswrite(XLS_Filename,temparray(SortedErrorIX),'Data',sprintf('L%d',StartRow + 5));
    
    % M: ORISPL Code
    xlswrite(XLS_Filename,{'ORISPL Code'},'Data',sprintf('M%d',StartRow + 4));
    temparray = {UnitStruct.ORISPL}';
    xlswrite(XLS_Filename,temparray(SortedErrorIX),'Data',sprintf('M%d',StartRow + 5));
    
    % N: Unit Code
    xlswrite(XLS_Filename,{'Unit Code'},'Data',sprintf('N%d',StartRow + 4));
    temparray = {UnitStruct.UnitID}';
    xlswrite(XLS_Filename,temparray(SortedErrorIX),'Data',sprintf('N%d',StartRow + 5));
    
    % O: Full Unit Name
    xlswrite(XLS_Filename,{'Full Unit Name'},'Data',sprintf('O%d',StartRow + 4));
    for x=1:length(UnitStruct)
        temparray_a(x).FullName=sprintf('%s %s',UnitStruct(x).Name,UnitStruct(x).UnitID);
    end
    temparray = {temparray_a.FullName}';
    xlswrite(XLS_Filename,temparray(SortedErrorIX),'Data',sprintf('O%d',StartRow + 5));
    
    % P: X Labels
    xlswrite(XLS_Filename,{'Load Bin Medians'},'Data',sprintf('P%d',StartRow + 3));
    xlswrite(XLS_Filename,EGGrid.LoadMeans,'Data',sprintf('P%d',StartRow + 4));
    
    % P: Data
    switch BlockCyc
        case 0
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).Gen(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
        case 1
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).SO2Ozone(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
        case 2
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).SO2NotOz(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
        case 3
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).NOxOzone(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
        case 4
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).NOxNotOz(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
        case 5
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).CO2Ozone(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
        case 6
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).CO2NotOz(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
        case 7
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).HROzone(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
        case 8
            xlswrite(XLS_Filename,EGGrid.FacMeans(1).HRNotOz(SortedErrorIX,:),...
                'Data',sprintf('P%d',StartRow + 5));
    end
end

xlswrite(XLS_Filename, {RegionOfInterest.Name}, 'Data','A1');
xlswrite(XLS_Filename, {RegionOfInterest.LongName}, 'Data','B1');
xlswrite(XLS_Filename, RunName, 'Data','C1');

xlswrite(XLS_Filename, {XLS_LocalFileName}, 'Data','D1');

xlswrite(XLS_Filename, {'MCRuns:'}, 'Data','E1');
xlswrite(XLS_Filename, MCRuns, 'Data','F1');

xlswrite(XLS_Filename, {'MCGenRuns:'}, 'Data','G1');
xlswrite(XLS_Filename, MCRunsGenOnly, 'Data','H1');

xlswrite(XLS_Filename, {StateList}, 'Data','A2');
if  FileChoice.PresentYear
    xlswrite(XLS_Filename, {'Present Year Analysis'}, 'Data','B2');
else
    xlswrite(XLS_Filename, {FileChoice.DirectoryFiles(FileChoice.Choice).name}, 'Data','B2');
end

delete(DoneMessegeWaitBar);
