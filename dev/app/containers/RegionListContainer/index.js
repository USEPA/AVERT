import { connect } from 'react-redux';
// components
import RegionList from '../../components/RegionList';
// action creators
import { changeSelectedRegion } from '../../actions';

const mapStateToProps = (state) => {
  return {
    selectedRegion: state.selectedRegion
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelectChange: (name) => {
      dispatch(changeSelectedRegion(name))
    }
  }
};

const RegionListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionList);

export default RegionListContainer;
