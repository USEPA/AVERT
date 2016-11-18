import { connect } from 'react-redux';
// components
import RegionList from '../../components/RegionList';
// action creators
import { changeSelectedRegion } from '../../actions';

const mapStateToProps = (state) => {
  return {
    selectedRegion: state.selectedRegion,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectChange: (text) => {
      dispatch(changeSelectedRegion(text))
    },
  }
};

const RegionListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionList);

export default RegionListContainer;
