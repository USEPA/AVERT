%% Add ability for existing units to meet extrapolated load

% 4/19/2012
% Synapse Energy Economics

function [LoadStructOut,ExpectedGen] = EERE_ExtrapolateLoad_9b_Cntrpnts_LinearExt_GenToLimits(LoadStruct,UnitStruct,RegionString)

load('SurfaceMap.mat')

MaxSystemCap = 0;
MinSystemCap = 0;
for UnitCyc = 1:length(UnitStruct)
    MaxSystemCap = MaxSystemCap + UnitStruct(UnitCyc).GenCats(end);
    MinSystemCap = MinSystemCap + UnitStruct(UnitCyc).GenCats(1);
end

TopExtrapBasis = .05; % where to start the top extrapolation
BottomExtrapBasis = .5; % where to end the bottom extrapolation

ExtrapolateUpDistance = 1.05; % The distance to extrapolate up above
%                               the top of the current load range.
%                               Multiplier times the dynamic range of the
%                               naturally occuring range.
ExtrapolateDownDistance = .5; % The distance to extrapolate down below the
%                               bottom of the current load range.
%                               Fraction of the distance between the bottom
%                               of the current load range and zero.

MaxHistoricalOnlineProb = .95; % If the probability of being online exceeded this value at any
%                              % load category, simply assign the future probability as
%                              %  MaxFutureOnlineProb, see below
MaxFutureOnlineProb = 1.0;     % ...see above.

plotson_ProbOnline      = 0;
plotson_GenProbByLoad   = 0;
plotson_SurfacePlots    = 0;
plotson_StartOnly       = 0;

LoadStructOut = [];
LoadStructOut(1).LoadCats = [];
LoadStructOut(1).LoadIX = [];
LoadStructOut(1).SumGen = [];
LoadStructOut(1).MidPoint = [];
LoadStructOut(1).Unit = [];

NumLoadCats = length(LoadStruct(1).LoadCats);
LoadCategories = LoadStruct(1).LoadCats;

% Expected generation will hold the relationship between load and generation
ExpectedGen=[];

% use MidPoints for LoadCats
ExpectedGen.Hist.LoadCats = LoadStruct(1).LoadCats';
ExpectedGen.Hist.MidPoints = [LoadStruct.MidPoint]';
ExpectedGen.Hist.Mean = zeros(NumLoadCats-1,1);

% Figure out what the new dynamic range will be
LoadDynamicRange = LoadStruct(1).LoadCats(end)-LoadStruct(1).LoadCats(1);

% Size of bins outside of the current load range
ExpectedGen.Increment = 4*median(ExpectedGen.Hist.LoadCats(2:end)-ExpectedGen.Hist.LoadCats(1:end-1));

NewLoadCatsAtTopEnd = ExpectedGen.Hist.LoadCats(end):ExpectedGen.Increment:MaxSystemCap;
NewLoadCatsAtTopEnd(1)=[];
NumNewLoadCatsAbove = length(NewLoadCatsAtTopEnd);

NewLoadCatsAtBottomEnd = linspace(MinSystemCap,ExpectedGen.Hist.LoadCats(1),10);
NewLoadCatsAtBottomEnd(end)=[];
NumNewLoadCatsBelow = length(NewLoadCatsAtBottomEnd);
bottomExpInc = (ExpectedGen.Hist.LoadCats(1) - MinSystemCap)/NumNewLoadCatsBelow;

ExpectedGen.Extr.LoadCats = zeros(NumLoadCats + NumNewLoadCatsAbove + NumNewLoadCatsBelow,1);
ExpectedGen.Extr.MidPoints = zeros(NumLoadCats + NumNewLoadCatsAbove + NumNewLoadCatsBelow - 1,1);
ExpectedGen.Extr.Mean = zeros(NumLoadCats - 1+ NumNewLoadCatsAbove + NumNewLoadCatsBelow,1);

