import { connect } from 'react-redux';
// components
import EEREInputField from './index.js';
// actions
import { calculateEereProfile } from 'app/redux/eere';

const mapStateToProps = (state) => ({
  valid: state.eere.valid,
});

const mapDispatchToProps = (dispatch) => ({
  onCalculateProfile() {
    dispatch(calculateEereProfile());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EEREInputField);
