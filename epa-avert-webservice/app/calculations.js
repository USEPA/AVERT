/**
 * @typedef {Object} RDF
 * @property {RdfData} data
 * @property {RdfLimits} limits
 * @property {number[]} load_bin_edges
 * @property {RdfRegion} region
 * @property {RdfRegionalLoad[]} regional_load
 * @property {RdfRun} run
 */

/**
 * @typedef {Object} RdfData
 * @property {LocationData[]} generation
 * @property {LocationData[]} so2
 * @property {LocationData[]} so2_not
 * @property {LocationData[]} nox
 * @property {LocationData[]} nox_not
 * @property {LocationData[]} co2
 * @property {LocationData[]} co2_not
 * @property {LocationData[]} pm25
 * @property {LocationData[]} pm25_not
 */

/**
 * @typedef {Object} LocationData
 * @property {string} state
 * @property {string} county
 * @property {number} lat
 * @property {number} lon
 * @property {string} fuel_type
 * @property {number} orispl_code
 * @property {string} unit_code
 * @property {string} full_name
 * @property {0|1} infreq_emissions_flag
 * @property {number[]} medians
 */

/**
 * @typedef {Object} RdfLimits
 * @property {string[]} created_at
 * @property {number} id
 * @property {number} max_ee_percent
 * @property {number} max_ee_yearly_gwh
 * @property {number} max_solar_wind_mwh
 * @property {number} region_id
 * @property {string[]} updated_at
 * @property {number} year
 */

/**
 * @typedef {Object} RdfRegion
 * @property {string} region_abbv
 * @property {string} region_name
 * @property {string} region_states
 */

/**
 * @typedef {Object} RdfRegionalLoad
 * @property {MonthNumber} month
 * @property {number} regional_load_mw
 */

/**
 * @typedef {1|2|3|4|5|6|7|8|9|10|11|12} MonthNumber
 */

/**
 * @typedef {'month1'|'month2'|'month3'|'month4'|'month5'|'month6'|'month7'|'month8'|'month9'|'month10'|'month11'|'month12'} MonthKey
 */

/**
 * @typedef {Object} RdfRun
 * @property {string[]} file_name
 * @property {number} mc_gen_runs
 * @property {number} mc_runs
 * @property {number} region_id
 * @property {number} year
 */

/**
* @typedef {Object} MonthlyDisplacement
* @property {DataByMonth} original
* @property {DataByMonth} postEere
*/

/**
 * @typedef {Object} DataByMonth
 * @property {number} MonthKey
 */

/**
 * @param {Object} options
 * @param {number} options.load
 * @param {number} options.genA
 * @param {number} options.genB
 * @param {number} options.edgeA
 * @param {number} options.edgeB
 */
function calculateLinear({ load, genA, genB, edgeA, edgeB }) {
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - (slope * edgeA);
  return load * slope + intercept;
};

/**
 * @param {number[]} array
 * @param {number} lookup
 */
function excelMatch(array, lookup) {
  const sortedArray = array.concat(lookup).sort((a, b) => a - b);
  const index = sortedArray.indexOf(lookup);
  // return index of item directly before lookup item in sorted array
  if (array[index] === lookup) return index;
  return index - 1;
};

/**
 * Caclulates displacement for a given pollutant.
 * @param {RDF} rdf
 * @param {number[]} eereLoad
 * @param {'generation'|'so2'|'nox'|'co2'|'pm25'} pollutant
 */
