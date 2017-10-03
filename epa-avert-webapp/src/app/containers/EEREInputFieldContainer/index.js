import { connect } from 'react-redux';
// components
import EEREInputField from '../../components/EEREInputField';
// action creators
import { calculateEereProfile } from 'app/actions';

const mapStateToProps = (state) => ({
  valid: state.eere.valid,
});

const mapDispatchToProps = (dispatch) => ({
  onCalculateProfile() {
    dispatch(calculateEereProfile());
  },
});

const EEREInputFieldContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EEREInputField);

export default EEREInputFieldContainer;
