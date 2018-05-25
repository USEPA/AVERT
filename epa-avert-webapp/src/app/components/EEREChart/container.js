import { connect } from 'react-redux';
// components
import EEREChart from './index.js';

const mapStateToProps = (state) => ({
  softValid: state.eere.softLimit.valid,
  softTopExceedanceValue: state.eere.softLimit.topExceedanceValue,
  softTopExceedanceTimestamp: state.eere.softLimit.topExceedanceTimestamp,
  hardValid: state.eere.hardLimit.valid,
  hardTopExceedanceValue: state.eere.hardLimit.topExceedanceValue,
  hardTopExceedanceTimestamp: state.eere.hardLimit.topExceedanceTimestamp,
  hourlyEere: state.eere.hourlyEere,
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(EEREChart);
