import { Fragment } from 'react';
import { useTypedSelector } from 'app/redux/index';
import type {
  EmissionsData,
  EmissionsMonthlyData,
} from 'app/redux/reducers/results';
import type { StateId } from 'app/config';
import { states as statesConfig } from 'app/config';

function formatNumber(number: number) {
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

/**
 * Sum the emissions monthly data into total annual state changes for each
 * pollutant.
 */
function setAnnualStateEmissionsChanges(
  emissionsMonthlyData: EmissionsMonthlyData,
) {
  if (!emissionsMonthlyData) return [];

  const { states } = emissionsMonthlyData;

  const result = Object.entries(states).reduce(
    (array, [stateKey, stateData]) => {
      const stateId = stateKey as StateId;

      const state = {
        id: stateId,
        name: statesConfig[stateId].name,
        generation: 0,
        so2: 0,
        nox: 0,
        co2: 0,
        pm25: 0,
        vocs: 0,
        nh3: 0,
      };

      Object.entries(stateData).forEach(([key, annualData]) => {
        const pollutant = key as keyof EmissionsData;

        Object.values(annualData).forEach((monthlyData) => {
          state[pollutant] += monthlyData.postEere - monthlyData.original;
        });
      });

      array.push(state);

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
  const emissionsMonthlyData = useTypedSelector(
    ({ results }) => results.emissionsMonthlyData,
  );

  const annualStateEmissionsChanges =
    setAnnualStateEmissionsChanges(emissionsMonthlyData);

  if (!emissionsMonthlyData) return null;

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
            {annualStateEmissionsChanges
              .sort((stateA, stateB) => stateA.name.localeCompare(stateB.name))
              .map((stateData) => {
                return (
                  <Fragment key={stateData.id}>
                    <tr>
                      <td rowSpan={3}>{stateData.name}</td>
                      <td className="width-1px text-no-wrap text-right">
                        <small>From</small> Fossil Generation
                      </td>
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

                    <tr>
                      <td className="width-1px text-no-wrap text-right">
                        <small>From</small> Vehicles
                      </td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                    </tr>

                    <tr className="border-width-1 border-top-width-0 border-x-width-0 border-solid">
                      <td className="width-1px text-no-wrap text-right">
                        Net Change
                      </td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
                      <td className="font-mono-xs text-right">{'---'}</td>
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
