%%% Read generation and emissions data and compile data arrays to hold data
%   Requires Facility Structure to have been created first
%   Steps through all USA data from start to finish
%   Each array created is hourly data long (rows) by number of facilities wide (columns).
%   This script prints progress updates as it runs.

%%% Note - This script requires a filepath to be updated each year in 4 places (row 53, 116, 154, 155)

%%% Jeremy Fisher, August 2nd 2007
%   Updated June 17, 2011
%   Updated May 21, 2012
%   Updated June 19, 2013
%       Steps through quarterly or monthly CAMD data
%   Updated and re-named Dec 11, 2013
%       AVERT-named, and reads from AVERT Future Year Scenario Template
%       Includes direct creation of Facility Structure
%       Reads data from EPA/CAMD file structure in K: drive

%% 1. Initialization (sets up flags and "last" structure)
PauseOn = 1;
StartOver = 1;
qerrorlast=0;

%%%% Create Last Structure. This will help track the most recently processed facility %%%%
Last.Name = 'Empty';
Last.UnitID = 'Empty';
Last.FacUniqueID = -1;
Last.IndexFacStruc = -1;
Last.FacIDIndex = -1;
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

%% 2. Facility Structure Check

% checks to see if Step 3 already ran before and created the DateArray
if exist('DateArray','var')
    StartOver = 0;
end

% This checks if the variable FacilityStruc already exists in the workspace
% and if it does not, it calls the AVERT_CreateFacilityStructure.m script to do so.
if ~exist('FacilityStruc','var')
    disp('Running AVERT Create Facility Structure');
    AVERT_CreateFacilityStructure
    disp('Finished AVERT Create Facility Structure');
end

