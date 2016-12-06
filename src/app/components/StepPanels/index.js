import React, { PropTypes } from 'react';
// components
import LoadingIcon from '../LoadingIcon';
import Panel from '../Panel';
import PanelBody from '../PanelBody';
import RegionMap from '../RegionMap';
import DataDownload from '../DataDownload';
// containers
import RegionListContainer from '../../containers/RegionListContainer';
import PanelFooterContainer from '../../containers/PanelFooterContainer';
import EEREInputsContainer from '../../containers/EEREInputsContainer';
import EEREChartContainer from '../../containers/EEREChartContainer';
import DisplacementsTableContainer from '../../containers/DisplacementsTableContainer';
import EmissionsTableContainer from '../../containers/EmissionsTableContainer';
import EmissionsChartContainer from '../../containers/EmissionsChartContainer';
// styles
import './styles.css';

const StepPanels = (props) => {
  const loadingClass = props.loading ? 'avert-loading-overlay' : '';

  let loadingIndicator = null;
  // conditionally re-define loadingIndicator when loading prop exists
  if (props.loading) {
    loadingIndicator = (
      <div className="avert-loading-indicator">
        <LoadingIcon />
        <p className="avert-loading-text">{'LOADING...'}</p>
      </div>
    );
  }

  let validationWarning = null;
  // conditionally re-define warning when softValid prop is false
  if (!props.softValid) {
    validationWarning = (
      <p className='avert-message-top avert-validation-warning'>
        <span className='avert-message-heading'>{'WARNING:'}</span>
        {'The proposed EE/RE programs would collectively displace more than 15% of regional fossil generation in one or more hours of the year. AVERT works best with displacements of 15% or less, as it is designed to simulate marginal operational changes in load, rather than large-scale changes that may change fundamental dynamics.'}
      </p>
    );
  }

  return (
    <div className={`avert-steps ${loadingClass}`}>
      { loadingIndicator }

      <Panel active={ props.activePanel === 1 }>
        <PanelBody heading='Select Region'>
          <p>
            {'The contiguous 48 states are split into 10 AVERT regions, which are aggregates of EPA’s '}
              <a href='https://www.epa.gov/energy/egrid'>{'eGRID subregions'}</a>
            {'. Select a region for analysis by either using the dropdown menu or clicking the map. Selecting a region loads region-specific wind and solar capacity data and the power plants operating within each region.'}
          </p>

          <RegionListContainer />

          <RegionMap />

          {/*
          <select
            value={ store.getState().regions.year }
            onChange={(e) => store.dispatch(updateYear(e.target.value))}
          >
            <option value="" disabled defaultValue>Select Year</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
          </select>
          */}

          <p className='avert-small-text'>
            {'The online version of AVERT can run analyses for 2015 only. The Excel version of AVERT (available for download '}
              <a href="https://www.epa.gov/statelocalclimate/download-avert">{'here'}</a>
            {') allows analyses for years 2007–2015 or for a future year scenario.'}
          </p>
          <em className="avert-small-text" onClick={() => { props.onClickDebug() }}>
            (Debug)
          </em>
        </PanelBody>

        <PanelFooterContainer nextButtonText='Set EE/RE Impacts' />
      </Panel>



      <Panel active={ props.activePanel === 2 }>
        <PanelBody heading='Set Energy Efficiency and Renewable Energy Impacts'>
          <p>
            {'AVERT quantifies avoided emissions and electricity generation displaced by EE/RE policies and programs. Specify the impacts of EE/RE programs below, and AVERT will use these inputs to generate results. For more information about inputs, please consult the '}
              <a href='https://www.epa.gov/statelocalclimate/avert-user-manual-0'>{'AVERT user manual'}</a>
            {'.'}
          </p>

          <p className="avert-small-text">
            {'Five types of programs are listed below (A through E). You can enter impacts for any or all types of programs, in any combination. AVERT will calculate cumulative impacts.'}
          </p>

          <EEREInputsContainer />

          <EEREChartContainer heading='EE/RE profile based on values entered:' />
        </PanelBody>

        <PanelFooterContainer prevButtonText='Back to Region' nextButtonText='Get Results' />
      </Panel>



      <Panel active={ props.activePanel === 3 }>
        <PanelBody heading='Results: Avoided Regional, State, and County-Level Emissions'>
          { validationWarning }

          <DisplacementsTableContainer heading='Annual Regional Displacements' />

          <EmissionsTableContainer heading='Annual State Emission Changes' />

          <EmissionsChartContainer heading='Monthly Emission Changes' />

          <DataDownload heading='Data Download' />
        </PanelBody>

        <PanelFooterContainer prevButtonText='Back to EE/RE Impacts' nextButtonText='Reset Region' lastPanel />
      </Panel>
    </div>
  );
};

StepPanels.propTypes = {
  activePanel: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  // softValid: PropTypes.string,
};

export default StepPanels;
