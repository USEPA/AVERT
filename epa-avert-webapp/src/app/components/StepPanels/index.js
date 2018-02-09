// @flow

import React from 'react';
// components
import LoadingIcon from 'app/components/LoadingIcon';
import Panel from 'app/components/Panel';
import PanelBody from 'app/components/PanelBody';
import PanelFooter from 'app/components/PanelFooter/container.js';
import RegionList from 'app/components/RegionList/container.js';
import RegionMap from 'app/components/RegionMap';
import EEREInputs from 'app/components/EEREInputs/container.js';
import EEREChart from 'app/components/EEREChart/container.js';
import DisplacementsTable from 'app/components/DisplacementsTable/container.js';
import EmissionsTable from '../../containers/EmissionsTableContainer';
import EmissionsChart from '../../containers/EmissionsChartContainer';
import DataDownload from 'app/components/DataDownload';
// styles
import './styles.css';

type Props = {
  activePanel: number,
  // redux connected props
  loading: boolean,
  modalOverlay: boolean,
  activeModalId: number,
  loadingProgress: number,
  softValid: boolean,
  onClickOutsideModal: (number) => void,
  onClickDataDownload: () => void,
};

const StepPanels = (props: Props) => {
  const loadingClass = props.loading ? ' avert-loading-overlay' : '';
  const modalClass = props.modalOverlay ? ' avert-modal-overlay' : '';

  let ProgressBar;
  // conditionally re-define ProgressBar if on third panel
  if (props.activePanel === 3) {
    ProgressBar = (
      <div>
        <progress className='avert-loading-progress' value={props.loadingProgress} max='6'>
          {props.loadingProgress * 100 / 6}%
        </progress>
        <p className='avert-loading-info'>These calculations may take several minutes.</p>
      </div>
    );
  }

  let LoadingIndicator;
  // conditionally re-define LoadingIndicator when loading prop exists
  if (props.loading) {
    LoadingIndicator = (
      <div className='avert-loading-indicator'>
        <LoadingIcon />
        <p className='avert-loading-heading'>LOADING...</p>
        {ProgressBar}
      </div>
    );
  }

  let ValidationWarning;
  // conditionally re-define ValidationWarning when softValid prop is false
  if (!props.softValid) {
    ValidationWarning = (
      <p className='avert-message-top avert-validation-warning'>
        <span className='avert-message-heading'>WARNING:</span>
        The proposed EE/RE programs would collectively displace more than 15% of regional fossil generation in one or more hours of the year. AVERT works best with displacements of 15% or less, as it is designed to simulate marginal operational changes in load, rather than large-scale changes that may change fundamental dynamics.
      </p>
    );
  }

  const clickedOutsideModal = (event) => {
    if (event.target.classList.contains('avert-modal-overlay')) return true;
    return false;
  };

  return (
    <div className={`avert-steps${loadingClass}${modalClass}`}
     onClick={(event) => {
       if (props.modalOverlay && clickedOutsideModal(event)) {
         props.onClickOutsideModal(props.activeModalId);
       }
     }}
     onKeyDown={(event) => {
       if (props.modalOverlay && event.keyCode === 27) {
         props.onClickOutsideModal(props.activeModalId);
       }
     }}
    >
      {LoadingIndicator}

      <Panel active={props.activePanel === 1}>
        <PanelBody heading='Select Region'>
          <p>AVERT splits the contiguous 48 states into 10 regions. AVERT regions are aggregated based on EPA’s <a href='https://www.epa.gov/energy/egrid'>eGRID subregions</a>. Select a region for analysis by either using the dropdown menu or clicking the map. Selecting a region loads the power plants operating within each region and region-specific wind and solar capacity data.</p>

          <RegionList />

          <RegionMap />

          <p className='avert-small-text'>The online version of AVERT can run analyses using 2015 emissions and generation data. The Excel version of AVERT (available for download <a href="https://www.epa.gov/statelocalclimate/download-avert">here</a>) allows analyses for years 2007–2015 or for a future year scenario.</p>
        </PanelBody>

        <PanelFooter nextButtonText='Set EE/RE Impacts'/>
      </Panel>


      <Panel active={props.activePanel === 2}>
        <PanelBody heading='Set Energy Efficiency and Renewable Energy Impacts'>
          <p>AVERT quantifies avoided emissions and electricity generation displaced by EE/RE policies and programs. Specify the impacts of EE/RE programs below, and AVERT will use these inputs to generate results. For more information about inputs, please consult the <a href='https://www.epa.gov/statelocalclimate/avert-user-manual-0'>AVERT user manual</a> or click the <span className="avert-modal-link"></span> icon for each program type below.</p>

          <p className="avert-small-text">Five types of programs are listed below (A through E). You can enter impacts for any or all types of programs, in any combination. AVERT will calculate cumulative impacts.</p>

          <EEREInputs />

          <EEREChart heading='EE/RE profile based on values entered:'/>
        </PanelBody>

        <PanelFooter prevButtonText='Back to Region' nextButtonText='Get Results'/>
      </Panel>


      <Panel active={props.activePanel === 3}>
        <PanelBody heading='Results: Avoided Regional, State, and County-Level Emissions'>
          {ValidationWarning}

          <DisplacementsTable heading='Annual Regional Displacements'/>

          <EmissionsTable heading='Annual State Emission Changes'/>

          <EmissionsChart heading='Monthly Emission Changes'/>

          <DataDownload heading='Data Download' onClick={() => props.onClickDataDownload()}/>
        </PanelBody>

        <PanelFooter prevButtonText='Back to EE/RE Impacts' nextButtonText='Reset Region'/>
      </Panel>
    </div>
  );
};

export default StepPanels;
