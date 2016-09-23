import { combineReducers } from 'redux';
import regions from './regions';
import eere from './eere';
import generation from './generation';
import monthlyEmissions from './monthlyEmissions';
import stateEmissions from './stateEmissions';

const avertApp = combineReducers({
	eere,
    generation,
    monthlyEmissions,
    stateEmissions,
    regions,
});



export default avertApp;