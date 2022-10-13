/** @jsxImportSource @emotion/react */

// components
import { subheadingStyles } from 'app/components/Panels';
// reducers
import { useTypedSelector } from 'app/redux/index';
// hooks
import { useSelectedRegion, useSelectedState } from 'app/hooks';
// data
import countyFips from 'app/data/county-fips.json';
import stateSalesAndStock from 'app/data/state-sales-and-stock.json';

type SalesAndStockStateId = keyof typeof stateSalesAndStock;

/**
 * Vehicle sales and stock for each state in the selected region, and the region
 * as a whole (sum of each state's sales and stock), for each vehicle type.
 *
 * Excel: "Table 9: List of states in region for purposes of calculating
 * vehicle sales and stock" table in the "Library" sheet (C440:I457).
 */
function setVehicleSalesAndStockForRegion(options: {
  regionName: string | undefined;
  locationIds: string[];
}) {
  const { regionName, locationIds } = options;

  const result: {
    [locationId: string]: {
      lightDutyVehicles: { sales: number; stock: number };
      transitBuses: { sales: number; stock: number };
      schoolBuses: { sales: number; stock: number };
    };
  } = {};

  const stateIds = locationIds.reduce((previous, current) => {
    return current.startsWith('region-')
      ? previous
      : previous.concat(current.replace('state-', ''));
  }, [] as string[]);

  countyFips.forEach((data) => {
    const stateId = data['Postal State Code'];

    if (data['AVERT Region'] === regionName && stateIds.includes(stateId)) {
      const id = `state-${stateId}`;

      const lightDutyVehiclesVMTShare = data['Share of State VMT - Passenger Cars']; // prettier-ignore
      const transitBusesVMTShare = data['Share of State VMT - Transit Buses'];
      const schoolBusesVMTShare = data['Share of State VMT - School Buses'];
      const salesAndStock = stateSalesAndStock[stateId as SalesAndStockStateId];

      // initialize and then increment state data by vehicle type
      result[id] ??= {
        lightDutyVehicles: { sales: 0, stock: 0 },
        transitBuses: { sales: 0, stock: 0 },
        schoolBuses: { sales: 0, stock: 0 },
      };

      result[id].lightDutyVehicles.sales +=
        lightDutyVehiclesVMTShare * salesAndStock.lightDutyVehicles.sales;
      result[id].lightDutyVehicles.stock +=
        lightDutyVehiclesVMTShare * salesAndStock.lightDutyVehicles.stock;
      result[id].transitBuses.sales +=
        transitBusesVMTShare * salesAndStock.transitBuses.sales;
      result[id].transitBuses.stock +=
        transitBusesVMTShare * salesAndStock.transitBuses.stock;
      result[id].schoolBuses.sales +=
        schoolBusesVMTShare * salesAndStock.schoolBuses.sales;
      result[id].schoolBuses.stock +=
        schoolBusesVMTShare * salesAndStock.schoolBuses.stock;
    }
  });

  const regionId = locationIds.find((item) => item.startsWith('region-'));

  if (regionId) {
    result[regionId] = {
      lightDutyVehicles: { sales: 0, stock: 0 },
      transitBuses: { sales: 0, stock: 0 },
      schoolBuses: { sales: 0, stock: 0 },
    };

    stateIds.forEach((stateId) => {
      const id = `state-${stateId}`;
      result[regionId].lightDutyVehicles.sales += result[id].lightDutyVehicles.sales; // prettier-ignore
      result[regionId].lightDutyVehicles.stock += result[id].lightDutyVehicles.stock; // prettier-ignore
      result[regionId].transitBuses.sales += result[id].transitBuses.sales;
      result[regionId].transitBuses.stock += result[id].transitBuses.stock;
      result[regionId].schoolBuses.sales += result[id].schoolBuses.sales;
      result[regionId].schoolBuses.stock += result[id].schoolBuses.stock;
    });
  }

  return result;
}

function EVSalesAndStockTable({ locationIds }: { locationIds: string[] }) {
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
    geographicFocus === 'regions' && selectedRegion
      ? `${selectedRegion.name} Region`
      : geographicFocus === 'states' && selectedState
      ? selectedState.name
      : '';

  // TODO: memoize so it's not calculated every time an input changes
  // (as it really only needs to be calculated when a region changes)
  const salesAndStockByLocation = setVehicleSalesAndStockForRegion({
    regionName: selectedRegion?.name,
    locationIds,
  });

  const locationSalesAndStock = salesAndStockByLocation[evDeploymentLocation];
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
