import React from 'react';
import { useDispatch } from 'react-redux';
// components
import LoadingIcon from 'app/components/LoadingIcon/LoadingIcon';
import Panel from 'app/components/Panel';
import PanelBody from 'app/components/PanelBody/PanelBody';
import PanelFooter from 'app/components/PanelFooter/PanelFooter';
import RegionsList from 'app/components/RegionsList';
import RegionMap from 'app/components/RegionMap/RegionMap';
// import StatesMap from 'app/components/StatesMap';
import EEREInputs from 'app/components/EEREInputs/EEREInputs';
import UnitConversion from 'app/components/UnitConversion/UnitConversion';
import EEREChart from 'app/components/EEREChart/EEREChart';
import DisplacementsTable from 'app/components/DisplacementsTable/DisplacementsTable';
import EmissionsTable from 'app/components/EmissionsTable';
import EmissionsChart from 'app/components/EmissionsChart/EmissionsChart';
import DataDownload from 'app/components/DataDownload';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { toggleModalOverlay, resetActiveModal } from 'app/redux/reducers/panel';
// hooks
import { useSelectedRegions } from 'app/hooks';
// styles
import './styles.css';

function StepPanels() {
  const dispatch = useDispatch();

  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);
  const loading = useTypedSelector(({ panel }) => panel.loading);
  const loadingProgress = useTypedSelector(
    ({ panel }) => panel.loadingProgress,
  );
  const modalOverlay = useTypedSelector(({ panel }) => panel.modalOverlay);
  const activeModalId = useTypedSelector(({ panel }) => panel.activeModalId);
  const softValid = useTypedSelector(({ eere }) => eere.softLimit.valid);
  const serverCalcError = useTypedSelector(
    ({ displacement }) => displacement.status === 'error',
  );

  // TODO: determine how to handle when multiple regions are selected
  const regions = useSelectedRegions();
  const regionName = regions[0]?.name;

  const classes = ['avert-steps'];
  if (loading || serverCalcError) {
    classes.push('avert-dark-overlay');
  }
  if (modalOverlay) {
    classes.push('avert-modal-overlay');
  }

  return (
    <div
      className={classes.join(' ')}
      onClick={(ev) => {
        if (!modalOverlay) return;
        const target = ev.target as HTMLDivElement;
        if (target.classList.contains('avert-modal-overlay')) {
          dispatch(resetActiveModal(activeModalId));
          dispatch(toggleModalOverlay());
        }
      }}
      onKeyDown={(ev) => {
        if (!modalOverlay) return;
        if (ev.keyCode === 27 /* escape key */) {
          dispatch(resetActiveModal(activeModalId));
          dispatch(toggleModalOverlay());
        }
      }}
    >
      {
        // conditionally display loading indicator
        loading && !serverCalcError && (
          <div className="avert-overlay-text">
            <LoadingIcon />
            <p className="avert-overlay-heading">LOADING...</p>
            {
              // conditionally display progress bar
              activeStep === 3 && (
                <div>
                  <progress
                    className="avert-loading-progress"
                    value={loadingProgress}
                    max="6"
                  >
                    {(loadingProgress * 100) / 6}%
                  </progress>
                  <p className="avert-overlay-info">
                    These calculations may take several minutes.
                  </p>
                </div>
              )
            }
          </div>
        )
      }

      {
        // conditionally display web server error
        serverCalcError && (
          <div className="avert-overlay-text">
            <p className="avert-overlay-heading">Web Server Error</p>
            <p className="avert-overlay-info">Please try reloading the page.</p>
          </div>
        )
      }

      <Panel active={activeStep === 1}>
        <PanelBody heading="Select Region">
          <p>
            AVERT splits the contiguous 48 states into 14 regions. AVERT regions
            are aggregated based on EPA’s{' '}
            <a href="https://www.epa.gov/energy/egrid" target="_parent">
              eGRID subregions
            </a>
            . Select a region for analysis by either using the dropdown menu or
            clicking the map. Selecting a region loads the power plants
            operating within each region and region-specific wind and solar
            capacity data.
          </p>

          <RegionsList />
          <RegionMap />

          {/* <StatesMap /> */}

          <p className="avert-small-text">
            The online version of AVERT can run analyses using 2019 emissions
            and generation data. The Excel version of AVERT (available for
            download{' '}
            <a
              href="https://www.epa.gov/statelocalenergy/download-avert"
              target="_parent"
            >
              here
            </a>
            ) allows analyses for years 2017–2019 or for a future year scenario.
          </p>
        </PanelBody>

        <PanelFooter nextButtonText="Set EE/RE Impacts" />
      </Panel>

      <Panel active={activeStep === 2}>
        <PanelBody heading="Set Energy Efficiency and Renewable Energy Impacts">
          <UnitConversion />

          <p>
            AVERT quantifies avoided emissions and electricity generation
            displaced by EE/RE policies and programs. Specify the impacts of
            EE/RE programs below, and AVERT will use these inputs to generate
            results. For more information about inputs, please consult the{' '}
            <a
              href="https://www.epa.gov/statelocalenergy/avert-user-manual"
              target="_parent"
            >
              AVERT user manual
            </a>{' '}
            or click the <span className="avert-modal-link" /> icon for each
            program type below.
          </p>

          <p className="avert-small-text">
            Several types of programs are listed below (A through D). You can
            enter impacts for any or all types of programs, in any combination.
            AVERT will calculate cumulative impacts.
          </p>

          <EEREInputs />
          <EEREChart />
        </PanelBody>

        <PanelFooter
          prevButtonText="Back to Region"
          nextButtonText="Get Results"
        />
      </Panel>

      <Panel active={activeStep === 3}>
        <PanelBody heading="Results: Avoided Regional, State, and County-Level Emissions">
          {
            // conditionally display validation warning
            !softValid && (
              <p className="avert-message-top avert-validation-warning">
                <span className="avert-message-heading">WARNING:</span>
                The proposed EE/RE programs would collectively displace more
                than 15% of regional fossil generation in one or more hours of
                the year. AVERT works best with displacements of 15% or less, as
                it is designed to simulate marginal operational changes in load,
                rather than large-scale changes that may change fundamental
                dynamics.
              </p>
            )
          }

          <DisplacementsTable
            heading={`Annual Regional Displacements: ${regionName} Region`}
          />

          <EmissionsTable
            heading={`Annual State Emission Changes: ${regionName} Region`}
          />

          <EmissionsChart
            heading={`Monthly Emission Changes: ${regionName} Region`}
          />

          <DataDownload />
        </PanelBody>

        <PanelFooter
          prevButtonText="Back to EE/RE Impacts"
          nextButtonText="Reset Region"
        />
      </Panel>
    </div>
  );
}

export default StepPanels;
