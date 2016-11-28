import React, { PropTypes } from 'react';
// utilities
import statusEnum from '../../utils/statusEnum';

const DisplacementsTable = (props) => {
  const disabledClass = () => {
    if (statusEnum[props.annual_status].submitted) {
      return 'avert-button-disabled';
    } else {
      return '';
    }
  };

  //TODO: Refactor into util method
  const addCommas = (number) => {
    if (typeof number === "undefined") return '';

    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g,",");
  };

  const formatOutput = (number) => {

    if(number < 10 && number > -10) return '--';

    let output = Math.ceil(number / 10) * 10;
    return addCommas(output);
  };

  return (
    <div className='avert-displacement-table'>
      <h3 className='avert-heading-three'>{ props.heading }</h3>

      <a className={`avert-button ${disabledClass()}`} href=''
        style={{ marginBottom: '0.5rem', }}
        onClick={(e) => {
          e.preventDefault();
          props.onCalculateDisplacement()
        }}
      >
        { statusEnum[props.annual_status].lang }
      </a>

      <table className='avert-table'>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>{'Original'}</th>
            <th>{'Post-EE/RE'}</th>
            <th>{'EE/RE Impacts'}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{'Generation (MWh)'}</td>
            <td>{ formatOutput(props.data.generation.original) }</td>
            <td>{ formatOutput(props.data.generation.post) }</td>
            <td>{ formatOutput(props.data.generation.impact) }</td>
          </tr>
          <tr className='avert-table-group'>
            <td colSpan='4'>{'Total emissions of fossil EGUs'}</td>
          </tr>
          <tr>
            <td>{'SO'}<sub>{'2'}</sub>{' (lbs)'}</td>
            <td>{ formatOutput(props.data.totalEmissions.so2.original) }</td>
            <td>{ formatOutput(props.data.totalEmissions.so2.post) }</td>
            <td>{ formatOutput(props.data.totalEmissions.so2.impact) }</td>
          </tr>
          <tr>
            <td>{'NO'}<sub>{'X'}</sub>{' (lbs)'}</td>
            <td>{ formatOutput(props.data.totalEmissions.nox.original) }</td>
            <td>{ formatOutput(props.data.totalEmissions.nox.post) }</td>
            <td>{ formatOutput(props.data.totalEmissions.nox.impact) }</td>
          </tr>
          <tr>
            <td>{'CO'}<sub>{'2'}</sub>{' (tons)'}</td>
            <td>{ formatOutput(props.data.totalEmissions.co2.original) }</td>
            <td>{ formatOutput(props.data.totalEmissions.co2.post) }</td>
            <td>{ formatOutput(props.data.totalEmissions.co2.impact) }</td>
          </tr>
          <tr className='avert-table-group'>
            <td colSpan='4'>{'Emission rates of fossil EGUs'}</td>
          </tr>
          <tr>
            <td>{'SO'}<sub>{'2'}</sub>{' (lbs/MWh)'}</td>
            <td>{ props.data.emissionRates.so2.original }</td>
            <td>{ props.data.emissionRates.so2.post }</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>{'NO'}<sub>{'X'}</sub>{' (lbs/MWh)'}</td>
            <td>{ props.data.emissionRates.nox.original }</td>
            <td>{ props.data.emissionRates.nox.post }</td>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>{'CO'}<sub>{'2'}</sub>{' (tons/MWh)'}</td>
            <td>{ props.data.emissionRates.co2.original }</td>
            <td>{ props.data.emissionRates.co2.post }</td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <p className='avert-small-text'>Negative numbers indicate displaced generation and emissions. All results are
        rounded to the nearest ten. A dash ('–') indicates a result greater than zero, but lower than the level of
        reportable significance.</p>
    </div>
  );
};

DisplacementsTable.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default DisplacementsTable;
