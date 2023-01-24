import { useTypedSelector } from 'app/redux/index';
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

export function DataDownload() {
  const geographicFocus = useTypedSelector(({ geography }) => geography.focus);
  const countyData = useTypedSelector(({ downloads }) => downloads.countyData);
  const cobraData = useTypedSelector(({ downloads }) => downloads.cobraData);

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
      <h3 className="avert-blue margin-bottom-1 font-serif-md">
        Data Download
      </h3>

      <p>
        Download monthly displacement data for each county, state, and region in
        this analysis, in CSV format, or download formatted outputs for use in
        EPA’s COBRA Screening and Mapping Tool.
      </p>

      <p className="text-center">
        <a
          className="usa-button avert-button"
          href={`data:text/csv;charset=utf-8,${countyCsvString}`}
          download={`AVERT Monthly Emission Changes (${geographyText}).csv`}
        >
          Download County Level Results
        </a>
      </p>

      <p className="margin-bottom-0 text-center">
        <a
          className="usa-button avert-button"
          href={`data:text/csv;charset=utf-8,${cobraCsvString}`}
          download={`AVERT COBRA (${geographyText}).csv`}
        >
          Download COBRA Results
        </a>
      </p>

      {isDesktopSafari && (
        <div className="usa-alert usa-alert--slim usa-alert--warning margin-bottom-0">
          <div className="usa-alert__body">
            <p className="usa-alert__text">
              Please press <strong>⌘ + S</strong> to save the file after it is
              opened.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
