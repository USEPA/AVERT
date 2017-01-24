import React, { PropTypes } from 'react';

const isDesktopSafari =
  navigator.userAgent.toLowerCase().indexOf('safari') !== -1 &&
  navigator.userAgent.toLowerCase().indexOf('chrome') === -1 &&
  navigator.userAgent.toLowerCase().indexOf('mobi') === -1;

const safariWarning = isDesktopSafari ? (
  <p className='avert-message-bottom avert-validation-warning avert-centered'>
    {'Please press ⌘ + S to save the file after it is opened.'}
  </p>
) : '';

const DataDownload = (props) => (
  <div className='avert-data-download'>
    <h3 className='avert-heading-three'>{ props.heading }</h3>

    <p>{'Download monthly displacement data for each county, state, and region in this analysis, in CSV format.'}</p>

    <p className='avert-centered'>
      <a className='avert-button' href='' onClick={(e) => {
        e.preventDefault();
        props.onClick();
      }}>{'Download Results File'}</a>
    </p>

    { safariWarning }
  </div>
);

DataDownload.propTypes = {
  heading: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default DataDownload;
