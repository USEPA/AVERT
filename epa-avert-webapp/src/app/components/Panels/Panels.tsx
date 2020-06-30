/** @jsx jsx */

import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { useDispatch } from 'react-redux';
// components
import LoadingIcon from 'app/components/LoadingIcon';
import PanelFooter from 'app/components/PanelFooter';
import RegionsList from 'app/components/RegionsList';
import RegionsMap from 'app/components/RegionsMap';
import StatesList from 'app/components/StatesList';
import StatesMap from 'app/components/StatesMap';
import EEREInputs from 'app/components/EEREInputs/EEREInputs';
import UnitConversion from 'app/components/UnitConversion';
import EEREChart from 'app/components/EEREChart';
import DisplacementsTable from 'app/components/DisplacementsTable';
import EmissionsTable from 'app/components/EmissionsTable';
import EmissionsChart from 'app/components/EmissionsChart';
import DataDownload from 'app/components/DataDownload';
import { modalLinkStyles } from 'app/components/Tooltip';
// reducers
import { useTypedSelector } from 'app/redux/index';
import { toggleModalOverlay, resetActiveModal } from 'app/redux/reducers/panel';
// hooks
import { useSelectedRegions } from 'app/hooks';
// styles
import './styles.css';

const Container = styled('div')<{ modalActive: boolean }>`
  ${({ modalActive }) => {
    if (modalActive) {
      return css`
        position: relative;

        &::after {
          content: '';
          position: absolute;
          z-index: 1;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-color: rgba(0, 0, 0, 0.5);
        }
      `;
    }
  }}
`;

const panelStyles = css`
  &[data-active='false'] {
    display: none;
  }
`;

const panelBodyStyles = css`
  padding: 1rem;
  border-top: 0.375rem solid rgb(0, 190, 230);
  min-height: 30rem;

  @media (min-width: 25em) {
    padding: 1.125rem;
  }

  @media (min-width: 30em) {
    padding: 1.25rem;
  }

  @media (min-width: 35em) {
    padding: 1.375rem;
  }

  @media (min-width: 40em) {
    padding: 1.5rem;
  }
`;

const panelHeadingStyles = css`
  margin-top: 0;
`;

function Panels() {
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

  return (
    <Container
      modalActive={modalOverlay}
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

      <section css={panelStyles} data-active={activeStep === 1}>
        <div css={panelBodyStyles}>
          <h2 css={panelHeadingStyles} className="avert-heading-two">
            Select Region
          </h2>

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
          <RegionsMap />

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
        </div>

        <div css={panelBodyStyles}>
          <h2 css={panelHeadingStyles} className="avert-heading-two">
            Select State
          </h2>

          <p>
            Select a state for analysis by either using the dropdown menu or
            clicking the map. Selecting a state loads the power plants operating
            within each region and region-specific wind and solar capacity data.
          </p>

          <StatesList />
          <StatesMap />

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
        </div>

        <PanelFooter nextButtonText="Set EE/RE Impacts" />
      </section>

      <section css={panelStyles} data-active={activeStep === 2}>
        <div css={panelBodyStyles}>
          <h2 css={panelHeadingStyles} className="avert-heading-two">
            Set Energy Efficiency and Renewable Energy Impacts
          </h2>

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
            or click the <span css={modalLinkStyles} /> icon for each program
            type below.
          </p>

          <p className="avert-small-text">
            Several types of programs are listed below (A through D). You can
            enter impacts for any or all types of programs, in any combination.
            AVERT will calculate cumulative impacts.
          </p>

          <EEREInputs />
          <EEREChart />
        </div>

        <PanelFooter
          prevButtonText="Back to Region"
          nextButtonText="Get Results"
        />
      </section>

      <section css={panelStyles} data-active={activeStep === 3}>
        <div css={panelBodyStyles}>
          <h2 css={panelHeadingStyles} className="avert-heading-two">
            Results: Avoided Regional, State, and County-Level Emissions
          </h2>

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
        </div>

        <PanelFooter
          prevButtonText="Back to EE/RE Impacts"
          nextButtonText="Reset Region"
        />
      </section>
    </Container>
  );
}

export default Panels;