% Fill in the historical data into all the categories
for LoadCatCyc = 1:NumLoadCats-1
    ExpectedGen.Hist.Mean(LoadCatCyc) = mean(LoadStruct(LoadCatCyc).SumGen);
    ExpectedGen.Extr.LoadCats(LoadCatCyc + NumNewLoadCatsBelow) = ExpectedGen.Hist.LoadCats(LoadCatCyc);
    ExpectedGen.Extr.MidPoints(LoadCatCyc + NumNewLoadCatsBelow) = ExpectedGen.Hist.MidPoints(LoadCatCyc);
    ExpectedGen.Extr.Mean(LoadCatCyc + NumNewLoadCatsBelow) = mean(LoadStruct(LoadCatCyc).SumGen);
end

ExpectedGen.Extr.LoadCats(NumLoadCats + NumNewLoadCatsBelow) = ExpectedGen.Hist.LoadCats(NumLoadCats);

% Extrapolate expected total generation out from the last 2/3 of the load
% vs. generation curve (linear). First, index the last 2/3 of categories
TopExtrapBasisIX = NumLoadCats-round(NumLoadCats*TopExtrapBasis):NumLoadCats-1;
BottomExtrapBasisIX = 1:round(NumLoadCats*BottomExtrapBasis);

B_TopExtrapBasis = [ExpectedGen.Hist.MidPoints(TopExtrapBasisIX) ...
    ones(length(TopExtrapBasisIX),1)] \ ...
    ExpectedGen.Hist.Mean(TopExtrapBasisIX);
B_BottomExtrapBasis = [ExpectedGen.Hist.MidPoints(BottomExtrapBasisIX) ...
    ones(length(BottomExtrapBasisIX),1)] \ ...
    ExpectedGen.Hist.Mean(BottomExtrapBasisIX);

if plotson_ProbOnline || plotson_StartOnly
    figure(99);
    clf; set(gcf,'color','w');
    plot(ExpectedGen.Hist.MidPoints,ExpectedGen.Hist.Mean,'ro','markerfacecolor',[1 .8 0])
    hold on
    plot(ExpectedGen.Hist.MidPoints(TopExtrapBasisIX),B_TopExtrapBasis(1) * ...
        ExpectedGen.Hist.MidPoints(TopExtrapBasisIX)+B_TopExtrapBasis(2), ...
        'k-','linewidth',2)
    plot(ExpectedGen.Hist.MidPoints(BottomExtrapBasisIX),B_BottomExtrapBasis(1) * ...
        ExpectedGen.Hist.MidPoints(BottomExtrapBasisIX)+B_BottomExtrapBasis(2), ...
        'k-','linewidth',2)
    xlabel('Load (MWh) [SumGen]'); ylabel('Generation (MWh)');
end

% Now we fill in expected generation, based on this extrapolation

for LoadCatCyc = NumLoadCats + NumNewLoadCatsBelow + 1: NumLoadCats + NumNewLoadCatsAbove + NumNewLoadCatsBelow
    ExpectedGen.Extr.LoadCats(LoadCatCyc) = ExpectedGen.Extr.LoadCats(LoadCatCyc-1)+ExpectedGen.Increment;
end

ExpectedGen.Extr.MidPoints(end-NumNewLoadCatsAbove+1:end)= ...
    (ExpectedGen.Extr.LoadCats(end-NumNewLoadCatsAbove+1:end) + ...
    ExpectedGen.Extr.LoadCats(end-NumNewLoadCatsAbove:end-1))./2;

for LoadCatCyc = NumLoadCats + NumNewLoadCatsBelow : NumLoadCats - 1 + NumNewLoadCatsAbove + NumNewLoadCatsBelow
    ExpectedGen.Extr.Mean(LoadCatCyc) = ExpectedGen.Extr.MidPoints(LoadCatCyc)*B_TopExtrapBasis(1)+B_TopExtrapBasis(2);
end

% Fill in below

