import { connect } from 'react-redux';
// components
import Region from './index.js';
// actions
import { selectRegion } from 'app/redux/regions';

const mapStateToProps = (state) => ({
  selectedRegion: state.regions.region,
});

const mapDispatchToProps = (dispatch) => ({
  onRegionClick(regionId) {
    dispatch(selectRegion(regionId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Region);
