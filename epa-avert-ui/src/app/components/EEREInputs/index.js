import React, {PropTypes} from 'react';
// containers
import EEREInputFieldContainer from '../../containers/EEREInputFieldContainer';
import TooltipContainer from '../../containers/TooltipContainer';
// utilities
import EereStatusEnum from '../../utils/EereStatusEnum';
// styles
import './styles.css';

const EEREInputs = ({
  limits,
  errors,
  valid,

  constantMw,
  annualGwh,
  broadProgram,
  reduction,
  topHours,
  windCapacity,
  utilitySolar,
  rooftopSolar,

  onConstantMwChange,
  onAnnualGwhChange,
  onBroadBasedProgramChange,
  onReductionChange,
  onTopHoursChange,
  onWindCapacityChange,
  onUtilitySolarChange,
  onRooftopSolarChange,

  eereStatus,
  onCalculateProfile,
}) => {
  // console.warn('Errors:', errors, 'Soft val:', softTopExceedanceValue, 'Hard val:', hardTopExceedanceValue);

  const displayError = (input) => {
    if ((errors.indexOf(input.name) !== -1) && (input.value.length > 0)) {
      let message;
      if (input.value >= 0) {
        message = (
          <span className='avert-input-error'>
            <span className='avert-input-error-range'>
              {`Please enter a number between 0 and ${input.max}.`}
            </span>
            {'This will help ensure that each of your proposed programs displaces no more than 15% of hourly regional fossil generation, which is the recommended limit for AVERT. AVERT is designed to simulate marginal operational changes in load, rather than large-scale changes that may change fundamental dynamics.'}
          </span>
        );
      } else {
        message = (
          <span className='avert-input-error'>
            <span className='avert-input-error-range'>
              {'Please enter a positive number.'}
            </span>
            {'If you wish to model a reverse EE/RE scenario (i.e., a negative number), use the Excel version of the AVERT Main Module.'}
          </span>
        );
      }

      return message;
    }
  };

  // array of field values saved to state; filter out fields that aren't empty; if any exist, assign false, else assign true
  const allFieldsEmpty = [constantMw, annualGwh, broadProgram, reduction, topHours, windCapacity, utilitySolar, rooftopSolar]
    .filter(field => field.length > 0).length <= 0;

  const disabledClass = (!valid || allFieldsEmpty || eereStatus === 'started') ?
    'avert-button-disabled' : '';

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
                <span className='avert-input-label'>
                  {'Reduce total annual generation by '}
                </span>
                <EEREInputFieldContainer
                  value={ annualGwh }
                  disabled={ constantMw ? true : false }
                  onChange={ onAnnualGwhChange }
                />
                <span className='avert-input-unit'>
                  {' GWh '}
                </span>

                <TooltipContainer id={1}>
                  {'Enter the total number of GWh expected to be saved in a single year. This option simply distributes the total annual savings evenly over all hours of the year. An industrial or refrigeration efficiency program may be well represented by a constant reduction across most hours of the year.'}
                </TooltipContainer>

                { displayError({name: 'annualGwh', value: annualGwh, max: limits.annualGwh}) }
              </li>

              <li>
                <span className='avert-input-label'>
                  {'Reduce hourly generation by '}
                </span>
                <EEREInputFieldContainer
                  value={ constantMw }
                  disabled={ annualGwh ? true : false }
                  onChange={ onConstantMwChange }
                />
                <span className='avert-input-unit'>
                  {' MW '}
                </span>

                <TooltipContainer id={2}>
                  {'“Reduce hourly generation” is identical in effect to reducing total annual generation. It allows you to enter a constant reduction for every hour of the year, in MW. An industrial or refrigeration efficiency program may be well represented by a constant reduction across most hours of the year.'}
                </TooltipContainer>

                { displayError({name: 'constantMw', value: constantMw, max: limits.constantMwh}) }
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
                <span className='avert-input-label'>
                  {'Broad-based program: Reduce generation by '}
                </span>
                <EEREInputFieldContainer
                  value={ broadProgram }
                  disabled={ reduction || topHours ? true : false }
                  onChange={ onBroadBasedProgramChange }
                />
                <span className='avert-input-unit'>
                  {' % in all hours '}
                </span>

                <TooltipContainer id={3}>
                  {'To simulate a broad-based efficiency program, enter an estimated load reduction fraction. This percentage reduction will be applied to all hours of the year.'}
                </TooltipContainer>

                { displayError({name: 'reduction', value: broadProgram, max: 15}) }
              </li>

              <li>
                <span className='avert-input-label'>
                  {'Targeted program: Reduce generation by '}
                </span>
                <EEREInputFieldContainer
                  value={ reduction }
                  disabled={ broadProgram ? true : false }
                  onChange={ onReductionChange }
                />
                <span className='avert-input-unit'>
                  {' % during the peak '}
                </span>
                <EEREInputFieldContainer
                  value={ topHours }
                  disabled={ broadProgram ? true : false }
                  onChange={ onTopHoursChange }
                />
                <span className='avert-input-unit'>
                  {' % of hours '}
                </span>

                <TooltipContainer id={4}>
                  {'To simulate a peak-reduction targeting program such as demand response, enter the load reduction (as a fraction of peaking load) that would be targeted, as well as the fraction of high-demand hours that the program is expected to affect (e.g., 1%–3%).'}
                </TooltipContainer>

                { displayError({name: 'reduction', value: reduction, max: 15}) }
                { displayError({name: 'topHours', value: topHours, max: 100}) }
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
              <span className='avert-input-label'>
                {'Total capacity: '}
              </span>
              <EEREInputFieldContainer
                value={ windCapacity }
                onChange={ onWindCapacityChange }
              />
              <span className='avert-input-unit'>
                {' MW '}
              </span>

              <TooltipContainer id={5}>
                {'Enter the total capacity (maximum potential electricity generation) for this type of resource, measured in MW. The model uses these inputs along with hourly capacity factors that vary by resource type and region.'}
              </TooltipContainer>

              { displayError({name: 'windCapacity', value: windCapacity, max: limits.renewables}) }
            </p>
          </section>
        </details>

        <details>
          <summary data-label='D'>Utility-scale solar photovoltaic</summary>
          <section>
            <p>
              <span className='avert-input-label'>
                {'Total capacity: '}
              </span>
              <EEREInputFieldContainer
                value={ utilitySolar }
                onChange={ onUtilitySolarChange }
              />
              <span className='avert-input-unit'>
                {' MW '}
              </span>

              <TooltipContainer id={6}>
                {'Enter the total capacity (maximum potential electricity generation) for this type of resource, measured in MW. The model uses these inputs along with hourly capacity factors that vary by resource type and region.'}
              </TooltipContainer>

              { displayError({name: 'utilitySolar', value: utilitySolar, max: limits.renewables}) }
            </p>
          </section>
        </details>

        <details>
          <summary data-label='E'>Distributed (rooftop) solar photovoltaic</summary>
          <section>
            <p>
              <span className='avert-input-label'>
                {'Total capacity: '}
              </span>
              <EEREInputFieldContainer
                value={ rooftopSolar }
                onChange={ onRooftopSolarChange }
              />
              <span className='avert-input-unit'>
                {' MW '}
              </span>

              <TooltipContainer id={7}>
                {'Enter the total capacity (maximum potential electricity generation) for this type of resource, measured in MW. The model uses these inputs along with hourly capacity factors that vary by resource type and region.'}
              </TooltipContainer>

              { displayError({name: 'rooftopSolar', value: rooftopSolar, max: limits.renewables}) }
            </p>
          </section>
        </details>
      </div>

      <p className='avert-impacts-button'>
        <a className={`avert-button ${disabledClass}`} href=''
           onClick={(e) => {
             e.preventDefault();
             // if valid prop (state) is true, calculate profile
             valid && onCalculateProfile();
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
  limits: PropTypes.object,
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
