import { connect } from 'react-redux';
// components
import App from './index.js';

const mapStateToProps = (state) => ({
  activeStep: state.panel.activeStep,
});

const mapDispatchToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(App);
