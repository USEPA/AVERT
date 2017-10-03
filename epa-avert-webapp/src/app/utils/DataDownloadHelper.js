import _ from 'lodash';

export const extractDownloadStructure = (type, emissionsOrPercentages, data, state, county) => {
  data = _.values(data);
  return {
    type: type,
    aggregation_level: county ? 'County' : (state ? 'State' : 'Regional'),
    state: state ? state : null,
    county: county ? county : null,
    emission_unit: emissionsOrPercentages,
    january: data[0],
    february: data[1],
    march: data[2],
    april: data[3],
    may: data[4],
    june: data[5],
    july: data[6],
    august: data[7],
    september: data[8],
    october: data[9],
    november: data[10],
    december: data[11],
  }
}