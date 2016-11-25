import React, { PropTypes } from 'react';

const EmissionsTable = (props) => (
  <div className='avert-emissions-table'>
    <h3 className='avert-heading-three'>{ props.heading }</h3>

    <table className='avert-table'>
      <thead>
        <tr>
          <th>{'State'}</th>
          <th>{'SO'}<sub>{'2'}</sub>{' (lbs)'}</th>
          <th>{'NO'}<sub>{'X'}</sub>{' (lbs)'}</th>
          <th>{'CO'}<sub>{'2'}</sub>{' (tons)'}</th>
        </tr>
      </thead>
      <tbody>
        {props.states.map((state, index) => {
          return (
            <tr key={ index }>
              <td>{ state }</td>
              <td>{ props.data[index].so2 }</td>
              <td>{ props.data[index].nox }</td>
              <td>{ props.data[index].co2 }</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

EmissionsTable.propTypes = {
  heading: PropTypes.string.isRequired,
  //data: PropTypes.object.isRequired,
  //data: PropTypes.array.isRequired,
};

export default EmissionsTable;
