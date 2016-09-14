import fetch from 'isomorphic-fetch';

export const SELECT_REGION = 'SELECT_REGION';
export const UPDATE_YEAR = 'UPDATE_YEAR';
export const UPDATE_EERE_TOP_HOURS = 'UPDATE_EERE_TOP_HOURS';
export const UPDATE_EERE_REDUCTION = 'UPDATE_EERE_REDUCTION';
export const UPDATE_EERE_ANNUAL_GWH = 'UPDATE_EERE_ANNUAL_GWH';
export const UPDATE_EERE_CONSTANT_MW = 'UPDATE_EERE_CONSTANT_MW';
export const UPDATE_EERE_WIND_CAPACITY = 'UPDATE_EERE_WIND_CAPACITY';
export const UPDATE_EERE_UTILITY_SOLAR = 'UPDATE_EERE_UTILITY_SOLAR';
export const UPDATE_EERE_ROOFTOP_SOLAR = 'UPDATE_EERE_ROOFTOP_SOLAR';
export const SUBMIT_PARAMS = "SUBMIT_PARAMS";
export const INVALIDATE_REGION = 'INVALIDATE_REGION';
export const REQUEST_REGION = 'REQUEST_REGION';
export const RECEIVE_REGION = 'RECEIVE_REGION';
export const ADD_RDF = 'ADD_RDF';

export function selectRegion(region) {
	return {
		type: SELECT_REGION,
		region
	}
}

export function updateYear(year) {
	return {
		type: UPDATE_YEAR,
		year
	}
}

export function updateEereTopHours(text) {
	return {
		type: UPDATE_EERE_TOP_HOURS,
		text
	}
}

export function updateEereReduction(text) {
	return {
		type: UPDATE_EERE_REDUCTION,
		text
	}
}

export function updateEereAnnualGwh(text) {
	return {
		type: UPDATE_EERE_ANNUAL_GWH,
		text
	}
}

export function updateEereConstantMw(text) {
	return {
		type: UPDATE_EERE_CONSTANT_MW,
		text
	}
}

export function updateEereWindCapacity(text) {
	return {
		type: UPDATE_EERE_WIND_CAPACITY,
		text
	}
}

export function updateEereUtilitySolar(text) {
	return {
		type: UPDATE_EERE_UTILITY_SOLAR,
		text
	}
}

export function updateEereRooftopSolar(text) {
	return {
		type: UPDATE_EERE_ROOFTOP_SOLAR,
		text
	}
}

export function submitParams() {
	return {
		type: SUBMIT_PARAMS
	}
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