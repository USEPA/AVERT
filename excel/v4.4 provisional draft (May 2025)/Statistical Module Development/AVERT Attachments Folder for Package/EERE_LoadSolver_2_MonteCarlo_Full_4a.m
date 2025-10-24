%% Load Solver - Solve for Generation and Emissions (Step 2)
% Uses load to solve for expected generation and emissions in a Monte
% Carlo approach. This is the second step in a multi-phase solve program.
% In the first, the program generates the statistical likelihood of generation for
% each unit in the system, including BOTH retiring and new units. In step
% 2, we construct a look-up table that deducts the expected generation of
% new units and adds in the foregone generation of retiring units to come
% up with a hypothetical load level that should be met by all remaining
% units. This is step 2.

% 8/30/2012
% Synapse Energy Economics

function [UArray] = EERE_LoadSolver_2_MonteCarlo_Full_4a(LoadNow,LoadStruct,UnitStruct,MCRuns)

% Verbose returns information about the operation of the model as it executes the Monte Carlo runs.
verbose = 1;

NumTotalUnits = length(UnitStruct);

UArray.Gen       = zeros(NumTotalUnits,MCRuns);
UArray.Ozone.NOX = zeros(NumTotalUnits,MCRuns);
UArray.NotOz.NOX = zeros(NumTotalUnits,MCRuns);
UArray.Ozone.SO2 = zeros(NumTotalUnits,MCRuns);
UArray.NotOz.SO2 = zeros(NumTotalUnits,MCRuns);
UArray.Ozone.CO2 = zeros(NumTotalUnits,MCRuns);
UArray.NotOz.CO2 = zeros(NumTotalUnits,MCRuns);
UArray.Ozone.HR = zeros(NumTotalUnits,MCRuns);
UArray.NotOz.HR = zeros(NumTotalUnits,MCRuns);

tic;
tocnow = 0;

LoadCat = find(LoadNow >= LoadStruct(1).LoadCats,1,'last');
    
    if isempty(LoadCat)
        q=sprintf('No load category found! \nRequested load is %d, but lowest extrapolated load is %d',...
            round(LoadNow),round(LoadStruct(1).LoadCats(1)));
        error(q);
    end
    
if LoadCat >= max(size(LoadStruct(1).LoadCats))
    disp(sprintf('In LoadSolver_MultiLoad:\nExpected load category is higher than extrapolation goes'));
    disp(sprintf(' Fixing by dropping load category down to the top of the extrapolation'));
    disp(sprintf(' This warning should not be ignored. Please check now for validity.'));
    LoadCat = size(LoadStruct(1).LoadCats,1)-1;
end

    if verbose
        disp(sprintf('Full MC Run: Category %d at %1.0f MW',LoadCat,LoadNow));
    end

