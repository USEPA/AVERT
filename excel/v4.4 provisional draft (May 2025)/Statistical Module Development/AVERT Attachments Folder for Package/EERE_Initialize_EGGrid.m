%% Initialize Emissions and Generation Grids

% 3/13/2013
% Synapse Energy Economics

function EGGrid = EERE_Initialize_EGGrid(Years,TotLoadCats)

%% Initialize
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
EGGrid = [];
EGGrid.LoadMeans        = zeros(length(Years),TotLoadCats);

EGGrid.Gen.Mean         = zeros(length(Years),TotLoadCats);

EGGrid.Ozone.NOX.Mean   = zeros(length(Years),TotLoadCats);
EGGrid.NotOz.NOX.Mean   = zeros(length(Years),TotLoadCats);

EGGrid.Ozone.SO2.Mean   = zeros(length(Years),TotLoadCats);
EGGrid.NotOz.SO2.Mean   = zeros(length(Years),TotLoadCats);

EGGrid.Ozone.CO2.Mean   = zeros(length(Years),TotLoadCats);
EGGrid.NotOz.CO2.Mean   = zeros(length(Years),TotLoadCats);

EGGrid.Ozone.HR.Mean   = zeros(length(Years),TotLoadCats);
EGGrid.NotOz.HR.Mean   = zeros(length(Years),TotLoadCats);
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

EGGrid.Gen.Std          = zeros(length(Years),TotLoadCats);

EGGrid.Ozone.NOX.Std    = zeros(length(Years),TotLoadCats);
EGGrid.NotOz.NOX.Std    = zeros(length(Years),TotLoadCats);

EGGrid.Ozone.SO2.Std    = zeros(length(Years),TotLoadCats);
EGGrid.NotOz.SO2.Std    = zeros(length(Years),TotLoadCats);

EGGrid.Ozone.CO2.Std    = zeros(length(Years),TotLoadCats);
EGGrid.NotOz.CO2.Std    = zeros(length(Years),TotLoadCats);

EGGrid.Ozone.HR.Std    = zeros(length(Years),TotLoadCats);
EGGrid.NotOz.HR.Std    = zeros(length(Years),TotLoadCats);
