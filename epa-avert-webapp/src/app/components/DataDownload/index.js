// @flow

import React from 'react';

const isDesktopSafari =
  navigator.userAgent.toLowerCase().indexOf('safari') !== -1 &&
  navigator.userAgent.toLowerCase().indexOf('chrome') === -1 &&
  navigator.userAgent.toLowerCase().indexOf('mobi') === -1;

const SafariWarning = isDesktopSafari ? (
  <p className="avert-message-bottom avert-validation-warning avert-centered">
    Please press ⌘ + S to save the file after it is opened.
  </p>
) : (
  ''
);

type Props = {
  heading: string,
  // redux connected props
  onClickCountyResults: () => void,
  onClickCobraResults: () => void,
};

const DataDownload = (props: Props) => (
  <div className="avert-data-download">
    <h3 className="avert-heading-three">{props.heading}</h3>

    <p>
      Download monthly displacement data for each county, state, and region in
      this analysis, in CSV format.
    </p>

    <p className="avert-centered">
      <a
        className="avert-button"
        href=""
        onClick={(event) => {
          event.preventDefault();
          props.onClickCountyResults();
        }}
      >
        Download County Level Results
      </a>
    </p>

    <p className="avert-centered">
      <a
        className="avert-button"
        href=""
        onClick={(event) => {
          event.preventDefault();
          props.onClickCobraResults();
        }}
      >
        Download COBRA Results
      </a>
    </p>

    {SafariWarning}
  </div>
);

export default DataDownload;
