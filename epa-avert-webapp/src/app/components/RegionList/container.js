import { connect } from 'react-redux';
// components
import RegionList from './index.js';
// actions
import { selectRegion } from 'app/actions';

const mapStateToProps = (state) => ({
  selectedRegion: state.regions.region,
});

const mapDispatchToProps = (dispatch) => ({
  onSelectChange: (regionId) => {
    dispatch(selectRegion(regionId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RegionList);
