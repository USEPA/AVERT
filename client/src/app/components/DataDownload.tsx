/** @jsxImportSource @emotion/react */

import { Fragment, useState, useEffect } from 'react';
import { css } from '@emotion/react';
// components
import {
  bottomMessageStyles,
  infoMessageStyles,
  successMessageStyles,
  warningMessageStyles,
  errorMessageStyles,
} from 'app/components/Panels';
// reducers
import { useTypedSelector } from 'app/redux/index';
// hooks
import { useSelectedRegion, useSelectedState } from 'app/hooks';

type CobraApiState = 'ready' | 'loading' | 'success' | 'error';

type CobraApiData = {
  stateCountyBadgesList: string[];
  tier1Text: 'Fuel Combustion: Electric Utility';
  tier2Text: null;
  tier3Text: null;
  PM25ri: 'reduce' | 'increase';
  SO2ri: 'reduce' | 'increase';
  NOXri: 'reduce' | 'increase';
  NH3ri: 'reduce' | 'increase';
  VOCri: 'reduce' | 'increase';
  cPM25: number | null;
  cSO2: number | null;
  cNOX: number | null;
  cNH3: number | null;
  cVOC: number | null;
  PM25pt: 'tons' | 'percent';
  SO2pt: 'tons' | 'percent';
  NOXpt: 'tons' | 'percent';
  NH3pt: 'tons' | 'percent';
  VOCpt: 'tons' | 'percent';
  statetree_items_selected: string[];
  tiertree_items_selected: ['1'];
};

const safariMessageStyles = css`
  ${bottomMessageStyles};
  ${warningMessageStyles};
`;

const cobraMessageStyles = css`
  padding: 1rem;
  font-size: 0.625rem;

  @media (min-width: 25em) {
    padding: 1.125rem;
  }

  @media (min-width: 30em) {
    padding: 1.25rem;
    font-size: 0.6875rem;
  }

  @media (min-width: 35em) {
    padding: 1.375rem;
  }

  @media (min-width: 40em) {
    padding: 1.5rem;
    font-size: 0.75rem;
  }
`;

function convertToCSVString(data: { [key: string]: any }[]) {
  const keys = Object.keys(data[0] || {});
  const rows = data.map((row) => {
    return keys
      .map((key) => `"${row[key] || row[key] === 0 ? row[key] : ''}"`)
      .join(',');
  });
  return [keys.map((key) => `"${key}"`).join(',')].concat(rows).join('\r\n');
}

