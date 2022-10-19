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
 * @typedef {MonthlyDisplacement} PollutantRegionalData
 */

/**
 * @typedef {Object.<string, MonthlyDisplacement>} PollutantStateData
 */

/**
 * @typedef {Object.<string, Object.<string, MonthlyDisplacement>>} PollutantCountyData
 */

/**
 * @typedef {Object} PollutantDisplacement
 * @property {string} regionId
 * @property {number} originalTotal
 * @property {number} postEereTotal
 * @property {PollutantRegionalData} regionalData
 * @property {PollutantStateData} stateData
 * @property {PollutantCountyData} countyData
 */

/**
 * @typedef {'generation'|'so2'|'nox'|'co2'|'pm25'|'vocs'|'nh3'} Pollutant
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
  const intercept = genA - slope * edgeA;
  return load * slope + intercept;
}

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
}

/**
 * Caclulates displacement for a given metric.
 * @param {Object} options
 * @param {number} options.year
 * @param {'generation'|'so2'|'nox'|'co2'|'nei'} options.metric
 * @param {RdfJson} options.rdfJson
 * @param {?NeiJson} options.neiJson
 * @param {number[]} options.eereLoad
 * @param {boolean} options.debug
 */
function getDisplacement({ year, metric, rdfJson, neiJson, eereLoad, debug }) {
  /**
   * this displacements object's keys will be one of type `Pollutant`, with
   * the key's values being the calculated displacement data for that pollutant.
   * an object with pollutants as keys is the return value from this function
   * because if the provided `metric` parameter equals "nei", displacements will
   * be calculated for multiple pullutants (PM2.5, VOCs, and NH3), with each
   * pollutant's calculated displacement data being stored as the value of the
   * pollutant's key of this `displacements` object.
   * @type {Object.<string, PollutantDisplacement>}
   */
  const displacements = {};

  // NOTE: displacement data for PM2.5, VOCs, and NH3 pollutants are all
  // calculated when the provided `metric` parameter equals "nei". emissions
  // rates for those pollutants are calculated with both the data in the "heat"
  // (and related "heat_not") keys of the `rdfJson` data object and data stored
  // in the `app/data/annual-emission-factors.json` file, whose data is passed
  // as the `neiJson` parameter to this function as well (`neiJson` will be null
  // unless the `metric` parameter equals "nei" – see `calculateMetric()` in
  // `app/controllers.js`). that `neiJson` data contains annual point-source
  // data from the National Emissions Inventory (NEI) for every EGU, organized
  // by region.

  /** @type {NeiEgu[]} - used to calculate PM2.5, VOCs, and NH3's emission rates */
  const regionalNeiEgus =
    metric === "nei" && neiJson
      ? neiJson.regions.find((r) => r.name === rdfJson.region.region_name).egus
      : [];

  // set ozoneSeasonData and nonOzoneSeasonData based on provided metric
  /** @type {EguData[]} */
  const ozoneSeasonData =
    metric === "nei"
      ? rdfJson.data["heat"] //
      : rdfJson.data[metric];

  /** @type {EguData[]|false} */
  const nonOzoneSeasonData =
    metric === "nei"
      ? rdfJson.data["heat_not"]
      : rdfJson.data[`${metric}_not`] || false; // false fallback for generation, as there's no non-ozone season generation data

  // ozone season and non-ozone season medians
  const ozoneSeasonMedians = ozoneSeasonData.map((data) => data.medians);
  const nonOzoneSeasonMedians = nonOzoneSeasonData
    ? nonOzoneSeasonData.map((data) => data.medians)
    : false;

  // load bin edges
  const firstEdge = rdfJson.load_bin_edges[0];
  const lastEdge = rdfJson.load_bin_edges[rdfJson.load_bin_edges.length - 1];

  // array of pollutants, based on passed metric argument:
  // - if the passed metric is "nei", the pollutants array will be ["pm25", "vocs", "nh3"]
  // - else, the passed metric is either "generation", "so2", "nox", or "co2", and the
  //   pollutants array will hold a single value of the passed metric...e.g. ["generation"]
  /** @type {Pollutant[]} */
  const pollutants = metric === "nei" ? ["pm25", "vocs", "nh3"] : [metric];

  // as with the `displacements` object, the following five object's string keys are of type `Pollutant`:
  /** @type {Object.<string, PollutantRegionalData} - monthly original and post-eere calculated values for the region, by pollutant */
  const regionalData = {};

  /** @type {Object.<string, PollutantStateData} - monthly original and post-eere calculated values for each state, by pollutant */
  const stateData = {};

  /** @type {Object.<string, PollutantCountyData} - monthly original and post-eere calculated values for each county within each state, by pollutant */
  const countyData = {};

  // NOTE: hourlyData is used for debugging only, as the resulting object is huge
  /** @type {Object.<string, Object} - hourly original and post-eere calculated values for every EGU, by pollutant */
  const hourlyData = {};

  /** @type {Object.<string, number[]} - used to calculate 'originalTotal' returned data, by pollutant */
  const hourlyOriginalTotals = {};

  /** @type {Object.<string, number[]} - used to calculate 'postEereTotal' returned data, by pollutant */
  const hourlyPostEereTotals = {};

  pollutants.forEach((pollutant) => {
    regionalData[pollutant] = {};
    stateData[pollutant] = {};
    countyData[pollutant] = {};
    hourlyOriginalTotals[pollutant] = new Array(rdfJson.regional_load.length).fill(0); // prettier-ignore
    hourlyPostEereTotals[pollutant] = new Array(rdfJson.regional_load.length).fill(0); // prettier-ignore
  });

  // iterate over each hour in the year (8760 in non-leap years)
  for (let i = 0; i < rdfJson.regional_load.length; i++) {
    const month = rdfJson.regional_load[i].month; // numeric month of load
    const originalLoad = rdfJson.regional_load[i].regional_load_mw; // original regional load (mwh)
    const postEereLoad = originalLoad + eereLoad[i]; // EERE-merged regional load (mwh)

    const originalLoadInBounds = originalLoad >= firstEdge && originalLoad <= lastEdge; // prettier-ignore
    const postEereLoadInBounds = postEereLoad >= firstEdge && postEereLoad <= lastEdge; // prettier-ignore

    // filter out outliers
    if (!(originalLoadInBounds && postEereLoadInBounds)) continue;

    // get index of item closest to originalLoad or postEereLoad in load_bin_edges array
    const originalLoadBinIndex = excelMatch(rdfJson.load_bin_edges, originalLoad); // prettier-ignore
    const postEereLoadBinIndex = excelMatch(rdfJson.load_bin_edges, postEereLoad); // prettier-ignore

    // set datasetMedians, based on nonOzoneSeasonMedians value and the current month
    // NOTE: if nonOzoneSeasonMedians doesn't exist (in the case of generation),
    // datasetMedians will be the same as ozoneSeasonMedians (which is rdfJson.data.generation)
    const datasetMedians = nonOzoneSeasonMedians
      ? month >= 5 && month <= 9
        ? ozoneSeasonMedians
        : nonOzoneSeasonMedians
      : ozoneSeasonMedians;

    // iterate over each EGU (electric generating unit) in ozoneSeasonData
    // (e.g. rdfJson.data.generation, rdfJson.data.so2, etc.)
    // the total number of EGUs varies per region...
    // (less than 100 for the RM region; more than 1000 for the SE region)
    ozoneSeasonData.forEach((egu, index) => {
      const medians = datasetMedians[index];
      const stateId = egu.state;
      const county = egu.county;

      const calculatedOriginal = calculateLinear({
        load: originalLoad,
        genA: medians[originalLoadBinIndex],
        genB: medians[originalLoadBinIndex + 1],
        edgeA: rdfJson.load_bin_edges[originalLoadBinIndex],
        edgeB: rdfJson.load_bin_edges[originalLoadBinIndex + 1],
      });

      // handle special exclusions for emissions changes at specific EGUs
      // (specifically added for errors with SO2 reporting, but the RDFs have
      // been updated to include the `infreq_emissions_flag` for all metrics
      // for consistency, which allows other metrics at specific EGUs
      // to be excluded in the future)
      const calculatedPostEere =
        egu.infreq_emissions_flag === 1
          ? calculatedOriginal
          : calculateLinear({
              load: postEereLoad,
              genA: medians[postEereLoadBinIndex],
              genB: medians[postEereLoadBinIndex + 1],
              edgeA: rdfJson.load_bin_edges[postEereLoadBinIndex],
              edgeB: rdfJson.load_bin_edges[postEereLoadBinIndex + 1],
            });

      // store `calculatedOriginal` and `calculatedPostEere` values in objects,
      // with their keys corresponding to the pollutant. these objects will be
      // used to build up the additive data that's eventually returned for each
      // pollutant. using these intermediate `original` and `postEere` objects
      // may seem redundant at first, but is necssary because when the provided
      // `metric` parameter equals "nei", the same `calculatedOriginal` and
      // `calculatedPostEere` values are used for PM2.5, VOCs, and NH3 pollutants

      // as with the `displacements` object, the following two object's string keys are of type `Pollutant`:
      /** @type {Object.<string, number} - calculated original number, by pollutant */
      const original = {};

      /** @type {Object.<string, number} - calculated post-eere number, by pollutant */
      const postEere = {};

      pollutants.forEach((pollutant) => {
        original[pollutant] = calculatedOriginal;
        postEere[pollutant] = calculatedPostEere;

        // NEI factor applied for PM2.5, VOCs, and NH3 pollutants
        if (metric === "nei") {
          const matchedEgu = regionalNeiEgus.find((n) => {
            const orisplCodeMatches = n.orispl_code === egu.orispl_code;
            const unitCodeMatches = n.unit_code === egu.unit_code;
            return orisplCodeMatches && unitCodeMatches;
          });
          // NEI EGU data for the given year
          const neiEguData = matchedEgu.annual_data.find((d) => d.year === year); // prettier-ignore
          original[pollutant] *= neiEguData[pollutant];
          postEere[pollutant] *= neiEguData[pollutant];
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
        regionalData[pollutant][`month${month}`] ??= { original: 0, postEere: 0 }; // prettier-ignore
        regionalData[pollutant][`month${month}`].original += original[pollutant]; // prettier-ignore
        regionalData[pollutant][`month${month}`].postEere += postEere[pollutant]; // prettier-ignore

        stateData[pollutant][stateId] ??= {};
        stateData[pollutant][stateId][`month${month}`] ??= { original: 0, postEere: 0 }; // prettier-ignore
        stateData[pollutant][stateId][`month${month}`].original += original[pollutant]; // prettier-ignore
        stateData[pollutant][stateId][`month${month}`].postEere += postEere[pollutant]; // prettier-ignore

        countyData[pollutant][stateId] ??= {};
        countyData[pollutant][stateId][county] ??= {};
        countyData[pollutant][stateId][county][`month${month}`] ??= { original: 0, postEere: 0 }; // prettier-ignore
        countyData[pollutant][stateId][county][`month${month}`].original += original[pollutant]; // prettier-ignore
        countyData[pollutant][stateId][county][`month${month}`].postEere += postEere[pollutant]; // prettier-ignore

        // NOTE: hourlyData isn't returned normally as the resulting object is
        // huge (several hundred MB). this is just added as a means to verify
        // hourly calculations for each EGU when developing locally.
        // to temporaily enable this, update the `calculateMetric()` method in
        // `app/controllers.js` to pass the `debug` parameter's value as `true`
        //
        // AGAIN, THIS IS FOR DEBUGGING ONLY – DO NOT ENABLE THIS FOR PRODUCTION,
        // as the returned `hourlyData` object is massive, and when debug is set
        // to `true`, this function also won't return the summed regional, state,
        // and county data the web app needs
        if (debug) {
          hourlyData[pollutant] ??= [];
          hourlyData[pollutant][i] ??= {
            hour: i + 1,
            month,
            year,
            originalLoad,
            postEereLoad,
          };

          // NOTE: to generate data for a specific EGU, and not all EGUs,
          // un-comment out the code below and update it with the specific EGU's
          // ORISPL code and unit code and comment out the next several lines of
          // code inside this `if` statement block
          //
          // if (egu.orispl_code === 50865 && egu.unit_code === '1') {
          //   hourlyData[pollutant][i].orisplCode ??= egu.orispl_code;
          //   hourlyData[pollutant][i].unitCode ??= egu.unit_code;
          //   hourlyData[pollutant][i].name ??= egu.full_name;
          //   hourlyData[pollutant][i].state ??= stateId;
          //   hourlyData[pollutant][i].county ??= county;
          //   hourlyData[pollutant][i].original ??= original[pollutant];
          //   hourlyData[pollutant][i].postEere ??= postEere[pollutant];
          // }

          hourlyData[pollutant][i].egus ??= [];
          hourlyData[pollutant][i].egus[index] ??= {
            orisplCode: egu.orispl_code,
            unitCode: egu.unit_code,
            name: egu.full_name,
            state: stateId,
            county,
            original: original[pollutant],
            postEere: postEere[pollutant],
          };
        }

        // increment hourly total arrays for each EGU for the given hour
        hourlyOriginalTotals[pollutant][i] += original[pollutant];
        hourlyPostEereTotals[pollutant][i] += postEere[pollutant];
      });
    });
  }

  pollutants.forEach((pollutant) => {
    displacements[pollutant] = {
      regionId: rdfJson.region.region_abbv,
      originalTotal: hourlyOriginalTotals[pollutant].reduce((a, b) => a + (b || 0), 0), // prettier-ignore
      postEereTotal: hourlyPostEereTotals[pollutant].reduce((a, b) => a + (b || 0), 0), // prettier-ignore
      regionalData: regionalData[pollutant],
      stateData: stateData[pollutant],
      countyData: countyData[pollutant],
    };
  });

  if (debug) {
    pollutants.forEach((pollutant) => {
      delete displacements[pollutant].regionalData;
      delete displacements[pollutant].stateData;
      delete displacements[pollutant].countyData;
      displacements[pollutant].hourlyData = hourlyData[pollutant];
    });
  }

  return displacements;
}

module.exports = getDisplacement;
