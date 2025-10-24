function UnitStruct = EERE_UnitStats_3a(StudyArray,FacilityStruc,StudyFacs,SeasonDates,RegionString)

%% Gather Unit Emissions Statistics
% 9/27/2012
% Synapse Energy Economics

% How many units exist?
NumUnits = size(StudyArray.Load,2);
NumGenCats = 20; % Generation categories which will be created
NumEmCats = 11;  % Emissions categories which will be created

% Gather unit-based emissions statistics

q= sprintf('%s\n\nGathering unit-based emissions stats by unit',RegionString);
hwaitbar = waitbar(0,q,'Name','UnitStats','color','w');

UnitStruct = [];

AllDatesIX = [SeasonDates.Ozone.IX; SeasonDates.NotOz.IX];
    
%% Cycle through units to collect generation vs. emissions stats
for UnitCyc = 1:NumUnits
    OneGenCat = 0;
    %disp(UnitCyc)
    UnitVec.Gen = double(StudyArray.Load(:,UnitCyc));
    UnitVec.CO2 = double(StudyArray.CO2(:,UnitCyc));
    UnitVec.NOX = double(StudyArray.NOX(:,UnitCyc));
    UnitVec.SO2 = double(StudyArray.SO2(:,UnitCyc));
    UnitVec.HR = double(StudyArray.HR(:,UnitCyc));

    IX = find(UnitVec.Gen(AllDatesIX)>0);
    NonZerosIX = AllDatesIX(IX);
    
    % Unit information
    UnitStruct(UnitCyc).Name = FacilityStruc(StudyFacs(UnitCyc)).Name;
    UnitStruct(UnitCyc).UnitID = FacilityStruc(StudyFacs(UnitCyc)).UnitID;
    UnitStruct(UnitCyc).ORISPL = FacilityStruc(StudyFacs(UnitCyc)).ORISPL;
    UnitStruct(UnitCyc).UniqueID = FacilityStruc(StudyFacs(UnitCyc)).UniqueID;
    UnitStruct(UnitCyc).Original = FacilityStruc(StudyFacs(UnitCyc)).Original; % Unit exists at the start of the study
    UnitStruct(UnitCyc).Retired = FacilityStruc(StudyFacs(UnitCyc)).Retired;  % Placeholder for future retirement
    UnitStruct(UnitCyc).NewUnit = FacilityStruc(StudyFacs(UnitCyc)).NewUnit;  % Placeholder for new units added to the mix
    
    UnitStruct(UnitCyc).SO2Override = FacilityStruc(StudyFacs(UnitCyc)).SO2Override;
    UnitStruct(UnitCyc).NOxOverride = FacilityStruc(StudyFacs(UnitCyc)).NOxOverride;
    UnitStruct(UnitCyc).CO2Override = FacilityStruc(StudyFacs(UnitCyc)).CO2Override;
    
    UnitStruct(UnitCyc).Lat = FacilityStruc(StudyFacs(UnitCyc)).Lat;
    UnitStruct(UnitCyc).Lon = FacilityStruc(StudyFacs(UnitCyc)).Lon;
    UnitStruct(UnitCyc).State = FacilityStruc(StudyFacs(UnitCyc)).State;
    UnitStruct(UnitCyc).County = FacilityStruc(StudyFacs(UnitCyc)).County;

    UnitStruct(UnitCyc).CO2content = FacilityStruc(StudyFacs(UnitCyc)).CO2content;  
    % end of unit information
    
    if isempty(NonZerosIX)
        UnitStruct(UnitCyc).Empty = 1;
    else
        UnitStruct(UnitCyc).Empty = 0;

        %% Decide on the generation categories for this particular unit
        if min(UnitVec.Gen(NonZerosIX)) == max(UnitVec.Gen(NonZerosIX))
            UnitStruct(UnitCyc).GenCats(1:2) = min(UnitVec.Gen(NonZerosIX));
            OneGenCat = 1;
        else
            UnitStruct(UnitCyc).GenCats = ...
                linspace(min(UnitVec.Gen(NonZerosIX)),...
                max(UnitVec.Gen(NonZerosIX)),NumGenCats);
            OneGenCat = 0;
        end

        if OneGenCat
            NumGenCatsNow = 2;
        else
            NumGenCatsNow = NumGenCats;
        end
        
        for GenCyc=1:NumGenCatsNow-1
            GenCatIX = find( UnitVec.Gen(NonZerosIX) >= ...
                UnitStruct(UnitCyc).GenCats(GenCyc) & ...
                UnitVec.Gen(NonZerosIX) <= ...
                UnitStruct(UnitCyc).GenCats(GenCyc+1) );
            UnitStruct(UnitCyc).GenCatFreq(GenCyc) = length(GenCatIX);
        end

        %% Remove any generation categories that don't exist
        UnitStruct(UnitCyc).GenCats(...
            find(UnitStruct(UnitCyc).GenCatFreq==0))=[];
        UnitStruct(UnitCyc).GenCatFreq(...
            find(UnitStruct(UnitCyc).GenCatFreq==0))=[];

        for OzCyc = 1:2
            switch OzCyc
                case 1
                    OzTog = 'Ozone';
                case 2
                    OzTog = 'NotOz';
            end

            % Find dates (and create an index) in which the generator is
            % operational during the ozone or non-ozone season
            IX = find(UnitVec.Gen(SeasonDates.(OzTog).IX)>0);
            NonZerosIX = SeasonDates.(OzTog).IX(IX);

            if isempty(NonZerosIX)
                UnitStruct(UnitCyc).(OzTog).Empty = 1;
            else
                UnitStruct(UnitCyc).(OzTog).Empty = 0;

                % Cycle through each generation category
                % (a) What is the distribution of NOX and SO2 emissions within the
                % generation category?
                % (b) Create a probability distribution function in each generation
                % category for retreival later

                NumGenCatsActual = length(UnitStruct(UnitCyc).GenCats);
                for GenCyc = 1:NumGenCatsActual-1
                    % Find all hours in which the unit is generating at the particular
                    % MWh of GenCats(GenCyc) to GenCats(GenCyc+1)
                    GenCatIX = find( UnitVec.Gen(NonZerosIX) >= ...
                        UnitStruct(UnitCyc).GenCats(GenCyc) & ...
                        UnitVec.Gen(NonZerosIX) <= ...
                        UnitStruct(UnitCyc).GenCats(GenCyc+1) );

                    % If the unit didn't generate during the ozone / non
                    % ozone season at a particular generation level, this
                    % level is simply marked as "empty" and excluded.
                    if isempty(GenCatIX)
                        UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).Empty = 1;
                    else
                        UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).Empty = 0;
                        
                        %% Choose NOX, SO2, CO2, or HeatRate (cycle through)
                        for PltCyc = 1:4 % Plt = Pollutant
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
                            
                            % Decide on the emission categories for this generation category
                            % If the difference between the maximum emissions in
                            % this category and the minimum emissions are more
                            % less than 5 units, define only one category
                            UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCats =[];
                            if (max(UnitVec.(PltTog)(NonZerosIX(GenCatIX))) - min(UnitVec.(PltTog)(NonZerosIX(GenCatIX)))) < 5
                                UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCats(1) =  ...
                                    min(UnitVec.(PltTog)(NonZerosIX(GenCatIX)));
                                UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCats(2) =  ...
                                    max(UnitVec.(PltTog)(NonZerosIX(GenCatIX)));
                            else
                                UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCats = ...
                                    linspace(min(UnitVec.(PltTog)(NonZerosIX(GenCatIX))),...
                                    max(UnitVec.(PltTog)(NonZerosIX(GenCatIX))),NumEmCats);
                            end

                            % The actual number of emissions categories are less
                            % than the "number of emissions categories" (11), so
                            % how many are there actually?
                            ActualNumEmCats = length(UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCats);

                            for EmCyc = 1:ActualNumEmCats-1
                                EmCatIX = find( UnitVec.(PltTog)(NonZerosIX(GenCatIX)) >= ...
                                    UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCats(EmCyc) & ...
                                    UnitVec.(PltTog)(NonZerosIX(GenCatIX)) <= ...
                                    UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCats(EmCyc+1) );
                                UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCatFreq(EmCyc) = length(EmCatIX);
                            end

                            %% Remove any generation categories that don't exist
                            UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCats(...
                                find(UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCatFreq==0))=[];
                            UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCatFreq(...
                                find(UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCatFreq==0))=[];

                            %% Cummulative Sum
                            UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCatCumFreq = ...
                                cumsum(UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCatFreq ./ ...
                                sum(UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog).(PltTog).EmCatFreq));

                        end %% Pollutant Cycle (PltCyc, PltTog)

                    end % Generation Category / Ozone Empty Categorization

                end % Generation Cycle (GenCyc)

            end % Seasonal Empty Categorization

        end % Ozone Cycle (OzCyc, OzTog)
        
        % Code subs in non-ozone data into the ozone season, and
        % visa versa if one is blank
        for OzCyc = 1:2
            switch OzCyc
                case 1
                    OzTog = 'Ozone';
                    OzTogOther = 'NotOz';
                case 2
                    OzTog = 'NotOz';
                    OzTogOther = 'Ozone';
            end
            % If the Ozone or Non-Ozone season is empty, fill it with
            % stats from the other season
            if UnitStruct(UnitCyc).(OzTog).Empty
                for GenCyc = 1:length(UnitStruct(UnitCyc).GenCats)-1
                    UnitStruct(UnitCyc).GenCat(GenCyc).(OzTog) = ...
                        UnitStruct(UnitCyc).GenCat(GenCyc).(OzTogOther);
                end
                UnitStruct(UnitCyc).(OzTog).Empty = 0;
                UnitStruct(UnitCyc).(OzTog).Subbed = 1;
            else
                UnitStruct(UnitCyc).(OzTog).Subbed = 0;
            end
        end
        
        if UnitStruct(UnitCyc).Ozone.Subbed + UnitStruct(UnitCyc).NotOz.Subbed > 1
            error('UnitStruct: We cannot substitute two non-existant categories for each other!');
        end

    end % General Empty Categorization

waitbar(UnitCyc / NumUnits)
  
end %UnitCycle

close(hwaitbar)
