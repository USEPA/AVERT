import React, { PropTypes } from 'react';
// components
import Panel from '../Panel';
import PanelBody from '../PanelBody';
// containers
import PanelFooterContainer from '../../containers/PanelFooterContainer';
// styles
import './styles.css';

const Panels = (props) => (
  <div className='avert-steps'>
    <Panel active={ props.activePanel === 1 ? true : false }>
      <PanelBody heading='Select Region'>
        <p>The contiguous 48 states are split into 10 AVERT regions, which are aggregates of EPA’s <a href='https://www.epa.gov/energy/egrid'>eGRID subregions</a>. Select a region for analysis by either using the dropdown menu or clicking the map. Selecting a region loads region-specific wind and solar capacity data and the power plants operating within each region.</p>
      </PanelBody>

      <PanelFooterContainer nextButtonText='Set EE/RE Impacts' />
    </Panel>

    <Panel active={ props.activePanel === 2 ? true : false }>
      <PanelBody heading='Set EE/RE Impacts'>
        <p>AVERT quantifies avoided emissions and electricity generation displaced by EE/RE policies and programs. Specify the impacts of EE/RE programs below, and AVERT will use these inputs to generate results. For more information about inputs, please consult the <a href='https://www.epa.gov/statelocalclimate/avert-user-manual-0'>AVERT user manual</a>.</p>
      </PanelBody>

      <PanelFooterContainer prevButtonText='Back to Region' nextButtonText='Get Results' />
    </Panel>

    <Panel active={ props.activePanel === 3 ? true : false }>
      <PanelBody heading='Get Results'>
        <h3 className='avert-heading-three'>Annual Regional Displacements</h3>
      </PanelBody>

      <PanelFooterContainer prevButtonText='Back to EE/RE Impacts' nextButtonText='Reset Region' lastPanel />
    </Panel>
  </div>
);

Panels.propTypes = {
  activePanel: PropTypes.number.isRequired,
};

export default Panels;
