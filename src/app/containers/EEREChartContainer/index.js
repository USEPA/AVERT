import { connect } from 'react-redux';
// components
import EEREChart from '../../components/EEREChart';
// action creators
import { calculateEereProfile } from '../../actions';

const mapStateToProps = (state) => ({
  eere_status: state.eere.status,
  hourlyEere: state.eere.hourlyEere,
});

const mapDispatchToProps = (dispatch) => ({
  onCalculateProfile() {
    calculateEereProfile();
  },
});

const EEREChartContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EEREChart);

export default EEREChartContainer;
