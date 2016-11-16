import { connect } from 'react-redux';
// components
import App from '../../components/App';

const mapStateToProps = (state) => {
  return {
    activeStep: state.activeStep
  }
};

const mapDispatchToProps = (dispatch) => {
  return {}
};

const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default AppContainer;
