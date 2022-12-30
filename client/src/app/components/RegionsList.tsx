import { useDispatch } from 'react-redux';
// ---
import { selectRegion } from 'app/redux/reducers/geography';
import { useSelectedRegion } from 'app/hooks';
import { RegionId, regions } from 'app/config';

export function RegionsList() {
  const dispatch = useDispatch();

  const selectedRegionId = useSelectedRegion()?.id;

  return (
    <select
      className={
        `usa-select ` + //
        `margin-top-3 margin-bottom-0 margin-x-auto width-full`
      }
      aria-label="Select Region"
      value={selectedRegionId || ''}
      onChange={(ev) => dispatch(selectRegion(ev.target.value as RegionId))}
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
  );
}
