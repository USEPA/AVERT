/** @jsx jsx */

import React from 'react';
import { jsx, css } from '@emotion/core';
import styled from '@emotion/styled/macro';
import { useDispatch } from 'react-redux';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';
// components
import LoadingIcon from 'app/components/LoadingIcon';
import PanelFooter from 'app/components/PanelFooter';
import RegionsList from 'app/components/RegionsList';
import RegionsMap from 'app/components/RegionsMap';
import StatesList from 'app/components/StatesList';
import StatesMap from 'app/components/StatesMap';
import EEREInputs from 'app/components/EEREInputs';
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
import { selectGeography } from 'app/redux/reducers/geography';
// hooks
import {
  useSelectedRegion,
  useSelectedState,
  useSelectedStateRegions,
} from 'app/hooks';

type ContainerProps = {
  lightOverlay: boolean;
  darkOverlay: boolean;
};

const Container = styled('div')<ContainerProps>`
  border: 1px solid #aaa;

  ${({ lightOverlay, darkOverlay }) => {
    const overlayStyles = css`
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    `;

    if (lightOverlay) {
      return css`
        ${overlayStyles};

        &::after {
          z-index: 1;
          background-color: rgba(0, 0, 0, 0.5);
        }
      `;
    }

    if (darkOverlay) {
      return css`
        ${overlayStyles};

        &::after {
          background-color: rgba(0, 0, 0, 0.875);
        }
      `;
    }
  }}
`;

const overlayTextStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  text-align: center;
  color: #00bee6;

  svg {
    width: 100%;
    transform: scale(0.75);

    @media (min-width: 25em) {
      transform: scale(0.8125);
    }

    @media (min-width: 30em) {
      transform: scale(0.875);
    }

    @media (min-width: 35em) {
      transform: scale(0.9375);
    }

    @media (min-width: 40em) {
      transform: none;
    }
  }
`;

const overlayHeadingStyles = css`
  font-size: 1.25rem;
  font-weight: bold;

  @media (min-width: 25em) {
    font-size: 1.3125rem;
  }

  @media (min-width: 30em) {
    font-size: 1.375rem;
  }

  @media (min-width: 35em) {
    font-size: 1.4375rem;
  }

  @media (min-width: 40em) {
    font-size: 1.5rem;
  }
`;

const overlayInfoStyles = css`
  margin-top: 0.5rem;
  font-size: 0.75rem;

  @media (min-width: 25em) {
    font-size: 0.8125rem;
  }

  @media (min-width: 30em) {
    font-size: 0.875rem;
  }

  @media (min-width: 35em) {
    font-size: 0.9375rem;
  }

  @media (min-width: 40em) {
    font-size: 1rem;
  }
`;

const loadingProgressStyles = css`
  margin-top: 0.5rem;
  width: 100%;
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

const tabsStyles = css`
  [data-reach-tab-list] {
    display: flex;
    justify-content: space-between;
    background-color: transparent;
  }

  [data-reach-tab] {
    padding: 0.5625rem 1rem 0.6875rem;
    border-top: 0.375rem solid #ccc;
    border-bottom: 1px solid #aaa;
    width: 50%;
    font-weight: 700;
    font-size: 0.875rem;
    line-height: 1;
    color: #999;
    background-color: #eee;
    outline: none;
    user-select: none;

    @media (min-width: 25em) {
      font-size: 0.9375rem;
    }

    @media (min-width: 30em) {
      font-size: 1rem;
    }

    @media (min-width: 35em) {
      font-size: 1.0625rem;
    }

    @media (min-width: 40em) {
      font-size: 1.125rem;
    }

    &:hover {
      border-top-color: #999;
      color: #666;
    }

    &:first-of-type[data-selected] {
      border-right: 1px solid #aaa;
    }

    &:last-of-type[data-selected] {
      border-left: 1px solid #aaa;
    }

    &[data-selected] {
      border-top-color: rgb(0, 190, 230);
      border-bottom-color: white;
      color: rgb(0, 169, 204);
      background-color: white;
    }
  }

  [data-reach-tab-panel] {
    outline: none;

    p:first-of-type {
      margin-top: 0;
    }
  }

  [data-reach-tab-panels] {
    ${panelBodyStyles}
    border-top: none;
    min-height: 0;
  }
`;

const headingStyles = css`
  margin-top: 0;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 2px solid currentColor;
  font-size: 1rem;
  color: rgb(0, 169, 204);

  @media (min-width: 25em) {
    margin-bottom: 0.8125rem;
    font-size: 1.0625rem;
  }

  @media (min-width: 30em) {
    margin-bottom: 0.875rem;
    font-size: 1.125rem;
  }

  @media (min-width: 35em) {
    margin-bottom: 0.9375rem;
    font-size: 1.1875rem;
  }

  @media (min-width: 40em) {
    margin-bottom: 1rem;
    font-size: 1.25rem;
  }
`;

