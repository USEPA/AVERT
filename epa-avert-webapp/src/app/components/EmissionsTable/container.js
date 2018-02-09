import { connect } from 'react-redux';
import StatesEnum from 'app/utils/StatesEnum';
// components
import EmissionsTable from './index.js';

const mapStateToProps = (state) => ({
  status: state.stateEmissions.status,
  data: state.stateEmissions.results.data,
  states: state.stateEmissions.results.states.map(state => StatesEnum[state]),
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(EmissionsTable);
