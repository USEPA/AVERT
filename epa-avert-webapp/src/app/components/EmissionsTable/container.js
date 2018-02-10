import { connect } from 'react-redux';
// enums
import States from 'app/enums/States';
// components
import EmissionsTable from './index.js';

const mapStateToProps = (state) => ({
  status: state.stateEmissions.status,
  data: state.stateEmissions.results.data,
  states: state.stateEmissions.results.states.map(state => States[state]),
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(EmissionsTable);
