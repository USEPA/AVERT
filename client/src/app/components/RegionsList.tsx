import { useDispatch } from 'react-redux';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { selectRegion } from 'app/redux/reducers/geography';
import { useSelectedRegion } from 'app/hooks';
import { RegionId, regions } from 'app/config';

function RegionsListContent() {
  const dispatch = useDispatch();

  const selectedRegionId = useSelectedRegion()?.id;

  // TODO: replace with data stored in redux state
  const selectedRegionStateId = '';
  const selectedRegionCounty = '';

  return (
    <>
      <p className="margin-top-2 margin-bottom-05">
        <strong>Select a state and county:</strong>
      </p>

      <div className="display-flex">
        <div className="flex-1 margin-right-1">
          <select
            className="usa-select margin-0 maxw-full"
            aria-label="Select State"
            value={selectedRegionStateId || ''}
            // onChange={(ev) => dispatch(selectRegionState(ev.target.value as StateId))}
            data-avert-region-state-select
          >
            <option value={''} disabled>
              Select State
            </option>
          </select>
        </div>

        <div className="flex-1 margin-left-1">
          <select
            className="usa-select margin-0 maxw-full"
            aria-label="Select County"
            value={selectedRegionCounty || ''}
            // onChange={(ev) => dispatch(selectRegionCounty(ev.target.value))}
            data-avert-region-county-select
          >
            <option value={''} disabled>
              Select County
            </option>
          </select>
        </div>
      </div>

      <p className="margin-top-2 margin-bottom-05">
        <strong>Or select a region directly:</strong>
      </p>

      <div className="display-flex">
        <div className="flex-1">
          <select
            className="usa-select margin-0 maxw-full"
            aria-label="Select Region"
            value={selectedRegionId || ''}
            onChange={(ev) =>
              dispatch(selectRegion(ev.target.value as RegionId))
            }
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
    </>
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
