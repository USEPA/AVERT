/** @jsxImportSource @emotion/react */

// components
import { subheadingStyles } from 'app/components/Panels';
import {
  SalesAndStockByVehicleType,
  RegionREDefaultsAverages,
} from 'app/components/EEREInputs';
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

function EVSalesAndStockTable(props: {
  evDeploymentLocationName: string | undefined;
  vehicleSalesAndStock: {
    [locationId: string]: SalesAndStockByVehicleType;
  };
}) {
  const { evDeploymentLocationName, vehicleSalesAndStock } = props;

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
 * table in the "Library" sheet (C664:H664).
 */
function setDeploymentLocationHistoricalEERE(options: {
  regionREDefaultsAverages: RegionREDefaultsAverages;
  locationId: string;
}) {
  const { regionREDefaultsAverages, locationId } = options;

  const result = {
    eeRetail: { mw: 0, gwh: 0 },
    onshoreWind: { mw: 0, gwh: 0 },
    utilitySolar: { mw: 0, gwh: 0 },
  };

  const locationIsRegion = locationId.startsWith('region-');
  const locationIsState = locationId.startsWith('state-');

  const fallbackAverage = {
    capacity_added_mw: { onshore_wind: 0, utility_pv: 0 },
    retail_impacts_ghw: { ee_retail: 0 },
  };

  // averages for selected EV deployment location (region or state)
  const locationAverage = locationIsRegion
    ? regionEereAverages[locationId.replace('region-', '') as RegionId]
    : locationIsState
    ? stateEereAverages[locationId.replace('state-', '') as StateId]
    : fallbackAverage;

  const hoursInYear = 8760;
  const GWtoMW = 1000;

  result.eeRetail.mw = (locationAverage.retail_impacts_ghw.ee_retail * GWtoMW) / hoursInYear; // prettier-ignore
  result.onshoreWind.mw = locationAverage.capacity_added_mw.onshore_wind;
  result.utilitySolar.mw = locationAverage.capacity_added_mw.utility_pv;
  result.eeRetail.gwh = locationAverage.retail_impacts_ghw.ee_retail;
  result.onshoreWind.gwh = regionREDefaultsAverages.onshore_wind * hoursInYear * result.onshoreWind.mw / GWtoMW // prettier-ignore
  result.utilitySolar.gwh = regionREDefaultsAverages.utility_pv * hoursInYear * result.utilitySolar.mw / GWtoMW; // prettier-ignore

  return result;
}

function formatNumber(number: number) {
  return number.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function EEREEVComparisonTable(props: {
  regionREDefaultsAverages: RegionREDefaultsAverages;
}) {
  const { regionREDefaultsAverages } = props;

  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const evDeploymentLocation = useTypedSelector(
    ({ eere }) => eere.inputs.evDeploymentLocation,
  );

  const selectedRegion = useSelectedRegion();

  const lineLoss =
    geographicFocus === 'regions' && selectedRegion
      ? selectedRegion.lineLoss
      : 1; // TODO: determine best way to set lineloss if a state is selected

  const historicalEERE = setDeploymentLocationHistoricalEERE({
    regionREDefaultsAverages,
    locationId: evDeploymentLocation,
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
            <td>{formatNumber(historicalEERE.eeRetail.mw)}</td>
            <td>{formatNumber(historicalEERE.eeRetail.gwh)}</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Onshore&nbsp;Wind</td>
            <td>{formatNumber(historicalEERE.onshoreWind.mw)}</td>
            <td>{formatNumber(historicalEERE.onshoreWind.gwh)}</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Utility&nbsp;Solar</td>
            <td>{formatNumber(historicalEERE.utilitySolar.mw)}</td>
            <td>{formatNumber(historicalEERE.utilitySolar.gwh)}</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>
              {formatNumber(
                historicalEERE.eeRetail.mw / (1 - lineLoss) +
                  historicalEERE.onshoreWind.mw +
                  historicalEERE.utilitySolar.mw,
              )}
            </td>
            <td>
              {formatNumber(
                historicalEERE.eeRetail.gwh / (1 - lineLoss) +
                  historicalEERE.onshoreWind.gwh +
                  historicalEERE.utilitySolar.gwh,
              )}
            </td>
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
