%% Gather Statistics: Load Patterns
% 1/7/2011
% Synapse Energy Economics

function LoadStruct = EERE_LoadStats_2a(StudyArray,HourlyLoad,UnitStruct,LoadCats,LoadPeriodsArray,RegionString)

q= sprintf('%s\n\nGathering load stats by load category',RegionString);

hwaitbar = waitbar(0,q,'Name','LoadStats','color','w');

NumUnits = size(StudyArray.Load,2);

LoadStruct = [];
LoadStruct.LoadCats = LoadCats;
NumLoadCats = length(LoadStruct(1).LoadCats);

for LoadCatCyc = 1:NumLoadCats-1
    
    % Set up the load categories
    % Hours go into the lower bounding load category (i.e. if an hour's
    % load is 5430, it would go into the 5424 bucket rather than the 5436
    % bucket)
    LoadIX = find(...
        HourlyLoad>LoadCats(LoadCatCyc) & ...
        HourlyLoad<=LoadCats(LoadCatCyc+1) & ...
        LoadPeriodsArray == 1);

    % Record the load categories in the structure
    LoadStruct(LoadCatCyc).LoadIX = LoadIX;
    LoadStruct(LoadCatCyc).SumGen = sum(StudyArray.Load(LoadIX,:)')';
    % Midpoints represent the average load in the category (important at high and
    % low load categories where the distribution is anything but normal)

    [V.Freq,V.Vals]=hist(HourlyLoad(LoadIX),5);
    
    LoadStruct(LoadCatCyc).MidPoint = mean(HourlyLoad(LoadIX));
 
    % Cycle through all of the units
    for UnitCyc = 1:NumUnits
        % Record the actual generation in the load category (index into
        % those hours in the load category are in LoadIX)
        LoadStruct(LoadCatCyc).Unit(UnitCyc).GenArray = ...
            double(StudyArray.Load(LoadIX,UnitCyc));
        GArray = LoadStruct(LoadCatCyc).Unit(UnitCyc).GenArray;
        LoadStruct(LoadCatCyc).Unit(UnitCyc).GenArrayOn = ...
            GArray(find(GArray > 0));

        % What percentage of the time is this unit online at this
        % particular load category?
        LoadStruct(LoadCatCyc).Unit(UnitCyc).ProbOnline = ...
            length(find(LoadStruct(LoadCatCyc).Unit(UnitCyc).GenArray~=0)) ./ ...
            length(LoadIX);

        % If the unit turns on at all, then it has a probability function
        % which will describe how it operates; and if the unit
        % actually has generation categories.
        if LoadStruct(LoadCatCyc).Unit(UnitCyc).ProbOnline > 0 & ...
                ~UnitStruct(UnitCyc).Empty

            % The categories are transfered in from the UnitStruc
            % structure system (for compatibility)
            LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCats = ...
                UnitStruct(UnitCyc).GenCats;

            % Cycles = Number of generation categories minus one
            NumCats = length(LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCats);

            % Determine the frequency in which the generator is
            % within the generation category
            for GenCyc = 1:NumCats-1
                GenIX = find( LoadStruct(LoadCatCyc).Unit(UnitCyc).GenArrayOn >= ...
                    LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCats(GenCyc) & ...
                    LoadStruct(LoadCatCyc).Unit(UnitCyc).GenArrayOn <= ...
                    LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCats(GenCyc+1));
                LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCatFreq(GenCyc) = length(GenIX);
            end

            % Cumulative Frequency
            LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCatCumFreq = ...
                cumsum(LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCatFreq ./ ...
                sum(LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCatFreq));

        end %If not empty and probability of the unit being online is greater than 1
    end % UnitCyc
    
waitbar(LoadCatCyc / (NumLoadCats-1))
    
end % Load Category Cycle

close(hwaitbar)