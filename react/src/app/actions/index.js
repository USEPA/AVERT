// Deps
import fetch from 'isomorphic-fetch';

// App
import { avert, eereProfile } from '../avert';
import { store } from '../store';

// Constants
export const SELECT_REGION = 'SELECT_REGION';
export const UPDATE_YEAR = 'UPDATE_YEAR';
export const UPDATE_EERE_TOP_HOURS = 'UPDATE_EERE_TOP_HOURS';
export const UPDATE_EERE_REDUCTION = 'UPDATE_EERE_REDUCTION';
export const UPDATE_EERE_ANNUAL_GWH = 'UPDATE_EERE_ANNUAL_GWH';
export const UPDATE_EERE_CONSTANT_MW = 'UPDATE_EERE_CONSTANT_MW';
export const UPDATE_EERE_WIND_CAPACITY = 'UPDATE_EERE_WIND_CAPACITY';
export const UPDATE_EERE_UTILITY_SOLAR = 'UPDATE_EERE_UTILITY_SOLAR';
export const UPDATE_EERE_ROOFTOP_SOLAR = 'UPDATE_EERE_ROOFTOP_SOLAR';
export const SUBMIT_PARAMS = 'SUBMIT_PARAMS';
export const SUBMIT_CALCULATION = 'SUBMIT_CALCULATION';
export const COMPLETE_CALCULATION = "COMPLETE_CALCULATION";
export const START_DISPLACEMENT = 'START_DISPLACEMENT';
export const COMPLETE_ANNUAL = 'COMPLETE_ANNUAL';
export const COMPLETE_MONTHLY = 'COMPLETE_MONTHLY';
export const COMPLETE_STATE = 'COMPLETE_STATE';
export const INVALIDATE_REGION = 'INVALIDATE_REGION';
export const REQUEST_REGION = 'REQUEST_REGION';
export const RECEIVE_REGION = 'RECEIVE_REGION';
export const ADD_RDF = 'ADD_RDF';

// Actions
export function selectRegion(region) {
	avert.setRegion(region);	
	return {
		type: SELECT_REGION,
		region
	}
}

export function updateYear(year) {
	avert.setYear(year);	
	return {
		type: UPDATE_YEAR,
		year
	}
}

export function updateEereTopHours(text) {
	store.dispatch(submitParams());
    eereProfile.setTopHours(text); 	
	return {
		type: UPDATE_EERE_TOP_HOURS,
		text
	}
}

export function updateEereReduction(text) {
	store.dispatch(submitParams());
    eereProfile.setReduction(text);	
	return {
		type: UPDATE_EERE_REDUCTION,
		text
	}
}

export function updateEereAnnualGwh(text) {
	store.dispatch(submitParams());
    eereProfile.setAnnualGwh(text);	
	return {
		type: UPDATE_EERE_ANNUAL_GWH,
		text
	}
}

export function updateEereConstantMw(text) {
	store.dispatch(submitParams());
    eereProfile.setConstantMw(text);
	return {
		type: UPDATE_EERE_CONSTANT_MW,
		text
	}
}

export function updateEereWindCapacity(text) {
	store.dispatch(submitParams());
    eereProfile.setWindCapacity(text);	
	return {
		type: UPDATE_EERE_WIND_CAPACITY,
		text
	}
}

export function updateEereUtilitySolar(text) {
	store.dispatch(submitParams());
    eereProfile.setUtilitySolar(text);	
	return {
		type: UPDATE_EERE_UTILITY_SOLAR,
		text
	}
}

export function updateEereRooftopSolar(text) {
	store.dispatch(submitParams());
    eereProfile.setRooftopSolar(text);	
	return {
		type: UPDATE_EERE_ROOFTOP_SOLAR,
		text
	}
}

export function submitParams() {
    avert.setEereProfile(eereProfile);	
	return {
		type: SUBMIT_PARAMS
	}
}

function submitCalculation() {
	return {
		type: SUBMIT_CALCULATION
	}
}

export function completeCalculation(hourlyEere) {
	return {
		type: COMPLETE_CALCULATION,
		hourlyEere
	}
}

export function calculateEereProfile() {
	store.dispatch(submitCalculation());

	setTimeout(() => {
		avert.calculateEereLoad();
	},50)
}

function startDisplacement() {
	return {
		type: START_DISPLACEMENT,
	}
}

export function completeAnnual(data) {
	return {
		type: COMPLETE_ANNUAL,
		data
	}
}

export function completeMonthlyEmissions(data) {
	return {
		type: COMPLETE_MONTHLY,
		data
	}
}

export function completeStateEmissions(data) {
	return {
		type: COMPLETE_STATE,
		data
	}
}

export function calculateDisplacement() {
	store.dispatch(startDisplacement());
	
	setTimeout(() => {
		avert.calculateDisplacement();
	},50);
}

export function invalidateRegion(region) {
	return {
		type: INVALIDATE_REGION,
		region
	}
}

export function requestRegion(region) {
	return {
		type: REQUEST_REGION,
		region
	}
}

export function receiveRegion(region, json) {
	return {
		type: RECEIVE_REGION,
		region,
		posts: json.data.children.map(child => child.data),
		receivedAt: Date.now()
	}
}

let nextRdfId = 0;
export function addRdf(rdf) {
	return {
		type: 'ADD_RDF',
		id: nextRdfId++,
		rdf
	}
}

export function fetchRegion(region) {
	return function(dispatch) {
		dispatch(requestRegion(region));

		return fetch(`http://www.reddit.com/r/${region}.json`)
			.then(response => response.json())
			.then(json =>
				dispatch(receiveRegion(region, json))
			)
	}
}