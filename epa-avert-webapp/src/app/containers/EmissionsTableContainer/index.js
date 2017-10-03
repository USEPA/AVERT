import { connect } from 'react-redux';
import StatesEnum from '../../utils/StatesEnum';
// components
import EmissionsTable from '../../components/EmissionsTable';

const mapStateToProps = (state) => ({
  state_status: state.stateEmissions.status,
  data: state.stateEmissions.results.data ? state.stateEmissions.results.data : {},
  states: state.stateEmissions.results.states ? state.stateEmissions.results.states.map(state => StatesEnum[state]) : [],
});

const EmissionsTableContainer = connect(
  mapStateToProps,
  null
)(EmissionsTable);

export default EmissionsTableContainer;
