import { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { useTypedSelector } from 'app/redux/index';
import { selectRegion } from 'app/redux/reducers/geography';
import { useSelectedRegion } from 'app/hooks';
import type { CountiesByGeography } from 'app/calculations/geography';
import type { RegionId, StateId } from 'app/config';
import { regions, states } from 'app/config';

function RegionsListContent() {
  const dispatch = useDispatch();
  const countiesByGeography = useTypedSelector(
    ({ geography }) => geography.countiesByGeography,
  );

  const selectedRegionId = useSelectedRegion()?.id;

  const [selectRegionStateId, setSelectRegionStateId] = useState('');
  const [selectRegionCounty, setSelectRegionCounty] = useState('');
  const [selectRegionCounties, setSelectRegionCounties] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const countiesByGeographyData =
      Object.keys(countiesByGeography).length !== 0
        ? (countiesByGeography as CountiesByGeography)
        : null;

    if (countiesByGeographyData) {
      const stateId = selectRegionStateId as StateId;
      const selectedStateCounties = countiesByGeographyData.states[stateId];

      if (selectedStateCounties) {
        setSelectRegionCounties(selectedStateCounties.sort());
      }
    }
  }, [countiesByGeography, selectRegionStateId]);

  return (
    <div className="text-base-darker">
      <p className="margin-top-205 margin-bottom-1 line-height-sans-2">
        <strong>
          Select a state and county, which will select an AVERT region:
        </strong>
      </p>

      <div className="display-flex">
        <div className="flex-1 margin-right-1">
          <select
            className="usa-select margin-0 maxw-full"
            aria-label="Select State"
            value={selectRegionStateId || ''}
            onChange={(ev) => {
              setSelectRegionStateId(ev.target.value as StateId);
              setSelectRegionCounty('');
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
            value={selectRegionCounty || ''}
            onChange={(ev) => {
              setSelectRegionCounty(ev.target.value);
            }}
            data-avert-region-county-select
          >
            <option value={''} disabled>
              Select County
            </option>

            {selectRegionCounties.map((county) => {
              return (
                <Fragment key={county}>
                  <option value={county}>{county}</option>
                </Fragment>
              );
            })}
          </select>
        </div>
      </div>

      <p className="margin-top-205 margin-bottom-1 line-height-sans-2">
        <strong>Or select an AVERT region directly:</strong>
      </p>

      <div className="display-flex">
        <div className="flex-1">
          <select
            className="usa-select margin-0 maxw-full"
            aria-label="Select Region"
            value={selectedRegionId || ''}
            onChange={(ev) => {
              dispatch(selectRegion(ev.target.value as RegionId));
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
