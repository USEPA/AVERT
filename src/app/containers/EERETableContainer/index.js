import { connect } from 'react-redux';
// components
import EERETable from '../../components/EERETable';

const mapStateToProps = (state) => ({
  hourlyEere: state.eere.hourlyEere,
});

const EERETableContainer = connect(
  mapStateToProps,
  null
)(EERETable);

export default EERETableContainer;
