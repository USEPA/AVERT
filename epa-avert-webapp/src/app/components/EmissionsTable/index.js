// @flow

import React from 'react';

const formatOutput = (number) => {
  return Math.round(number).toLocaleString();
};

type Data = {
  state: string,
  so2: number,
  nox: number,
  co2: number,
  pm25: number,
};

type Props = {
  heading: string,
  // redux connected props
  status: string,
  data: Array<Data>,
  states: Array<string>,
};

const EmissionsTable = (props: Props) => {
  // rendering is ready when state emissions status is 'complete'
  const readyToRender = props.status === 'complete';

  let Table;
  // conditionally re-define Table when ready to render
  if (readyToRender) {
    Table = (
      <table className='avert-table'>
        <thead>
          <tr>
            <th>State</th>
            <th>SO<sub>2</sub> (lbs)</th>
            <th>NO<sub>X</sub> (lbs)</th>
            <th>CO<sub>2</sub> (tons)</th>
            <th>PM<sub>2.5</sub> (lbs)</th>
          </tr>
        </thead>
        <tbody>
          {props.states.map((state, index) => {
            return (
              <tr key={index}>
                <td>{state}</td>
                <td className="avert-table-data">{formatOutput(props.data[index].so2)}</td>
                <td className="avert-table-data">{formatOutput(props.data[index].nox)}</td>
                <td className="avert-table-data">{formatOutput(props.data[index].co2)}</td>
                <td className="avert-table-data">{formatOutput(props.data[index].pm25)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  return (
    <div className='avert-emissions-table'>
      <h3 className='avert-heading-three'>{props.heading}</h3>
      {Table}
    </div>
  );
};

export default EmissionsTable;