ExpectedGen.Extr.LoadCats(1:NumNewLoadCatsBelow+1) = linspace(MinSystemCap,ExpectedGen.Hist.LoadCats(1),10);
ExpectedGen.Extr.MidPoints(1:NumNewLoadCatsBelow) = ...
    (ExpectedGen.Extr.LoadCats(2:NumNewLoadCatsBelow+1) + ...
    4*ExpectedGen.Extr.LoadCats(1:NumNewLoadCatsBelow))./5;

for LoadCatCyc = NumNewLoadCatsBelow : -1 : 1
    ExpectedGen.Extr.Mean(LoadCatCyc) = ExpectedGen.Extr.MidPoints(LoadCatCyc) - ExpectedGen.Extr.MidPoints(1) + ExpectedGen.Extr.LoadCats(1);%*B_BottomExtrapBasis(1)+B_BottomExtrapBasis(2);
end

if plotson_ProbOnline || plotson_StartOnly
    figure(99);
    plot(ExpectedGen.Extr.MidPoints,ExpectedGen.Extr.Mean,'.');
    axis square;
    axis([0 max(ExpectedGen.Extr.LoadCats)*1.1 0 max(ExpectedGen.Extr.LoadCats)*1.1]);
    title('Load Bin Midpoints');
    disp('Paused....');
    if plotson_ProbOnline
        pause;
    end
    if plotson_StartOnly
        pause(1);
    end
end

% Fit the new information about the load categories into the load structure
LoadStructOut(1).LoadCats = ExpectedGen.Extr.LoadCats;

NumNewLoadCatsTotal = length(ExpectedGen.Extr.LoadCats);

% Place information from LoadStruct in LoadStructOut
for LoadCatCyc = 1 : NumLoadCats - 1
    LoadStructOut(LoadCatCyc+NumNewLoadCatsBelow) = ...
        LoadStruct(LoadCatCyc);
end

% Place midpoints in LoadStruct
for LoadCatCyc = 1 : NumNewLoadCatsTotal-1
    LoadStructOut(LoadCatCyc).MidPoint = ExpectedGen.Extr.MidPoints(LoadCatCyc);
end

%% Individual Unit Extrapolations
% Cycle through individual units to extrapolate out their generation vs. load

q= sprintf('%s\n\nInterpolating above and below load categories',RegionString);

hwaitbar = waitbar(0,q,'Name','Extrapolation','color','w');

