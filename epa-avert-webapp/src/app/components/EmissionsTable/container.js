import { connect } from 'react-redux';
// enums
import States from 'app/enums/States';
// components
import EmissionsTable from './index.js';

const mapStateToProps = (state) => ({
  status: state.stateEmissions.status,
  data: state.stateEmissions.data,
  states: state.stateEmissions.states.map((state) => States[state]),
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(EmissionsTable);
