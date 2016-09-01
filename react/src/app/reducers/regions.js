import { combineReducers } from 'redux';
import { SELECT_REGION, INVALIDATE_REGION, REQUEST_REGION, RECEIVE_REGION } from '../actions';

function selectedRegion(state = 'NE', action) {
	switch (action.type) {
		case SELECT_REGION:
			return action.region;
		default:
			return state;
	}
}

function data(state = { isFetch: false, didInvalidate: false, items: [] }, action) {
	switch (action.type) {
		case INVALIDATE_REGION:
			return Object.assign({}, state, {
				didInvalidate: true
			});

		case REQUEST_REGION:
			return Object.assign({}, state, {
				isFetching: true,
				didInvalidate: false
			});

		case RECEIVE_REGION:
			return Object.assign({}, state, {
				isFetching: false,
				didInvalidate: false,
				items: action.posts,
				lastUpdated: action.receivedAt
			});

		default:
			return state;
	}
}

function dataByRegion(state = {}, action) {
	switch (action.type) {
		case INVALIDATE_REGION:
		case RECEIVE_REGION:
		case REQUEST_REGION:
			return Object.assign({}, state, {
				[action.region]: data(state[action.region], action)
			});
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	selectedRegion,
	dataByRegion
});

export default rootReducer;