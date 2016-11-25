import { connect } from 'react-redux';
// components
import EmissionsTable from '../../components/EmissionsTable';

const mapStateToProps = (state) => ({
  state_status: state.stateEmissions.status,
  data: state.stateEmissions.results.data ? state.stateEmissions.results.data : {},
  states: state.stateEmissions.results.states ? state.stateEmissions.results.states : [],
});

const EmissionsTableContainer = connect(
  mapStateToProps,
  null
)(EmissionsTable);

export default EmissionsTableContainer;
