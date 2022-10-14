/** @jsxImportSource @emotion/react */

// components
import { subheadingStyles } from 'app/components/Panels';
import { SalesAndStockByVehicleType } from 'app/components/EEREInputs';
// reducers
import { useTypedSelector } from 'app/redux/index';
// hooks
import { useSelectedRegion } from 'app/hooks';
/**
 * Excel: "Table 12: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B589:E603).
 */
import regionEereAverages from 'app/data/region-eere-averages.json';
/**
 * Excel: "Table 12: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B609:E658).
 */
import stateEereAverages from 'app/data/state-eere-averages.json';

type RegionId = keyof typeof regionEereAverages;
type StateId = keyof typeof stateEereAverages;

function calculatePercent(numerator: number, denominator: number) {
  return denominator !== 0
    ? `${((numerator / denominator) * 100).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      })}%`
    : 'N/A';
}

function EVSalesAndStockTable({
  evDeploymentLocationName,
  vehicleSalesAndStock,
}: {
  evDeploymentLocationName: string | undefined;
  vehicleSalesAndStock: {
    [locationId: string]: SalesAndStockByVehicleType;
  };
}) {
  const batteryEVs = useTypedSelector(({ eere }) => eere.inputs.batteryEVs);
  const hybridEVs = useTypedSelector(({ eere }) => eere.inputs.hybridEVs);
  const transitBuses = useTypedSelector(({ eere }) => eere.inputs.transitBuses);
  const schoolBuses = useTypedSelector(({ eere }) => eere.inputs.schoolBuses);
  const evDeploymentLocation = useTypedSelector(
    ({ eere }) => eere.inputs.evDeploymentLocation,
  );

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
      <h3 css={subheadingStyles}>EV Sales and Stock Comparison</h3>

      <table className="avert-table">
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
              {calculatePercent(totalLightDutyVehicles, lightDutyVehicleSales)}
            </td>
            <td>
              {calculatePercent(totalLightDutyVehicles, lightDutyVehicleStock)}
            </td>
          </tr>
          <tr>
            <td>Transit buses</td>
            <td>{calculatePercent(totalTransitBuses, transitBusesSales)}</td>
            <td>{calculatePercent(totalTransitBuses, transitBusesStock)}</td>
          </tr>
          <tr>
            <td>School buses</td>
            <td>{calculatePercent(totalSchoolBuses, schoolBusesSales)}</td>
            <td>{calculatePercent(totalSchoolBuses, schoolBusesStock)}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

/**
 * Historical EERE data for the EV deployment location (entire region or state).
 *
 * Excel: "Table 12: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (C664:E664).
 */
function setDeploymentLocationHistoricalEERE(options: {
  locationId: string;
  lineLoss: number;
}) {
  const { locationId, lineLoss } = options;

  const historicalMw = locationId.startsWith('region-')
    ? regionEereAverages[locationId.replace('region-', '') as RegionId]
    : locationId.startsWith('state-')
    ? stateEereAverages[locationId.replace('state-', '') as StateId]
    : { onshore_wind: 0, utility_pv: 0, ee_retail: 0 }; // fallback

  /**
   * NOTE: In the Excel app, EE (Retail) is only adjusted for lineLoss if the
   * EV deployment location is the entire region (E664 of the "Library" sheet)
   */
  const lineLossFactor = locationId.startsWith('region-') ? 1 - lineLoss : 1;

  const result = {
    eeRetail: historicalMw.ee_retail * lineLossFactor,
    onshoreWind: historicalMw.onshore_wind,
    utilitySolar: historicalMw.utility_pv,
  };

  return result;
}

function formatNumber(number: number) {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function EEREEVComparisonTable() {
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const evDeploymentLocation = useTypedSelector(
    ({ eere }) => eere.inputs.evDeploymentLocation,
  );

  const selectedRegion = useSelectedRegion();

  const lineLoss =
    geographicFocus === 'regions' && selectedRegion
      ? selectedRegion.lineLoss
      : 1; // TODO: determine best way to set lineloss if a state is selected

  const historicalMw = setDeploymentLocationHistoricalEERE({
    locationId: evDeploymentLocation,
    lineLoss,
  });

  return (
    <>
      <h3 css={subheadingStyles}>EE/RE and EV Comparison</h3>

      <table className="avert-table">
        <thead>
          <tr>
            <th rowSpan={2}>EE/RE Type</th>
            <th colSpan={2}>
              Historical Additions <small>(Annual Avg. 2018&ndash;2020)</small>
            </th>
            <th colSpan={2}>EE/RE Required to Offset EV Demand</th>
            <th colSpan={2}>EE/RE Required ÷ Historical Additions</th>
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
            <td>{formatNumber(historicalMw.eeRetail)}</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Onshore&nbsp;Wind</td>
            <td>{formatNumber(historicalMw.onshoreWind)}</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Utility&nbsp;Solar</td>
            <td>{formatNumber(historicalMw.utilitySolar)}</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>
              {formatNumber(
                historicalMw.eeRetail / (1 - lineLoss) +
                  historicalMw.onshoreWind +
                  historicalMw.utilitySolar,
              )}
            </td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

export { EVSalesAndStockTable, EEREEVComparisonTable };
