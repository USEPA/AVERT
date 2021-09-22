/** @jsxImportSource @emotion/react */

// components
import {
  bottomMessageStyles,
  warningMessageStyles,
} from 'app/components/Panels';
// reducers
import { useTypedSelector } from 'app/redux/index';
// hooks
import { useSelectedRegion, useSelectedState } from 'app/hooks';

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
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const countyData = useTypedSelector(
    ({ displacement }) => displacement.downloadableCountyData,
  );
  const cobraData = useTypedSelector(
    ({ displacement }) => displacement.downloadableCobraData,
  );

  const selectedRegionName = useSelectedRegion()?.name || '';
  const selectedStateName = useSelectedState()?.name || '';

  const geographyText =
    geographicFocus === 'regions'
      ? `Region – ${selectedRegionName}`
      : `State – ${selectedStateName}`;

  const countyCsvString = encodeURIComponent(convertToCSVString(countyData));
  const cobraCsvString = encodeURIComponent(convertToCSVString(cobraData));

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
        Download formatted outputs for use in EPA’s COBRA Screening and Mapping
        Tool.
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

      {isDesktopSafari && (
        <p
          css={[bottomMessageStyles, warningMessageStyles]}
          className="avert-centered"
        >
          Please press <strong>⌘ + S</strong> to save the file after it is
          opened.
        </p>
      )}
    </>
  );
}

export default DataDownload;
