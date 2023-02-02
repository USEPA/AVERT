import { Fragment } from 'react';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { useTypedSelector } from 'app/redux/index';
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
 * Format the state emissions data from the power and transportation sectors for
 * easier use in displaying in a table.
 */
function setAnnualStateEmissionsChanges(
  combinedSectorsEmissionsData: CombinedSectorsEmissionsData,
) {
  if (!combinedSectorsEmissionsData) return [];

  const stateEmissionsData = combinedSectorsEmissionsData.states;

  const result = Object.entries(stateEmissionsData).reduce(
    (array, [key, stateData]) => {
      const stateId = key as keyof typeof stateEmissionsData;
      const stateName = statesConfig[stateId].name;

      const { power, vehicle } = Object.entries(stateData).reduce(
        (object, [stateDataKey, stateDataValue]) => {
          const pollutant = stateDataKey as keyof typeof stateData;
          const statePowerData = stateDataValue.power;
          const stateVehicleData = stateDataValue.vehicle;

          if (pollutant !== 'generation' && statePowerData) {
            const { original, postEere } = statePowerData.annual;
            object.power[pollutant] += postEere - original;
          }

          if (pollutant !== 'generation' && stateVehicleData) {
            object.vehicle[pollutant] = stateVehicleData;
          }

          return object;
        },
        {
          power: { so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 },
          vehicle: { so2: 0, nox: 0, co2: 0, pm25: 0, vocs: 0, nh3: 0 },
        },
      );

      if (stateName) {
        array.push({ id: stateId, name: stateName, power, vehicle });
      }

      return array;
    },
    [] as {
      id: StateId;
      name: string;
      power: { so2: number; nox: number; co2: number; pm25: number; vocs: number; nh3: number }; // prettier-ignore
      vehicle: { so2: number; nox: number; co2: number; pm25: number; vocs: number; nh3: number }; // prettier-ignore
    }[],
  );

  return result;
}

function StateEmissionsTableContent() {
  const combinedSectorsEmissionsData = useTypedSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );

  const annualStateEmissionsChanges = setAnnualStateEmissionsChanges(
    combinedSectorsEmissionsData,
  );

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
                      {formatNumber(data.vehicle.so2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.vehicle.nox)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.vehicle.co2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.vehicle.pm25)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.vehicle.vocs)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.vehicle.nh3)}
                    </td>
                  </tr>

                  <tr
                    className={`${stripedRowClassName} ${stateSpacingClassName}`}
                  >
                    <td className="width-1px text-no-wrap text-right">
                      Net Change
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.so2 + data.vehicle.so2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.nox + data.vehicle.nox)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.co2 + data.vehicle.co2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.pm25 + data.vehicle.pm25)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.vocs + data.vehicle.vocs)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(data.power.nh3 + data.vehicle.nh3)}
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
