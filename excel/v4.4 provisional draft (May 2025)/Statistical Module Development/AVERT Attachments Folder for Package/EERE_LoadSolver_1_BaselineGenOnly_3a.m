%% Load Solver - Baseline (Step 1)
% Uses load to solve for expected generation and emissions in a Monte
% Carlo approach. This is the first step in a multi-phase solve program.
% First, the program generates the statistical likelihood of generation for
% each unit in the system, including BOTH retiring and new units. In step
% 2, we construct a look-up table that deducts the expected generation of
% new units and adds in the foregone generation of retiring units to come
% up with a hypothetical load level that should be met by all remaining
% units. This is just step 1.

% 8/30/2012
% Synapse Energy Economics

function [UArray] = EERE_LoadSolver_1_BaselineGenOnly_3a(LoadNow,LoadStruct,UnitStruct,MCRuns)

% Verbose returns information about the operation of the model as it executes the Monte Carlo runs.
verbose = 0;

NumTotalUnits = length(UnitStruct);

UArray.Gen       = zeros(NumTotalUnits,MCRuns);

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
        disp(sprintf('Gen Only MC Run: Category %d at %1.0f MW',LoadCat,LoadNow));
    end
    
%% Cycle through all monte carlo runs

MCCyc = 1;
while MCCyc < MCRuns + 1

    % Consolidate the unit probabilities into a long list
    % In the BASELINE run, this represents ALL UNITS (New, Retiring, & Original)
    UnitProbsAtLoadCat = [LoadStruct(LoadCat).Unit.ProbOnline]';
    NumUnits = length(UnitProbsAtLoadCat);
    UnitsIX = 1:NumUnits;
    
    %% First random draw - units on vs. off
    if NumUnits > 0
        % Which units are operating? 1st random draw
        UnitsOn = UnitsIX(find(rand(NumUnits,1) <= UnitProbsAtLoadCat));
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
        end % Unit Cycle
    end %% if no units to deal with in the first place...
    
        MCCyc = MCCyc +1;
    
end % Monte Carlo Cycle

if verbose
    disp(sprintf('Result: %1.0f',round(sum(mean(UArray.Gen(:,:),2)))));
end