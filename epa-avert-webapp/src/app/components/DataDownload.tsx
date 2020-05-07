import React from 'react';
import { useDispatch } from 'react-redux';
// reducers
import {
  startCountyResultsDownload,
  startCobraResultsDownload,
} from 'app/redux/reducers/dataDownload';

function DataDownload() {
  const dispatch = useDispatch();

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
            dispatch(startCountyResultsDownload());
          }}
        >
          Download County Level Results
        </a>
      </p>

      <p className="avert-centered">
        <a
          className="avert-button"
          href="/"
          onClick={(ev) => {
            ev.preventDefault();
            dispatch(startCobraResultsDownload());
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
