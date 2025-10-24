%% Read in Retirement [and Manual Emissions Rates Data]
% 9/27/2012
% Synapse Energy Economics

% This reads in retirement data in the national scale database.
% It does not actually execute the retirement, or modify statistics.
% To retire, we need to (A) read in which units are retiring and mark the
% national database (this step) (B) designate the retiring units in the
% local-scale database (happens within the regional loop), and (C) actually
% modify the monte carlo analysis so that apparent system requirements are
% increased and the unit is ignored in the statics (this happens in LoadSolver)

PresentYearAnalysis = 0;

RetireUnits =[];

for FacCyc = 1:length(FacilityStruc)
    FacilityStruc(FacCyc).Original = 1;
    FacilityStruc(FacCyc).Retired  = 0;
    FacilityStruc(FacCyc).NewUnit  = 0;
    
    FacilityStruc(FacCyc).SO2Override  = -1;
    FacilityStruc(FacCyc).NOxOverride  = -1;
    FacilityStruc(FacCyc).CO2Override  = -1;
end

FileChoice.DirectoryFiles = dir('.\AVERT Future Year Scenarios\*.xlsx');
FileChoice.Choice = menu('Choose Future Year Scenario',FileChoice.DirectoryFiles.name,'Present year analysis (no modifications)');
if FileChoice.Choice > length(FileChoice.DirectoryFiles)

    PresentYearAnalysis = 1;
    FileChoice.PresentYear = 1;
else
    FileChoice.PresentYear = 0;
end

