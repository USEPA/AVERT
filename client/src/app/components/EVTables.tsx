import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import type { SelectedRegionsTotalYearlyEVEnergyUsage } from 'app/calculations/transportation';

function calculatePercent(numerator: number, denominator: number) {
  return denominator !== 0
    ? `${((numerator / denominator) * 100).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })}%`
    : '-';
}

function formatNumber(number: number) {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function EVSalesAndStockTableContent(props: { className?: string }) {
  const { className } = props;

  const inputs = useTypedSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useTypedSelector(
    ({ impacts }) => impacts.selectOptions,
  );
  const vehicleSalesAndStock = useTypedSelector(
    ({ transportation }) => transportation.vehicleSalesAndStock,
  );

  const {
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    evDeploymentLocation,
  } = inputs;

  const { evDeploymentLocationOptions } = selectOptions;

  const evDeploymentLocationName = evDeploymentLocationOptions.find((opt) => {
    return opt.id === evDeploymentLocation;
  })?.name;

  const locationSalesAndStock = vehicleSalesAndStock[evDeploymentLocation];
  if (!locationSalesAndStock) return null;

  const totalLightDutyVehicles =
    isNaN(Number(batteryEVs) + Number(hybridEVs)) ||
    Number(batteryEVs) < 0 ||
    Number(hybridEVs) < 0
      ? 0
      : Number(batteryEVs) + Number(hybridEVs);

  const totalTransitBuses =
    isNaN(Number(transitBuses)) || Number(transitBuses) < 0
      ? 0
      : Number(transitBuses);

  const totalSchoolBuses =
    isNaN(Number(schoolBuses)) || Number(schoolBuses) < 0
      ? 0
      : Number(schoolBuses);

  const lightDutyVehicleSales = locationSalesAndStock.lightDutyVehicles.sales;
  const lightDutyVehicleStock = locationSalesAndStock.lightDutyVehicles.stock;
  const transitBusesSales = locationSalesAndStock.transitBuses.sales;
  const transitBusesStock = locationSalesAndStock.transitBuses.stock;
  const schoolBusesSales = locationSalesAndStock.schoolBuses.sales;
  const schoolBusesStock = locationSalesAndStock.schoolBuses.stock;

  return (
    <>
      <h4 className="avert-blue margin-bottom-1 font-serif-md">
        EV Sales and Stock Comparison{' '}
        <Tooltip>
          <span className="text-normal">
            This table translates the user-specified number of EVs into shares
            of vehicle sales and shares of vehicles on the road (i.e., vehicle
            stock). These shares are based on recent historical data aggregated
            for the location of EV deployment selected by the user. This table
            can assist the user in entering the number of EVs to model.
          </span>
        </Tooltip>
      </h4>

      <div className="overflow-auto">
        <div className="avert-table-container">
          <table
            className={`avert-table avert-table-striped ${className ?? ''}`}
          >
            <thead>
              <tr>
                <th scope="col">Electric Vehicle Type</th>
                <th scope="col">
                  % of Annual Vehicle Sales
                  {evDeploymentLocationName && (
                    <>
                      <br />
                      <small>in {evDeploymentLocationName}</small>
                    </>
                  )}
                </th>
                <th scope="col">
                  % of Vehicles on the Road
                  {evDeploymentLocationName && (
                    <>
                      <br />
                      <small>in {evDeploymentLocationName}</small>
                    </>
                  )}
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th scope="row">Light-duty vehicles</th>
                <td>
                  {calculatePercent(
                    totalLightDutyVehicles,
                    lightDutyVehicleSales,
                  )}
                </td>
                <td>
                  {calculatePercent(
                    totalLightDutyVehicles,
                    lightDutyVehicleStock,
                  )}
                </td>
              </tr>

              <tr>
                <th scope="row">Transit buses</th>
                <td>
                  {calculatePercent(totalTransitBuses, transitBusesSales)}
                </td>
                <td>
                  {calculatePercent(totalTransitBuses, transitBusesStock)}
                </td>
              </tr>

              <tr>
                <th scope="row">School buses</th>
                <td>{calculatePercent(totalSchoolBuses, schoolBusesSales)}</td>
                <td>{calculatePercent(totalSchoolBuses, schoolBusesStock)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function EEREEVComparisonTableContent(props: { className?: string }) {
  const { className } = props;

  const regionalLineLoss = useTypedSelector(
    ({ geography }) => geography.regionalLineLoss,
  );
  const selectedRegionsTotalYearlyEVEnergyUsage = useTypedSelector(
    ({ transportation }) =>
      transportation.selectedRegionsTotalYearlyEVEnergyUsage,
  );
  const evDeploymentLocationHistoricalEERE = useTypedSelector(
    ({ transportation }) => transportation.evDeploymentLocationHistoricalEERE,
  );
  const inputs = useTypedSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useTypedSelector(
    ({ impacts }) => impacts.selectOptions,
  );

  const { evDeploymentLocation } = inputs;
  const { evDeploymentLocationOptions } = selectOptions;

  const evDeploymentLocationName = evDeploymentLocationOptions.find((opt) => {
    return opt.id === evDeploymentLocation;
  })?.name;

  const selectedRegionsEnergyData =
    Object.keys(selectedRegionsTotalYearlyEVEnergyUsage).length !== 0
      ? (selectedRegionsTotalYearlyEVEnergyUsage as SelectedRegionsTotalYearlyEVEnergyUsage)
      : null;

  const totalYearlyEVEnergyUsage = selectedRegionsEnergyData
    ? Object.values(selectedRegionsEnergyData).reduce((a, b) => (a || 0) + (b || 0), 0) // prettier-ignore
    : 0;

  const historicalEERetailMw = evDeploymentLocationHistoricalEERE.eeRetail.mw;
  const historicalEERetailGWh = evDeploymentLocationHistoricalEERE.eeRetail.gwh;

  const historicalOnshoreWindMw = evDeploymentLocationHistoricalEERE.onshoreWind.mw; // prettier-ignore
  const historicalOnshoreWindGWh = evDeploymentLocationHistoricalEERE.onshoreWind.gwh; // prettier-ignore

  const historicalUtilitySolarMw = evDeploymentLocationHistoricalEERE.utilitySolar.mw; // prettier-ignore
  const historicalUtilitySolarGWh = evDeploymentLocationHistoricalEERE.utilitySolar.gwh; // prettier-ignore

  const historicalTotalMw =
    historicalEERetailMw / (1 - regionalLineLoss) +
    historicalOnshoreWindMw +
    historicalUtilitySolarMw;

  const historicalTotalGWh =
    historicalEERetailGWh / (1 - regionalLineLoss) +
    historicalOnshoreWindGWh +
    historicalUtilitySolarGWh;

  const requiredOffsetTotalGWh =
    totalYearlyEVEnergyUsage / (1 - regionalLineLoss);

  const requiredOffsetEERetailGWh =
    (historicalEERetailGWh /
      (1 - regionalLineLoss) /
      (historicalTotalGWh || 1)) *
    requiredOffsetTotalGWh;

  const requiredOffsetEERetailMw =
    (historicalEERetailMw * requiredOffsetEERetailGWh) /
    (historicalEERetailGWh || 1);

  const requiredOffsetOnshoreWindGWh =
    (historicalOnshoreWindGWh / (historicalTotalGWh || 1)) *
    requiredOffsetTotalGWh;

  const requiredOffsetOnshoreWindMw =
    (historicalOnshoreWindMw * requiredOffsetOnshoreWindGWh) /
    (historicalOnshoreWindGWh || 1);

  const requiredOffsetUtilitySolarGWh =
    (historicalUtilitySolarGWh / (historicalTotalGWh || 1)) *
    requiredOffsetTotalGWh;

  const requiredOffsetUtilitySolarMw =
    (historicalUtilitySolarMw * requiredOffsetUtilitySolarGWh) /
    (historicalUtilitySolarGWh || 1);

  const requiredOffsetTotalMw =
    requiredOffsetEERetailMw +
    requiredOffsetOnshoreWindMw +
    requiredOffsetUtilitySolarMw;

  const precentDifferenceEERetailMw =
    requiredOffsetEERetailMw / (historicalEERetailMw || 1);

  const precentDifferenceEERetailGWh =
    requiredOffsetEERetailGWh / (historicalEERetailGWh || 1);

  const precentDifferenceOnshoreWindMw =
    requiredOffsetOnshoreWindMw / (historicalOnshoreWindMw || 1);

  const precentDifferenceOnshoreWindGWh =
    requiredOffsetOnshoreWindGWh / (historicalOnshoreWindGWh || 1);

  const precentDifferenceUtilitySolarMw =
    requiredOffsetUtilitySolarMw / (historicalUtilitySolarMw || 1);

  const precentDifferenceUtilitySolarGWh =
    requiredOffsetUtilitySolarGWh / (historicalUtilitySolarGWh || 1);

  return (
    <div className="margin-top-2">
      <h4 className="avert-blue margin-bottom-1 font-serif-md">
        EE/RE and EV Comparison{' '}
        <Tooltip>
          <span className="text-normal">
            This table provides a comparison between the total annual energy
            impact of the EVs entered and recent trends in RE capacity
            installation and EE programs in the location of EV deployment. AVERT
            compares the generation required to power the EVs entered against
            the average first-year GWh generation from wind, solar, and EE
            resources deployed in the selected state or region between 2018 and
            2020. This table helps users build more likely scenarios combining
            EVs, EE, and RE.
          </span>
        </Tooltip>
      </h4>

      <div className="overflow-auto">
        <div className="avert-table-container">
          <table
            className={`avert-table avert-table-striped ${className ?? ''}`}
          >
            <thead>
              <tr>
                <th scope="col" rowSpan={2}>
                  EE/RE Type
                </th>
                <th scope="col" colSpan={2}>
                  Historical Additions
                  <br />
                  <small>
                    {evDeploymentLocationName && (
                      <>for {evDeploymentLocationName} </>
                    )}
                    (Annual Avg. 2018&ndash;2020)
                  </small>
                </th>
                <th scope="col" colSpan={2}>
                  EE/RE Required
                  <br />
                  <small>to Offset EV Demand</small>
                </th>
                <th scope="col" colSpan={2}>
                  EE/RE Required
                  <br />
                  <small>÷ Historical Additions</small>
                </th>
              </tr>

              <tr>
                <th scope="col">
                  <small>MW</small>
                </th>
                <th scope="col">
                  <small>GWh</small>
                </th>
                <th scope="col">
                  <small>MW</small>
                </th>
                <th scope="col">
                  <small>GWh</small>
                </th>
                <th scope="col">
                  <small>MW</small>
                </th>
                <th scope="col">
                  <small>GWh</small>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th scope="row">EE&nbsp;(retail)</th>
                <td>{formatNumber(historicalEERetailMw)}</td>
                <td>{formatNumber(historicalEERetailGWh)}</td>
                <td>
                  {historicalEERetailGWh === 0
                    ? '-'
                    : formatNumber(requiredOffsetEERetailMw)}
                </td>
                <td>
                  {historicalEERetailGWh === 0
                    ? '-'
                    : formatNumber(requiredOffsetEERetailGWh)}
                </td>
                <td>
                  {historicalEERetailMw === 0
                    ? '-'
                    : `${formatNumber(precentDifferenceEERetailMw * 100)}%`}
                </td>
                <td>
                  {historicalEERetailGWh === 0
                    ? '-'
                    : `${formatNumber(precentDifferenceEERetailGWh * 100)}%`}
                </td>
              </tr>

              <tr>
                <th scope="row">Onshore&nbsp;Wind</th>
                <td>{formatNumber(historicalOnshoreWindMw)}</td>
                <td>{formatNumber(historicalOnshoreWindGWh)}</td>
                <td>
                  {historicalOnshoreWindGWh === 0
                    ? '-'
                    : formatNumber(requiredOffsetOnshoreWindMw)}
                </td>
                <td>
                  {historicalOnshoreWindGWh === 0
                    ? '-'
                    : formatNumber(requiredOffsetOnshoreWindGWh)}
                </td>
                <td>
                  {historicalOnshoreWindMw === 0
                    ? '-'
                    : `${formatNumber(precentDifferenceOnshoreWindMw * 100)}%`}
                </td>
                <td>
                  {historicalOnshoreWindGWh === 0
                    ? '-'
                    : `${formatNumber(precentDifferenceOnshoreWindGWh * 100)}%`}
                </td>
              </tr>

              <tr>
                <th scope="row">Utility&nbsp;Solar</th>
                <td>{formatNumber(historicalUtilitySolarMw)}</td>
                <td>{formatNumber(historicalUtilitySolarGWh)}</td>
                <td>
                  {historicalUtilitySolarGWh === 0
                    ? '-'
                    : formatNumber(requiredOffsetUtilitySolarMw)}
                </td>
                <td>
                  {historicalUtilitySolarGWh === 0
                    ? '-'
                    : formatNumber(requiredOffsetUtilitySolarGWh)}
                </td>
                <td>
                  {historicalUtilitySolarMw === 0
                    ? '-'
                    : `${formatNumber(precentDifferenceUtilitySolarMw * 100)}%`}
                </td>
                <td>
                  {historicalUtilitySolarGWh === 0
                    ? '-'
                    : `${formatNumber(
                        precentDifferenceUtilitySolarGWh * 100,
                      )}%`}
                </td>
              </tr>

              <tr>
                <th scope="row">Total</th>
                <td>{formatNumber(historicalTotalMw)}</td>
                <td>{formatNumber(historicalTotalGWh)}</td>
                <td>{formatNumber(requiredOffsetTotalMw)}</td>
                <td>{formatNumber(requiredOffsetTotalGWh)}</td>
                <td>{'-'}</td>
                <td>{'-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function EVSalesAndStockTable(props: { className?: string }) {
  const { className } = props;

  return (
    <ErrorBoundary
      message={
        <>
          Error loading EV Sales and Stock Comparison table. Please contact
          AVERT support at{' '}
          <a
            className="usa-link"
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <EVSalesAndStockTableContent className={className} />
    </ErrorBoundary>
  );
}

export function EEREEVComparisonTable(props: { className?: string }) {
  const { className } = props;

  return (
    <ErrorBoundary
      message={
        <>
          Error loading EE/RE and EV Comparison table. Please contact AVERT
          support at{' '}
          <a
            className="usa-link"
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <EEREEVComparisonTableContent className={className} />
    </ErrorBoundary>
  );
}
