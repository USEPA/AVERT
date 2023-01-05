/** @jsxImportSource @emotion/react */

import { useEffect } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs';
import '@reach/tabs/styles.css';
// ---
import { LoadingIcon } from 'app/components/LoadingIcon';
import { PanelFooter } from 'app/components/PanelFooter';
import { RegionsList } from 'app/components/RegionsList';
import { RegionsMap } from 'app/components/RegionsMap';
import { StatesList } from 'app/components/StatesList';
import { StatesMap } from 'app/components/StatesMap';
import { UnitConversion } from 'app/components/UnitConversion';
import { EEREInputs } from 'app/components/EEREInputs';
import { EEREChart } from 'app/components/EEREChart';
import { DisplacementsTable } from 'app/components/DisplacementsTable';
import { EmissionsTable } from 'app/components/EmissionsTable';
import { EmissionsChart } from 'app/components/EmissionsChart';
import { COBRAConnection } from 'app/components/COBRAConnection';
import { DataDownload } from 'app/components/DataDownload';
import { modalLinkStyles } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import { toggleModalOverlay, resetActiveModal } from 'app/redux/reducers/panel';
import { selectGeography } from 'app/redux/reducers/geography';
import {
  setVMTData,
  setHourlyEVChargingPercentages,
} from 'app/redux/reducers/transportation';
import {
  useSelectedRegion,
  useSelectedState,
  useSelectedStateRegions,
} from 'app/hooks';

const Container = styled('div')<{
  lightOverlay: boolean;
  darkOverlay: boolean;
}>`
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
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  color: #00bee6;
`;

const panelStyles = css`
  &[data-active='false'] {
    display: none;
  }
`;

const panelBodyStyles = css`
  border-top: 0.375rem solid rgb(0, 164, 200); // avert-light-blue
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
    border-bottom: 1px solid #a9aeb1; // base-light
    width: 50%;
    font-weight: 700;
    font-size: 1rem;
    line-height: 1;
    color: #565c65; // base-dark
    background-color: whitesmoke;
    user-select: none;

    @media (min-width: 40em) {
      font-size: 1.125rem;
    }

    &:focus {
      outline: none;
    }

    &:hover {
      border-top-color: #a9aeb1; // base-light
    }

    &:first-of-type[data-selected] {
      border-right: 1px solid #a9aeb1; // base-light
    }

    &:last-of-type[data-selected] {
      border-left: 1px solid #a9aeb1; // base-light
    }

    &[data-selected] {
      border-top-color: rgb(0, 164, 200); // avert-light-blue
      border-bottom-color: white;
      color: rgb(0, 128, 164); // avert-blue
      background-color: white;
    }
  }

  [data-reach-tab-panel] {
    outline: none;
  }

  [data-reach-tab-panels] {
    padding: 1.5rem;
  }
`;

const messageStyles = css`
  position: relative;
  left: -1.5rem;
  width: calc(100% + 3rem);
  padding: 1.5rem;
  margin-top: 0;
`;

const topMessageStyles = css`
  ${messageStyles};

  top: 0;
`;

export const bottomMessageStyles = css`
  ${messageStyles};

  bottom: -1.5rem;
`;

export const warningMessageStyles = css`
  background-color: rgb(249, 201, 114);
`;

export const errorMessageStyles = css`
  color: white;
  background-color: rgb(212, 57, 57);
`;

