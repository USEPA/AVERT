import React, { PropTypes } from 'react';
// styles
import './styles.css';

// include details pollyfill for IE/Edge
const details = require('../../../assets/details-pollyfill');

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
}) => {
  console.warn('Errors:', errors, 'Soft val:', softTopExceedanceValue, 'Hard val:', hardTopExceedanceValue);

  const displayError = (errors, inputField) => {
    if (errors.indexOf(inputField) !== -1) {
      return(
        <span className='avert-input-error'>{`Errors in ${inputField}`}</span>
      );
    }
  };

  return(
    <div>
      <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#eee', }}>
        <p className='avert-small-text' style={{ marginTop: '0', }}>
          {'Is First Pass Valid?'} <b>{ valid ? 'Yes' : 'No' }</b>
          <br />
          {'Did second pass stay under 15%?'} <b>{ softValid ? 'Yes': 'No' }</b>
          {` (Value: ${softTopExceedanceValue}, Hour: ${softTopExceedanceHour})`}
          <br />
          {'Did second pass stay under 30%?'} <b>{ hardValid ? 'Yes': 'No' }</b>
        {` (Value: ${hardTopExceedanceValue}, Hour: ${hardTopExceedanceHour})`}
        </p>
      </div>

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
                { displayError(errors, 'constantMw') }
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
                { displayError(errors, 'annualGwh') }
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
                { displayError(errors, '___?___') }
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
                { displayError(errors, 'reduction') }
                { displayError(errors, 'topHours') }
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
              { displayError(errors, 'windCapacity') }
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
              { displayError(errors, 'utilitySolar') }
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
              { displayError(errors, 'rooftopSolar') }
            </p>
          </section>
        </details>
      </div>
    </div>
  );
};

EEREInputs.propTypes = {
  // errors: PropTypes.string,
  // valid: PropTypes.string,
  // softValid: PropTypes.string,
  // softTopExceedanceValue: PropTypes.string,
  // softTopExceedanceHour: PropTypes.string,
  // hardValid: PropTypes.string,
  // hardTopExceedanceValue: PropTypes.string,
  // hardTopExceedanceHour: PropTypes.string,
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
};

export default EEREInputs;
