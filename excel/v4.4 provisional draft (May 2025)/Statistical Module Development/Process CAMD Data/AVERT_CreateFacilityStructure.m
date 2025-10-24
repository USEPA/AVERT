%%% Create Facility Structure %%%
%   Read Facility data from Excel and compile a structure to point to
%   ancillary data

%%% Jeremy Fisher, August 2nd 2007 %%%
%   Updated June 19, 2013

%%  Prepare unit look up table

% Load in region names and name abbreviations
load('AVERT_RegionNames_Update');

if ~exist('PlantLUTtext')

    % Figure out the list of Excel files in the FacilityData folder (removing non-Excel files)
    FacilityDir=dir('.\FacilityData');
    FacilityDir(find([FacilityDir.isdir]'==1))=[];

    for x=1:length(FacilityDir)
        if FacilityDir(x).name(1)=='~'
            FacilityDir(x).xls = 0;
        else
            if findstr('xlsx',FacilityDir(x).name(end-3:end))==1
                FacilityDir(x).xls = 1;
            else
                FacilityDir(x).xls = 0;
            end
        end
    end
    FacilityDir(find([FacilityDir.xls]==0))=[];
   
    %Display list of Excel files in FacilityData folder (user should select the Future Year Scenario Template)
    MenuChoice = menu('Choose Facility Data File:',{FacilityDir.name}');
    
    % Read in the MenuChoice (should be the Future Year Scenario Template)
    disp('Opening Excel file 1');
    [PlantLUTnum, PlantLUTtext] = xlsread(sprintf('.\\FacilityData\\%s',FacilityDir(MenuChoice).name), 'EPA_Facilities'); % Reads in the EPA_Facilities sheet of the FYST

    ColHeaders = PlantLUTtext(3,:); % Stores column headers
    PlantLUTtext(1:3,:) = []; % Deletes first 3 rows
    PlantLUTnum(1:2,:)=[]; % Added to correct for wrong number of facilities SAG June 2017

    % Create a look up table of states and NERC sub-regions
        disp('Opening Excel file 2');
    [State_LUT_Indx, State_LUT] = ...
        xlsread('.\FacilityData\NERC_LUTs.xlsx', 'NERC LUTS','I2:J52'); % crosswalk of State abbrev. to state LUT
        disp('Opening Excel file 3');
    [NERCSub_LUT_Indx, NERCSub_LUT] = ...
        xlsread('.\FacilityData\NERC_LUTs.xlsx', 'NERC LUTS','E2:F27'); % crosswalk of EGrid Subregions to EGrid subregion LUTs

end

NumFacilities = size(PlantLUTnum,1); 

%%  Create Facility Structure

disp('Reading in all facility data...');

for FacCyc = 1:NumFacilities
    
    FacilityStruc(FacCyc).LUTValue =  FacCyc; % Store a Unique ID for each row
    
    % Display progress every 100 facilities
    if mod(FacCyc,100)==0
        disp(sprintf('FacCyc: %d',FacCyc));
    end
    
    %Name - Col 6
    FacilityStruc(FacCyc).Name = char(PlantLUTtext(FacCyc,6)); % Store the name of the facility
    
    %Unit ID - Col 7/8
    if isnan(PlantLUTnum(FacCyc,7)) %% Ff there is no unit number, then it has a unit name (text)
        FacilityStruc(FacCyc).UnitID = ...
            char(PlantLUTtext(FacCyc,8)); %% the Unit ID becomes the text name of the unit
    else
        FacilityStruc(FacCyc).UnitID = ...
            [char(PlantLUTtext(FacCyc,8)) num2str(PlantLUTnum(FacCyc,7))]; %% or else the Unit ID becomes a text
    end

    % eGRID (NERC) Subregion - Col 24
    FacilityStruc(FacCyc).NERCSub =  char(PlantLUTtext(FacCyc,24));
    if isempty(FacilityStruc(FacCyc).NERCSub)
        FacilityStruc(FacCyc).NERCSub_Ix = 0;
    else
        FacilityStruc(FacCyc).NERCSub_Ix = strmatch(FacilityStruc(FacCyc).NERCSub,NERCSub_LUT);
    end

    % State - Col 4
    FacilityStruc(FacCyc).State =  char(PlantLUTtext(FacCyc,4));
    FacilityStruc(FacCyc).State_Ix = strmatch(FacilityStruc(FacCyc).State,State_LUT);
    if isempty(FacilityStruc(FacCyc).State_Ix)
        FacilityStruc(FacCyc).State_Ix = 0;
    end

    % Other parts
    FacilityStruc(FacCyc).ORISPL =  PlantLUTnum(FacCyc,6); % ORISPL
    
    FacilityStruc(FacCyc).Lat =  PlantLUTnum(FacCyc,8);
    FacilityStruc(FacCyc).Lon =  PlantLUTnum(FacCyc,9); 
    FacilityStruc(FacCyc).County =  char(PlantLUTtext(FacCyc,5));
    
    FacilityStruc(FacCyc).GCount = 0;
    FacilityStruc(FacCyc).SCount = 0;
    
    FacilityStruc(FacCyc).FuelPrimary =  char(PlantLUTtext(FacCyc,16));
    FacilityStruc(FacCyc).FuelSecondary =  char(PlantLUTtext(FacCyc,17)); 
    FacilityStruc(FacCyc).PrimeFuelType =  char(PlantLUTtext(FacCyc,21)); 

    FacilityStruc(FacCyc).CSIRegion =  char(PlantLUTtext(FacCyc,28));     
    FacilityStruc(FacCyc).G2Nfactor =  PlantLUTnum(FacCyc,50);
    FacilityStruc(FacCyc).CO2content =  PlantLUTnum(FacCyc,51); 
    
    FacilityStruc(FacCyc).CSIRegionIX = ...
        strmatch(FacilityStruc(FacCyc).CSIRegion,CSIRegions_LUT);
    if isempty(FacilityStruc(FacCyc).CSIRegionIX)
        FacilityStruc(FacCyc).CSIRegionIX = 0;
        disp(sprintf('AVERT Region not found in FacCyc %d',FacCyc));
    end
    
    % Assign a unique ID to the facility
    % This facility number is a combination of the facility ID (EPA) and the transformation from character into number of the facility's UNIT ID
    UnitIDChar = num2str((double(FacilityStruc(FacCyc).UnitID)));
    UnitIDChar(find(isspace(UnitIDChar)))=[];
    UIDNum = str2num(UnitIDChar);
    FacilityStruc(FacCyc).UniqueID = strcat(int2str(FacilityStruc(FacCyc).ORISPL),'|',FacilityStruc(FacCyc).UnitID);

end

%% Associate Plants which do not have a NERC association with a NERC by looking up the most common NERC for every state

disp('Associating plants with no NERC data...');

StateNERCAssociation = zeros(size(State_LUT_Indx));
for StateCyc = 1:length(State_LUT_Indx)
    IndexState = find(cell2mat({FacilityStruc.State_Ix}')==StateCyc);
    IndexNERC_State = cell2mat({FacilityStruc(IndexState).NERCSub_Ix}');
    IndexNERC_State(find(IndexNERC_State  == 0)) = [];
    [Freq, Val] = hist(IndexNERC_State,[1:26]);
    [MaxFreq MaxLoc] = max(Freq);
    StateNERCAssociation(StateCyc) =  Val(MaxLoc);
end

% Fill in most likely NERC for each station without a NERC designation by checking which state it's in and associating it with the table above
IndexNoNERC = find(cell2mat({FacilityStruc.NERCSub_Ix}')==0);
for FacCyc = 1:length(IndexNoNERC)
    if FacilityStruc(IndexNoNERC(FacCyc)).State_Ix > 0
        FacilityStruc(IndexNoNERC(FacCyc)).NERCSub_Ix = ...
            StateNERCAssociation(FacilityStruc(IndexNoNERC(FacCyc)).State_Ix);
        FacilityStruc(IndexNoNERC(FacCyc)).NERCSub = ...
            char(NERCSub_LUT(FacilityStruc(IndexNoNERC(FacCyc)).NERCSub_Ix));
        disp(sprintf('Placing %s %s, %s into %s',...
            FacilityStruc(IndexNoNERC(FacCyc)).Name, ...
            FacilityStruc(IndexNoNERC(FacCyc)).UnitID, ...
            FacilityStruc(IndexNoNERC(FacCyc)).State, ...
            FacilityStruc(IndexNoNERC(FacCyc)).NERCSub));
    end
end
    
%% Create structure to identify where specific plants are in the overall array system

for NERCCyc = 1:length(NERCSub_LUT_Indx)
    NERCSubStruc(NERCCyc).Index = NERCCyc;
    NERCSubStruc(NERCCyc).Name = NERCSub_LUT(NERCCyc,:);
    NERCSubStruc(NERCCyc).NumPlants = length(find(cell2mat({FacilityStruc.NERCSub_Ix}')==NERCCyc));
    NERCSubStruc(NERCCyc).Plants = find(cell2mat({FacilityStruc.NERCSub_Ix}')==NERCCyc);
end

% clear PlantLUTnum PlantLUTtext
for x=1:26
disp(sprintf('%s: %d',char(NERCSub_LUT(x)),length(find([FacilityStruc.NERCSub_Ix]==x))));
end


disp('Finished creating facility structure...');