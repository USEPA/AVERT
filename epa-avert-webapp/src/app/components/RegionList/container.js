import { connect } from 'react-redux';
// components
import RegionList from './index.js';
// actions
import { selectRegion } from 'app/redux/region';

const mapStateToProps = (state) => ({
  selectedRegion: state.region.id,
});

const mapDispatchToProps = (dispatch) => ({
  onSelectChange: (regionId) => {
    dispatch(selectRegion(regionId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(RegionList);
