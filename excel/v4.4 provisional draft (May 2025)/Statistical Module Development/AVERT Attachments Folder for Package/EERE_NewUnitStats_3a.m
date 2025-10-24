%% Create NewUnit Options

% 9/27/2012
% Synapse Energy Economics

% Code adds information from proxy units back into statistics for
% UnitStruct and for LoadStruct. Modifies the proxy unit to yield generation 
% and emissions scaled to the capacity of the new unit.

function [NewUnitStructOptions, NewLoadStructOptions] = EERE_NewUnitStats_3a(UnitStruct,LoadStruct,NewUnitsLocal);

NewUnitOptions = [];
NewLoadStructOptions = [];
NewUnitStructOptions =[];

UnitNow = 0;
for UnitCyc = 1:length(NewUnitsLocal)
    cellUnit = struct2cell(UnitStruct);
    temp_Unit_UniqueID = cellUnit(4,:,:);
    UnitToCopy = find(ismember(temp_Unit_UniqueID,NewUnitsLocal(UnitCyc).UniqueID));
    if isempty(UnitToCopy)
        q=(sprintf('Unit %s no longer exists in %s.\nUnit either produces less than minimum generation, or does not exist.',...
            char(NewUnitsLocal(UnitCyc).Name),...
            char(NewUnitsLocal(UnitCyc).CSIRegion)));
    else
        TemporaryStruct = [];
        UnitNow = UnitNow + 1;

        TemporaryStruct = UnitStruct(UnitToCopy);

        TemporaryStruct.Name = ...
            sprintf('[NewUnit #%d] %s',...
            NewUnitsLocal(UnitCyc).AdditionNumber,...
            UnitStruct(UnitToCopy).Name);
        
        TemporaryStruct.Lat = NewUnitsLocal(UnitCyc).Lat;
        TemporaryStruct.Lon = NewUnitsLocal(UnitCyc).Lon;
        TemporaryStruct.State = NewUnitsLocal(UnitCyc).State; % NEW 2020
        TemporaryStruct.County = NewUnitsLocal(UnitCyc).County;
   
        TemporaryStruct.Original = 0;
        TemporaryStruct.NewUnit = 1;
        TemporaryStruct.Retired = 0;
        
        %% Now adjust capacity to fit new requirements
       
        % CapMultipier determines the fraction of the "new" unit to the proxy
        % unit. We use this to determine the output of the unit by the target
        % capacity and adjust emissions accordingly.
        CapMultiplier = NewUnitsLocal(UnitCyc).Capacity ./ ...
            UnitStruct(UnitToCopy).GenCats(end);
        
        TemporaryStruct.GenCats = ...
            CapMultiplier .* UnitStruct(UnitToCopy).GenCats;
        
        % Walk through each pollutant to adjust the emissions by the capacity
        % multiplier (preserving the emissions rate)
        for GenCatCyc = 1:length(UnitStruct(UnitToCopy).GenCat)
            for OzCyc = 1:2
                switch OzCyc
                    case 1
                        OzTog = 'Ozone';
                    case 2
                        OzTog = 'NotOz';
                end
                if ~UnitStruct(UnitToCopy).GenCat(GenCatCyc).(OzTog).Empty
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
                        TemporaryStruct.GenCat(GenCatCyc).(OzTog).(PltTog).EmCats = ...
                            CapMultiplier .* ...
                            UnitStruct(UnitToCopy).GenCat(GenCatCyc).(OzTog).(PltTog).EmCats;
                    end
                end
            end
        end
        
        if UnitNow == 1
            NewUnitStructOptions = TemporaryStruct;
        else
            NewUnitStructOptions(UnitNow) = TemporaryStruct;
        end
        
        % Add another unit into LoadStruct with similar characteristics to the new unit
        for LoadCatCyc = 1:length(LoadStruct(1).LoadCats)-1 %[does this stay the same, or do I need midpoints?]
            NewLoadStructOptions(LoadCatCyc).Unit(UnitNow) = LoadStruct(LoadCatCyc).Unit(UnitToCopy);
            % Adjust elements of LoadStruct to include changes in capacity
            NewLoadStructOptions(LoadCatCyc).Unit(UnitNow).GenArray = ...
                CapMultiplier .* LoadStruct(LoadCatCyc).Unit(UnitToCopy).GenArray;
            NewLoadStructOptions(LoadCatCyc).Unit(UnitNow).GenArrayOn = ...
                CapMultiplier .* LoadStruct(LoadCatCyc).Unit(UnitToCopy).GenArrayOn;
            NewLoadStructOptions(LoadCatCyc).Unit(UnitNow).GenCats = ...
                CapMultiplier .* LoadStruct(LoadCatCyc).Unit(UnitToCopy).GenCats;
        end
        
        q=(sprintf('Created %s Unit:\n%s %s [%1.0f MW]\n\nTarget Unit:\n%s [%1.0f MW]',...
            NewUnitsLocal(UnitCyc).CSIRegion,...
            NewUnitStructOptions(UnitNow).Name,...
            NewUnitStructOptions(UnitNow).UnitID,...
            NewUnitStructOptions(UnitNow).GenCats(end),...
            char(NewUnitsLocal(UnitCyc).Name),...
            NewUnitsLocal(UnitCyc).Capacity));

        pause(1);
    end
end