import { connect } from 'react-redux';
// components
import EEREChart from '../../components/EEREChart';

const mapStateToProps = (state) => ({
  softValid: state.eere.soft_valid,
  softTopExceedanceHour: state.eere.soft_top_exceedance_hour,
  softTopExceedance: state.eere.soft_top_exceedance_value,
  hardValid: state.eere.hard_valid,
  hardTopExceedanceHour: state.eere.hard_top_exceedance_hour,
  hardTopExceedance: state.eere.hard_top_exceedance_value,

  hourlyEere: state.eere.hourlyEere,
});

const EEREChartContainer = connect(
  mapStateToProps,
  null
)(EEREChart);

export default EEREChartContainer;
