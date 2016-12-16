import React, { PropTypes } from 'react';

const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') !== -1 && navigator.userAgent.toLowerCase().indexOf('chrome') === -1;
const safariWarning = isSafari ? (
  <p className='avert-safari-warning'>Safari users, please press ⌘ + S to save the file after it is opened.</p>
) : '';

const DataDownload = (props) => (
  <div className='avert-data-download'>
    <h3 className='avert-heading-three'>{ props.heading }</h3>

    <p>Download monthly displacement data for each county, state, or region in this analysis, in CSV format.</p>
    {safariWarning}
    <p className='avert-centered'>
      <a className='avert-button' href='' onClick={(e) => {
        e.preventDefault();
        props.onClick();
      }}>Download Results File</a>
    </p>
  </div>
);

DataDownload.propTypes = {
  heading: PropTypes.string.isRequired,
  onClick: PropTypes.func
};

export default DataDownload;