if ~PresentYearAnalysis
    
    FileChoice.FilePath = ['.\AVERT Future Year Scenarios\' ...
        FileChoice.DirectoryFiles(FileChoice.Choice).name];

        q=sprintf('Reading retirement and modification data from\n%s', FileChoice.DirectoryFiles(FileChoice.Choice).name);
        CurrentStep = CurrentStep + 1;
    
    [UnitRetireNum, UnitRetireTxt, UnitRetireRAW] = ...
        xlsread(...
        FileChoice.FilePath, ...
        'Retires_Modifications',...
        'B4:L10000');
    
    ColHeaders = UnitRetireRAW(1,:);
    UnitRetireTxt(1,:) = [];
    UnitRetireNum(1,:) = [];
    UnitRetireRAW(1,:) = [];
    
    %% Retiring unit information in column 5
    RetiringUnitsIX = find(cell2mat(UnitRetireRAW(:,5))==1);
      
    q = sprintf('Designating retired units in national-scale database');

    CurrentStep = CurrentStep + 1;

    for RetUnitCyc = 1:length(RetiringUnitsIX)
        RetireUnits(RetUnitCyc).Name = UnitRetireRAW(RetiringUnitsIX(RetUnitCyc),1);
        RetireUnits(RetUnitCyc).ORISPL = cell2mat(UnitRetireRAW(RetiringUnitsIX(RetUnitCyc),2));
        
        UnitIDNow = cell2mat(UnitRetireRAW(RetiringUnitsIX(RetUnitCyc),3));
        if isnumeric(UnitIDNow);
            RetireUnits(RetUnitCyc).UnitID = num2str(UnitIDNow);
        else
            RetireUnits(RetUnitCyc).UnitID = UnitIDNow;
        end
        
        % Unique ID: Assign a unique ID to the facility at hand. This facility number is a concatenation of the ORISPL and unit ID, separated with the pipe character ("|").
        
        RetireUnits(RetUnitCyc).UniqueID =  strcat(int2str(RetireUnits(RetUnitCyc).ORISPL),'|',RetireUnits(RetUnitCyc).UnitID);
        cellFac = struct2cell(FacilityStruc);
        temp_Fac_UniqueID = cellFac(21,:,:);
        FacLoc = find(ismember(temp_Fac_UniqueID,RetireUnits(RetUnitCyc).UniqueID));
        if isempty('FacLoc')
            error('Cannot find retiring unit unique facility ID');
        end
        RetireUnits(RetUnitCyc).CSIRegionIX = FacilityStruc(FacLoc).CSIRegionIX;
        RetireUnits(RetUnitCyc).CSIRegion = FacilityStruc(FacLoc).CSIRegion;
        
        FacilityStruc(FacLoc).Retired = 1;
    end
    
    Temp = []
    for LoopID = 1:length(FacilityStruc)
        Temp(LoopID).UniqueID = FacilityStruc(LoopID).UniqueID
    end
    
    %% SO2 Rate Override
    EmsUnitsIX.SO2 = find(cell2mat(UnitRetireRAW(:,8))>0);
    EmsUnitsRate.SO2 = cell2mat(UnitRetireRAW(EmsUnitsIX.SO2,8));
    
    EmsDeltaUnits.SO2 =[];
    for UnitCyc = 1:length(EmsUnitsIX.SO2)
        EmsDeltaUnits.SO2(UnitCyc).Name = UnitRetireRAW(EmsUnitsIX.SO2(UnitCyc),1);
        EmsDeltaUnits.SO2(UnitCyc).ORISPL = cell2mat(UnitRetireRAW(EmsUnitsIX.SO2(UnitCyc),2));
        
        UnitIDNow = cell2mat(UnitRetireRAW(EmsUnitsIX.SO2(UnitCyc),3));
        if isnumeric(UnitIDNow);
            EmsDeltaUnits.SO2(UnitCyc).UnitID = num2str(UnitIDNow);
        else
            EmsDeltaUnits.SO2(UnitCyc).UnitID = UnitIDNow;
        end
        
        % Unique ID: Assign a unique ID to the facility at hand. This facility number is a concatenation of the ORISPL and unit ID, separated with the pipe character ("|").
        UnitIDChar = num2str(char(EmsDeltaUnits.SO2(UnitCyc).UnitID));
        UIDNum = str2num(UnitIDChar);
        EmsDeltaUnits.SO2(UnitCyc).UniqueID =  strcat(int2str(EmsDeltaUnits.SO2(UnitCyc).ORISPL),'|',UnitIDChar);
        FacLoc = find(ismember(FacIDCellList,EmsDeltaUnits.SO2(UnitCyc).UniqueID));
        if isempty('FacLoc')
            error('Cannot find SO2 change unit unique facility ID');
        end
        EmsDeltaUnits.SO2(UnitCyc).CSIRegionIX = FacilityStruc(FacLoc).CSIRegionIX;
        EmsDeltaUnits.SO2(UnitCyc).CSIRegion = FacilityStruc(FacLoc).CSIRegion;
        EmsDeltaUnits.SO2(UnitCyc).EmissionsRate = EmsUnitsRate.SO2(UnitCyc);
        
        FacilityStruc(FacLoc).SO2Override = EmsUnitsRate.SO2(UnitCyc);
    end
    
    %% NOx Rate Override
    EmsUnitsIX.NOx = find(cell2mat(UnitRetireRAW(:,9))>0);
    EmsUnitsRate.NOx = cell2mat(UnitRetireRAW(EmsUnitsIX.NOx,9));
    
    EmsDeltaUnits.NOx =[];
    for UnitCyc = 1:length(EmsUnitsIX.NOx)
        EmsDeltaUnits.NOx(UnitCyc).Name = UnitRetireRAW(EmsUnitsIX.NOx(UnitCyc),1);
        EmsDeltaUnits.NOx(UnitCyc).ORISPL = cell2mat(UnitRetireRAW(EmsUnitsIX.NOx(UnitCyc),2));
        
        UnitIDNow = cell2mat(UnitRetireRAW(EmsUnitsIX.NOx(UnitCyc),3));
        if isnumeric(UnitIDNow);
            EmsDeltaUnits.NOx(UnitCyc).UnitID = num2str(UnitIDNow);
        else
            EmsDeltaUnits.NOx(UnitCyc).UnitID = UnitIDNow;
        end
        
        % Unique ID: Assign a unique ID to the facility at hand. This facility number is a concatenation of the ORISPL and unit ID, separated with the pipe character ("|").
        UnitIDChar = num2str(char(EmsDeltaUnits.NOx(UnitCyc).UnitID));
        UIDNum = str2num(UnitIDChar);
        EmsDeltaUnits.NOx(UnitCyc).UniqueID =  strcat(int2str(EmsDeltaUnits.NOx(UnitCyc).ORISPL),'|',UnitIDChar);
        FacLoc = find(ismember(FacIDCellList,EmsDeltaUnits.NOx(UnitCyc).UniqueID));
        if isempty('FacLoc')
            error('Cannot find NOx change unit unique facility ID');
        end
        EmsDeltaUnits.NOx(UnitCyc).CSIRegionIX = FacilityStruc(FacLoc).CSIRegionIX;
        EmsDeltaUnits.NOx(UnitCyc).CSIRegion = FacilityStruc(FacLoc).CSIRegion;
        EmsDeltaUnits.NOx(UnitCyc).EmissionsRate = EmsUnitsRate.NOx(UnitCyc);
        
        FacilityStruc(FacLoc).NOxOverride = EmsUnitsRate.NOx(UnitCyc);
    end
    
    %% CO2 Rate Override
    EmsUnitsIX.CO2 = find(cell2mat(UnitRetireRAW(:,10))>0);
    EmsUnitsRate.CO2 = cell2mat(UnitRetireRAW(EmsUnitsIX.CO2,10));
    
    EmsDeltaUnits.CO2 =[];
    for UnitCyc = 1:length(EmsUnitsIX.CO2)
        EmsDeltaUnits.CO2(UnitCyc).Name = UnitRetireRAW(EmsUnitsIX.CO2(UnitCyc),1);
        EmsDeltaUnits.CO2(UnitCyc).ORISPL = cell2mat(UnitRetireRAW(EmsUnitsIX.CO2(UnitCyc),2));
        
        UnitIDNow = cell2mat(UnitRetireRAW(EmsUnitsIX.CO2(UnitCyc),3));
        if isnumeric(UnitIDNow);
            EmsDeltaUnits.CO2(UnitCyc).UnitID = num2str(UnitIDNow);
        else
            EmsDeltaUnits.CO2(UnitCyc).UnitID = UnitIDNow;
        end
        
        % Unique ID: Assign a unique ID to the facility at hand. This facility number is a concatenation of the ORISPL and unit ID, separated with the pipe character ("|"). 
        UnitIDChar = num2str(char(EmsDeltaUnits.CO2(UnitCyc).UnitID));
        UIDNum = str2num(UnitIDChar);
        EmsDeltaUnits.CO2(UnitCyc).UniqueID =  strcat(int2str(EmsDeltaUnits.CO2(UnitCyc).ORISPL),'|',UnitIDChar);
        FacLoc = find(ismember(FacIDCellList,EmsDeltaUnits.CO2(UnitCyc).UniqueID));
        if isempty('FacLoc')
            error('Cannot find CO2 change unit unique facility ID');
        end
        EmsDeltaUnits.CO2(UnitCyc).CSIRegionIX = FacilityStruc(FacLoc).CSIRegionIX;
        EmsDeltaUnits.CO2(UnitCyc).CSIRegion = FacilityStruc(FacLoc).CSIRegion;
        EmsDeltaUnits.CO2(UnitCyc).EmissionsRate = EmsUnitsRate.CO2(UnitCyc);
        
        FacilityStruc(FacLoc).CO2Override = EmsUnitsRate.CO2(UnitCyc);
    end
    
else % Not present year analysis
    
    q = sprintf('Present year analysis. No units removed or added.');
        CurrentStep = CurrentStep + 1;
    waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);

end