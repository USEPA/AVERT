// Deps
import { combineReducers } from 'redux';

// App
import { 
	UPDATE_YEAR, 
	SELECT_REGION, 
} from '../actions';

function options(state = {}, action) {
	switch(action.type) {
		case SELECT_REGION:
			return Object.assign({}, state, {
				region: action.region
			});
		case UPDATE_YEAR:
			return Object.assign({}, state, {
				year: action.year
			});		
		default:
			return state;

	}
}

const rootReducer = combineReducers({
	options,
});

export default rootReducer;