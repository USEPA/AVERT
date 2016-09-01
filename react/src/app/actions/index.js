import fetch from 'isomorphic-fetch';

export const SELECT_REGION = 'SELECT_REGION';
export function selectRegion(region) {
	return {
		type: SELECT_REGION,
		region
	}
}

export const INVALIDATE_REGION = 'INVALIDATE_REGION';
export function invalidateRegion(region) {
	return {
		type: INVALIDATE_REGION,
		region
	}
}

export const REQUEST_REGION = 'REQUEST_REGION';
export function requestRegion(region) {
	return {
		type: REQUEST_REGION,
		region
	}
}

export const RECEIVE_REGION = 'RECEIVE_REGION';
export function receiveRegion(region, json) {
	return {
		type: RECEIVE_REGION,
		region,
		posts: json.data.children.map(child => child.data),
		receivedAt: Date.now()
	}
}

export const ADD_RDF = 'ADD_RDF';
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