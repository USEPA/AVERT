import { connect } from 'react-redux';
// components
import DisplacementsTable from './index.js';

const mapStateToProps = (state) => ({
  annualStatus: state.annualDisplacement.status,
  data: state.annualDisplacement.results,
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(DisplacementsTable);