const subheadingStyles = css`
  font-size: 0.875rem;
  color: rgb(0, 127, 153);

  @media (min-width: 25em) {
    font-size: 0.9375rem;
  }

  @media (min-width: 30em) {
    font-size: 1rem;
  }

  @media (min-width: 35em) {
    font-size: 1.0625rem;
  }

  @media (min-width: 40em) {
    font-size: 1.125rem;
  }
`;

const messageStyles = css`
  position: relative;
  left: -1rem;
  width: calc(100% + 2rem);
  padding: 1rem;
  margin-top: 0;
  font-size: 0.625rem;

  @media (min-width: 25em) {
    left: -1.125rem;
    width: calc(100% + 2.25rem);
    padding: 1.125rem;
  }

  @media (min-width: 30em) {
    left: -1.25rem;
    width: calc(100% + 2.5rem);
    padding: 1.25rem;
    font-size: 0.6875rem;
  }

  @media (min-width: 35em) {
    left: -1.375rem;
    width: calc(100% + 2.75rem);
    padding: 1.375rem;
  }

  @media (min-width: 40em) {
    left: -1.5rem;
    width: calc(100% + 3rem);
    padding: 1.5rem;
    font-size: 0.75rem;
  }
`;

const topMessageStyles = css`
  ${messageStyles};
  top: 0;
`;

export const bottomMessageStyles = css`
  ${messageStyles};
  bottom: -1rem;

  @media (min-width: 25em) {
    bottom: -1.125rem;
  }

  @media (min-width: 30em) {
    bottom: -1.25rem;
  }

  @media (min-width: 35em) {
    bottom: -1.375rem;
  }

  @media (min-width: 40em) {
    bottom: -1.5rem;
  }
`;

export const messageHeadingStyles = css`
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
  font-size: 0.75rem;

  @media (min-width: 30em) {
    font-size: 0.8125rem;
  }

  @media (min-width: 40em) {
    font-size: 0.875rem;
  }
`;

export const vadidationErrorStyles = css`
  color: white;
  background-color: rgb(212, 57, 57);
`;

export const vadidationWarningStyles = css`
  background-color: rgb(249, 201, 114);
`;

