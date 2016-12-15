export const extractDownloadStructure = (type, emissionsOrPercentages, data, state, county) => {

  return {
    type: type,
    aggregation_level: county ? 'County' : (state ? 'State' : 'Regional'),
    state: state ? state : null,
    county: county ? county : null,
    emission_unit: emissionsOrPercentages,
    january: data[state ? 1 : 0],
    february: data[state ? 2 : 1],
    march: data[state ? 3 : 2],
    april: data[state ? 4 : 3],
    may: data[state ? 5 : 4],
    june: data[state ? 6 : 5],
    july: data[state ? 7 : 6],
    august: data[state ? 8 : 7],
    september: data[state ? 9 : 8],
    october: data[state ? 10 : 9],
    november: data[state ? 11 : 10],
    december: data[state ? 12 : 11],
  }
}