function getDisplacement(rdf, eereLoad, pollutant) {
  // set ozoneData and nonOzoneData based on provided pollutant
  const ozoneData = rdf.data[pollutant];

  /** @type {LocationData[]|false} */
  const nonOzoneData = rdf.data[`${pollutant}_not`] || false;

  /**
   * monthly original and post-eere calculated values for the region
   * @type {MonthlyDisplacement}
   */
  const regionalData = {}

  /**
   * monthly original and post-eere calculated values for each state
   * @type {Object.<string, MonthlyDisplacement>}
   */
  const stateData = {}

  /**
   * monthly original and post-eere calculated values for each county within each state
   * @type {Object.<string, Object.<string, MonthlyDisplacement>>}
   */
  const countyData = {}

  // load bin edges
  const firstEdge = rdf.load_bin_edges[0];
  const lastEdge = rdf.load_bin_edges[rdf.load_bin_edges.length - 1];

  // dataset medians (ozone and non-ozone)
  const ozoneMedians = ozoneData.map((data) => data.medians);
  const nonOzoneMedians = 
    nonOzoneData
      ? nonOzoneData.map((data) => data.medians)
      : false;

  /** @type {number[]} - used to calculate 'originalTotal' returned data */
  const originalTotals = new Array(rdf.regional_load.length).fill(0);

  /** @type {number[]} - used to calculate 'postEereTotal' returned data */
  const postEereTotals = new Array(rdf.regional_load.length).fill(0);

  // iterate over each hour in the year (8760 in non-leap years)
  for (let i = 0; i < rdf.regional_load.length; i++) {
    const month = rdf.regional_load[i].month;                   // numeric month of load
    const originalLoad = rdf.regional_load[i].regional_load_mw; // original regional load (mwh)
    const postEereLoad = originalLoad + eereLoad[i];            // EERE-merged regional load (mwh)

    const originalLoadInBounds = originalLoad >= firstEdge && originalLoad <= lastEdge;
    const postEereLoadInBounds = postEereLoad >= firstEdge && postEereLoad <= lastEdge;

    // filter out outliers
    if (!(originalLoadInBounds && postEereLoadInBounds)) continue;

    // get index of item closest to originalLoad or postEereLoad in load_bin_edges array
    const originalLoadBinIndex = excelMatch(rdf.load_bin_edges, originalLoad);
    const postEereLoadBinIndex = excelMatch(rdf.load_bin_edges, postEereLoad);

    // set activeMedians, based on passed nonOzoneMedians value and month
    const activeMedians =
      nonOzoneMedians
        ? (month >= 5 && month <= 9) ? ozoneMedians : nonOzoneMedians
        : ozoneMedians;

    // iterate over each location in ozoneData (e.g. rdf.data.generation)
    // the total number of iterations varies per region...
    // (less than 100 for the RM region; more than 1000 for the SE region)
    ozoneData.forEach((location, index) => {
      const medians = activeMedians[index];
      const stateId = location.state;
      const county = location.county;

      const calculatedOriginal = calculateLinear({
        load: originalLoad,
        genA: medians[originalLoadBinIndex],
        genB: medians[originalLoadBinIndex + 1],
        edgeA: rdf.load_bin_edges[originalLoadBinIndex],
        edgeB: rdf.load_bin_edges[originalLoadBinIndex + 1]
      });

      // handle special exclusions for emissions changes at specific locations
      // (specifically added for errors with SO2 reporting, but the RDFs have
      // been updated to include the `infreq_emissions_flag` for all pollutants
      // for consistency, which allows other pollutants at specific locations
      // to be excluded in the future)
      const calculatedPostEere =
        location.infreq_emissions_flag === 1
          ? calculatedOriginal
          : calculateLinear({
              load: postEereLoad,
              genA: medians[postEereLoadBinIndex],
              genB: medians[postEereLoadBinIndex + 1],
              edgeA: rdf.load_bin_edges[postEereLoadBinIndex],
              edgeB: rdf.load_bin_edges[postEereLoadBinIndex + 1],
            });

      // initialize the data structures for the region, each state, each county,
      // and each month if they haven't yet been set up, and increment by the
      // calculated original and calculated post-eere values for each day of the
      // month to arrive at cumulative total original and post-eere values for
      // the month for each data structure
      // NOTE: in the web app, we could just use `countyData` and derive state
      // totals and the region total by adding up values, but storing them
      // individually here is computationally smarter as it means we don't need
      // to re-iterate over data structures later to sum those totals
      regionalData[`month${month}`] = regionalData[`month${month}`] || {};
      regionalData[`month${month}`].original = regionalData[`month${month}`].original || 0;
      regionalData[`month${month}`].postEere = regionalData[`month${month}`].postEere || 0;
      regionalData[`month${month}`].original += calculatedOriginal;
      regionalData[`month${month}`].postEere += calculatedPostEere;

      stateData[stateId] = stateData[stateId] || {};
      stateData[stateId][`month${month}`] = stateData[stateId][`month${month}`] || {};
      stateData[stateId][`month${month}`].original = stateData[stateId][`month${month}`].original || 0;
      stateData[stateId][`month${month}`].postEere = stateData[stateId][`month${month}`].postEere || 0;
      stateData[stateId][`month${month}`].original += calculatedOriginal;
      stateData[stateId][`month${month}`].postEere += calculatedPostEere;

      countyData[stateId] = countyData[stateId] || {};
      countyData[stateId][county] = countyData[stateId][county] || {};
      countyData[stateId][county][`month${month}`] = countyData[stateId][county][`month${month}`] || {};
      countyData[stateId][county][`month${month}`].original = countyData[stateId][county][`month${month}`].original || 0;
      countyData[stateId][county][`month${month}`].postEere = countyData[stateId][county][`month${month}`].postEere || 0;
      countyData[stateId][county][`month${month}`].original += calculatedOriginal;
      countyData[stateId][county][`month${month}`].postEere += calculatedPostEere;

      // increment total and delta arrays with data
      originalTotals[i] += calculatedOriginal;
      postEereTotals[i] += calculatedPostEere;
    });
  }

  return {
    regionId: rdf.region.region_abbv,
    pollutant: pollutant,
    originalTotal: originalTotals.reduce((acc, cur) => acc + (cur || 0), 0),
    postEereTotal: postEereTotals.reduce((acc, cur) => acc + (cur || 0), 0),
    regionalData,
    stateData,
    countyData,
  };
}

module.exports = getDisplacement;
