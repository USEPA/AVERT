/**
 * @typedef {Object} RdfJson
 * @property {RdfRegion} region
 * @property {RdfRun} run
 * @property {RdfLimits} limits
 * @property {RdfRegionalLoad[]} regional_load
 * @property {number[]} load_bin_edges
 * @property {RdfData} data
 */

/**
 * @typedef {Object} RdfRegion
 * @property {string} region_abbv
 * @property {string} region_name
 * @property {string} region_states
 */

/**
 * @typedef {Object} RdfRun
 * @property {number} region_id
 * @property {number} year
 * @property {string[]} file_name
 * @property {number} mc_runs
 * @property {number} mc_gen_runs
 */

/**
 * @typedef {Object} RdfLimits
 * @property {number} id
 * @property {number} region_id
 * @property {number} year
 * @property {number} max_solar_wind_mwh
 * @property {number} max_ee_yearly_gwh
 * @property {number} max_ee_percent
 * @property {?string[]} created_at
 * @property {?string[]} updated_at
 */

/**
 * @typedef {Object} RdfRegionalLoad
 * @property {number} hour_of_year
 * @property {number} year
 * @property {1|2|3|4|5|6|7|8|9|10|11|12} month
 * @property {number} day
 * @property {number} hour
 * @property {number} regional_load_mw
 * @property {number} hourly_limit
 */

/**
 * @typedef {Object} RdfData
 * @property {EguData[]} generation
 * @property {EguData[]} so2
 * @property {EguData[]} so2_not
 * @property {EguData[]} nox
 * @property {EguData[]} nox_not
 * @property {EguData[]} co2
 * @property {EguData[]} co2_not
 * @property {EguData[]} heat
 * @property {EguData[]} heat_not
 * @property {EguData[]} pm25
 * @property {EguData[]} pm25_not
 */

/**
 * @typedef {Object} EguData
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
 * @typedef {Object} NeiJson
 * @property {NeiRegion[]} regions
 */

/**
 * @typedef {Object} NeiRegion
 * @property {string} name
 * @property {NeiEgu[]} egus
 */

/**
 * @typedef {Object} NeiEgu
 * @property {string} state
 * @property {string} county
 * @property {string} plant
 * @property {number} orispl_code
 * @property {string} unit_code
 * @property {string} full_name
 * @property {NeiData[]} annual_data
 */

/**
 * @typedef {Object} NeiData
 * @property {number} year
 * @property {number} generation
 * @property {number} heat
 * @property {?number} pm25
 * @property {?number} vocs
 * @property {?number} nh3
 */

/**
* @typedef {Object} MonthlyDisplacement
* @property {Displacement} month1
* @property {Displacement} month2
* @property {Displacement} month3
* @property {Displacement} month4
* @property {Displacement} month5
* @property {Displacement} month6
* @property {Displacement} month7
* @property {Displacement} month8
* @property {Displacement} month9
* @property {Displacement} month10
* @property {Displacement} month11
* @property {Displacement} month12
*/

/**
* @typedef {Object} Displacement
* @property {number} original
* @property {number} postEere
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
 * Caclulates displacement for a given metric.
 * @param {Object} options
 * @param {number} options.year
 * @param {'generation'|'so2'|'nox'|'co2'|'nei'} options.metric
 * @param {RdfJson} options.rdfJson
 * @param {?NeiJson} options.neiJson
 * @param {number[]} options.eereLoad
 */
