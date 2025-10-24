%% Read in New Unit Data
% 9/27/2012
% Jeremy Fisher, Synapse Energy Economics

% Actual adding in of new units has to happen AFTER statistics have been
% gathered on the units. Retirement can happen now, though.

NewUnits =[];

if PresentYearAnalysis == 1
    q=sprintf('Present year analysis.\nNo modifications to additions.\n');
    CurrentStep = CurrentStep + 1;
    waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);

else  
    q= sprintf('Reading additional/new unit data from\n%s', FileChoice.DirectoryFiles(FileChoice.Choice).name);
    CurrentStep = CurrentStep + 1;
    waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
    
    [UnitAddNum, UnitAddTxt, UnitAddRAW] = ...
        xlsread(...
        FileChoice.FilePath, ...
        'Additions',...
        'B4:N10000');

    ColHeaders = UnitAddRAW(1,:);
    UnitAddRAW(1,:) = [];
    
    NewUnitXLSLines = find(cell2mat(UnitAddRAW(:,6))>0); %Find ORISPL numbers that aren't zero or NaN
    
    if NewUnitXLSLines > 0
        q = sprintf('Designating additional units ');
     CurrentStep = CurrentStep + 1;
    waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
        
        for NewUnitCyc = 1:size(NewUnitXLSLines,1)
            
            NewUnits(NewUnitCyc).ORISPL = cell2mat(UnitAddRAW(NewUnitCyc,6));
            NewUnits(NewUnitCyc).Name = UnitAddRAW(NewUnitCyc,5);
            
            UnitIDNow = cell2mat(UnitAddRAW(NewUnitCyc,7));
            if isnumeric(UnitIDNow);
                NewUnits(NewUnitCyc).UnitID = num2str(UnitIDNow);
            else
                NewUnits(NewUnitCyc).UnitID = UnitIDNow;
            end
            
            NewUnits(NewUnitCyc).Capacity = cell2mat(UnitAddRAW(NewUnitCyc,9));
            NewUnits(NewUnitCyc).State = cell2mat(UnitAddRAW(NewUnitCyc,10));
            NewUnits(NewUnitCyc).County = cell2mat(UnitAddRAW(NewUnitCyc,11));
            NewUnits(NewUnitCyc).Lat = cell2mat(UnitAddRAW(NewUnitCyc,12));
            NewUnits(NewUnitCyc).Lon = cell2mat(UnitAddRAW(NewUnitCyc,13));
            NewUnits(NewUnitCyc).AdditionNumber = cell2mat(UnitAddRAW(NewUnitCyc,1));
            
            % Unique ID: Assign a unique ID to the facility at hand. This facility number is a concatenation of the facility ID (EPA)and the unit ID, separated with the pipe character ("|").  
            UnitIDChar = num2str(char(NewUnits(NewUnitCyc).UnitID));
            NewUnits(NewUnitCyc).UniqueID =  strcat(int2str(NewUnits(NewUnitCyc).ORISPL),'|',UnitIDChar);
            FacLoc = find(ismember(FacIDCellList,NewUnits(NewUnitCyc).UniqueID));
            if isempty('FacLoc')
                error('Cannot find new unit unique facility ID');
            end
            NewUnits(NewUnitCyc).CSIRegionIX = FacilityStruc(FacLoc).CSIRegionIX;
            NewUnits(NewUnitCyc).CSIRegion = FacilityStruc(FacLoc).CSIRegion;
        end
        
        pause(1);
        
    else
        q = sprintf('No new units to add.\n');
     CurrentStep = CurrentStep + 1;
    waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);

    end
    
end %Present Year Analysis Toggle