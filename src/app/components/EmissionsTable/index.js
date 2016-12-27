import React, { PropTypes } from 'react';

//TODO: Refactor into util method
// const addCommas = (number) => {
//   if (typeof number === "undefined") { return '' };
//   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
// };
//
// const formatOutput = (number) => {
//   let output = Math.ceil(number / 10) * 10;
//   return addCommas(output);
// };
const formatOutput = (number) => {
  return Math.round(number).toLocaleString();
};

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
          console.log('........',state,index,props.data[index]);
          return (
            <tr key={ index }>
              <td>{ state }</td>
              <td>{ formatOutput(props.data[index].so2) }</td>
              <td>{ formatOutput(props.data[index].nox) }</td>
              <td>{ formatOutput(props.data[index].co2) }</td>
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
