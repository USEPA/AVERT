import React, { PropTypes } from 'react';

const EmissionsTable = (props) => (
  <div className='avert-emissions-table'>
    <h3 className='avert-heading-three'>{ props.heading }</h3>

    <table className='avert-table'>
      <thead>
        <tr>
          <th>State</th>
          <th>SO<sub>2</sub> (lbs)</th>
          <th>NO<sub>X</sub> (lbs)</th>
          <th>CO<sub>2</sub> (tons)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>(State Name)</td>
          <td>(number)</td>
          <td>(number)</td>
          <td>(number)</td>
        </tr>
      </tbody>
    </table>
  </div>
);

EmissionsTable.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default EmissionsTable;
