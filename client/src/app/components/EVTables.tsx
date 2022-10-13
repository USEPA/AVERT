/** @jsxImportSource @emotion/react */

// components
import { subheadingStyles } from 'app/components/Panels';
import { SalesAndStockByVehicleType } from 'app/components/EEREInputs';
// reducers
import { useTypedSelector } from 'app/redux/index';

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

  const data = {
    lightDutyVehicles: {
      sales: totalLightDutyVehicles / locationSalesAndStock.lightDutyVehicles.sales, // prettier-ignore
      stock: totalLightDutyVehicles / locationSalesAndStock.lightDutyVehicles.stock, // prettier-ignore
    },
    transitBuses: {
      sales: totalTransitBuses / locationSalesAndStock.transitBuses.sales,
      stock: totalTransitBuses / locationSalesAndStock.transitBuses.stock,
    },
    schoolBuses: {
      sales: totalSchoolBuses / locationSalesAndStock.schoolBuses.sales,
      stock: totalSchoolBuses / locationSalesAndStock.schoolBuses.stock,
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
            <td>{(data.lightDutyVehicles.sales * 100)?.toLocaleString()}%</td>
            <td>{(data.lightDutyVehicles.stock * 100)?.toLocaleString()}%</td>
          </tr>
          <tr>
            <td>Transit buses</td>
            <td>{(data.transitBuses.sales * 100)?.toLocaleString()}%</td>
            <td>{(data.transitBuses.stock * 100)?.toLocaleString()}%</td>
          </tr>
          <tr>
            <td>School buses</td>
            <td>{(data.schoolBuses.sales * 100)?.toLocaleString()}%</td>
            <td>{(data.schoolBuses.stock * 100)?.toLocaleString()}%</td>
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