%% 3. Set Up Year and Data Arrays
if StartOver
    
    % Figure out which years are available for parsing in directory
    % Each year, update directory here for annual update:
    CAMDDirectory=dir('C:\Users\eashley\Desktop\2025 AVERT Annual Update\MATLAB\Process CAMD Data\CAMD');

    % Sets up a directory (CAMDDirectory) of data years in the "CAMD" folder (though you should only copy the most recent year into this folder).
    % This loop retrieves all non-directory (folder) entries, ending up with an array of only folders within "CAMD". It then removes all
    %directories (foldes) that don't have a numeric name, essentially only containing a list of the year folders in "CAMD".
    CAMDDirectory(find([CAMDDirectory.isdir]'~=1))=[];
    for x=1:length(CAMDDirectory)
        if isempty(str2num(CAMDDirectory(x).name))
            CAMDDirectory(x).year = 0;
        else
            CAMDDirectory(x).year = 1;
        end
    end
    
    CAMDDirectory(find([CAMDDirectory.year]==0))=[];
    % end of filtering
    
    % Presents a menu for the user to select which year to analyze
    YearChoice = menu('Choose year to parse:',{CAMDDirectory.name}');
    YearOfAnalysis = str2num(CAMDDirectory(YearChoice).name);
    
    disp(sprintf('Year of analysis is set to %d',YearOfAnalysis));
    
    counter=0;
    NumStations = length(FacilityStruc); % number of facilities there are this year (columns needed in each output array)
    
    % Creates Date Array %%% (rows needed in each output array)
    if mod(YearOfAnalysis,4) == 0
        DateArray=datevec(datenum(YearOfAnalysis,1,1:1/24:(366+23/24))); %Leap Year
    else
        DateArray=datevec(datenum(YearOfAnalysis,1,1:1/24:(365+23/24)));
    end
    DateArray(:,6)=datenum([zeros(size(DateArray,1),1) DateArray(:,2:4) zeros(size(DateArray,1),2)]);
    DateArray(:,5)=datenum([DateArray(:,1:4) zeros(size(DateArray,1),2)]);
    %%% end of create date array - the result is a matrix with one row per
    %%% hour of the year, and 6 columns [Y,M,D,H,Min,Sec], and then columns
    %%% 5 and 6 rewritten
    DateCube = zeros(12,31,24);
    
    % 3.2 Data Array Creation
    % Arranged by MONTH / DAY / HOUR
    
    for DateCyc = 1:size(DateArray,1)
        DateCube(DateArray(DateCyc,2),DateArray(DateCyc,3),DateArray(DateCyc,4)+1) = DateCyc;
    end
    
    % Create arrays for data
    NumDates=size(DateArray,1); % days x hours per day (essentially number of hours in year)
    disp('Creating Generation Array (GLoadArray)');
    GLoadArray=zeros(NumDates,NumStations); % array of all hourly (rows) generation values, by facility (cols)
    GLoadArray=uint16(GLoadArray); % this slightly increases memory efficiency (doubles use 64 bits per value instead of 16)
    disp('Creating Steam Generation Array (SLoadArray)');
    SLoadArray=GLoadArray;
    disp('Creating Carbon Dioxide Emissions Array (CO2Array)');
    CO2Array=GLoadArray;
    disp('Creating Heat Rate Array (HRArray)');
    HRArray=GLoadArray;
    disp('Creating Sulfer Oxide Emissions Array (SOXArray)');
    SOXArray=GLoadArray;
    disp('Creating Nitrous Oxide Emissions Array (NOXArray)');
    NOXArray=GLoadArray;

    % Each year, update directory here for annual update:
    DataDirectory=dir(sprintf('C:\\Users\\eashley\\Desktop\\2025 AVERT Annual Update\\MATLAB\\Process CAMD Data\\CAMD\\%d\\*.zip',YearOfAnalysis));
   
    FileCycStart=1;
    
% Skip initilaization of the arrays if you already ran part of the analysis and are restarting the script. Pick up on the file you left off on.    
else
    FileCycStart = FileCyc;

    disp(sprintf('Year of analysis is set to %d',YearOfAnalysis));
end

%% 4. File Processing Loop
% This is where all of the actual analysis occurs, filling up the contents of the 6 arrays.

disp('Starting...');

FacIDCellList = {};
for i = 1:length(FacilityStruc) %set up all the unique ideas in FacilityStructure (in the format "FacilityID|UniqueID")
    FacIDCellList{i} = FacilityStruc(i).UniqueID;
end

couldNotFindList = {}; %this will track any facilities in the data that can't be matched to the facility structure

for FileCyc = FileCycStart:length(DataDirectory)
    % This ensures any previously opened files are closed before proceeding
    if exist('fid_input','var')
        fclose(fid_input);
    end
    if exist('ErrorFile','var')
        fclose(ErrorFile);
    end   
    FileOk = 1;
    
    if FileOk
        % unzip the file to this folder - locally
        q=sprintf('Unzipping %s',DataDirectory(FileCyc).name); 
        disp(q);
        % Each year, update the two directories here for annual update:
        unzip([sprintf('C:\\Users\\eashley\\Desktop\\2025 AVERT Annual Update\\MATLAB\\Process CAMD Data\\CAMD\\%d\\',YearOfAnalysis) DataDirectory(FileCyc).name]);
        FileNameZIP = [sprintf('C:\\Users\\eashley\\Desktop\\2025 AVERT Annual Update\\MATLAB\\Process CAMD Data\\CAMD\\%d\\',YearOfAnalysis) DataDirectory(FileCyc).name];
        FileNameCSV = [DataDirectory(FileCyc).name(1:end-4) '.csv'];

        fid_input=fopen(FileNameCSV); % Opens the current csv
        q=sprintf('Now working on file %s',FileNameCSV);
        disp(q);
        ErrorFile=fopen('ErrorFile.txt','a'); % Opens error log file in append mode
       
        HeaderLine = fgetl(fid_input); % grabs the first row (headers) of the csv and moves on (essentially discards it)
        
        Done = 0;
        counter=0;
        FacilityCounter=0;
        
        % Process each line in the open csv
        while ~Done
            clear LineInfo LineNow;
            LineNow = fgetl(fid_input); % read in the current line
            counter=counter+1;
            
            if size(LineNow,2) < 2 % checks the end of the file hasn't been reached
                if LineNow == -1
                    Done = 1;
                end
            else
                if LineNow == -1
                    Done = 1;
                else                 
                    Done = 0;
                    PauseLine = 0;  
                    CommaLocs = strfind(LineNow,'","');
                    
                    % Extract basic facility information
                    ColNum=7; % Time in operation
                    LineInfo.OpTime = sscanf(LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1),'%f');
                    
                    if isempty(LineInfo.OpTime)
                        LineInfo.OpTime = 0;
                    end
                    
                    ColNum=2; % Facility Name
                    FacName = LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1);

                    LineInfo.FacName = FacName;
                    
                    ColNum=3; % Facility ID
                    LineInfo.FacID = sscanf(LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1),'%d');
                    
                    ColNum=4; % Unit ID
                    LineInfo.UnitID = LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1);
                    
                    % If the facility was operating during this hour, save additional variables
                    if LineInfo.OpTime > 0
                        
                        ColNum=5; %% Date

                        DateString=LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1);
                        DV = sscanf(DateString,'%d-%d-%d');
                        
                        LineDate.Month = DV(2);
                        LineDate.Day = DV(3);
                        LineDate.Year = DV(1);
                        
                        LineInfo.OpDate = datenum(0,LineDate.Month,LineDate.Day);
                        LineInfo.OpYear = LineDate.Year;
                        
                        ColNum=6; %% Hour
                        LineInfo.OpHour = sscanf(LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1),'%f');
                        
                        ColNum=8; %% G-Load (Generation)
                        LineInfo.Gload = sscanf(LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1),'%f');
                        
                        ColNum=9; %% S-Load (Steam) - (No longer used)
                        LineInfo.Sload = sscanf(LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1),'%f');
                        
                        if isempty(LineInfo.Gload)
                            LineInfo.TotLoad =  LineInfo.Sload;
                        else
                            LineInfo.TotLoad =  LineInfo.Gload;
                        end
                        
                        ColNum=10; %% SOX Emissions
                        LineInfo.SOXMass = sscanf(LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1),'%f');
                        
                        ColNum=16; %% NOX Emissions
                        LineInfo.NOXMass = sscanf(LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1),'%f');
                        
                        ColNum=18; %% CO2 Emissions
                        LineInfo.CO2Mass = sscanf(LineNow(CommaLocs(ColNum-1)+3:CommaLocs(ColNum)-1),'%f');
                        
                        ColNum=22; %% Heat Input
                        LineInfo.HeatInput = sscanf(LineNow(CommaLocs(ColNum-1)+3:end-1),'%f');
                        
                    end
                
                    if PauseLine && PauseOn
                        LineInfo
                        disp('Paused');
                        pause;
                    end
                    
                    % Assign a unique ID to the facility at hand
                    % This facility number is a string concatenation of the Facility ID (EPA)
                    % and the facility's UNIT ID, seperated by a pipe "|"
                    FillInData = 0;
                    % This checks if the current facility is the same as the last one processed (for efficiency). If not, looks up the uniqueID in the FacilityStruc.
                    if strcmp(LineInfo.FacName,Last.Name) && strcmp(LineInfo.UnitID,Last.UnitID)
                        FacUniqueID = Last.FacUniqueID;
                        IndexFacStruc = Last.IndexFacStruc;
                        FacIDIndex = Last.FacIDIndex;
                        FillInData = 1;
                    else           
                        UnitIDChar = num2str((double(LineInfo.UnitID)));
                        UnitIDChar(find(isspace(UnitIDChar)))=[];
                        UIDNum = str2double(UnitIDChar);
                        
                        FacUniqueID = strcat(int2str(LineInfo.FacID),'|',LineInfo.UnitID);
                       
                        IndexFacStruc =  find(ismember(FacIDCellList,FacUniqueID));
                        if ~isempty(IndexFacStruc)
                            IndexFacStruc = IndexFacStruc(1);
                            FacIDIndex = FacilityStruc(IndexFacStruc).LUTValue;
                            FillInData = 1;
                        else % If the current facility is not found, logs an error to the couldNotFindList variable
                            qerror=sprintf('Could not find index for ORISPL %d: %s %s',...
                                LineInfo.FacID, LineInfo.FacName,LineInfo.UnitID);
                            disp(FacUniqueID);
                            couldNotFindList = {couldNotFindList{:} FacUniqueID};
                            disp(length(FacIDCellList));
                            if ~strcmp(qerror,qerrorlast)
                                fwrite(ErrorFile,qerror);
                                disp(qerror);
                            end
                            qerrorlast=qerror;
                        end
                    end
                    
                    % Populate the output Arrays with the data just extracted
                    if FillInData && (LineInfo.OpTime > 0)
                        ArrayIndex = DateCube(LineDate.Month,LineDate.Day,LineInfo.OpHour+1); % Use DateCube to find the array index for this row
                        if ~isempty(ArrayIndex)
                            if ~isempty(FacIDIndex)
                                if ArrayIndex > NumDates || ArrayIndex < 1 || FacIDIndex < 1 || FacIDIndex > size(GLoadArray,2)
                                    error('Something doesn''t fit...');
                                else
                                    if ~isempty(LineInfo.TotLoad)
                                        
                                        if ~isempty(LineInfo.Gload)
                                            GLoadArray(ArrayIndex,FacIDIndex)=uint16(LineInfo.Gload)*FacilityStruc(IndexFacStruc).G2Nfactor; % Mutiplies gross generation by gross-to-net factor to arrive at net (exported-to-grid) generation -AIH, April 2017
                                        else
                                            SLoadArray(ArrayIndex,FacIDIndex)=uint16(LineInfo.Sload);
                                        end
                                        if ~isempty(LineInfo.CO2Mass)
                                            CO2Array(ArrayIndex,FacIDIndex)=uint16(LineInfo.CO2Mass);
                                        end 
                                        if ~isempty(LineInfo.HeatInput)
                                            HRArray(ArrayIndex,FacIDIndex)=uint16(LineInfo.HeatInput);
                                        end 
                                        if ~isempty(LineInfo.SOXMass)
                                            SOXArray(ArrayIndex,FacIDIndex)=uint16(LineInfo.SOXMass);
                                        end        
                                        if ~isempty(LineInfo.NOXMass)
                                            NOXArray(ArrayIndex,FacIDIndex)=uint16(LineInfo.NOXMass);
                                        end
                                        
                                    end
                                end
                            else
                                error('No FacIDIndex');
                            end
                        end
                        
                        % Display progress every 5000 lines
                        if mod(counter,5000)==0
                            q=sprintf('%s\t Line: %d\t %s-%d\t Facility: %s %s',...
                                FacilityStruc(IndexFacStruc).State, counter, ...
                                datestr(LineInfo.OpDate,'mm-dd'), ...
                                LineInfo.OpYear, LineInfo.FacName, LineInfo.UnitID);
                            disp(q);
                        end
                        
                        % Create "Last" Structure to cache the current facility information for faster processing of subsequent lines from the same facility
                        Last.Name = LineInfo.FacName;
                        Last.UnitID = LineInfo.UnitID;
                        Last.FacUniqueID = FacUniqueID;
                        Last.IndexFacStruc = IndexFacStruc;
                        Last.FacIDIndex = FacIDIndex;
                         
                    end % if optime & FillInData
                    
                end %if Linenow = -1 then you are done
                
            end % if ~strmatch('',LineNow,'exact')
            
        end % while not done loop
        
        % close the csv and ErrorFile, delete the csv
        fclose(fid_input);
        fclose(ErrorFile);
        clear fid_input
        clear ErrorFile
        delete(FileNameCSV);
        
        % Display progress to user
        FractionComplete =sum([DataDirectory(1:FileCyc).bytes])./sum([DataDirectory.bytes])*100;
        disp(sprintf('Paused on %s: %s. Approximately %1.1f%% complete.',...
            FacilityStruc(Last.FacIDIndex).State,...
            datestr(clock),FractionComplete));
        pause(1); 
        if mod(FileCyc,20)==0
            disp('Saving...');
        end
        
    end
    
