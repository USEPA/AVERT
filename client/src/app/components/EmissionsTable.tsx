import { useTypedSelector } from 'app/redux/index';
import { StateChange } from 'app/redux/reducers/displacement';
import { StateId } from 'app/config';

function formatNumber(number: number) {
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

export function EmissionsTable() {
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const annualStateEmissionChanges = useTypedSelector(
    ({ displacement }) => displacement.annualStateEmissionChanges,
  );

  // convert object of annual state changes to an array of changes by state
  const changesByState: StateChange[] = [];
  for (const stateId in annualStateEmissionChanges) {
    const stateChange = annualStateEmissionChanges[stateId as StateId];
    if (stateChange) changesByState.push(stateChange);
  }

  if (status !== 'complete') return null;

  return (
    <div className="overflow-auto">
      <div className="avert-table-container">
        <table className="avert-table width-full">
          <thead>
            <tr>
              <th>State</th>
              <th>
                SO<sub>2</sub> <small>(lb)</small>
              </th>
              <th>
                NO<sub>X</sub> <small>(lb)</small>
              </th>
              <th>
                CO<sub>2</sub> <small>(tons)</small>
              </th>
              <th>
                PM<sub>2.5</sub> <small>(lb)</small>
              </th>
              <th>
                VOCs <small>(lb)</small>
              </th>
              <th>
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
