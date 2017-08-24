import { connect } from 'react-redux';
// components
import DisplacementsTable from '../../components/DisplacementsTable';

const mapStateToProps = (state) => ({
  annualStatus: state.annualDisplacement.status,
  data: state.annualDisplacement.results,
});

const DisplacementsTableContainer = connect(
  mapStateToProps,
  null,
)(DisplacementsTable);

export default DisplacementsTableContainer;
