%% Avoided Emissions and Generation Tool (AVERT)
%% AVERT Statistical Module - Main
% Synapse Energy Economics

% Batch load period processing

TotalSteps = 15;
CurrentStep = 0;
scrsz = get(0,'ScreenSize');

clc;
Qstring.a = sprintf('Avoided Emissions and Generation Tool (AVERT) Statistical Module');
Qstring.b = sprintf('Synapse Energy Economics, April 2025');

Qstring.c = sprintf('Enter number of Monte Carlo runs:');

prompt = {sprintf('%s\n%s\n\n%s',Qstring.a,Qstring.b,Qstring.c),...
    'Enter number of generation-only Monte Carlo runs:',...
    'Minimum annual generation to participate (MWh):',...
    'Write output file?',...
    'Please name this run.'};
dlg_title = 'Input for AVERT Model';
num_lines = 1;
def = {'1000','500','1000','Y',''};
answer = inputdlg(prompt,dlg_title,num_lines,def);
RunName = answer(5);

MCRuns = str2num(char(answer(1)));
MCRunsGenOnly = str2num(char(answer(2)));
MinAnnualGen = str2num(char(answer(3)));

if char(answer(4))=='Y'
    WriteOutput = 1;
else if char(answer(4))=='N'
        WriteOutput = 0;
    else
        warndlg('Not valid WriteOutput value. Use letter Y or N only.')
        error('Not valid WriteOutput value. Use letter Y or N only.')
    end
end

if MCRuns == str2num(char(def(1)))
    q = ' [default]';
else
    q = '';
end
Qstring.a=(sprintf('AVERT Monte Carlo Runs:   %d%s',MCRuns,q));

if MCRunsGenOnly == str2num(char(def(2)))
    q = ' [default]';
else
    q = '';
end
Qstring.b=(sprintf('MC EGU Estimate Runs:   %d%s',MCRunsGenOnly,q));

q = ' [default]';
InitNumLoadCats = 40; % Number of load bins in which to divide fossil generation
Qstring.c=(sprintf('Number of load categories:   %d%s',InitNumLoadCats+1,q));

if MinAnnualGen == str2num(char(def(3)))
    q = ' [default]';
else
    q = '';
end
Qstring.d=(sprintf('Minimum generation threshold:   %d MWh%s',MinAnnualGen,q));

if WriteOutput
    Qstring.e=sprintf('AVERT will write output file.');
else
    Qstring.e=sprintf('AVERT will not write output file.');
end

q =    sprintf('%s\n%s\n%s\n%s\n%s\n',Qstring.a,Qstring.b,Qstring.c,Qstring.d,Qstring.e);%,...

%% Plot options
MCVerbose = 0;

%q=sprintf('AVERT Model:\n');
Primary_waitbar = waitbar(CurrentStep,q,...
    'Name','AVERT Model Progress','color','w');

% Exceedance Limit
% This is the limit to which the expected generation can be off from the
% extrapolated generation line without triggering a fault. If a fault is
% triggered, we need to build a new set of power plants
ExceedanceLimit = .20;

load('AVERT_RegionNames_Update.mat');

%% Load in CAMD Data and Initial Structure Array
if ~exist('GLoadArray')

    CAMDChoice.DirectoryFiles = dir('.\CAMD Input Files\*.mat');
    CAMDChoice.Choice = menu('Choose CAMD Dataset',CAMDChoice.DirectoryFiles.name);
    CAMDChoice.FilePath =['.\CAMD Input Files\' ...
        CAMDChoice.DirectoryFiles(CAMDChoice.Choice).name];

    q=sprintf('Now loading %s CAMD database...\n',CAMDChoice.FilePath(end-14:end-11));
    CurrentStep = CurrentStep + 1;
    waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
    load(CAMDChoice.FilePath);

q=sprintf('Now loading %s CAMD database...\nDone.',CAMDChoice.FilePath(end-14:end-11));

end

CurrentStep = CurrentStep + 1;
waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);

%% Read in Retirement and Changed Unit Data
EERE_ReadRetirementData_1a;

%% Read in New Unit Data
EERE_ReadNewUnitData_1a;

