import React from 'react';
// reducers
import { useTypedSelector } from 'app/redux/index';

type Props = {
  heading: string;
};

function EmissionsTable({ heading }: Props) {
  const status = useTypedSelector(
    ({ stateEmissions }) => stateEmissions.status,
  );
  const stateIds = useTypedSelector(
    ({ stateEmissions }) => stateEmissions.stateIds,
  );
  const data = useTypedSelector(({ stateEmissions }) => stateEmissions.data);

  // rendering is ready when state emissions status is 'complete'
  const readyToRender = status === 'complete';

  let table;
  // conditionally re-define table when ready to render
  if (readyToRender) {
    table = (
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

  return (
    <div className="avert-emissions-table">
      <h3 className="avert-heading-three">{heading}</h3>
      {table}
    </div>
  );
}

export default EmissionsTable;
