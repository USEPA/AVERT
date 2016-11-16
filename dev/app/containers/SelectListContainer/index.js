import { connect } from 'react-redux';
// components
import SelectList from '../../components/SelectList';
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

const SelectListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectList);

export default SelectListContainer;
