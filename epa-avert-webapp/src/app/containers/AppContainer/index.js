import { connect } from 'react-redux';
// components
import App from '../../components/App';

const mapStateToProps = (state) => ({
  activeStep: state.panel.activeStep,
});

const AppContainer = connect(
  mapStateToProps,
  null
)(App);

export default AppContainer;