%% Cycle through all monte carlo runs
MCCyc = 1;
while MCCyc < MCRuns + 1
    
    SuccessfulRun = 0;
    
    % Consolidate the unit probabilities into a long list
    % In the BASELINE run, this represents ALL UNITS (New, Retiring, & Original)
    UnitProbsAtLoadCat = [LoadStruct(LoadCat).Unit.ProbOnline]';
    NumUnits = length(UnitProbsAtLoadCat);
    UnitsIX = 1:NumUnits;
    
    %% First random draw - units on vs. off
    if NumUnits > 0
        % Which units are operating? 1st random draw
        UnitsOn = UnitsIX(rand(NumUnits,1) <= UnitProbsAtLoadCat);
    else
        UnitsOn = [];
    end
    
    % No units operating? Problem if this is the Units On Status Cycle
    if isempty(UnitsOn)
        if verbose
            disp(sprintf('Not enough units to actually generate anything...'));
        end
    else
  
        % Cycle through the units to determine their generation and emissions
        for UnitCyc = 1:length(UnitsOn)
            UnitNow = UnitsOn(UnitCyc);
            
            %% Second random draw - how much is each unit generating?
            % How much is this unit generating? 2nd random draw - off of probability map. This is the index into the category
            CDFDraw = rand(1);
            
            % How much is this unit generating? 2nd random draw - off of probability map. This is the index into the category
            GenCat = find(CDFDraw <= ...
                LoadStruct(LoadCat).Unit(UnitNow).GenCatCumFreq,1,'first');
            
            % Determine unit generation by taking the average of the bottom of the category and the top of the category
            UnitGen = ...
                (LoadStruct(LoadCat).Unit(UnitNow).GenCats(GenCat) + ...
                LoadStruct(LoadCat).Unit(UnitNow).GenCats(GenCat+1))/2;

            % Store unit generation in big array
            UArray.Gen(UnitNow,MCCyc)=UnitGen;

            for OzCyc = 1:2
                switch OzCyc
                    case 1
                        OzTog = 'Ozone';
                    case 2
                        OzTog = 'NotOz';
                end
                
                if ~UnitStruct(UnitNow).(OzTog).Empty
                    
                    if ~UnitStruct(UnitNow).GenCat(GenCat).(OzTog).Empty
                        
                        for PltCyc = 1:4
                            OverrideOn = 0;
                            switch PltCyc
                                case 1
                                    PltTog = 'SO2';
                                    if UnitStruct(UnitNow).SO2Override > 0
                                        UnitEmission = UnitGen*UnitStruct(UnitNow).SO2Override;
                                        OverrideOn = 1;
                                    end
                                    
                                case 2
                                    PltTog = 'NOX';
                                    if UnitStruct(UnitNow).NOxOverride > 0
                                        UnitEmission = UnitGen*UnitStruct(UnitNow).NOxOverride;
                                        OverrideOn = 1;
                                    end
                                    
                                case 3
                                    PltTog = 'CO2';
                                    if UnitStruct(UnitNow).CO2Override > 0
                                        UnitEmission = UnitGen*UnitStruct(UnitNow).CO2Override;
                                        OverrideOn = 1;
                                    end
                                    
                                case 4
                                    PltTog = 'HR';
                                   
                            end
                            
                            if ~OverrideOn
                                    %% Third random draw - emissions
                                    % What's the emission load from this unit at this generation level? 3rd random draw off of a probability map.
                                    CDFDraw = rand(1);

                                    % How much is this unit emitting? 3rd random draw - off of emissions probability map. This is the index into the category
                                    
                                    % Below is a routine for CO2 gapfilling. If a unit has no CO2 emissions, it likely does not report. 
                                    % Instead, we calculate CO2 as the product of a fuel-based carbon content and the unit's heat input in MMBTU.
                                    if PltCyc == 3 && sum(UnitStruct(UnitNow).GenCat(GenCat).(OzTog).CO2.EmCats)==0                   
                                        CO2gapfill = 1; 
                                    
                                        EmCat = find(CDFDraw <= ...
                                        UnitStruct(UnitNow).GenCat(GenCat).(OzTog).HR.EmCatCumFreq,1,'first');
                                    
                                    else    
                                        CO2gapfill = 0;
                                        
                                        EmCat = find(CDFDraw <= ...
                                            UnitStruct(UnitNow).GenCat(GenCat).(OzTog).(PltTog).EmCatCumFreq,1,'first');
                                    end
 
                                    if CO2gapfill == 1
                                    
                                        EmCatsLocal = UnitStruct(UnitNow).GenCat(GenCat).(OzTog).HR.EmCats;
                                        
                                        UnitEmission = ...
                                        UnitStruct(UnitNow).CO2content*(EmCatsLocal(EmCat) + ...
                                        EmCatsLocal(EmCat+1))/2;

                                    else
                                        
                                        EmCatsLocal = UnitStruct(UnitNow).GenCat(GenCat).(OzTog).(PltTog).EmCats;
                                        
                                        UnitEmission = ...
                                        (EmCatsLocal(EmCat) + ...
                                        EmCatsLocal(EmCat+1))/2;
                                    
                                    end                         
                            end
                           
                            % Store it in the array
                            UArray.(OzTog).(PltTog)(UnitNow,MCCyc) = UnitEmission;

                        end %Pollutant Cycle
                        
                        SuccessfulRun = 1;
                        
                    else
                        SuccessfulRun = 0;
                    end % If there's no data here
                else
                    SuccessfulRun = 0;
                end
                
            end % Ozone Toggle
            
        end % Unit Cycle
        
    end % if no units to deal with in the first place...
    
    SuccessfulRun=1;
    
    if SuccessfulRun
        MCCyc = MCCyc +1;
    end
    
    if verbose
    if mod(MCCyc,100)==1
        disp(sprintf('MCCyc=%d',MCCyc));
    end
    end

end % Monte Carlo Cycle

if verbose
    disp(sprintf('Result: %1.0f',round(sum(mean(UArray.Gen(:,:),2)))));
end
