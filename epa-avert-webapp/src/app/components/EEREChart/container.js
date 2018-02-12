import { connect } from 'react-redux';
// components
import EEREChart from './index.js';

const mapStateToProps = (state) => ({
  softValid: state.eere.softValid,
  softTopExceedanceTimestamp: state.eere.softTopExceedanceTimestamp,
  softTopExceedance: state.eere.softTopExceedanceValue,
  hardValid: state.eere.hardValid,
  hardTopExceedanceTimestamp: state.eere.hardTopExceedanceTimestamp,
  hardTopExceedance: state.eere.hardTopExceedanceValue,
  hourlyEere: state.eere.hourlyEere,
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(EEREChart);
