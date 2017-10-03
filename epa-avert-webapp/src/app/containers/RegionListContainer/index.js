import { connect } from 'react-redux';
// components
import RegionList from '../../components/RegionList';
// action creators
import { selectRegion } from 'app/actions';

const mapStateToProps = (state) => ({
  selectedRegion: state.regions.region,
});

const mapDispatchToProps = (dispatch) => ({
  onSelectChange: (regionId) => {
    dispatch(selectRegion(regionId));
  },
});

const RegionListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegionList);

export default RegionListContainer;