function Panels() {
  const dispatch = useDispatch();

  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);
  const loading = useTypedSelector(({ panel }) => panel.loading);
  const loadingSteps = useTypedSelector(({ panel }) => panel.loadingSteps);
  const loadingProgress = useTypedSelector(
    ({ panel }) => panel.loadingProgress,
  );
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const modalOverlay = useTypedSelector(({ panel }) => panel.modalOverlay);
  const activeModalId = useTypedSelector(({ panel }) => panel.activeModalId);
  const softValid = useTypedSelector(
    ({ eere }) => eere.combinedProfile.softValid,
  );
  const serverCalcError = useTypedSelector(
    ({ displacement }) => displacement.status === 'error',
  );

  const selectedRegionName = useSelectedRegion()?.name || '';
  const selectedStateName = useSelectedState()?.name || '';
  const selectedStateRegionNames = useSelectedStateRegions().map((r) => r.name);

  const selectedStateRegions =
    selectedStateRegionNames.length === 1
      ? `${selectedStateRegionNames} Region`
      : `${selectedStateRegionNames.join(', ')} Regions`;

  const resultsHeading =
    geographicFocus === 'regions'
      ? `${selectedRegionName} Region`
      : `${selectedStateRegions} (due to changes in ${selectedStateName})`;

  // the order of the displacements table and emissions table will be
  // determined by the selected geography (regions or states)
  const displacementsTable = (
    <React.Fragment>
      <h3 css={subheadingStyles}>
        Annual Regional Displacements:
        <br />
        <small>{resultsHeading}</small>
      </h3>
      <DisplacementsTable />
    </React.Fragment>
  );

  const emissionsTable = (
    <React.Fragment>
      <h3 css={subheadingStyles}>
        Annual State Emission Changes:
        <br />
        <small>{resultsHeading}</small>
      </h3>
      <EmissionsTable />
    </React.Fragment>
  );

  return (
    <Container
      lightOverlay={modalOverlay}
      darkOverlay={loading || serverCalcError}
      onClick={(ev) => {
        if (!modalOverlay) return;
        const target = ev.target as HTMLDivElement;
        if (!target.dataset['modalId'] && !target.dataset['modalClose']) {
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
          <div css={overlayTextStyles}>
            <LoadingIcon />
            <p css={overlayHeadingStyles}>LOADING...</p>
            {
              // conditionally display progress bar
              activeStep === 3 && (
                <div>
                  <progress
                    css={loadingProgressStyles}
                    value={loadingProgress}
                    max={loadingSteps}
                  >
                    {(loadingProgress * 100) / loadingSteps}%
                  </progress>
                  <p css={overlayInfoStyles}>
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
          <div css={overlayTextStyles}>
            <p css={overlayHeadingStyles}>Web Server Error</p>
            <p css={overlayInfoStyles}>Please try reloading the page.</p>
          </div>
        )
      }

      <section css={panelStyles} data-active={activeStep === 1}>
        <Tabs
          css={tabsStyles}
          index={geographicFocus === 'regions' ? 0 : 1}
          onChange={(index: number) => {
            dispatch(selectGeography(index === 0 ? 'regions' : 'states'));
          }}
        >
          <TabList>
            <Tab>Select Region</Tab>
            <Tab>Select State</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>
                AVERT splits the contiguous 48 states into 14 independent
                electricity regions. AVERT regions are organized by one or more
                balancing authorities. Select a region for analysis by either
                using the dropdown menu or clicking the map. Selecting a region
                loads the power plants operating within each region and
                region-specific wind and solar capacity data.
              </p>

              <RegionsList />
              <RegionsMap />

              <p className="avert-small-text">
                The online version of AVERT completes analyses using 2019
                emissions and generation data. The Excel version of AVERT
                (available for download{' '}
                <a
                  href="https://www.epa.gov/statelocalenergy/download-avert"
                  target="_parent"
                >
                  here
                </a>
                ) allows analyses for years 2017–2019 or for a future year
                scenario.
              </p>
            </TabPanel>

            <TabPanel>
              <p>
                Select a state for analysis by either using the dropdown menu or
                clicking the map. Selecting a state means AVERT will load power
                plants and wind and solar capacity factors for all regions that
                the state is part of.
              </p>

              <StatesList />
              <StatesMap />

              <p className="avert-small-text">
                When modeling EE/RE in a state, AVERT distributes the user-input
                EE/RE across all the AVERT regions straddled by the state. The
                energy impacts of EE/RE programs are assigned to each AVERT
                region based on the proportional generation provided to the
                state by EGUs in each AVERT region. For more information, see
                Appendix G of the User Manual.
              </p>

              <p className="avert-small-text">
                The online version of AVERT completes analyses using 2019
                emissions and generation data. The Excel version of AVERT
                (available for download{' '}
                <a
                  href="https://www.epa.gov/statelocalenergy/download-avert"
                  target="_parent"
                >
                  here
                </a>
                ) allows analyses for years 2017–2019 or for a future year
                scenario.
              </p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <PanelFooter nextButtonText="Set EE/RE Impacts" />
      </section>

      <section css={panelStyles} data-active={activeStep === 2}>
        <div css={panelBodyStyles}>
          <h2 css={headingStyles}>
            Set Energy Efficiency and Renewable Energy Impacts
          </h2>

          <h3 css={[subheadingStyles, { marginTop: 0 }]}>
            {geographicFocus === 'regions'
              ? `Region: ${selectedRegionName}`
              : `State: ${selectedStateName}`}
          </h3>

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
          prevButtonText="Back to Geography"
          nextButtonText="Get Results"
        />
      </section>

      <section css={panelStyles} data-active={activeStep === 3}>
        <div css={panelBodyStyles}>
          <h2 css={headingStyles}>
            Results: Avoided Regional, State, and County-Level Emissions
          </h2>

          {
            // conditionally display validation warning
            !softValid && (
              <p css={[topMessageStyles, vadidationWarningStyles]}>
                <span css={messageHeadingStyles}>WARNING:</span>
                The proposed EE/RE programs would collectively displace more
                than 15% of regional fossil generation in one or more hours of
                the year. AVERT works best with displacements of 15% or less, as
                it is designed to simulate marginal operational changes in load,
                rather than large-scale changes that may change fundamental
                dynamics.
              </p>
            )
          }

          {geographicFocus === 'regions' ? (
            <React.Fragment>
              {displacementsTable}
              {emissionsTable}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {emissionsTable}
              {displacementsTable}
            </React.Fragment>
          )}

          <h3 css={subheadingStyles}>
            Monthly Emission Changes:
            <br />
            <small>{resultsHeading}</small>
          </h3>

          <EmissionsChart />

          <h3 css={subheadingStyles}>Data Download</h3>

          <DataDownload />
        </div>

        <PanelFooter
          prevButtonText="Back to EE/RE Impacts"
          nextButtonText="Reselect Geography"
        />
      </section>
    </Container>
  );
}

export default Panels;