function getDisplacement({ year, metric, rdfJson, neiJson, eereLoad }) {
  // NOTE: displacement data for PM2.5, VOCs, and NH3 pollutants are all
  // calculated when the provided metric parameter equals "nei"
  //
  // emissions rates for those pollutants are calculated with both the data in the
  // "heat" (and related "heat_not") key of the RDF's data object and data stored
  // in the `app/data/annual-emission-factors.json` file, whose data is passed as
  // the "neiJson" parameter as well ("neiJson" will be null unless the "metric"
  // parameter equals "nei" – see calculateMetric() in `app/controllers.js`)
  //
  // that "neoJson" data contains annual point-source data from the National
  // Emissions Inventory for every EGU, organized by region

  /** @type {NeiEgu[]} - used to calculate PM2.5, VOCs, and NH3's emission rates */
  let regionalNeiEgus = [];

  if (metric === 'nei' && neiJson) {
    regionalNeiEgus = neiJson.regions.find((region) => {
      return region.name === rdfJson.region.region_name;
    }).egus;
  }

  // set ozoneData and nonOzoneData based on provided metric
  /** @type {EguData[]} */
  const ozoneData = metric === 'nei'
    ? rdfJson.data['heat']
    : rdfJson.data[metric];

  /** @type {EguData[]|false} */
  const nonOzoneData = metric === 'nei'
    ? rdfJson.data['heat_not']
    : rdfJson.data[`${metric}_not`] || false; // false fallback for generation

  /**
   * monthly original and post-eere calculated values for the region
   * @type {MonthlyDisplacement}
   */
  const regionalData = {};

  /**
   * monthly original and post-eere calculated values for each state
   * @type {Object.<string, MonthlyDisplacement>}
   */
  const stateData = {};

  /**
   * monthly original and post-eere calculated values for each county within each state
   * @type {Object.<string, Object.<string, MonthlyDisplacement>>}
   */
  const countyData = {};

  // load bin edges
  const firstEdge = rdfJson.load_bin_edges[0];
  const lastEdge = rdfJson.load_bin_edges[rdfJson.load_bin_edges.length - 1];

  // dataset medians (ozone and non-ozone)
  const ozoneMedians = ozoneData.map((data) => data.medians);
  const nonOzoneMedians = nonOzoneData
    ? nonOzoneData.map((data) => data.medians)
    : false;

  /** @type {number[]} - used to calculate 'originalTotal' returned data */
  const hourlyOriginalTotals = new Array(rdfJson.regional_load.length).fill(0);

  /** @type {number[]} - used to calculate 'postEereTotal' returned data */
  const hourlyPostEereTotals = new Array(rdfJson.regional_load.length).fill(0);

  // iterate over each hour in the year (8760 in non-leap years)
  for (let i = 0; i < rdfJson.regional_load.length; i++) {
    const month = rdfJson.regional_load[i].month;                   // numeric month of load
    const originalLoad = rdfJson.regional_load[i].regional_load_mw; // original regional load (mwh)
    const postEereLoad = originalLoad + eereLoad[i];                // EERE-merged regional load (mwh)

    const originalLoadInBounds = originalLoad >= firstEdge && originalLoad <= lastEdge;
    const postEereLoadInBounds = postEereLoad >= firstEdge && postEereLoad <= lastEdge;

    // filter out outliers
    if (!(originalLoadInBounds && postEereLoadInBounds)) continue;

    // get index of item closest to originalLoad or postEereLoad in load_bin_edges array
    const originalLoadBinIndex = excelMatch(rdfJson.load_bin_edges, originalLoad);
    const postEereLoadBinIndex = excelMatch(rdfJson.load_bin_edges, postEereLoad);

    // set activeMedians, based on nonOzoneMedians value and month
    const activeMedians = nonOzoneMedians
      ? (month >= 5 && month <= 9) ? ozoneMedians : nonOzoneMedians
      : ozoneMedians;

    // iterate over each EGU (electric generating unit) in ozoneData (e.g. rdfJson.data.generation)
    // the total number of EGUs varies per region...
    // (less than 100 for the RM region; more than 1000 for the SE region)
    ozoneData.forEach((egu, index) => {
      const medians = activeMedians[index];
      const stateId = egu.state;
      const county = egu.county;

      let calculatedOriginal = calculateLinear({
        load: originalLoad,
        genA: medians[originalLoadBinIndex],
        genB: medians[originalLoadBinIndex + 1],
        edgeA: rdfJson.load_bin_edges[originalLoadBinIndex],
        edgeB: rdfJson.load_bin_edges[originalLoadBinIndex + 1]
      });

      // handle special exclusions for emissions changes at specific EGUs
      // (specifically added for errors with SO2 reporting, but the RDFs have
      // been updated to include the `infreq_emissions_flag` for all metrics
      // for consistency, which allows other metrics at specific EGUs
      // to be excluded in the future)
      let calculatedPostEere = egu.infreq_emissions_flag === 1
        ? calculatedOriginal
        : calculateLinear({
            load: postEereLoad,
            genA: medians[postEereLoadBinIndex],
            genB: medians[postEereLoadBinIndex + 1],
            edgeA: rdfJson.load_bin_edges[postEereLoadBinIndex],
            edgeB: rdfJson.load_bin_edges[postEereLoadBinIndex + 1],
          });

      // NEI factor applied for PM2.5, VOCs, and NH3 pollutants
      if (metric === 'nei') {
        const matchedEgu = regionalNeiEgus.find((n) => {
          return n.orispl_code === egu.orispl_code && n.unit_code === egu.unit_code;
        });

        // NEI EGU data for the given year
        const neiEguData = matchedEgu.annual_data.find((d) => d.year === year);

        // TODO: don't hardcode PM2.5, but run the calculation for all three pollutants
        calculatedOriginal = calculatedOriginal * neiEguData['PM2.5'];
        calculatedPostEere = calculatedPostEere * neiEguData['PM2.5'];
      }

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

      // increment hourly total arrays for each EGU for the given hour
      hourlyOriginalTotals[i] += calculatedOriginal;
      hourlyPostEereTotals[i] += calculatedPostEere;
    });
  }

  return {
    regionId: rdfJson.region.region_abbv,
    pollutant: metric,
    originalTotal: hourlyOriginalTotals.reduce((acc, cur) => acc + (cur || 0), 0),
    postEereTotal: hourlyPostEereTotals.reduce((acc, cur) => acc + (cur || 0), 0),
    regionalData,
    stateData,
    countyData,
  };
}

module.exports = getDisplacement;
