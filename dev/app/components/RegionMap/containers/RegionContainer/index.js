import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
// action creators
import { changeSelectedRegion } from '../../../../actions';

const Region = (props) => (
  <g className='avert-region'
    onClick={(e) => {
      props.onRegionClick(props.name);
    }}
    data-active={ props.name === props.selectedRegion ? true : false }
  >
    { props.children }
  </g>
);

Region.propTypes = {
  name: PropTypes.string.isRequired,
  onRegionClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};

const mapStateToProps = (state) => {
  return {
    selectedRegion: state.selectedRegion
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onRegionClick: (name) => {
      dispatch(changeSelectedRegion(name))
    }
  }
};

const RegionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Region);

export default RegionContainer;
