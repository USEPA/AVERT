import React from 'react';
// reducers
import { useTypedSelector } from 'app/redux/index';

function EmissionsTable() {
  const status = useTypedSelector(
    ({ stateEmissions }) => stateEmissions.status,
  );
  const stateIds = useTypedSelector(
    ({ stateEmissions }) => stateEmissions.stateIds,
  );
  const data = useTypedSelector(({ stateEmissions }) => stateEmissions.data);

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
        {stateIds.map((stateId) => {
          const state = data[stateId];
          return (
            <tr key={stateId}>
              <td>{state.name}</td>
              <td className="avert-table-data">
                {Math.round(state.so2).toLocaleString()}
              </td>
              <td className="avert-table-data">
                {Math.round(state.nox).toLocaleString()}
              </td>
              <td className="avert-table-data">
                {Math.round(state.co2).toLocaleString()}
              </td>
              <td className="avert-table-data">
                {Math.round(state.pm25).toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default EmissionsTable;