NumUnits = length(UnitStruct);
for UnitCyc = 1:NumUnits
    %% Probability Online Interpolation
    
    % Vector will store the probability of being online stats, which will
    % be extrapolated out to the higher and lower load categories
    ProbOnlineVec=[];
    ProbOnlineVec.Hist = zeros(NumLoadCats-1,1);
    for LoadCatCyc=1:NumLoadCats-1
        ProbOnlineVec.Hist(LoadCatCyc) =...
            LoadStruct(LoadCatCyc).Unit(UnitCyc).ProbOnline;
    end
    
    ProbOnlineVec.Extr = zeros(NumLoadCats + NumNewLoadCatsAbove + NumNewLoadCatsBelow,1);
    ProbOnlineVec.Extr(NumNewLoadCatsBelow+1:NumLoadCats+NumNewLoadCatsBelow-1) = ...
        ProbOnlineVec.Hist(1:NumLoadCats-1);

    % Interpolate the upper and lower bounds of the probability curves
    % If the probability at the end of the load category series was
    % 1, then the remainder of the load categories will also have a
    % probability of 1. If NOT, then we need to extrapolate up.

        % We're only going to interpolate between the last of the
        % historical categories and the end of the new categories
        GTZeroIX = find(ProbOnlineVec.Hist(TopExtrapBasisIX) > 0);
        
        BNat = [ExpectedGen.Hist.MidPoints(TopExtrapBasisIX(GTZeroIX)) ...
            ones(length(TopExtrapBasisIX(GTZeroIX)),1)] \ ...
            ProbOnlineVec.Hist(TopExtrapBasisIX(GTZeroIX));
        
            BPush = (cat(2,[ExpectedGen.Hist.MidPoints(end); ...
               ExpectedGen.Extr.MidPoints(end)],...
               [ones(2,1)]) \ ...
               [ProbOnlineVec.Hist(end); 1]);
        B = BPush;

        ProbOnlineVec.Extr(NumLoadCats + NumNewLoadCatsBelow : ...
            NumNewLoadCatsTotal - 1) = ...
            ExpectedGen.Extr.MidPoints(NumLoadCats + NumNewLoadCatsBelow : ...
            NumNewLoadCatsTotal - 1) * B(1) + B(2);
        
        B(1) = max(0,B(1)); % Forces slope to be non-negative
        
        ProbOnlineVec.Hist(TopExtrapBasisIX(find(ProbOnlineVec.Hist(TopExtrapBasisIX)==0))) = ...
            ExpectedGen.Hist.MidPoints(TopExtrapBasisIX(find(ProbOnlineVec.Hist(TopExtrapBasisIX)==0)))*B(1)+B(2);
        ProbOnlineVec.Hist(find(ProbOnlineVec.Hist > 1)) = 1;
        ProbOnlineVec.Hist(find(ProbOnlineVec.Hist < 0)) = 0;
    
    % If the probability at the start of the load category series was
    % 0, then the earlier load categories will also have a
    % probability of 0. If NOT, then we need to extrapolate down.
    if mean(ProbOnlineVec.Hist(1:3)) == 0 
        ProbOnlineVec.Extr(1:NumNewLoadCatsBelow)=0;
    else
        % We're only going to interpolate between the first cateogory and
        % the start of the historical categories
        GTZeroIX = find(ProbOnlineVec.Hist(BottomExtrapBasisIX) > 0);

           BPush = (cat(2,[0; ExpectedGen.Hist.MidPoints(2)], ...
               [ones(2,1)]) \ ...
               [0; ProbOnlineVec.Hist(2)]);
        
        ProbOnlineVec.Extr(1 : NumNewLoadCatsBelow) = ...
                  ExpectedGen.Extr.MidPoints(1 : NumNewLoadCatsBelow) * BPush(1) + BPush(2);       
    end
    
    % Ensure that nothing is out of place (we can't have probabilities greater than 1 or less than zero)
    ProbOnlineVec.Extr(find(ProbOnlineVec.Extr > 1)) = 1;
    % Rather than choosing to fill in a probability of 1, we use the "MaxFutureOnlineProb" which in
    % this case represents a forced outage rate...
    ProbOnlineVec.Extr(find(ProbOnlineVec.Extr < 0)) = 0;
    
    % Plotting Probabiliy Online
    if plotson_ProbOnline  
             
        figure(99);
        clf; set(gcf,'color','w');
        plot(ExpectedGen.Extr.MidPoints,ProbOnlineVec.Extr,'o','markerfacecolor',[.8 .8 .8],'markeredgecolor',[.6 .6 .6]); hold on
        plot(ExpectedGen.Hist.MidPoints,ProbOnlineVec.Hist,'ko','markerfacecolor',[.2 .2 .2]);
        ylim([0 1]);
    
        xlabel('Load Bin (MWh)');
        ylabel('Probability of Operating');
        title(sprintf('%s %s (%d)\n%d MW (UnitCyc %d)',...
            UnitStruct(UnitCyc).Name,...
            UnitStruct(UnitCyc).UnitID,...
            UnitStruct(UnitCyc).ORISPL,...
            UnitStruct(UnitCyc).GenCats(end),...
            UnitCyc));
        set(gca,'XTickLabel',get(gca,'XTick'));
                pause;
        end

    % Create new substructures within LoadStruct which have extrapolated information
    for LoadCatCyc = 1 : NumNewLoadCatsTotal - 1
        LoadStructOut(LoadCatCyc).Unit(UnitCyc).ProbOnline = ...
            ProbOnlineVec.Extr(LoadCatCyc);
    end
    
    %% Generation Histogram Interpolation
    
    % Next, we need to determine the shape of all of the
    % probability curves in the future, or if there's greater demand. This
    % is a challenge. We're going to determine that any generation
    % category which had zero probability in the highest (historical) load
    % categories cannot become a viable generation at higher load
    % categories, so they'll maintain a zero probability. Any other
    % categories will be determined by their relative likelihood
    % trajectory from lower load categories and extrapolated out.
    
    % Cycle through generation levels and solve for each one
      
    if ~UnitStruct(UnitCyc).Empty
        GenCats = UnitStruct(UnitCyc).GenCats;
        
        % defining the points for which extrapolations are pinned to 1
        unitMaximumGeneration = GenCats(length(GenCats)-1);
        unitMinimumGeneration = min(GenCats);
        
        % all slopes for extrapolated data will be stored for debugging
        upSlopesDebug = zeros(length(GenCats),1);
        downSlopesDebug = zeros(length(GenCats),1);
        
        for GenCyc = 1:length(GenCats)-1
            
            % fetching unit generation level for constraint check
            unitGeneration = GenCats(GenCyc);
            
            % .Extr contains .Hist in the middle as well as extrapolated values above and below
            GenProbByLoad.Hist = zeros(NumLoadCats - 1,1); %Historical
            GenProbByLoad.Extr = zeros(NumLoadCats + ...
                NumNewLoadCatsBelow + NumNewLoadCatsAbove - 1 ,1); %Extrapolated
            
            % setting up indices so that we can later figure out where to stick in the extrapolated data
            % firstHist is 1 above lastBelow, firstAbove is 1 above lastHist
            firstBelowIndex = 1;
            lastBelowIndex = NumNewLoadCatsBelow;
            firstHistIndex = NumNewLoadCatsBelow + 1;
            lastHistIndex = NumNewLoadCatsBelow + NumLoadCats;
            firstAboveIndex = NumNewLoadCatsBelow + NumLoadCats;
            lastAboveIndex = NumNewLoadCatsBelow + NumLoadCats + NumNewLoadCatsAbove - 1;
            
            for LoadCatCyc = 1:NumLoadCats-1
                if LoadStruct(LoadCatCyc).Unit(UnitCyc).ProbOnline > 0
                    
                    GenProbByLoad.Hist(LoadCatCyc) = ...
                        LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCatFreq(GenCyc) ./ ...
                        sum(LoadStruct(LoadCatCyc).Unit(UnitCyc).GenCatFreq);
                    
                    GenProbByLoad.Extr(LoadCatCyc + NumNewLoadCatsBelow) = ...
                        GenProbByLoad.Hist(LoadCatCyc);              
                end
            end
            
            % These values are the start points of the extrapolations above (HistMax) and below (HistMin) historical data.
            % In other words, the endpoints of the .Hist element of the GenProbByLoad struct
            genProb_HistMinSystemLoad = GenProbByLoad.Hist(1);
            genProb_HistMaxSystemLoad = GenProbByLoad.Hist(NumLoadCats-1);
            
            % This sequence establishes what the extrapolations are going to reach. 
            % If we're at the min GenCat, the unit should have 100% probability of 
            % being at its minimum at system minimum load and 0% probability
            % of being at its max. If we're at the max GenCat, the unit should have 
            % 100% probability of being at its max output at system max load and 0% 
            % probability of being at its min. In all other cases, we go down to 0 
            % on both ends to result in clean, impulse-like responses at system min and max.
           if unitGeneration == unitMinimumGeneration
               extrapolateDownTo = 1;
               extrapolateUpTo = 0;
           elseif unitGeneration == unitMaximumGeneration
               extrapolateDownTo = 0;
               extrapolateUpTo = 1;
           else
               extrapolateDownTo = 0;
               extrapolateUpTo = 0;
           end
           
           % Here we calculate the difference between the generation probability at 
           % the system historical max and where we want to extrapolate to (system 
           % theoretical max), and then the slope of the line we need to get there
           distanceUp = extrapolateUpTo - genProb_HistMaxSystemLoad;
           extrapolateUpSlope = distanceUp/NumNewLoadCatsAbove;
           
           % same as above, but for system historical and theoretical min
           distanceDown = extrapolateDownTo - genProb_HistMinSystemLoad;
           extrapolateDownSlope = distanceDown/NumNewLoadCatsBelow;

           %filling in our debug outputs
           upSlopesDebug(GenCyc) = extrapolateUpSlope;
           downSlopesDebug(GenCyc) = extrapolateDownSlope;
           
           % This block calculates the extrapolated data. First we have an array of integer steps, 
           % that's then multiplied by the slope calculated above and shifted to meet the end of the
           % historical data. Data below is mirror-flipped because we're going downwards in index 
           % from the historical data to the end of the extrapolated date instead of upwards. Once 
           % calculated, extrapolated arrays are simply inserted into the appropriate segment of the 
           % .Extr part of the GenProbByLoad struct
            GTZeroIX = find(GenProbByLoad.Hist(BottomExtrapBasisIX) >= 0);
            if length(GTZeroIX) < 2
                % If there are too few values to support a rigerous interpolation, don't
                GenProbByLoad.Extr(1:NumNewLoadCatsBelow) = 0;
            else
                BGen = [ExpectedGen.Hist.MidPoints(BottomExtrapBasisIX(GTZeroIX)) ...
                    ones(length(BottomExtrapBasisIX(GTZeroIX)),1)] \ ...
                    GenProbByLoad.Hist(BottomExtrapBasisIX(GTZeroIX));
                
                GenProbByLoad.Extr(1:NumNewLoadCatsBelow) = ...
                    ExpectedGen.Extr.MidPoints(1:NumNewLoadCatsBelow)*BGen(1)+BGen(2);
            end

           stepsAbove = [1:1:NumNewLoadCatsAbove];
           extrapolatedAbove = genProb_HistMaxSystemLoad + stepsAbove*extrapolateUpSlope;
           GenProbByLoad.Extr(firstAboveIndex:lastAboveIndex) = extrapolatedAbove;
           
            for i = 1:length(GenProbByLoad.Extr)
                if GenProbByLoad.Extr(i) > 1
                    GenProbByLoad.Extr(i) = 1;
                elseif GenProbByLoad.Extr(i) < 0
                    GenProbByLoad.Extr(i) = 0;
                end
            end
           
            if plotson_GenProbByLoad
                figure(70); clf;
                plot(ExpectedGen.Hist.MidPoints,GenProbByLoad.Hist,'+-')
                hold on
                plot(ExpectedGen.Extr.MidPoints,GenProbByLoad.Extr,'k.');
                pause
            end
            
            % Insert material into LoadStructOut
            for LoadCatCyc = 1 : NumLoadCats + NumNewLoadCatsBelow + NumNewLoadCatsAbove - 1
                LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq(GenCyc) = ...
                    GenProbByLoad.Extr(LoadCatCyc);
            end
        end % Generation Cycle
        
        % Fill in LoadStructOut with LoadStruct Data
        for LoadCatCyc = 1 : NumLoadCats-1
            LoadStructOut(LoadCatCyc + NumNewLoadCatsBelow).Unit(UnitCyc) ...
                = LoadStruct(LoadCatCyc).Unit(UnitCyc);
        end
        
        %% Fill in LoadStructOut Below
        for LoadCatCyc = 1 : NumNewLoadCatsBelow
            if (LoadStructOut(LoadCatCyc).Unit(UnitCyc).ProbOnline > 0)
                if (sum(LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq) > 0)
                    LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatCumFreq = ...
                        cumsum(LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq ./ ...
                        sum(LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq));
                else
                    LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatCumFreq = ...
                        zeros(size(LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq));
                    % If this is the case, then all of our extrapolations indicate that the unit can't run, so it's
                    % probability at this load category has to drop to zero.
                    if LoadCatCyc > 30
                        disp('RIGHT HERE');
                    end
                    
                    LoadStructOut(LoadCatCyc).Unit(UnitCyc).ProbOnline = 0;
                end
            end
            LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCats = ...
                UnitStruct(UnitCyc).GenCats;
        end
           
        %% Fill in LoadStructOut Above
        for LoadCatCyc = NumLoadCats + NumNewLoadCatsBelow : ...
                NumLoadCats + NumNewLoadCatsBelow + NumNewLoadCatsAbove - 1
            if (LoadStructOut(LoadCatCyc).Unit(UnitCyc).ProbOnline > 0)
                if (sum(LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq) > 0)
                    LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatCumFreq = ...
                        cumsum(LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq ./ ...
                        sum(LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq));
                else
                    LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatCumFreq = ...
                        zeros(size(LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCatFreq));
                    % If this is the case, then all of our extrapolations indicate that the unit can't run, so it's
                    % probability at this load category has to drop to zero.
                    LoadStructOut(LoadCatCyc).Unit(UnitCyc).ProbOnline = 0;
                end
            end
            LoadStructOut(LoadCatCyc).Unit(UnitCyc).GenCats = ...
                UnitStruct(UnitCyc).GenCats;
        end
        
    end % ~UnitStruct(UnitCyc).Empty
    
    waitbar(UnitCyc / NumUnits)
    
end % UnitCyc

close(hwaitbar)

ExtendedLoadCats = length(ExpectedGen.Extr.MidPoints);

for LoadCatCyc = 1 : ExtendedLoadCats
    IX = LoadCatCyc-20:LoadCatCyc+20;
    IX(find(IX<1)) = [];
    IX(find(IX>ExtendedLoadCats)) =[];
    
    B = [ExpectedGen.Extr.MidPoints(IX) ones(size(IX))']\ ExpectedGen.Extr.Mean(IX);
    ExpectedGen.Extr.LoadVsGenSlope(LoadCatCyc) = B(1);
end

% Analysis is now done. The rest of this code is to plot results
if plotson_SurfacePlots
    for UnitCyc = 1:length(UnitStruct)
        
        GenMidPoints = [];
        FreqField_NonNormal_Hist = zeros(length(UnitStruct(UnitCyc).GenCats)-1,length(LoadStruct));
        FreqField_Normal_Hist = zeros(length(UnitStruct(UnitCyc).GenCats)-1,length(LoadStruct));
        
        FreqField_NonNormal_Ext = zeros(length(UnitStruct(UnitCyc).GenCats)-1,length(LoadStructOut));
        FreqField_Normal_Ext = zeros(length(UnitStruct(UnitCyc).GenCats)-1,length(LoadStructOut));
        
        ProbOnlineVecGraph = zeros(1,length(LoadStructOut));
        
        for LoadCyc = 1:length(LoadStruct)
            if LoadStruct(LoadCyc).Unit(UnitCyc).ProbOnline > 0
                FreqField_NonNormal_Hist(:,LoadCyc) = ...
                    LoadStruct(LoadCyc).Unit(UnitCyc).GenCatFreq;
                FreqField_Normal_Hist(:,LoadCyc) = ...
                    LoadStruct(LoadCyc).Unit(UnitCyc).GenCatFreq ./ ...
                    sum(LoadStruct(LoadCyc).Unit(UnitCyc).GenCatFreq);
                GenMidPoints_Hist = ...
                    (LoadStruct(LoadCyc).Unit(UnitCyc).GenCats(1:end-1) + ...
                    LoadStruct(LoadCyc).Unit(UnitCyc).GenCats(2:end)) ./ 2;
                ProbOnlineVecGraph(LoadCyc) = LoadStruct(LoadCyc).Unit(UnitCyc).ProbOnline;
            end
        end
            
        for LoadCyc = 1:length(LoadStructOut)
            if LoadStructOut(LoadCyc).Unit(UnitCyc).ProbOnline > 0
                FreqField_NonNormal_Ext(:,LoadCyc) = ...
                    LoadStructOut(LoadCyc).Unit(UnitCyc).GenCatFreq;
                FreqField_Normal_Ext(:,LoadCyc) = ...
                    LoadStructOut(LoadCyc).Unit(UnitCyc).GenCatFreq ./ ...
                    sum(LoadStructOut(LoadCyc).Unit(UnitCyc).GenCatFreq);
                GenMidPoints_Ext = ...
                    (LoadStructOut(LoadCyc).Unit(UnitCyc).GenCats(1:end-1) + ...
                    LoadStructOut(LoadCyc).Unit(UnitCyc).GenCats(2:end)) ./ 2;
                ProbOnlineVecGraph(LoadCyc) = LoadStructOut(LoadCyc).Unit(UnitCyc).ProbOnline;
            end
        end
        
        %%% Historical Plot %%%
        figure(81); clf; set(gcf, 'color','w');
        subplot(211);
        [X_Hist,Y_Hist]=meshgrid([LoadStruct.MidPoint],GenMidPoints_Hist);
        surf(X_Hist,Y_Hist,FreqField_Normal_Hist,'edgecolor','k','facecolor',[1 .6 .4]);
        h = findobj('Type','surface');
        set(h,'FaceLighting','phong',...
            'FaceColor','interp',...
            'EdgeColor',[.4 .4 .4],...
            'BackFaceLighting','lit')
        xlim([0 max([LoadStructOut.MidPoint]) ])
        ylim([0 max(GenMidPoints_Ext) ])
        
                title(sprintf('%s %s\n%d MW (UnitCyc %d)',...
            UnitStruct(UnitCyc).Name,...
            UnitStruct(UnitCyc).UnitID,...
            UnitStruct(UnitCyc).GenCats(end),...
            UnitCyc));
        
        xlabel('Fossil-Fuel Load Bin (MW)');
        zlabel('Probability of Generation Level');
        ylabel('Unit Generation Bin (MW)');
        view([-30, 45])
                set(gca,'XTickLabel',get(gca,'XTick'));

        %%% Extrapolated Plot %%%
        subplot(212);
        [X_Ext,Y_Ext]=meshgrid([LoadStructOut.MidPoint],GenMidPoints_Ext);
        surf(X_Ext,Y_Ext,FreqField_Normal_Ext,'edgecolor','k','facecolor',[1 .6 .4]);
        h = findobj('Type','surface');
        set(h,'FaceLighting','phong',...
            'FaceColor','interp',...
            'EdgeColor',[.4 .4 .4],...
            'BackFaceLighting','lit')
        hold on
        plot3([LoadStructOut.MidPoint],ones(size(ProbOnlineVecGraph)),ProbOnlineVecGraph,'k.-')
        xlim([0 max([LoadStructOut.MidPoint]) ])
        ylim([0 max(GenMidPoints_Ext) ])
        
        title(sprintf('%s %s\n%d MW (UnitCyc %d)',...
            UnitStruct(UnitCyc).Name,...
            UnitStruct(UnitCyc).UnitID,...
            UnitStruct(UnitCyc).GenCats(end),...
            UnitCyc));
        
        xlabel('Fossil-Fuel Load Bin (MW)');
        zlabel('Probability of Generation Level');
        ylabel('Unit Generation Bin (MW)');
        view([-30, 45])
                set(gca,'XTickLabel',get(gca,'XTick'));
        %%% --- %%%
        
        colormap(SurfaceMap);
        
        pause;
    end
end