function DataDownload() {
  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);
  const cobraApiUrl = useTypedSelector(({ api }) => api.cobraApiUrl);
  const cobraAppUrl = useTypedSelector(({ api }) => api.cobraAppUrl);
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const countyData = useTypedSelector(
    ({ displacement }) => displacement.downloadableCountyData,
  );
  const cobraData = useTypedSelector(
    ({ displacement }) => displacement.downloadableCobraData,
  );

  const [cobraApiState, setCobraApiState] = useState<CobraApiState>('ready');
  const [cobraApiMessage, setCobraApiMessage] = useState(<Fragment />);

  useEffect(() => {
    setCobraApiState('ready');
    setCobraApiMessage(<Fragment />);
  }, [activeStep]);

  const selectedRegionName = useSelectedRegion()?.name || '';
  const selectedStateName = useSelectedState()?.name || '';

  const geographyText =
    geographicFocus === 'regions'
      ? `Region – ${selectedRegionName}`
      : `State – ${selectedStateName}`;

  const countyCsvString = encodeURIComponent(convertToCSVString(countyData));
  const cobraCsvString = encodeURIComponent(convertToCSVString(cobraData));

  const cobraApiData: CobraApiData[] = cobraData.map((row) => {
    const countyState = `${row.COUNTY.replace(/ County$/, '')}, ${row.STATE}`;
    return {
      stateCountyBadgesList: [countyState],
      tier1Text: 'Fuel Combustion: Electric Utility',
      tier2Text: null,
      tier3Text: null,
      PM25ri: 'reduce',
      SO2ri: 'reduce',
      NOXri: 'reduce',
      NH3ri: 'reduce',
      VOCri: 'reduce',
      cPM25: Math.abs(row.PM25_REDUCTIONS_TONS),
      cSO2: Math.abs(row.SO2_REDUCTIONS_TONS),
      cNOX: Math.abs(row.NOx_REDUCTIONS_TONS),
      cNH3: Math.abs(row.NH3_REDUCTIONS_TONS),
      cVOC: Math.abs(row.VOCS_REDUCTIONS_TONS),
      PM25pt: 'tons',
      SO2pt: 'tons',
      NOXpt: 'tons',
      NH3pt: 'tons',
      VOCpt: 'tons',
      statetree_items_selected: [row.FIPS],
      tiertree_items_selected: ['1'],
    };
  });

  const isDesktopSafari =
    navigator.userAgent.toLowerCase().indexOf('safari') !== -1 &&
    navigator.userAgent.toLowerCase().indexOf('chrome') === -1 &&
    navigator.userAgent.toLowerCase().indexOf('mobi') === -1;

  return (
    <>
      <p>
        Download monthly displacement data for each county, state, and region in
        this analysis, in CSV format.
      </p>

      <p className="avert-centered">
        <a
          className="avert-button"
          href={`data:text/csv;charset=utf-8,${countyCsvString}`}
          download={`AVERT Monthly Emission Changes (${geographyText}).csv`}
        >
          Download County Level Results
        </a>
      </p>

      <p>
        Download formatted outputs for use in EPA’s Co-Benefits Risk Assessment
        (COBRA) Screening Model.
      </p>

      <p className="avert-centered">
        <a
          className="avert-button"
          href={`data:text/csv;charset=utf-8,${cobraCsvString}`}
          download={`AVERT COBRA (${geographyText}).csv`}
        >
          Download COBRA Results
        </a>
      </p>

      <p>
        (PLACEHOLDER: text explaining submitting data to the COBRA App, and how
        the user will be redirected upon successful submission).
      </p>

      {cobraApiState !== 'ready' && (
        <p
          css={[
            cobraMessageStyles,
            cobraApiState === 'loading' && infoMessageStyles,
            cobraApiState === 'success' && successMessageStyles,
            cobraApiState === 'error' && errorMessageStyles,
          ]}
          className="avert-centered"
        >
          {cobraApiMessage}
        </p>
      )}

      <p className="avert-centered">
        <a
          className="avert-button"
          href={cobraAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(ev) => {
            ev.preventDefault();

            setCobraApiState('loading');
            setCobraApiMessage(<>Posting data to COBRA...</>);

            const cobraAppWindow = window.open('', '_blank');
            if (cobraAppWindow) {
              cobraAppWindow.document.write('Posting data to COBRA...');
              cobraAppWindow.document.body.style.fontFamily = 'sans-serif';
            }

            fetch(`${cobraApiUrl}/api/Token`)
              .then((tokenRes) => {
                if (!tokenRes.ok) {
                  setCobraApiState('error');
                  setCobraApiMessage(<>Error connecting with COBRA app.</>);
                  cobraAppWindow?.close();
                  throw new Error(tokenRes.statusText);
                }
                return tokenRes.json();
              })
              .then((tokenData) => {
                const token = tokenData.value;

                fetch(`${cobraApiUrl}/api/Queue`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token, queueElements: cobraApiData }),
                })
                  .then((queueRes) => {
                    if (!queueRes.ok) {
                      setCobraApiState('error');
                      setCobraApiMessage(<>Error connecting with COBRA app.</>);
                      cobraAppWindow?.close();
                      throw new Error(queueRes.statusText);
                    }

                    if (cobraAppWindow) {
                      cobraAppWindow.location.href = `${cobraAppUrl}/externalscenario/${token}`;
                    }

                    setCobraApiState('success');
                    setCobraApiMessage(<>Succesfully posted data to COBRA.</>);
                  })
                  .catch((error) => {
                    console.log(error);
                    setCobraApiState('error');
                    setCobraApiMessage(<>Error connecting with COBRA app.</>);
                    cobraAppWindow?.close();
                  });
              })
              .catch((error) => {
                console.log(error);
                setCobraApiState('error');
                setCobraApiMessage(<>Error connecting with COBRA app.</>);
                cobraAppWindow?.close();
              });
          }}
        >
          Submit COBRA Results
        </a>
      </p>

      {isDesktopSafari && (
        <p css={safariMessageStyles} className="avert-centered">
          Please press <strong>⌘ + S</strong> to save the file after it is
          opened.
        </p>
      )}
    </>
  );
}

export default DataDownload;
