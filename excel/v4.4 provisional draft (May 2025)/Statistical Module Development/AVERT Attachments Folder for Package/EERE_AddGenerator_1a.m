%% Add a Generator

% 9/27/2012
% Synapse Energy Economics

function [UnitStructOut,LoadStructOut] = AddGenerator_1a(UnitStruct,LoadStruct,NewUnitStructOptions,NewLoadStructOptions,RefNum)

NewUnitStruct = NewUnitStructOptions(RefNum);

UnitName = cell2mat({cell2mat([{NewUnitStruct.Name}' ' ' {NewUnitStruct.UnitID}'])});

NumUnits = length(UnitStruct);

%% Alter Unit Structure
UnitStructOut = UnitStruct;
LoadStructOut = LoadStruct;
UnitStructOut(NumUnits+1) = NewUnitStruct;

%% Alter Load Structure
for LoadCatCyc = 1:length(LoadStruct(1).LoadCats)-1
    LoadStructOut(LoadCatCyc).Unit(NumUnits+1) = NewLoadStructOptions(LoadCatCyc).Unit(RefNum);
end
