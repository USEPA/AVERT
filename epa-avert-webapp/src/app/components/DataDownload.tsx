import React from 'react';
import json2csv from 'json2csv';
import Blob from 'blob';
import FileSaver from 'file-saver';
// reducers
import { useTypedSelector } from 'app/redux/index';
// hooks
import { useSelectedRegions } from 'app/hooks';

function downloadDataFile(fileName: string, data: any) {
  const fields = Object.keys(data[0]);

  try {
    const csv = json2csv.parse(data, { fields });
    const blob = new Blob([csv], { type: 'text/plain:charset=utf-8' });
    FileSaver.saveAs(blob, `${fileName}.csv`);
  } catch (err) {
    console.error(err);
  }
}

function DataDownload() {
  const countyData = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.downloadableCountyData,
  );
  const cobraData = useTypedSelector(
    ({ monthlyEmissions }) => monthlyEmissions.downloadableCobraData,
  );

  // TODO: determine how to handle when multiple regions are selected
  const regions = useSelectedRegions();
  const regionName = regions[0]?.name;

  const isDesktopSafari =
    navigator.userAgent.toLowerCase().indexOf('safari') !== -1 &&
    navigator.userAgent.toLowerCase().indexOf('chrome') === -1 &&
    navigator.userAgent.toLowerCase().indexOf('mobi') === -1;

  return (
    <div className="avert-data-download">
      <h3 className="avert-heading-three">Data Download</h3>

      <p>
        Download monthly displacement data for each county, state, and region in
        this analysis, in CSV format.
      </p>

      <p className="avert-centered">
        <a
          className="avert-button"
          href="/"
          onClick={(ev) => {
            ev.preventDefault();
            const fileName = `AVERT Monthly Emission Changes (${regionName})`;
            downloadDataFile(fileName, countyData);
          }}
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
          href="/"
          onClick={(ev) => {
            ev.preventDefault();
            const fileName = `AVERT COBRA (${regionName})`;
            downloadDataFile(fileName, cobraData);
          }}
        >
          Download COBRA Results
        </a>
      </p>

      {isDesktopSafari && (
        <p className="avert-message-bottom avert-validation-warning avert-centered">
          Please press ⌘ + S to save the file after it is opened.
        </p>
      )}
    </div>
  );
}

export default DataDownload;