%% Start Batch Runs
[Batch.Options,ok] = listdlg('PromptString','Choose one or more regions:',...
    'SelectionMode','multiple',...
    'ListString',CSIRegionsNames);
if ok==0
    warndlg('Selection cancelled')
    error('Selection cancelled');
end

for BatchCyc = 1:length(Batch.Options)

    Years = DateArray(1,1);
    jet2=jet(length(Years));
    
    % Define ORISPLs of Interest
    NumLoadCats = InitNumLoadCats;
    
    RegionOfInterest.Num = Batch.Options(BatchCyc);
    RegionOfInterest.Name = char(CSIRegions_LUT(RegionOfInterest.Num));
    RegionOfInterest.LongName = char(CSIRegionsNames(RegionOfInterest.Num));
    
    if exist('StudyArray')
        clear StudyArray;
    end
    
    q=sprintf('Creating new StudyArray for %s (%s)',RegionOfInterest.LongName,RegionOfInterest.Name);
    
    CurrentStep = CurrentStep + 1;
    waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
    
    % Pull correct plants for region
    StudyFacs = find([FacilityStruc.CSIRegionIX]==RegionOfInterest.Num)';
    PlantsInStudy = [FacilityStruc(StudyFacs).LUTValue]';
    
    StatesInAnalysis =  unique([{FacilityStruc(StudyFacs).State}'])';
    StateList=char(StatesInAnalysis(1));
    for StateCyc = 2:length(StatesInAnalysis)
        StateList = [StateList ', ' char(StatesInAnalysis(StateCyc))];
    end
    
    % Greater than MinAnnualGen MWh each year
    NoGenPlants = find(sum(GLoadArray(:,PlantsInStudy),1)<=MinAnnualGen);
    
    PlantsInStudy(NoGenPlants)=[];
    StudyFacs(NoGenPlants)=[];
    
    StudyArray = [];
    StudyArray.Load = GLoadArray(:,PlantsInStudy);
    StudyArray.CO2 = CO2Array(:,PlantsInStudy);
    StudyArray.SO2 = SOXArray(:,PlantsInStudy);
    StudyArray.NOX = NOXArray(:,PlantsInStudy);
    StudyArray.HR = HRArray(:,PlantsInStudy);
    
    Qstring.a=sprintf('------------------------------------------------------------');
    Qstring.b=sprintf('Working on %s region (%d)',RegionOfInterest.Name,YearOfAnalysis);
    Qstring.c=sprintf('Includes States: %s',StateList);
    Qstring.d=sprintf('%d fossil units',length(PlantsInStudy));

    RegionString = sprintf('%s\n%s\n%s\n%s\n%s',Qstring.a,Qstring.b,Qstring.c,Qstring.d,Qstring.a);
    
    % Create the AnalysisOn and SeasonDates Arrays
    if ~exist('AnalysisOn')
        clear AnalysisOn
        AnalysisOn.Array = ones(size(DateArray,1),1); %%Default all hours on
    end
    
    % SeasonDates is the Ozone Season or Not Ozone Season marker
    if ~exist('SeasonDates')
        clear SeasonDates
        SeasonDates.Ozone.IX = find(...
            (DateArray(:,2)==5 | ...
            DateArray(:,2)==6 | ...
            DateArray(:,2)==7 | ...
            DateArray(:,2)==8 | ...
            DateArray(:,2)==9));
        SeasonDates.NotOz.IX = find(...
            (DateArray(:,2)==1 | ...
            DateArray(:,2)==2 | ...
            DateArray(:,2)==3 | ...
            DateArray(:,2)==4 | ...
            DateArray(:,2)==10 | ...
            DateArray(:,2)==11 | ...
            DateArray(:,2)==12));
        SeasonDates.Ozone.Array = zeros(size(DateArray,1),1);
        SeasonDates.Ozone.Array(SeasonDates.Ozone.IX)=1;
        SeasonDates.NotOz.Array = zeros(size(DateArray,1),1);
        SeasonDates.NotOz.Array(SeasonDates.NotOz.IX)=1;
    end
    
    %%
    
    EGGridPeriod = [];
    
    UnitStruct = [];
    LoadStructPeriod = [];
    GenEmsOutputStruct = [];
    
    NumHours = size(DateArray,1);
    
    %% Start Load Periods Statistics

    FirstYearLoad = sum(StudyArray.Load,2); % This is the total fossil load of the year of analysis
    
    % A load period is a unique period of hours in which it is clear that
    % the dynamics between load and generation are unique. For example, if
    % a nuclear unit comes online, or a hydro facility starts generating,
    % the rest of dispatch will change dramatically. This takes into
    % account such changes.
    
    LoadPeriods.Values = ones(size(DateArray,1),1);
    LoadPeriods.Count = max(LoadPeriods.Values)-min(LoadPeriods.Values)+1;
    for PeriodCyc = 1:LoadPeriods.Count
        LoadPeriods.Index(PeriodCyc).IX=find(LoadPeriods.Values==PeriodCyc);
        LoadPeriods.Index(PeriodCyc).Array=zeros(size(FirstYearLoad));
        LoadPeriods.Index(PeriodCyc).Array(LoadPeriods.Index(PeriodCyc).IX)=1;
    end
    
    %% UnitStruct
    % Gather Unit-based statistics
    q = sprintf('Gathering unit-based Statistics.\n(%s)\n',RegionOfInterest.LongName);
    CurrentStep = CurrentStep + 1;
    waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
    UnitStructBase = EERE_UnitStats_3a(StudyArray,FacilityStruc,StudyFacs,SeasonDates,RegionString);
    
    for PeriodCyc = 1:LoadPeriods.Count
        
        disp(sprintf('Beginning Period Cycle #%d',PeriodCyc'));
        
        UnitStruct = UnitStructBase;
        
        YearCounter = 0; % Year Counter is not used in this version of the model, which only uses a single test year. Legacy variable
        LoadStruct =[];
        
        % Choose mechanism for finding load categories
        
        % Even-houred load categories [preferred]
        LoadPercentiles = 100*(0:NumLoadCats-1)/(NumLoadCats-1);
        LoadPercentiles = [0 ...
            100*(20/length(FirstYearLoad))...
            LoadPercentiles(2:end-1) ...
            100*(1-(20/length(FirstYearLoad))) ...
            100];
        LoadCats = prctile(FirstYearLoad(LoadPeriods.Index(PeriodCyc).IX),LoadPercentiles);
        
        %% Gather Load-based Statistics - Load
        q = sprintf('Gathering load-based Statistics.\n(%s)\n',RegionOfInterest.LongName);
        CurrentStep = CurrentStep + 1;
        waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
        
        LoadStruct = ...
            EERE_LoadStats_2a(StudyArray,FirstYearLoad,UnitStruct,...
            LoadCats,LoadPeriods.Index(PeriodCyc).Array,RegionString);
        LoadStructBase = LoadStruct;
        
        LoadStructPeriod(PeriodCyc).LoadStruct = LoadStructBase;
        
        %% ADD NEW UNITS and RETIRE EXISTING UNITS
        %%% Add new units into UnitStruct and LoadStruct
        if isempty(NewUnits)
            NewUnitsLocal=[];
        else
            NewUnitsLocal = NewUnits(find([NewUnits.CSIRegionIX]==RegionOfInterest.Num));
        end
        
        % Collect Stats about Potential New Units (based on pre-existing units)

        if isempty(NewUnitsLocal)
            q=sprintf('No new units to add in %s.',RegionOfInterest.LongName);

            CurrentStep = CurrentStep + 1;
            waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
        else
            q=sprintf('\nNow adding new units to %s.',RegionOfInterest.LongName);

            CurrentStep = CurrentStep + 1;
            waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
            [NewUnitStructOptions, NewLoadStructOptions] = ...
                EERE_NewUnitStats_3a(UnitStruct,LoadStruct,NewUnits);
            for UnitCyc=1:length(NewUnitStructOptions)
                [UnitStruct,LoadStruct] = ...
                    EERE_AddGenerator_1a(UnitStruct,LoadStruct,...
                    NewUnitStructOptions,NewLoadStructOptions,UnitCyc);
            end
        end
        
        %%% Designate Retiring Units %%%
        % Units are already designated as retired from the national
        % database, so here we just announce which units are retired.
        RetUnitsLocal = find([UnitStruct.Retired]);
        
        if ~isempty(RetUnitsLocal)
            q=(sprintf('\nRetiring units in the %s region.',...
                RegionOfInterest.LongName));

            CurrentStep = CurrentStep + 1;
            waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
            
            for FacCyc = 1:length(RetUnitsLocal)
                q=(sprintf('Retiring %s %s [%d MW]',...
                    UnitStruct(RetUnitsLocal(FacCyc)).Name,...
                    UnitStruct(RetUnitsLocal(FacCyc)).UnitID,...
                    UnitStruct(RetUnitsLocal(FacCyc)).GenCats(end)));

            end
        end
        %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        
        %% Begin Model
        for YearCyc = min(Years):max(Years)
            YearCounter = YearCounter + 1;
       
            % Load_Annual should turn into the expected load or load reduction, in essence the test load in the future year
            Load_Annual = FirstYearLoad;
            
            %% Extrapolate load structures
            % This section of code estimates statistics (i.e. the
            % probability of operation and the expected generation at any
            % given level of system load) when system load is much higher
            % or much lower than has been experienced in the past.
            q = sprintf('Now extrapolating generation units\ninto higher and lower load categories.\n(%s)\n',RegionOfInterest.LongName);
            waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
            
            [LoadStructExp,ExpectedGen] = ...
                EERE_ExtrapolateLoad_10a_Cntrpnts_LinearExt_GenToLimits(LoadStruct,UnitStruct,RegionString);
            NumUnits = length(UnitStruct);
            
            q = sprintf('Now extrapolating generation units\ninto higher and lower load categories.\n(%s)\nDone',RegionOfInterest.LongName);
            CurrentStep = CurrentStep + 1;
            waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
            
            %% Set up structures to drop information
            
            % Redefine load categories for this year
            LoadCatsAnnual = [LoadStructExp.MidPoint]';
            NumLoadCatsAnnual = length(LoadCatsAnnual);
            
            % Create array to drop average unit output from monte carlo runs
            GenAvgOutputArray = zeros(length(UnitStruct),NumLoadCatsAnnual);
            
            GenMeans = zeros(NumLoadCatsAnnual-1,2);
            NOXOzoneMeans = zeros(NumLoadCatsAnnual-1,2);
            LoadMeans = zeros(NumLoadCatsAnnual-1,1);
            
            % New initialization of EEGrid 3/16/2012
            EGGrid=EERE_Initialize_EGGrid(Years,NumLoadCatsAnnual);
            
            EGGrid.LoadCats(YearCounter).LoadCatsAnnual = LoadCatsAnnual;
            
            % Cycle through each of the Load Bins in the extrapolated load
            % bins set to get the lowest and highest set of answers.
            
            q = sprintf('Generation-only Monte Carlo runs.\n(%s)\n',RegionOfInterest.LongName);
            CurrentStep = CurrentStep + 1;
            waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
            
            q= sprintf('%s\n\nGeneration-only Monte Carlo runs.\nLoad Cycle:',RegionString);
            hwaitbar = waitbar(0,q,'Name','AVERT Model','color','w');
            
            for LoadCyc = 1 : NumLoadCatsAnnual
                
                LoadNow = LoadCatsAnnual(LoadCyc); % EERE 3/15/2012
                
                %% Run the stochastic model %%
                % UArray will hold stochastic _generation_ output for all
                % EGU in one load bin ("LoadNow"). GenAvgOutputArray takes
                % the average of the stochastic runs. This info will then
                % get used to determine the contribution of retired units to
                % the system.
                UArray=[];
                [UArray] = EERE_LoadSolver_1_BaselineGenOnly_3a(LoadNow,LoadStructExp,UnitStruct,MCRunsGenOnly);
                GenAvgOutputArray(:,LoadCyc) = mean(UArray.Gen,2);
                
                waitbar(LoadCyc/NumLoadCatsAnnual,hwaitbar,...
                    sprintf('%s %d',q,LoadCyc));
                
            end % LoadCyc
            
            close(hwaitbar);
            
            MigrateDistanceArray = zeros(NumLoadCatsAnnual,1);
            
            for LoadCyc = 1 : NumLoadCatsAnnual
                [MigrateDistance] = EERE_FindRetireAdd_ProxyLoad(GenAvgOutputArray,LoadCatsAnnual,UnitStruct,LoadCyc);
                if ~isempty(MigrateDistance)
                    MigrateDistanceArray(LoadCyc) = MigrateDistance;
                end
                
            end % LoadCyc
            
            q = sprintf('Full Generation & Emissions\nMonte Carlo runs.\n(%s)\n',RegionOfInterest.LongName);
            CurrentStep = CurrentStep + 1;
            waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
            
            q= sprintf('%s\n\nAVERT Monte Carlo runs.\nLoad Cycle:',RegionString);
            hwaitbar = waitbar(0,q,'Name','AVERT Model','color','w');
            
            for LoadCyc = 1 : NumLoadCatsAnnual
                
                DesiredLoad = round(LoadCatsAnnual(LoadCyc));
                
                LoadNow = round(LoadCatsAnnual(LoadCyc) + ...
                    MigrateDistanceArray(LoadCyc));
                
                UArray=[];
                [UArray] = EERE_LoadSolver_2_MonteCarlo_Full_4a(LoadNow,LoadStructExp,UnitStruct,MCRuns);
                
                UnitExistIX = find([UnitStruct.Retired]==0);
                
                if MCVerbose
                    DerivedLoad = round(sum(mean(UArray.Gen(UnitExistIX,:),2)) );
                    disp(sprintf('%1.0f + %1.0f = %1.0f; Result = %1.0f; Difference = %1.0f\n',...
                        DesiredLoad,...
                        MigrateDistanceArray(LoadCyc),...
                        LoadNow,...
                        DerivedLoad, DesiredLoad-DerivedLoad));
                end
                
                EGGrid.LoadMeans(YearCounter,LoadCyc) = DesiredLoad;
                EGGrid.Gen.Mean(YearCounter,LoadCyc) = round(mean(sum(UArray.Gen(UnitExistIX,:)),2));
                EGGrid.Gen.Std(YearCounter,LoadCyc) = round(std(sum(UArray.Gen(UnitExistIX,:))));
                
                for OzCyc = 1:2
                    switch OzCyc
                        case 1
                            OzTog = 'Ozone';
                        case 2
                            OzTog = 'NotOz';
                    end
                    
                    for PltCyc = 1:4
                        switch PltCyc
                            case 1
                                PltTog = 'NOX';
                            case 2
                                PltTog = 'SO2';
                            case 3
                                PltTog = 'CO2';
                            case 4
                                PltTog = 'HR';
                        end
                        
                        EGGrid.(OzTog).(PltTog).Mean(YearCounter,LoadCyc) = ...
                            round(mean(sum(UArray.(OzTog).(PltTog)(UnitExistIX,:)),2));
                        EGGrid.(OzTog).(PltTog).Std(YearCounter,LoadCyc) = ...
                            round(std(sum(UArray.(OzTog).(PltTog)(UnitExistIX,:))));
                        
                    end %Ozone Season Cyc
                end %Pollutant Cycle
                
                %%%%%%%%%%%%%%%%%% EERE Material %%%%%%%%%%%%%%%%%%%
                
                EGGrid.FacMeans(YearCounter).Gen(:,LoadCyc) = mean(UArray.Gen,2);
                EGGrid.FacMeans(YearCounter).NOxOzone(:,LoadCyc) = mean(UArray.Ozone.NOX,2);
                EGGrid.FacMeans(YearCounter).NOxNotOz(:,LoadCyc) = mean(UArray.NotOz.NOX,2);
                
                EGGrid.FacMeans(YearCounter).SO2Ozone(:,LoadCyc) = mean(UArray.Ozone.SO2,2);
                EGGrid.FacMeans(YearCounter).SO2NotOz(:,LoadCyc) = mean(UArray.NotOz.SO2,2);
                
                EGGrid.FacMeans(YearCounter).CO2Ozone(:,LoadCyc) = mean(UArray.Ozone.CO2,2);
                EGGrid.FacMeans(YearCounter).CO2NotOz(:,LoadCyc) = mean(UArray.NotOz.CO2,2);
                
                EGGrid.FacMeans(YearCounter).HROzone(:,LoadCyc) = mean(UArray.Ozone.HR,2);
                EGGrid.FacMeans(YearCounter).HRNotOz(:,LoadCyc) = mean(UArray.NotOz.HR,2);
                
                %%%%%%%%%%%%%%%% End EERE Material %%%%%%%%%%%%%%%%%
                
                waitbar(LoadCyc/NumLoadCatsAnnual,hwaitbar,...
                    sprintf('%s %d',q,LoadCyc));
                
            end %LoadCyc
            
            delete(hwaitbar);
            
        end %Year
        
        % end %If RunModel
        
    end %PeriodCyc
    
    %% Final Sorting for Output
    AGen =EGGrid.FacMeans(1).Gen;
    %%%%%% vvvvvvvvvvvvvvvvvvvvvvv %%%%%%%
    % Identify generators that are retired so we can pull them out
    RetireStatus = [UnitStruct.Retired]';
    RetireFacs = find(RetireStatus == 1);
    AGen(RetireFacs,:)=-9999;
    %%%%%% ^^^^^^^^^^^^^^^^^^^^^^^ %%%%%%%
    Astderror = std(AGen')'./sum(AGen')';
    [SortedError,SortedErrorIX]=sort(Astderror,'ascend');
    %%%%%% vvvvvvvvvvvvvvvvvvvvvvv %%%%%%%
    SortedError(find(RetireStatus(SortedErrorIX)))=[];
    SortedErrorIX(find(RetireStatus(SortedErrorIX)))=[];
    %%%%%% ^^^^^^^^^^^^^^^^^^^^^^^ %%%%%%%
    
    %% Final Figure
    if 1
        h=figure('Name',sprintf('AVERT Model - %s',RegionOfInterest.LongName),...
            'Numbertitle','off',...
            'Position',[50 50 scrsz(3)/2-50 scrsz(4)/2-50],...
            'menubar','none','color','w');
        clf;
        area([LoadStructExp.MidPoint],EGGrid.FacMeans(1).Gen(SortedErrorIX,:)');
        hold on;
        plot(EGGrid.LoadMeans(YearCounter,:)',EGGrid.Gen.Mean(YearCounter,:)',...
            'ko','markerfacecolor',[.5 .5 .5]);
        
        NativeLoadIX = ...
            find(EGGrid.LoadMeans(YearCounter,:)==round(ExpectedGen.Hist.MidPoints(1))) : ...
            find(EGGrid.LoadMeans(YearCounter,:)==round(ExpectedGen.Hist.MidPoints(end)));
        
        h=plot(EGGrid.LoadMeans(YearCounter,NativeLoadIX)',EGGrid.Gen.Mean(YearCounter,NativeLoadIX)',...
            'ko','markerfacecolor',[1 1 1]);
        
        axis image; grid on;
        
        title(sprintf('Average unit generation for\n all load levels in %s',RegionOfInterest.LongName));
        set(gca,'XTickLabel',get(gca,'XTick'));
        xlabel('Required Fossil Generation (MW)');
        set(gca,'YTickLabel',get(gca,'YTick'));
        ylabel('Modeled Fossil Generation (MW)');
    end
    
    save(sprintf('AVERT_AVERTArray_%s_%d',RegionOfInterest.Name,YearOfAnalysis))
    %% Write Output
    
    if WriteOutput
        
        q = sprintf('Finished Monte Carlo runs.\nNow writing output file.\n(%s)\n',RegionOfInterest.LongName);
        CurrentStep = CurrentStep + 1;
        waitbar(CurrentStep/TotalSteps,Primary_waitbar,q);
        
        %%%JSON Switch%%% 
        %this version outputs unit metadata as part of every data block
        EERE_json_output;
        
        %this version outputs unit metadata only once
        EERE_json_output_condensed;
        
        EERE_Output_Gen_EmissionsArray_5a_RetiredUnitsExcluded;
        q=sprintf('Finished with %s.\nOutput file written.',RegionOfInterest.LongName);
        waitbar(TotalSteps/TotalSteps,Primary_waitbar,q);
        
    else
        q=sprintf('Finished with %s.\nNo output file written.',RegionOfInterest.LongName);
        waitbar(TotalSteps/TotalSteps,Primary_waitbar,q);
    end
    
end %% batch processing