import { Fragment } from 'react';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { useTypedSelector } from 'app/redux/index';
import type { VehicleEmissionChangesByGeography } from 'app/calculations/transportation';
import type { CombinedSectorsEmissionsData } from 'app/calculations/emissions';
import type { StateId } from 'app/config';
import { states as statesConfig } from 'app/config';

/**
 * Round number to the nearest 10 and conditionally format resulting -0 to 0.
 */
function formatNumber(number: number) {
  const result = Math.round(number / 10) * 10;
  return (result === -0 ? 0 : result).toLocaleString();
}

/**
 * Combine the power sector emissions annual data changes for each pollutant at
 * each state with state transportation sector results.
 */
function setAnnualStateEmissionsChanges(options: {
  combinedSectorsEmissionsData: CombinedSectorsEmissionsData;
  vehicleEmissionChangesByGeography: VehicleEmissionChangesByGeography | {};
}) {
  const { combinedSectorsEmissionsData, vehicleEmissionChangesByGeography } =
    options;

  const result = [] as {
    id: StateId;
    name: string;
    power: {
      generation: number;
      so2: number;
      nox: number;
      co2: number;
      pm25: number;
      vocs: number;
      nh3: number;
    };
    transportation: {
      CO2: number;
      NOX: number;
      SO2: number;
      PM25: number;
      VOCs: number;
      NH3: number;
    };
  }[];

  const vehicleEmissionChanges =
    Object.keys(vehicleEmissionChangesByGeography).length !== 0
      ? (vehicleEmissionChangesByGeography as VehicleEmissionChangesByGeography)
      : null;

  if (!combinedSectorsEmissionsData || !vehicleEmissionChanges) return [];

  /** Add power sector data */
  Object.entries(combinedSectorsEmissionsData.states).forEach(
    ([key, stateData]) => {
      const stateId = key as keyof typeof combinedSectorsEmissionsData.states;
      const stateName = statesConfig[stateId].name;

      const power = Object.entries(stateData).reduce(
        (object, [stateDataKey, stateDataValue]) => {
          const pollutant = stateDataKey as keyof typeof stateData;
          const statePowerData = stateDataValue.power;

          if (statePowerData) {
            const { original, postEere } = statePowerData.annual;
            object[pollutant] += postEere - original;
          }

          return object;
        },
        { generation: 0, so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 },
      );

      if (stateName) {
        result.push({
          id: stateId,
          name: stateName,
          power,
          transportation: { CO2: 0, NOX: 0, SO2: 0, PM25: 0, VOCs: 0, NH3: 0 },
        });
      }
    },
  );

  /** Add transportation sector data */
  Object.entries(vehicleEmissionChanges.states).forEach(([key, stateData]) => {
    const stateId = key as StateId;
    const stateName = statesConfig[stateId].name;

    const existingState = result.find((state) => state.id === stateId);

    if (existingState) {
      existingState.transportation = stateData;
    }

    if (!existingState && stateName) {
      result.push({
        id: stateId,
        name: stateName,
        power: { generation: 0, so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 }, // prettier-ignore
        transportation: stateData,
      });
    }
  });

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

function StateEmissionsTableContent() {
  const combinedSectorsEmissionsData = useTypedSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );
  const vehicleEmissionChangesByGeography = useTypedSelector(
    ({ transportation }) => transportation.vehicleEmissionChangesByGeography,
  );

  const annualStateEmissionsChanges = setAnnualStateEmissionsChanges({
    combinedSectorsEmissionsData,
    vehicleEmissionChangesByGeography,
  });

  if (!combinedSectorsEmissionsData) return null;

  return (
    <div className="overflow-auto">
      <div className="avert-table-container">
        <table className="avert-table width-full">
          <thead>
            <tr>
              <th colSpan={2}>State</th>
              <th className="text-right">
                SO<sub>2</sub> <small>(lb)</small>
              </th>
              <th className="text-right">
                NO<sub>X</sub> <small>(lb)</small>
              </th>
              <th className="text-right">
                CO<sub>2</sub> <small>(tons)</small>
              </th>
              <th className="text-right">
                PM<sub>2.5</sub> <small>(lb)</small>
              </th>
              <th className="text-right">
                VOCs <small>(lb)</small>
              </th>
              <th className="text-right">
                NH<sub>3</sub> <small>(lb)</small>
              </th>
            </tr>
          </thead>

          <tbody>
            {annualStateEmissionsChanges.map((data, index, array) => {
              /** apply zebra striping to groups of state data rows */
              const stripedRowClassName =
                index % 2 ? '' : 'avert-table-striped-row';

              /** add visual space below the last state row, unless its the last state */
              const stateSpacingClassName =
                index !== array.length - 1
                  ? 'border-width-1 border-top-width-0 border-x-width-0 border-solid border-white'
                  : '';

              return (
                <Fragment key={data.id}>
                  <tr className={stripedRowClassName}>
                    <td rowSpan={3}>{data.name}</td>
                    <td className="width-1px text-no-wrap text-right">
                      <small>From</small> Fossil Generation
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.so2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.nox)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.co2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.pm25)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.vocs)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.nh3)}
                    </td>
                  </tr>

                  <tr className={stripedRowClassName}>
                    <td className="width-1px text-no-wrap text-right">
                      <small>From</small> Vehicles
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.transportation.SO2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.transportation.NOX)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.transportation.CO2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.transportation.PM25)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.transportation.VOCs)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.transportation.NH3)}
                    </td>
                  </tr>

                  <tr
                    className={`${stripedRowClassName} ${stateSpacingClassName}`}
                  >
                    <td className="width-1px text-no-wrap text-right">
                      Net Change
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.so2 + data.transportation.SO2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.nox + data.transportation.NOX)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.co2 + data.transportation.CO2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.pm25 + data.transportation.PM25)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.vocs + data.transportation.VOCs)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.nh3 + data.transportation.NH3)}
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StateEmissionsTable() {
  return (
    <ErrorBoundary
      message={
        <>
          Error loading state emissions table. Please contact AVERT support at{' '}
          <a className="usa-link" href="mailto:avert@epa.gov">
            avert@epa.gov
          </a>
        </>
      }
    >
      <StateEmissionsTableContent />
    </ErrorBoundary>
  );
}
