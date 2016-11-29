import { connect } from 'react-redux';
// components
import EEREChart from '../../components/EEREChart';

const mapStateToProps = (state) => ({
  hourlyEere: state.eere.hourlyEere,
});

const EEREChartContainer = connect(
  mapStateToProps,
  null
)(EEREChart);

export default EEREChartContainer;
