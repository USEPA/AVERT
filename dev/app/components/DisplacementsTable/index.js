import React, { PropTypes } from 'react';

const DisplacementsTable = (props) => (
  <div className='avert-displacement-table'>
    <h3 className='avert-heading-three'>{ props.heading }</h3>

    <table className='avert-table'>
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>Original</th>
          <th>Post-EE/RE</th>
          <th>EE/RE Impacts</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Generation (MWh)</td>
          <td>(number)</td>
          <td>(number)</td>
          <td>(number)</td>
        </tr>
        <tr className='avert-table-group'>
          <td colSpan='4'>Total emissions of fossil EGUs</td>
        </tr>
        <tr>
          <td>SO<sub>2</sub> (lbs)</td>
          <td>(number)</td>
          <td>(number)</td>
          <td>(number)</td>
        </tr>
        <tr>
          <td>NO<sub>X</sub> (lbs)</td>
          <td>(number)</td>
          <td>(number)</td>
          <td>(number)</td>
        </tr>
        <tr>
          <td>CO<sub>2</sub> (tons)</td>
          <td>(number)</td>
          <td>(number)</td>
          <td>(number)</td>
        </tr>
        <tr className='avert-table-group'>
          <td colSpan='4'>Emission rates of fossil EGUs</td>
        </tr>
        <tr>
          <td>SO<sub>2</sub> (lbs/MWh)</td>
          <td>(number)</td>
          <td>(number)</td>
          <td>(number)</td>
        </tr>
        <tr>
          <td>NO<sub>X</sub> (lbs/MWh)</td>
          <td>(number)</td>
          <td>(number)</td>
          <td>(number)</td>
        </tr>
        <tr>
          <td>CO<sub>2</sub> (tons/MWh)</td>
          <td>(number)</td>
          <td>(number)</td>
          <td>(number)</td>
        </tr>
      </tbody>
    </table>

    <p className='avert-small-text'>Negative numbers indicate displaced generation and emissions. All results are rounded to the nearest hundred. A dash ('–') indicates a result greater than zero, but lower than the level of reportable significance.</p>
  </div>
);

DisplacementsTable.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default DisplacementsTable;
