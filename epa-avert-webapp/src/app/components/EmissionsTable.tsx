import React from 'react';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { StateChange } from 'app/redux/reducers/displacement';
// config
import { StateId } from 'app/config';

function EmissionsTable() {
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const stateChanges = useTypedSelector(
    ({ displacement }) => displacement.stateChanges,
  );

  // convert object of state changes to an array of state changes
  const statesData: StateChange[] = [];
  for (const stateId in stateChanges) {
    const stateChange = stateChanges[stateId as StateId];
    if (stateChange) statesData.push(stateChange);
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
        {statesData
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
