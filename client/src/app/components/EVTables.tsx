/** @jsxImportSource @emotion/react */

// components
import { subheadingStyles } from 'app/components/Panels';
import { SalesAndStockByVehicleType } from 'app/components/EEREInputs';
// reducers
import { useTypedSelector } from 'app/redux/index';

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

  const data = {
    lightDutyVehicles: {
      sales: calculatePercent(totalLightDutyVehicles, lightDutyVehicleSales),
      stock: calculatePercent(totalLightDutyVehicles, lightDutyVehicleStock),
    },
    transitBuses: {
      sales: calculatePercent(totalTransitBuses, transitBusesSales),
      stock: calculatePercent(totalTransitBuses, transitBusesStock),
    },
    schoolBuses: {
      sales: calculatePercent(totalSchoolBuses, schoolBusesSales),
      stock: calculatePercent(totalSchoolBuses, schoolBusesStock),
    },
  };

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
            <td>{data.lightDutyVehicles.sales}</td>
            <td>{data.lightDutyVehicles.stock}</td>
          </tr>
          <tr>
            <td>Transit buses</td>
            <td>{data.transitBuses.sales}</td>
            <td>{data.transitBuses.stock}</td>
          </tr>
          <tr>
            <td>School buses</td>
            <td>{data.schoolBuses.sales}</td>
            <td>{data.schoolBuses.stock}</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function EEREEVComparisonTable() {
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
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Onshore&nbsp;Wind</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Utility&nbsp;Solar</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>Total</td>
            <td>&nbsp;</td>
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
