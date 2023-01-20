import { useTypedSelector } from 'app/redux/index';
import type { EmissionsChanges } from 'app/calculations/emissions';
import type { StateId } from 'app/config';
import { states } from 'app/config';

function formatNumber(number: number) {
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

/**
 * Total up the pollutant emissions data of all provided EGUs.
 */
function totalEgusStateChanges(egus: EmissionsChanges) {
  if (Object.keys(egus).length === 0) return [];

  const result = Object.values(egus).reduce(
    (array, eguData) => {
      const stateId = eguData.state as StateId;

      // conditionally initialize the state data
      if (!array.some((state) => state.id === stateId)) {
        array.push({
          id: stateId,
          name: states[stateId].name,
          generation: 0,
          so2: 0,
          nox: 0,
          co2: 0,
          pm25: 0,
          vocs: 0,
          nh3: 0,
        });
      }

      const state = array.find((state) => state.id === stateId);

      if (state) {
        Object.entries(eguData.data).forEach(([key, annualData]) => {
          const pollutant = key as keyof EmissionsChanges[string]['data'];

          Object.values(annualData).forEach((monthlyData) => {
            state[pollutant] += monthlyData.postEere - monthlyData.original;
          });
        });
      }

      return array;
    },
    [] as {
      id: StateId;
      name: string;
      generation: number;
      so2: number;
      nox: number;
      co2: number;
      pm25: number;
      vocs: number;
      nh3: number;
    }[],
  );

  return result;
}

export function StateEmissionsTable() {
  const emissionsChanges = useTypedSelector(
    ({ results }) => results.emissionsChanges,
  );

  const changesByState = totalEgusStateChanges(emissionsChanges.data);

  if (emissionsChanges.status !== 'success') return null;

  return (
    <div className="overflow-auto">
      <div className="avert-table-container">
        <table className="avert-table width-full">
          <thead>
            <tr>
              <th>State</th>
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
            {changesByState
              .sort((stateA, stateB) => stateA.name.localeCompare(stateB.name))
              .map((stateData) => {
                return (
                  <tr key={stateData.id}>
                    <td>{stateData.name}</td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(stateData.so2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(stateData.nox)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(stateData.co2)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(stateData.pm25)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(stateData.vocs)}
                    </td>
                    <td className="font-mono-xs text-right">
                      {formatNumber(stateData.nh3)}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