export function Panels() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setVMTData());
    dispatch(setHourlyEVChargingPercentages());
  }, [dispatch]);

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
    <>
      <h3 className="avert-blue margin-bottom-1 font-serif-md">
        Annual Regional Displacements:
        <br />
        <span className="display-block margin-top-05 font-serif-xs">
          {resultsHeading}
        </span>
      </h3>

      <DisplacementsTable />
    </>
  );

  const emissionsTable = (
    <>
      <h3 className="avert-blue margin-bottom-1 font-serif-md">
        Annual State Emission Changes:
        <br />
        <span className="display-block margin-top-05 font-serif-xs">
          {resultsHeading}
        </span>
      </h3>

      <EmissionsTable />
    </>
  );

  return (
    <Container
      className="border-width-1px border-solid border-base-light"
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
          <div
            css={overlayTextStyles}
            className="position-absolute text-center"
          >
            <LoadingIcon />

            <p className="font-sans-lg text-bold">LOADING...</p>

            {
              // conditionally display progress bar
              activeStep === 3 && (
                <div>
                  <progress
                    className="margin-top-1 width-full"
                    value={loadingProgress}
                    max={loadingSteps}
                  >
                    {(loadingProgress * 100) / loadingSteps}%
                  </progress>

                  <p className="margin-top-1 font-sans-sm">
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
          <div
            css={overlayTextStyles}
            className="position-absolute text-center"
          >
            <p className="font-sans-lg text-bold">Web Server Error</p>

            <p className="margin-top-1 font-sans-sm">
              Please try reloading the page.
            </p>
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
              <p className="tablet:font-sans-md">
                AVERT splits the contiguous 48 states into 14 independent
                electricity regions. AVERT regions are organized by one or more
                balancing authorities. Select a region for analysis by either
                using the dropdown menu or clicking the map. Selecting a region
                loads the power plants operating within each region and
                region-specific wind and solar capacity data.
              </p>

              <RegionsList />

              <RegionsMap />

              <p className="text-base-dark">
                The online version of AVERT completes analyses using 2021
                emissions and generation data. The Excel version of AVERT (
                <a
                  className="usa-link"
                  href="https://www.epa.gov/avert/download-avert"
                  target="_blank"
                  rel="noreferrer"
                >
                  available for download here
                </a>
                ) allows analyses for years 2017–2021 or for a future year
                scenario.
              </p>
            </TabPanel>

            <TabPanel>
              <p className="tablet:font-sans-md">
                Select a state for analysis by either using the dropdown menu or
                clicking the map. Selecting a state means AVERT will load power
                plants and wind and solar capacity factors for all regions that
                the state is part of.
              </p>

              <StatesList />

              <StatesMap />

              <p className="text-base-dark">
                When modeling EE/RE in a state, AVERT distributes the user-input
                EE/RE across all the AVERT regions straddled by the state. The
                energy impacts of EE/RE programs are assigned to each AVERT
                region based on the proportional generation provided to the
                state by EGUs in each AVERT region. For more information, see
                Appendix G of the User Manual.
              </p>

              <p className="text-base-dark">
                The online version of AVERT completes analyses using 2021
                emissions and generation data. The Excel version of AVERT (
                <a
                  className="usa-link"
                  href="https://www.epa.gov/avert/download-avert"
                  target="_blank"
                  rel="noreferrer"
                >
                  available for download here
                </a>
                ) allows analyses for years 2017–2021 or for a future year
                scenario.
              </p>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <PanelFooter nextButtonText="Set EE/RE Impacts" />
      </section>

      <section css={panelStyles} data-active={activeStep === 2}>
        <div css={panelBodyStyles} className="padding-3 minh-mobile-lg">
          <h2 className="avert-blue margin-bottom-105 padding-bottom-05 border-bottom-2px font-serif-lg">
            Set Energy Scenario
          </h2>

          <h3 className="avert-blue margin-top-0 margin-bottom-1 font-serif-md">
            {geographicFocus === 'regions'
              ? `Region: ${selectedRegionName}`
              : `State: ${selectedStateName}`}
          </h3>

          <UnitConversion />

          <p className="tablet:font-sans-md">
            AVERT quantifies avoided emissions and electricity generation
            displaced by EE/RE policies and programs. Specify the impacts of
            EE/RE programs below, and AVERT will use these inputs to generate
            results. For more information about inputs, please consult the{' '}
            <a
              href="https://www.epa.gov/statelocalenergy/avert-user-manual"
              target="_blank"
              rel="noreferrer"
            >
              AVERT user manual
            </a>{' '}
            or click the &nbsp;
            <span
              css={modalLinkStyles}
              className="position-relative display-inline-block width-2 height-2"
            />
            &nbsp; icon for each program type below.
          </p>

          <p className="text-base-dark">
            Several types of programs are listed below (A through E). You can
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
        <div css={panelBodyStyles} className="padding-3 minh-mobile-lg">
          <h2 className="avert-blue margin-bottom-105 padding-bottom-05 border-bottom-2px font-serif-lg">
            Results: Avoided Regional, State, and County-Level Emissions
          </h2>

          {
            // conditionally display validation warning
            !softValid && (
              <p
                css={[topMessageStyles, warningMessageStyles]}
                className="font-sans-xs"
              >
                <span className="dislay-block margin-bottom-05 text-bold">
                  WARNING:
                </span>
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
            <>
              {displacementsTable}
              {emissionsTable}
            </>
          ) : (
            <>
              {emissionsTable}
              {displacementsTable}
            </>
          )}

          <h3 className="avert-blue margin-bottom-1 font-serif-md">
            Monthly Emission Changes:
            <br />
            <span className="display-block margin-top-05 font-serif-sm">
              {resultsHeading}
            </span>
          </h3>

          <EmissionsChart />

          <COBRAConnection />

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
