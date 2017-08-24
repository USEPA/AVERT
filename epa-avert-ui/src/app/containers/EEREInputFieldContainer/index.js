import { connect } from 'react-redux';
// components
import EEREInputField from '../../components/EEREInputField';
// action creators
import { calculateEereProfile } from '../../actions';

const mapStateToProps = (state) => ({
  valid: state.eere.valid,
});

const mapDispatchToProps = (dispatch) => ({
  onCalculateProfile() {
    calculateEereProfile();
  },
});

const EEREInputFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EEREInputField);

export default EEREInputFieldContainer;
