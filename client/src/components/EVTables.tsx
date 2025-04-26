import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Tooltip } from "@/components/Tooltip";
import { useAppSelector } from "@/redux/index";
import { type _SelectedRegionsTotalYearlyEVEnergyUsage } from "@/calculations/transportation";
import { type StateId } from "@/config";

/**
 * Format a string to a number. If attempting to cast the string to a number
 * results in NaN, or if the number is less than 0, return 0.
 */
function stringToNumber(value: string) {
  return isNaN(Number(value)) || Number(value) < 0 ? 0 : Number(value);
}

/**
 * Calculate the value of one number divided by another, shown as a percentage.
 * Format the result as a string with zero to one decimal places percent sign
 * appended. If the provided denominator is 0, return "-".
 */
function calculatePercent(numerator: number, denominator: number) {
  const numberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  };

  return denominator !== 0
    ? `${((numerator / denominator) * 100).toLocaleString(undefined, numberFormatOptions)}%`
    : "-";
}

/**
 * Format a number to a string with zero decimal places and thousands separator.
 */
function formatNumber(number: number) {
  const numberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  return number.toLocaleString(undefined, numberFormatOptions);
}

function EVSalesAndStockTableContent(props: { className?: string }) {
  const { className } = props;

  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useAppSelector(({ impacts }) => impacts.selectOptions);
  const salesAndStockByState = useAppSelector(
    ({ transportation }) =>
      transportation.selectedGeographySalesAndStockByState,
  );
  const salesAndStockByRegion = useAppSelector(
    ({ transportation }) =>
      transportation.selectedGeographySalesAndStockByRegion,
  );

  const { evDeploymentLocation } = inputs;
  const { evDeploymentLocationOptions } = selectOptions;

  const evDeploymentLocationName = evDeploymentLocationOptions.find((opt) => {
    return opt.id === evDeploymentLocation;
  })?.name;

  const deploymentLocationIsRegion = evDeploymentLocation.startsWith("region-");
  const deploymentLocationIsState = evDeploymentLocation.startsWith("state-");
  const deploymentLocationStateId = evDeploymentLocation.replace("state-", "") as StateId; // prettier-ignore

  const salesAndStock = deploymentLocationIsRegion
    ? salesAndStockByRegion
    : deploymentLocationIsState
      ? salesAndStockByState?.[deploymentLocationStateId]
      : null;

  if (!salesAndStock) return null;

  const batteryEVs = stringToNumber(inputs.batteryEVs);
  const hybridEVs = stringToNumber(inputs.hybridEVs);
  const ldvs = batteryEVs + hybridEVs;
  const transitBuses = stringToNumber(inputs.transitBuses);
  const schoolBuses = stringToNumber(inputs.schoolBuses);
  const shortHaulTrucks = stringToNumber(inputs.shortHaulTrucks);
  const comboLongHaulTrucks = stringToNumber(inputs.comboLongHaulTrucks);
  const refuseTrucks = stringToNumber(inputs.refuseTrucks);

  const ldvsSales = calculatePercent(ldvs, salesAndStock["LDVs"].sales);
  const ldvsStock = calculatePercent(ldvs, salesAndStock["LDVs"].stock);
  const transitBusesSales = calculatePercent(transitBuses, salesAndStock["Transit buses"].sales); // prettier-ignore
  const transitBusesStock = calculatePercent(transitBuses, salesAndStock["Transit buses"].stock); // prettier-ignore
  const schoolBusesSales = calculatePercent(schoolBuses, salesAndStock["School buses"].sales); // prettier-ignore
  const schoolBusesStock = calculatePercent(schoolBuses, salesAndStock["School buses"].stock); // prettier-ignore
  const shortHaulTrucksSales = calculatePercent(shortHaulTrucks, salesAndStock["Short-haul trucks"].sales); // prettier-ignore
  const shortHaulTrucksStock = calculatePercent(shortHaulTrucks, salesAndStock["Short-haul trucks"].stock); // prettier-ignore
  const comboLongHaulTrucksSales = calculatePercent(comboLongHaulTrucks, salesAndStock["Combination long-haul trucks"].sales); // prettier-ignore
  const comboLongHaulTrucksStock = calculatePercent(comboLongHaulTrucks, salesAndStock["Combination long-haul trucks"].stock); // prettier-ignore
  const refuseTrucksSales = calculatePercent(refuseTrucks, salesAndStock["Refuse trucks"].sales); // prettier-ignore
  const refuseTrucksStock = calculatePercent(refuseTrucks, salesAndStock["Refuse trucks"].stock); // prettier-ignore

  return (
    <>
      <h4 className={clsx("avert-blue", "margin-bottom-1 font-serif-md")}>
        EV Sales and Stock Comparison{" "}
        <Tooltip>
          <span className={clsx("text-normal")}>
            This table translates the user-specified number of EVs into shares
            of vehicle sales and shares of vehicles on the road (i.e., vehicle
            stock). These shares are based on recent historical data aggregated
            for the location of EV deployment selected by the user. This table
            can assist the user in entering the number of EVs to model.
          </span>
        </Tooltip>
      </h4>

      <div className={clsx("overflow-auto")}>
        <div className={clsx("avert-table-container")}>
          <table className={clsx("avert-table avert-table-striped", className)}>
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
                <td>{ldvsSales}</td>
                <td>{ldvsStock}</td>
              </tr>

              <tr>
                <th scope="row">Transit buses</th>
                <td>{transitBusesSales}</td>
                <td>{transitBusesStock}</td>
              </tr>

              <tr>
                <th scope="row">School buses</th>
                <td>{schoolBusesSales}</td>
                <td>{schoolBusesStock}</td>
              </tr>

              <tr>
                <th scope="row">Short-haul trucks</th>
                <td>{shortHaulTrucksSales}</td>
                <td>{shortHaulTrucksStock}</td>
              </tr>

              <tr>
                <th scope="row">Comb. long-haul trucks</th>
                <td>{comboLongHaulTrucksSales}</td>
                <td>{comboLongHaulTrucksStock}</td>
              </tr>

              <tr>
                <th scope="row">Refuse trucks</th>
                <td>{refuseTrucksSales}</td>
                <td>{refuseTrucksStock}</td>
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

  const regionalLineLoss = useAppSelector(
    ({ geography }) => geography.regionalLineLoss,
  );
  const _selectedRegionsTotalYearlyEVEnergyUsage = useAppSelector(
    ({ transportation }) =>
      transportation._selectedRegionsTotalYearlyEVEnergyUsage,
  );
  const evDeploymentLocationHistoricalEERE = useAppSelector(
    ({ transportation }) => transportation.evDeploymentLocationHistoricalEERE,
  );
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useAppSelector(({ impacts }) => impacts.selectOptions);

  const { evDeploymentLocation } = inputs;
  const { evDeploymentLocationOptions } = selectOptions;

  const evDeploymentLocationName = evDeploymentLocationOptions.find((opt) => {
    return opt.id === evDeploymentLocation;
  })?.name;

  const selectedRegionsEnergyData =
    Object.keys(_selectedRegionsTotalYearlyEVEnergyUsage).length !== 0
      ? (_selectedRegionsTotalYearlyEVEnergyUsage as _SelectedRegionsTotalYearlyEVEnergyUsage)
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
    <div className={clsx("margin-top-2")}>
      <h4 className={clsx("avert-blue", "margin-bottom-1 font-serif-md")}>
        EE/RE and EV Comparison{" "}
        <Tooltip>
          <span className={clsx("text-normal")}>
            This table provides a comparison between the total annual energy
            impact of the EVs entered and recent trends in RE capacity
            installation and EE programs in the location of EV deployment. AVERT
            compares the generation required to power the EVs entered against
            the average first-year GWh generation from wind, solar, and EE
            resources deployed in the selected state or region between 2019 and
            2021. This table helps users build more likely scenarios combining
            EVs, EE, and RE.
          </span>
        </Tooltip>
      </h4>

      <div className={clsx("overflow-auto")}>
        <div className={clsx("avert-table-container")}>
          <table className={clsx("avert-table avert-table-striped", className)}>
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
                    (Annual Avg. 2019&ndash;2021)
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
                    ? "-"
                    : formatNumber(requiredOffsetEERetailMw)}
                </td>
                <td>
                  {historicalEERetailGWh === 0
                    ? "-"
                    : formatNumber(requiredOffsetEERetailGWh)}
                </td>
                <td>
                  {historicalEERetailMw === 0
                    ? "-"
                    : `${formatNumber(precentDifferenceEERetailMw * 100)}%`}
                </td>
                <td>
                  {historicalEERetailGWh === 0
                    ? "-"
                    : `${formatNumber(precentDifferenceEERetailGWh * 100)}%`}
                </td>
              </tr>

              <tr>
                <th scope="row">Onshore&nbsp;Wind</th>
                <td>{formatNumber(historicalOnshoreWindMw)}</td>
                <td>{formatNumber(historicalOnshoreWindGWh)}</td>
                <td>
                  {historicalOnshoreWindGWh === 0
                    ? "-"
                    : formatNumber(requiredOffsetOnshoreWindMw)}
                </td>
                <td>
                  {historicalOnshoreWindGWh === 0
                    ? "-"
                    : formatNumber(requiredOffsetOnshoreWindGWh)}
                </td>
                <td>
                  {historicalOnshoreWindMw === 0
                    ? "-"
                    : `${formatNumber(precentDifferenceOnshoreWindMw * 100)}%`}
                </td>
                <td>
                  {historicalOnshoreWindGWh === 0
                    ? "-"
                    : `${formatNumber(precentDifferenceOnshoreWindGWh * 100)}%`}
                </td>
              </tr>

              <tr>
                <th scope="row">Utility&nbsp;Solar</th>
                <td>{formatNumber(historicalUtilitySolarMw)}</td>
                <td>{formatNumber(historicalUtilitySolarGWh)}</td>
                <td>
                  {historicalUtilitySolarGWh === 0
                    ? "-"
                    : formatNumber(requiredOffsetUtilitySolarMw)}
                </td>
                <td>
                  {historicalUtilitySolarGWh === 0
                    ? "-"
                    : formatNumber(requiredOffsetUtilitySolarGWh)}
                </td>
                <td>
                  {historicalUtilitySolarMw === 0
                    ? "-"
                    : `${formatNumber(precentDifferenceUtilitySolarMw * 100)}%`}
                </td>
                <td>
                  {historicalUtilitySolarGWh === 0
                    ? "-"
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
                <td>{"-"}</td>
                <td>{"-"}</td>
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
          AVERT support at{" "}
          <a
            className={clsx("usa-link")}
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <EVSalesAndStockTableContent className={clsx(className)} />
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
          support at{" "}
          <a
            className={clsx("usa-link")}
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <EEREEVComparisonTableContent className={clsx(className)} />
    </ErrorBoundary>
  );
}
