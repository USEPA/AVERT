import { combineReducers } from 'redux';
import regions from './regions';
import eere from './eere';
import annualDisplacement from './annualDisplacement';
import monthlyEmissions from './monthlyEmissions';
import stateEmissions from './stateEmissions';

const avertApp = combineReducers({
	eere,
    annualDisplacement,
    stateEmissions,
    monthlyEmissions,
    regions,
});



export default avertApp;