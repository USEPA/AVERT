import React, { PropTypes } from 'react';

const DataDownload = (props) => (
  <div className='avert-data-download'>
    <h3 className='avert-heading-three'>{ props.heading }</h3>

    <p>Download monthly displacement data for each county, state, or region in this analysis, in CSV format.</p>

    <p className='avert-centered'><a className='avert-button' href=''>Download Results File</a></p>
  </div>
);

DataDownload.propTypes = {
  heading: PropTypes.string.isRequired,
};

export default DataDownload;
