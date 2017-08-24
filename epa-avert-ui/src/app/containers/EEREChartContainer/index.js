import { connect } from 'react-redux';
// components
import EEREChart from '../../components/EEREChart';

const mapStateToProps = (state) => ({
  softValid: state.eere.soft_valid,
  softTopExceedanceTimestamp: state.eere.soft_top_exceedance_timestamp,
  softTopExceedance: state.eere.soft_top_exceedance_value,
  hardValid: state.eere.hard_valid,
  hardTopExceedanceTimestamp: state.eere.hard_top_exceedance_timestamp,
  hardTopExceedance: state.eere.hard_top_exceedance_value,

  hourlyEere: state.eere.hourlyEere,
});

const EEREChartContainer = connect(
  mapStateToProps,
  null
)(EEREChart);

export default EEREChartContainer;
