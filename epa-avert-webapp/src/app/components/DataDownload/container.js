import { connect } from 'react-redux';
// components
import DataDownload from './index.js';
// actions
import {
  startCountyResultsDownload,
  startCobraResultsDownload,
} from 'app/redux/dataDownload';

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  onClickCountyResults() {
    dispatch(startCountyResultsDownload());
  },
  onClickCobraResults() {
    dispatch(startCobraResultsDownload());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DataDownload);
