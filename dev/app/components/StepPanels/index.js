import React, { PropTypes } from 'react';
// components
import Panel from '../Panel';
import PanelBody from '../PanelBody';
import RegionItem from '../RegionItem';
import RegionMap from '../RegionMap';
import EEREInputs from '../EEREInputs';
import EEREChart from '../EEREChart';
import DisplacementsTable from '../DisplacementsTable';
import EmissionsTable from '../EmissionsTable';
import DataDownload from '../DataDownload';
// containers
import RegionListContainer from '../../containers/RegionListContainer';
import PanelFooterContainer from '../../containers/PanelFooterContainer';
import EmissionsChartContainer from '../../containers/EmissionsChartContainer';
// styles
import './styles.css';

const StepPanels = (props) => (
  <div className='avert-steps'>
    <Panel active={ props.activePanel === 1 ? true : false }>
      <PanelBody heading='Select Region'>
        <p>The contiguous 48 states are split into 10 AVERT regions, which are aggregates of EPA’s <a href='https://www.epa.gov/energy/egrid'>eGRID subregions</a>. Select a region for analysis by either using the dropdown menu or clicking the map. Selecting a region loads region-specific wind and solar capacity data and the power plants operating within each region.</p>

        <RegionListContainer>
          <RegionItem name='California' />
          <RegionItem name='Great Lakes / Mid-Atlantic' />
          <RegionItem name='Lower Midwest' />
          <RegionItem name='Northeast' />
          <RegionItem name='Northwest' />
          <RegionItem name='Rocky Mountains' />
          <RegionItem name='Southeast' />
          <RegionItem name='Southwest' />
          <RegionItem name='Texas' />
          <RegionItem name='Upper Midwest' />
        </RegionListContainer>

        <RegionMap />

        <p className="avert-small-text">The online version of AVERT can run analyses for 2015 only. The Excel version of AVERT (available for download <a href="https://www.epa.gov/statelocalclimate/download-avert">here</a>) allows analyses for years 2007–2015 or for a future year scenario.</p>
      </PanelBody>

      <PanelFooterContainer nextButtonText='Set EE/RE Impacts' />
    </Panel>



    <Panel active={ props.activePanel === 2 ? true : false }>
      <PanelBody heading='Set Energy Efficiency and Renewable Energy Impacts'>
        <p>AVERT quantifies avoided emissions and electricity generation displaced by EE/RE policies and programs. Specify the impacts of EE/RE programs below, and AVERT will use these inputs to generate results. For more information about inputs, please consult the <a href='https://www.epa.gov/statelocalclimate/avert-user-manual-0'>AVERT user manual</a>.</p>

        <p className="avert-small-text">Five types of programs are listed below (A through E). You can enter impacts for any or all types of programs, in any combination. AVERT will calculate cumulative impacts.</p>

        <EEREInputs />

        <EEREChart heading='EE/RE profile based on values entered:' />
      </PanelBody>

      <PanelFooterContainer prevButtonText='Back to Region' nextButtonText='Get Results' />
    </Panel>



    <Panel active={ props.activePanel === 3 ? true : false }>
      <PanelBody heading='Results: Avoided Regional, State, and County-Level Emissions'>
        <DisplacementsTable heading='Annual Regional Displacements' />

        <EmissionsTable heading='Annual State Emission Changes' />

        <EmissionsChartContainer heading='Monthly Emission Changes' />

        <DataDownload heading='Data Download' />
      </PanelBody>

      <PanelFooterContainer prevButtonText='Back to EE/RE Impacts' nextButtonText='Reset Region' lastPanel />
    </Panel>
  </div>
);

StepPanels.propTypes = {
  activePanel: PropTypes.number.isRequired,
};

export default StepPanels;
