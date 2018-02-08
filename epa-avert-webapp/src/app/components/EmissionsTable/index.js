import React from 'react';

const formatOutput = (number) => {
  return Math.round(number).toLocaleString();
};

const EmissionsTable = (props) => {
  // rendering is ready when state emissions status is 'complete'
  const readyToRender = props.state_status === 'complete';

  let table = null;
  // conditionally re-define chart when ready to render
  if (readyToRender) {
    table = (
      <div className='avert-emissions-table'>
        <h3 className='avert-heading-three'>{ props.heading }</h3>

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
                <tr key={ index }>
                  <td>{ state }</td>
                  <td className="avert-table-data">{ formatOutput(props.data[index].so2) }</td>
                  <td className="avert-table-data">{ formatOutput(props.data[index].nox) }</td>
                  <td className="avert-table-data">{ formatOutput(props.data[index].co2) }</td>
                  <td className="avert-table-data">{ formatOutput(props.data[index].pm25) }</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  return table;
};

// EmissionsTable.propTypes = {
//   heading: PropTypes.string.isRequired,
//   //state_status: PropTypes.string.isRequired,
//   //data: PropTypes.object.isRequired,
//   //data: PropTypes.array.isRequired,
// };

export default EmissionsTable;
