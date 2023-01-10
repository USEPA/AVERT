import { useTypedSelector } from 'app/redux/index';
import {
  calculateRegionalScalingFactors,
  getSelectedGeographyRegions,
} from 'app/calculations/geography';
import type { RegionId } from 'app/config';

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

export function EVSalesAndStockTable(props: { className?: string }) {
  const { className } = props;

  const batteryEVs = useTypedSelector(({ eere }) => eere.inputs.batteryEVs);
  const hybridEVs = useTypedSelector(({ eere }) => eere.inputs.hybridEVs);
  const transitBuses = useTypedSelector(({ eere }) => eere.inputs.transitBuses);
  const schoolBuses = useTypedSelector(({ eere }) => eere.inputs.schoolBuses);
  const evDeploymentLocation = useTypedSelector(
    ({ eere }) => eere.inputs.evDeploymentLocation,
  );
  const evDeploymentLocationOptions = useTypedSelector(
    ({ eere }) => eere.selectOptions.evDeploymentLocationOptions,
  );
  const vehicleSalesAndStock = useTypedSelector(
    ({ transportation }) => transportation.vehicleSalesAndStock,
  );

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
      <h3 className="avert-blue margin-bottom-1 font-serif-md">
        EV Sales and Stock Comparison
      </h3>

      <div className="overflow-auto">
        <div className="avert-table-container">
          <table className={`avert-table ${className ? className : ''}`}>
            <thead>
              <tr>
                <th>Electric Vehicle Type</th>
                <th>
                  % of Annual Vehicle Sales
                  {evDeploymentLocationName && (
                    <>
                      <br />
                      <small>in {evDeploymentLocationName}</small>
                    </>
                  )}
                </th>
                <th>
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
                <td>Light-duty vehicles</td>
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
                <td>Transit buses</td>
                <td>
                  {calculatePercent(totalTransitBuses, transitBusesSales)}
                </td>
                <td>
                  {calculatePercent(totalTransitBuses, transitBusesStock)}
                </td>
              </tr>
              <tr>
                <td>School buses</td>
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

export function EEREEVComparisonTable(props: { className?: string }) {
  const { className } = props;

  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const regions = useTypedSelector(({ geography }) => geography.regions);
  const states = useTypedSelector(({ geography }) => geography.states);
  const totalYearlyEVEnergyUsage = useTypedSelector(
    ({ transportation }) => transportation.totalYearlyEVEnergyUsage,
  );
  const evDeploymentLocationHistoricalEERE = useTypedSelector(
    ({ transportation }) => transportation.evDeploymentLocationHistoricalEERE,
  );

  const regionalScalingFactors = calculateRegionalScalingFactors({
    geographicFocus,
    selectedRegion: Object.values(regions).find((r) => r.selected),
    selectedState: Object.values(states).find((s) => s.selected),
  });

  const selectedGeographyRegionIds = Object.keys(
    regionalScalingFactors,
  ) as RegionId[];

  const selectedGeographyRegions = getSelectedGeographyRegions({
    regions,
    selectedGeographyRegionIds,
  });

  /**
   * Build up line loss from the selected geography's regions using the regional
   * scaling factors.
   *
   * NOTE: this is to support selected states – if a region is selected, the
   * result will be the same as the region's line loss value
   */
  const lineLoss = Object.entries(selectedGeographyRegions).reduce(
    (result, [id, regionData]) => {
      const regionalScalingFactor = regionalScalingFactors[id as RegionId];
      if (regionalScalingFactor) {
        result += regionData.lineLoss * regionalScalingFactor;
      }
      return result;
    },
    0,
  );

  const historicalEERetailMw = evDeploymentLocationHistoricalEERE.eeRetail.mw;
  const historicalEERetailGWh = evDeploymentLocationHistoricalEERE.eeRetail.gwh;

  const historicalOnshoreWindMw = evDeploymentLocationHistoricalEERE.onshoreWind.mw; // prettier-ignore
  const historicalOnshoreWindGWh = evDeploymentLocationHistoricalEERE.onshoreWind.gwh; // prettier-ignore

  const historicalUtilitySolarMw = evDeploymentLocationHistoricalEERE.utilitySolar.mw; // prettier-ignore
  const historicalUtilitySolarGWh = evDeploymentLocationHistoricalEERE.utilitySolar.gwh; // prettier-ignore

  const historicalTotalMw =
    historicalEERetailMw / (1 - lineLoss) +
    historicalOnshoreWindMw +
    historicalUtilitySolarMw;

  const historicalTotalGWh =
    historicalEERetailGWh / (1 - lineLoss) +
    historicalOnshoreWindGWh +
    historicalUtilitySolarGWh;

  const requiredOffsetTotalGWh = totalYearlyEVEnergyUsage / (1 - lineLoss);

  const requiredOffsetEERetailGWh =
    (historicalEERetailGWh / (1 - lineLoss) / (historicalTotalGWh || 1)) *
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
    <>
      <h3 className="avert-blue margin-bottom-1 font-serif-md">
        EE/RE and EV Comparison
      </h3>

      <div className="overflow-auto">
        <div className="avert-table-container">
          <table className={`avert-table ${className ? className : ''}`}>
            <thead>
              <tr>
                <th rowSpan={2}>EE/RE Type</th>
                <th colSpan={2}>
                  Historical Additions
                  <br />
                  <small>(Annual Avg. 2018&ndash;2020)</small>
                </th>
                <th colSpan={2}>
                  EE/RE Required
                  <br />
                  <small>to Offset EV Demand</small>
                </th>
                <th colSpan={2}>
                  EE/RE Required
                  <br />
                  <small>÷ Historical Additions</small>
                </th>
              </tr>
              <tr>
                <th>
                  <small>MW</small>
                </th>
                <th>
                  <small>GWh</small>
                </th>
                <th>
                  <small>MW</small>
                </th>
                <th>
                  <small>GWh</small>
                </th>
                <th>
                  <small>MW</small>
                </th>
                <th>
                  <small>GWh</small>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>EE&nbsp;(retail)</td>
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
                <td>Onshore&nbsp;Wind</td>
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
                <td>Utility&nbsp;Solar</td>
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
                <td>Total</td>
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
    </>
  );
}