end % for FileCyc = 1:length(A)

%% 5.  NEW/UPDATED as of February 2022

% JZL and PK: The code will break after the above lines because the "xlsread" function fails to import the
% "CAMDtoFilter_20YY.xlsx" file, causing the code to break at that step. To fix this, the "CAMDtoFilter_20YY.xlsx"
% file must be manually imported into MATLAB. To do this, follow these steps:

% 1. Open the "CAMDtoFilter_20YY.xlsx" (or equivalent for the current year) file and rename the headings by adding "MPC" before each.
% 2. Save and close the "CAMDtoFilter_20YY.xlsx" file.
% 3. In the MATLAB console, select "Import Data" from the header and navigate to the "CAMDtoFilter_20YY.xlsx" file.
% 4. Select the file and click "Open."
% 5. An import window in MATLAB will open. In the header, make sure "Column Vectors" is selected in the "Imported Data" section. This will make each column of data its own variable in MATLAB.
% 6. Select "Import Selection" to import the data.
% 7. In the header of this ("AVERT_ReadCAMDEmissionsData.m") code file, click "run" to finish running the code.
% Note that you cannot import the "CAMDtoFilter_20YY.xlsx" file before running this code from the beginning.
% If you import and then run the code from the beginning, the variables will be cleared out and need to be imported here anyways.

for u = 1:length(MPCCO2)

    FilterLUTCode = MPCLUTCode(u);
    FilterColumn = strmatch(FilterLUTCode, PlantLUTtext(:,1));
    FilterHour = MPCHour(u);
% SO2
    if MPCSO2(u)== 1
        SOXArray(FilterHour,FilterColumn) = 0;
    else
    end
% NOx
    if MPCNOx(u)==1
        NOXArray(FilterHour,FilterColumn) = 0;
    else
    end
% CO2
    if MPCCO2(u)==1
        CO2Array(FilterHour,FilterColumn) = 0;
    else
    end
end

% END NEW/UPDATE

disp('Done!');
%This saves a new file, AVERT_CAMDArray_20YY_UPDATE.mat, containing all of the variables in the current MATLAB workspace
% E.g., GLoadArray, SLoadArray, CO2Array, SOXArray, NOXArray, HRArray, as well as FacilityStruc, DateArray, DateCube, couldNotFindList, etc.
save(sprintf('AVERT_CAMDArray_%d_UPDATE',YearOfAnalysis)) 
disp('Have a good day.')