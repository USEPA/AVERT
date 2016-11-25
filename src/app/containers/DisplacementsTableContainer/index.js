import { connect } from 'react-redux';
// components
import DisplacementsTable from '../../components/DisplacementsTable';
// action creators
import { calculateDisplacement } from '../../actions';

const mapStateToProps = (state) => ({
  annual_status: state.annualDisplacement.status,
  data: state.annualDisplacement.results,
});

const mapDispatchToProps = (dispatch) => ({
  onCalculateDisplacement() {
    calculateDisplacement();
  },
});

const DisplacementsTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DisplacementsTable);

export default DisplacementsTableContainer;
