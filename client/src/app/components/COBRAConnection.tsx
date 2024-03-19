import { useState, useEffect } from 'react';
// ---
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { useAppSelector } from '@/app/redux/index';

type CobraApiState = 'idle' | 'pending' | 'success' | 'failure';

type CobraApiData = {
  stateCountyBadgesList: string[];
  tier1Text: 'Fuel Combustion: Electric Utility' | 'Highway Vehicles';
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
  tiertree_items_selected: ['1' | '11'];
};

function COBRAConnectionContent() {
  const activeStep = useAppSelector(({ panel }) => panel.activeStep);
  const cobraApiUrl = useAppSelector(({ api }) => api.cobraApiUrl);
  const cobraAppUrl = useAppSelector(({ api }) => api.cobraAppUrl);
  const cobraData = useAppSelector(({ downloads }) => downloads.cobraData);

  const [cobraApiState, setCobraApiState] = useState<CobraApiState>('idle');

  useEffect(() => {
    setCobraApiState('idle');
  }, [activeStep]);

  const cobraApiData: CobraApiData[] = cobraData.map((row) => {
    const countyState = `${row.COUNTY.replace(/ County$/, '')}, ${row.STATE}`;
    return {
      stateCountyBadgesList: [countyState],
      tier1Text:
        row.TIER1NAME === 'FUEL COMB. ELEC. UTIL.'
          ? 'Fuel Combustion: Electric Utility'
          : 'Highway Vehicles',
      tier2Text: null,
      tier3Text: null,
      PM25ri: row.PM25_REDUCTIONS_TONS <= 0 ? 'reduce' : 'increase',
      SO2ri: row.SO2_REDUCTIONS_TONS <= 0 ? 'reduce' : 'increase',
      NOXri: row.NOx_REDUCTIONS_TONS <= 0 ? 'reduce' : 'increase',
      NH3ri: row.NH3_REDUCTIONS_TONS <= 0 ? 'reduce' : 'increase',
      VOCri: row.VOCS_REDUCTIONS_TONS <= 0 ? 'reduce' : 'increase',
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
      tiertree_items_selected: [
        row.TIER1NAME === 'FUEL COMB. ELEC. UTIL.' ? '1' : '11',
      ],
    };
  });

  return (
    <>
      <h3 className="avert-blue margin-bottom-1 font-serif-md">
        Direct Connection to COBRA
      </h3>

      <p className="margin-top-0">
        EPA’s{' '}
        <a
          className="usa-link"
          href="https://www.epa.gov/cobra"
          target="_parent"
          rel="noreferrer"
        >
          CO-Benefits Risk Assessment (COBRA) Health Impacts Screening and
          Mapping Tool
        </a>{' '}
        is a free tool that quantifies the air quality, human health, and
        health-related economic benefits from reductions in emissions that
        result from clean energy policies and programs. Outputs from AVERT can
        serve as inputs to COBRA. The button below will open a new browser tab
        and load your AVERT results directly into the COBRA Web Edition.
      </p>

      {cobraApiState === 'pending' && (
        <div className="usa-alert usa-alert--slim usa-alert--info">
          <div className="usa-alert__body">
            <p className="usa-alert__text">Sending data to COBRA...</p>
          </div>
        </div>
      )}

      {cobraApiState === 'success' && (
        <div className="usa-alert usa-alert--slim usa-alert--success">
          <div className="usa-alert__body">
            <p className="usa-alert__text">Succesfully posted data to COBRA.</p>
          </div>
        </div>
      )}

      {cobraApiState === 'failure' && (
        <div className="usa-alert usa-alert--slim usa-alert--error">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              Error connecting with COBRA application. Please try again later.
              If connection problems persist, please contact AVERT support at{' '}
              <a
                className="usa-link"
                href="mailto:avert@epa.gov"
                target="_parent"
                rel="noreferrer"
              >
                avert@epa.gov
              </a>
              .
            </p>
          </div>
        </div>
      )}

      <p className="margin-0 text-center">
        <a
          className="usa-button avert-button"
          href={cobraAppUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(ev) => {
            ev.preventDefault();

            const cobraAppWindow = window.open('', '_blank');

            if (cobraAppWindow) {
              cobraAppWindow.document.write('Sending data to COBRA...');
              cobraAppWindow.document.body.style.fontFamily = 'sans-serif';
            }

            setCobraApiState('pending');

            fetch(`${cobraApiUrl}/api/Token`)
              .then((tokenRes) => {
                if (!tokenRes.ok) throw new Error(tokenRes.statusText);
                return tokenRes.json();
              })
              .then((tokenData) => {
                const token = tokenData.value;
                return fetch(`${cobraApiUrl}/api/Queue`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ token, queueElements: cobraApiData }),
                }).then((queueRes) => {
                  if (!queueRes.ok) throw new Error(queueRes.statusText);

                  if (cobraAppWindow) {
                    cobraAppWindow.location.href = `${cobraAppUrl}/externalscenario/${token}`;
                  }

                  setCobraApiState('success');
                });
              })
              .catch((error) => {
                console.log(error);
                cobraAppWindow?.close();
                setCobraApiState('failure');
              });
          }}
        >
          Submit Results to COBRA
        </a>
      </p>
    </>
  );
}

export function COBRAConnection() {
  return (
    <ErrorBoundary
      message={
        <>
          COBRA connection error. Please contact AVERT support at{' '}
          <a
            className="usa-link"
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <COBRAConnectionContent />
    </ErrorBoundary>
  );
}
