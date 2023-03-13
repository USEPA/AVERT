import { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { useTypedSelector } from 'app/redux/index';
import {
  selectRegion,
  setRegionSelectStateId,
  setRegionSelectCounty,
} from 'app/redux/reducers/geography';
import { useSelectedRegion } from 'app/hooks';
import type { CountiesByGeography } from 'app/calculations/geography';
import type { RegionId, StateId } from 'app/config';
import { regions, states } from 'app/config';

function RegionsListContent() {
  const dispatch = useDispatch();
  const countiesByGeography = useTypedSelector(
    ({ geography }) => geography.countiesByGeography,
  );
  const regionSelectStateId = useTypedSelector(
    ({ geography }) => geography.regionSelect.stateId,
  );
  const regionSelectCounty = useTypedSelector(
    ({ geography }) => geography.regionSelect.county,
  );

  const selectedRegionId = useSelectedRegion()?.id;

  const [countyNames, setCountyNames] = useState<string[]>([]);

  // update county select options, based on selected state
  useEffect(() => {
    const stateId = regionSelectStateId;

    const countiesByGeographyData =
      Object.keys(countiesByGeography).length !== 0
        ? (countiesByGeography as CountiesByGeography)
        : null;

    if (stateId === '') {
      setCountyNames([]);
      return;
    }

    if (countiesByGeographyData) {
      const selectedStateCounties = countiesByGeographyData.states[stateId];

      if (selectedStateCounties) {
        setCountyNames(selectedStateCounties.sort());
      }
    }
  }, [countiesByGeography, regionSelectStateId]);

  // update selected region, based on selected county
  useEffect(() => {
    const stateId = regionSelectStateId;
    const county = regionSelectCounty;

    const countiesByGeographyData =
      Object.keys(countiesByGeography).length !== 0
        ? (countiesByGeography as CountiesByGeography)
        : null;

    if (stateId === '') {
      return;
    }

    if (countiesByGeographyData) {
      /** determine which region the county falls within */
      const regionId = Object.entries(countiesByGeographyData.regions).find(
        ([_, regionData]) => {
          return Object.entries(regionData).some(([key, value]) => {
            return (key as StateId) === stateId && value.includes(county);
          });
        },
      )?.[0] as RegionId | undefined;

      if (regionId) {
        dispatch(selectRegion(regionId));
      }
    }
  }, [countiesByGeography, regionSelectStateId, regionSelectCounty, dispatch]);

  return (
    <div className="text-base-darker">
      <p className="margin-top-205 margin-bottom-1 line-height-sans-2">
        <strong>Select an AVERT region directly:</strong>
      </p>

      <div className="display-flex">
        <div className="flex-1">
          <select
            className="usa-select margin-0 maxw-full"
            aria-label="Select Region"
            value={selectedRegionId || ''}
            onChange={(ev) => {
              dispatch(selectRegion(ev.target.value as RegionId));
              dispatch(setRegionSelectStateId(''));
              dispatch(setRegionSelectCounty(''));
            }}
            data-avert-region-select
          >
            <option value={''} disabled>
              Select Region
            </option>
            <option value={regions.CA.id}>{regions.CA.name}</option>
            <option value={regions.NCSC.id}>{regions.NCSC.name}</option>
            <option value={regions.CENT.id}>{regions.CENT.name}</option>
            <option value={regions.FL.id}>{regions.FL.name}</option>
            <option value={regions.MIDA.id}>{regions.MIDA.name}</option>
            <option value={regions.MIDW.id}>{regions.MIDW.name}</option>
            <option value={regions.NE.id}>{regions.NE.name}</option>
            <option value={regions.NY.id}>{regions.NY.name}</option>
            <option value={regions.NW.id}>{regions.NW.name}</option>
            <option value={regions.RM.id}>{regions.RM.name}</option>
            <option value={regions.SE.id}>{regions.SE.name}</option>
            <option value={regions.SW.id}>{regions.SW.name}</option>
            <option value={regions.TN.id}>{regions.TN.name}</option>
            <option value={regions.TE.id}>{regions.TE.name}</option>
          </select>
        </div>
      </div>

      <p className="margin-top-205 margin-bottom-1 line-height-sans-2">
        <strong>
          Or select a state and county, which will select an AVERT region:
        </strong>
      </p>

      <div className="display-flex">
        <div className="flex-1 margin-right-1">
          <select
            className="usa-select margin-0 maxw-full"
            aria-label="Select State"
            value={regionSelectStateId || ''}
            onChange={(ev) => {
              dispatch(selectRegion('' as RegionId));
              dispatch(setRegionSelectStateId(ev.target.value as StateId));
              dispatch(setRegionSelectCounty(''));
            }}
            data-avert-region-state-select
          >
            <option value={''} disabled>
              Select State
            </option>

            {Object.keys(states).map((stateId) => {
              return (
                <Fragment key={stateId}>
                  <option value={stateId}>
                    {states[stateId as StateId].name}
                  </option>
                </Fragment>
              );
            })}
          </select>
        </div>

        <div className="flex-1 margin-left-1">
          <select
            className="usa-select margin-0 maxw-full"
            aria-label="Select County"
            value={regionSelectCounty || ''}
            onChange={(ev) => {
              dispatch(setRegionSelectCounty(ev.target.value));
            }}
            data-avert-region-county-select
          >
            <option value={''} disabled>
              Select County
            </option>

            {countyNames.map((county) => {
              return (
                <Fragment key={county}>
                  <option value={county}>
                    {county.replace(/city/, '(City)')}
                  </option>
                </Fragment>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}

export function RegionsList() {
  return (
    <ErrorBoundary
      message={
        <>
          AVERT Regions select error. Please contact AVERT support at{' '}
          <a className="usa-link" href="mailto:avert@epa.gov">
            avert@epa.gov
          </a>
        </>
      }
    >
      <RegionsListContent />
    </ErrorBoundary>
  );
}
