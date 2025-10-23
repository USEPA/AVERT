import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Tooltip } from "@/components/Tooltip";
import { useAppSelector } from "@/redux/index";
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

  if (!salesAndStock || Object.keys(salesAndStock).length === 0) {
    return null;
  }

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
        Entered EVs Compared to Total Sales and Stock{" "}
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
                  % of Total Annual Vehicle Sales
                  {evDeploymentLocationName && (
                    <>
                      <br />
                      <small>in {evDeploymentLocationName}</small>
                    </>
                  )}
                </th>
                <th scope="col">
                  % of Registered Vehicles
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
  const selectedRegionsTotalYearlySalesChanges = useAppSelector(
    ({ transportation }) =>
      transportation.selectedRegionsTotalYearlySalesChanges,
  );
  const evDeploymentLocationHistoricalEERE = useAppSelector(
    ({ transportation }) => transportation.evDeploymentLocationHistoricalEERE,
  );
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useAppSelector(({ impacts }) => impacts.selectOptions);

  const { averageAnnualCapacityAddedMW, estimatedAnnualImpactsGWh } =
    evDeploymentLocationHistoricalEERE;
  const { evDeploymentLocation } = inputs;
  const { evDeploymentLocationOptions } = selectOptions;

  const totalYearlySalesChanges = Object.values(
    selectedRegionsTotalYearlySalesChanges,
  ).reduce((total, regionTotal) => total + (regionTotal || 0), 0);

  const evDeploymentLocationName = evDeploymentLocationOptions.find((opt) => {
    return opt.id === evDeploymentLocation;
  })?.name;

  const eeRetailCapacityAdded = averageAnnualCapacityAddedMW.eeRetail;
  const eeRetailImpacts = estimatedAnnualImpactsGWh.eeRetail;

  const windCapacityAdded = averageAnnualCapacityAddedMW.wind;
  const windImpacts = estimatedAnnualImpactsGWh.wind;

  const solarCapacityAdded = averageAnnualCapacityAddedMW.upv;
  const solarImpacts = estimatedAnnualImpactsGWh.upv;

  const totalCapacityAdded =
    eeRetailCapacityAdded / (1 - regionalLineLoss) +
    windCapacityAdded +
    solarCapacityAdded;

  const totalImpacts =
    eeRetailImpacts / (1 - regionalLineLoss) + windImpacts + solarImpacts;

  const totalOffsetRequiredGWh =
    totalYearlySalesChanges / (1 - regionalLineLoss);

  const eeOffsetRequiredGWh =
    (eeRetailImpacts / (1 - regionalLineLoss) / (totalImpacts || 1)) *
    totalOffsetRequiredGWh;

  const eeOffsetRequiredMw =
    (eeRetailCapacityAdded * eeOffsetRequiredGWh) / (eeRetailImpacts || 1);

  const windOffsetRequiredGWh =
    (windImpacts / (totalImpacts || 1)) * totalOffsetRequiredGWh;

  const windOffsetRequiredMw =
    (windCapacityAdded * windOffsetRequiredGWh) / (windImpacts || 1);

  const solarOffsetRequiredGWh =
    (solarImpacts / (totalImpacts || 1)) * totalOffsetRequiredGWh;

  const solarOffsetRequiredMw =
    (solarCapacityAdded * solarOffsetRequiredGWh) / (solarImpacts || 1);

  const totalOffsetRequiredMw =
    eeOffsetRequiredMw + windOffsetRequiredMw + solarOffsetRequiredMw;

  const eePercentDifferenceMw =
    eeOffsetRequiredMw / (eeRetailCapacityAdded || 1);

  const eePercentDifferenceGWh = eeOffsetRequiredGWh / (eeRetailImpacts || 1);

  const windPercentDifferenceMw =
    windOffsetRequiredMw / (windCapacityAdded || 1);

  const windPercentDifferenceGWh = windOffsetRequiredGWh / (windImpacts || 1);

  const solarPercentDifferenceMw =
    solarOffsetRequiredMw / (solarCapacityAdded || 1);

  const solarPercentDifferenceGWh =
    solarOffsetRequiredGWh / (solarImpacts || 1);

  return (
    <div className={clsx("margin-top-2")}>
      <h4 className={clsx("avert-blue", "margin-bottom-1 font-serif-md")}>
        EV Demand Relative to EE/RE Growth{" "}
        <Tooltip>
          <span className={clsx("text-normal")}>
            This table provides a comparison between the total annual energy
            impact of the EVs entered and recent trends in RE capacity
            installation and EE programs in the location of EV deployment. AVERT
            compares the generation required to power the EVs entered against
            the average first-year GWh generation from wind, solar, and EE
            resources deployed in the selected state or region between 2021 and
            2023. This table helps users build more likely scenarios combining
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
                    (Annual Avg. 2021&ndash;2023)
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
                <td>{formatNumber(eeRetailCapacityAdded)}</td>
                <td>{formatNumber(eeRetailImpacts)}</td>
                <td>
                  {eeRetailImpacts === 0
                    ? "-"
                    : formatNumber(eeOffsetRequiredMw)}
                </td>
                <td>
                  {eeRetailImpacts === 0
                    ? "-"
                    : formatNumber(eeOffsetRequiredGWh)}
                </td>
                <td>
                  {eeRetailCapacityAdded === 0
                    ? "-"
                    : `${formatNumber(eePercentDifferenceMw * 100)}%`}
                </td>
                <td>
                  {eeRetailImpacts === 0
                    ? "-"
                    : `${formatNumber(eePercentDifferenceGWh * 100)}%`}
                </td>
              </tr>

              <tr>
                <th scope="row">Onshore&nbsp;Wind</th>
                <td>{formatNumber(windCapacityAdded)}</td>
                <td>{formatNumber(windImpacts)}</td>
                <td>
                  {windImpacts === 0 ? "-" : formatNumber(windOffsetRequiredMw)}
                </td>
                <td>
                  {windImpacts === 0
                    ? "-"
                    : formatNumber(windOffsetRequiredGWh)}
                </td>
                <td>
                  {windCapacityAdded === 0
                    ? "-"
                    : `${formatNumber(windPercentDifferenceMw * 100)}%`}
                </td>
                <td>
                  {windImpacts === 0
                    ? "-"
                    : `${formatNumber(windPercentDifferenceGWh * 100)}%`}
                </td>
              </tr>

              <tr>
                <th scope="row">Utility&nbsp;Solar</th>
                <td>{formatNumber(solarCapacityAdded)}</td>
                <td>{formatNumber(solarImpacts)}</td>
                <td>
                  {solarImpacts === 0
                    ? "-"
                    : formatNumber(solarOffsetRequiredMw)}
                </td>
                <td>
                  {solarImpacts === 0
                    ? "-"
                    : formatNumber(solarOffsetRequiredGWh)}
                </td>
                <td>
                  {solarCapacityAdded === 0
                    ? "-"
                    : `${formatNumber(solarPercentDifferenceMw * 100)}%`}
                </td>
                <td>
                  {solarImpacts === 0
                    ? "-"
                    : `${formatNumber(solarPercentDifferenceGWh * 100)}%`}
                </td>
              </tr>

              <tr>
                <th scope="row">Total</th>
                <td>{formatNumber(totalCapacityAdded)}</td>
                <td>{formatNumber(totalImpacts)}</td>
                <td>{formatNumber(totalOffsetRequiredMw)}</td>
                <td>{formatNumber(totalOffsetRequiredGWh)}</td>
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
          Error loading “Entered EVs Compared to Total Sales and Stock” table.
          Please contact AVERT support at{" "}
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
          Error loading “EV Demand Relative to EE/RE Growth” table. Please
          contact AVERT support at{" "}
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
