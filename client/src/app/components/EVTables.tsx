/** @jsxImportSource @emotion/react */

// reducers
import { useTypedSelector } from 'app/redux/index';
// hooks
import { useSelectedRegion, useSelectedState } from 'app/hooks';

function EVSalesAndStockTable() {
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const batteryEVs = useTypedSelector(({ eere }) => eere.inputs.batteryEVs);
  const hybridEVs = useTypedSelector(({ eere }) => eere.inputs.hybridEVs);
  const transitBuses = useTypedSelector(({ eere }) => eere.inputs.transitBuses);
  const schoolBuses = useTypedSelector(({ eere }) => eere.inputs.schoolBuses);
  const evDeploymentLocation = useTypedSelector(
    ({ eere }) => eere.inputs.evDeploymentLocation,
  );

  const selectedRegion = useSelectedRegion();
  const selectedState = useSelectedState();

  const locationName =
    geographicFocus === 'regions'
      ? `${selectedRegion?.name} Region`
      : selectedState?.name;

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
      sales: totalLightDutyVehicles / 1 /* TODO */,
      stock: 0,
    },
    transitBuses: {
      sales: totalTransitBuses / 1 /* TODO */,
      stock: 0,
    },
    schoolBuses: {
      sales: totalSchoolBuses / 1 /* TODO */,
      stock: 0,
    },
  };

  return (
    <table className="avert-table">
      <thead>
        <tr>
          <th>Electric Vehicle Type</th>
          <th>
            % of Annual Vehicle Sales
            {locationName && (
              <>
                <br />
                <small>in {locationName}</small>
              </>
            )}
          </th>
          <th>
            % of Vehicles on the Road
            {locationName && (
              <>
                <br />
                <small>in {locationName}</small>
              </>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Light-duty vehicles</td>
          <td>{data.lightDutyVehicles.sales?.toLocaleString()}</td>
          <td>{data.lightDutyVehicles.stock}</td>
        </tr>
        <tr>
          <td>Transit buses</td>
          <td>{data.transitBuses.sales?.toLocaleString()}</td>
          <td>{data.transitBuses.stock}</td>
        </tr>
        <tr>
          <td>School buses</td>
          <td>{data.schoolBuses.sales?.toLocaleString()}</td>
          <td>{data.schoolBuses.stock}</td>
        </tr>
      </tbody>
    </table>
  );
}

function EEREEVComparisonTable() {
  return (
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
  );
}

export { EVSalesAndStockTable, EEREEVComparisonTable };
