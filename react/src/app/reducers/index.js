import { combineReducers } from 'redux';
import regions from './regions';
import eere from './eere';

const avertApp = combineReducers({
	eere,
    regions,
});



export default avertApp;