import React from 'react';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { StateChange } from 'app/redux/reducers/displacement';
// config
import { StateId } from 'app/config';

function EmissionsTable() {
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const combinedStateChanges = useTypedSelector(
    ({ displacement }) => displacement.combinedStateChanges,
  );

  // convert object of combined state changes to an array of changes by state
  const changesByState: StateChange[] = [];
  for (const stateId in combinedStateChanges) {
    const stateChange = combinedStateChanges[stateId as StateId];
    if (stateChange) changesByState.push(stateChange);
  }

  if (status !== 'complete') return null;

  return (
    <table className="avert-table">
      <thead>
        <tr>
          <th>State</th>
          <th>
            SO<sub>2</sub> (lbs)
          </th>
          <th>
            NO<sub>X</sub> (lbs)
          </th>
          <th>
            CO<sub>2</sub> (tons)
          </th>
          <th>
            PM<sub>2.5</sub> (lbs)
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
                <td className="avert-table-data">
                  {Math.round(stateData.so2).toLocaleString()}
                </td>
                <td className="avert-table-data">
                  {Math.round(stateData.nox).toLocaleString()}
                </td>
                <td className="avert-table-data">
                  {Math.round(stateData.co2).toLocaleString()}
                </td>
                <td className="avert-table-data">
                  {Math.round(stateData.pm25).toLocaleString()}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default EmissionsTable;
