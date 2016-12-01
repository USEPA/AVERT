import React, { PropTypes } from 'react';
// utilities
import EereStatusEnum from '../../utils/EereStatusEnum';
// styles
import './styles.css';

const EEREInputs = ({
  errors,
  valid,
  softValid,
  softTopExceedanceValue,
  softTopExceedanceHour,
  hardValid,
  hardTopExceedanceValue,
  hardTopExceedanceHour,

  constantMw,
  annualGwh,
  //___?___
  reduction,
  topHours,
  windCapacity,
  utilitySolar,
  rooftopSolar,

  onConstantMwChange,
  onAnnualGwhChange,
  //on___?___Change,
  onReductionChange,
  onTopHoursChange,
  onWindCapacityChange,
  onUtilitySolarChange,
  onRooftopSolarChange,

  eereStatus,
  onCalculateProfile,
}) => {
  console.warn('Errors:', errors, 'Soft val:', softTopExceedanceValue, 'Hard val:', hardTopExceedanceValue);

  const displayError = (errors, inputField, maxVal, errorMessage) => {
    if (errors.indexOf(inputField) !== -1) {
      return (
        <span className='avert-input-error'>
          <span className='avert-input-error-range'>
            { errorMessage ? errorMessage :
              `Please enter a number between 0 and ${maxVal}.`
            }
          </span>
          { errorMessage ? '' :
            'This will help ensure that each of your proposed programs displaces no more than 15% of hourly regional fossil generation, which is the recommended limit for AVERT. AVERT is designed to simulate marginal operational changes in load, rather than large-scale changes that may fundamental dynamics.'
          }
        </span>
      );
    }
  };

  const disabledClass = !valid || eereStatus === 'started' ? 'avert-button-disabled' : '';

  return (
    <div>
      <div className='avert-details-block'>
        <header>
          <p>Energy Efficiency</p>
        </header>

        <details>
          <summary data-label='A'>Reductions spread evenly throughout the year</summary>
          <section>
            <p><strong>Choose one:</strong></p>
            <ul>
              <li>
                {'Reduce hourly generation by '}
                <input
                  type='text'
                  value={ constantMw }
                  onChange={(e) => {
                    onConstantMwChange(e.target.value)
                  }}
                />
                <span>{' MW'}</span>
                { displayError(errors, 'constantMw', 4783) }
              </li>

              <li>
                {'Reduce total annual generation by '}
                <input
                  type='text'
                  value={ annualGwh }
                  onChange={(e) => {
                    onAnnualGwhChange(e.target.value)
                  }}
                />
                <span>{' GWh'}</span>
                { displayError(errors, 'annualGwh', 41900) }
              </li>
            </ul>
          </section>
        </details>

        <details>
          <summary data-label='B'>Percentage reductions in some or all hours</summary>
          <section>
            <p><strong>Choose one:</strong></p>
            <ul>
              <li>
                {'Broad-based program: Reduce generation by '}
                <input
                  type='text'
                  value={ '___?___' }
                  onChange={(e) => {
                    //on___?___Change(e.target.value)
                  }}
                />
                <span>{' % in all hours'}</span>
                { displayError(errors, '___?___', 15) }
              </li>

              <li>
                {'Targeted program: Reduce generation by '}
                <input
                  type='text'
                  value={ reduction }
                  onChange={(e) => {
                    onReductionChange(e.target.value)
                  }}
                />
                <span>{' % during the peak '}</span>
                <input
                  type='text'
                  value={ topHours }
                  onChange={(e) => {
                    onTopHoursChange(e.target.value)
                  }}
                />
                <span>{' % of hours'}</span>
                { displayError(errors, 'reduction', false, 'Please enter a number from 0 to 100.') }
                { displayError(errors, 'topHours', false, 'Please enter a number from 0 to 100.') }
              </li>
            </ul>
          </section>
        </details>

        <header>
          <p>Renewable Energy</p>
        </header>

        <details>
          <summary data-label='C'>Wind</summary>
          <section>
            <p>
              {'Total capacity: '}
              <input
                type='text'
                value={ windCapacity }
                onChange={(e) => {
                  onWindCapacityChange(e.target.value)
                }}
              />
              <span>{' MW'}</span>
              { displayError(errors, 'windCapacity', 4780) }
            </p>
          </section>
        </details>

        <details>
          <summary data-label='D'>Utility-scale solar photovoltaic</summary>
          <section>
            <p>
              {'Total capacity: '}
              <input
                type='text'
                value={ utilitySolar }
                onChange={(e) => {
                  onUtilitySolarChange(e.target.value)
                }}
              />
              <span>{' MW'}</span>
              { displayError(errors, 'utilitySolar', 4780) }
            </p>
          </section>
        </details>

        <details>
          <summary data-label='E'>Distributed (rooftop) solar photovoltaic</summary>
          <section>
            <p>
              {'Total capacity: '}
              <input
                type='text'
                value={ rooftopSolar }
                onChange={(e) => {
                  onRooftopSolarChange(e.target.value)
                }}
              />
              <span>{' MW'}</span>
              { displayError(errors, 'rooftopSolar', 4780) }
            </p>
          </section>
        </details>
      </div>

      <p className='avert-centered'>
        <a className={`avert-button ${disabledClass}`} href=''
          onClick={(e) => {
            e.preventDefault();
            // if valid prop (state) is true, calculate profile
            if (valid) { onCalculateProfile() }
          }}
        >
          { EereStatusEnum[eereStatus].text }
        </a>
      </p>
    </div>
  );
};

EEREInputs.propTypes = {
  // errors: PropTypes.string,
  // valid: PropTypes.string,
  // topHours: PropTypes.string,
  // reduction: PropTypes.string,
  // annualGwh: PropTypes.string,
  // constantMw: PropTypes.string,
  // capacity: PropTypes.string,
  // utilitySolar: PropTypes.string,
  // rooftopSolar: PropTypes.string,
  onTopHoursChange: PropTypes.func,
  onReductionChange: PropTypes.func,
  onAnnualGwhChange: PropTypes.func,
  onConstantMwChange: PropTypes.func,
  onWindCapacityChange: PropTypes.func,
  onUtilitySolarChange: PropTypes.func,
  onRooftopSolarChange: PropTypes.func,

  eereStatus: PropTypes.string.isRequired,
  onCalculateProfile: PropTypes.func.isRequired,
};

export default EEREInputs;
