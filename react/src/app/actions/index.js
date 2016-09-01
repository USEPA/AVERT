let nextRdfId = 0;
export const addRdf = (text) => {
	return {
		type: 'ADD_RDF',
		id: nextRdfId++,
		text
	}
}