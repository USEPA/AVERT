/**
 * @typedef {Object} EGUData
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
 * @typedef {Object} RDFJSON
 * @property {{
 *  region_abbv: string,
 *  region_name: string,
 *  region_states: string
 * }} region
 * @property {{
 *  file_name: string[],
 *  mc_gen_runs: number,
 *  mc_runs: number,
 *  region_id: number,
 *  year: number
 * }} run
 * @property {{
 *  created_at: ?string[],
 *  id: number,
 *  max_ee_percent: number,
 *  max_ee_yearly_gwh: number,
 *  max_solar_wind_mwh: number,
 *  region_id: number,
 *  updated_at: ?string[],
 *  year: number
 * }} limits
 * @property {{
 *  day: number,
 *  hour: number,
 *  hour_of_year: number,
 *  hourly_limit: number,
 *  month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
 *  regional_load_mw: number,
 *  year: number
 * }[]} regional_load
 * @property {number[]} load_bin_edges
 * @property {{
 *  generation: EGUData[],
 *  so2: EGUData[],
 *  so2_not: EGUData[],
 *  nox: EGUData[],
 *  nox_not: EGUData[],
 *  co2: EGUData[],
 *  co2_not: EGUData[],
 *  heat: EGUData[],
 *  heat_not: EGUData[]
 * }} data
 */

/**
 * @typedef {{
 *  generation: number,
 *  heat: number,
 *  pm25: number,
 *  vocs: number,
 *  nh3: number
 * }} NEIPollutantsEmissionRates
 */

/**
 * @typedef {{
 *  region: string,
 *  state: string,
 *  plant: string,
 *  orspl: number,
 *  unit: string,
 *  name: string,
 *  county: string,
 *  "orspl|unit|region": string,
 *  years: {
 *    "2017": NEIPollutantsEmissionRates,
 *    "2018": NEIPollutantsEmissionRates,
 *    "2019": NEIPollutantsEmissionRates,
 *    "2020": NEIPollutantsEmissionRates,
 *    "2021": NEIPollutantsEmissionRates,
 *    "2022": NEIPollutantsEmissionRates,
 *    "2023": NEIPollutantsEmissionRates,
 *    "2024": NEIPollutantsEmissionRates
 *  }
 * }} NEIEmissionRatesByEGU
 */

/**
 * Adds a number to an array of numbers, sorts it, and returns the index of the
 * number directly before the one that was inserted
 *
 * Excel: Functionaly similar to the code associated with "matchedArray" in the
 * "m_3_displaced_gen_emissions" Visual Basic module.
 *
 * @param {number[]} array
 * @param {number} number
 */
function getPrecedingIndex(array, number) {
  /** Insert the provided number into the provided array and sort it. */
  const sortedArray = array.concat(number).sort((a, b) => a - b);
  const numberIndex = sortedArray.indexOf(number);
  /** Return the index of the number directly before the inserted number. */
  if (array[numberIndex] === number) return numberIndex;
  return numberIndex - 1;
}

/**
 * Excel: "pre" and "post" calculation from the "m_3_displaced_gen_emissions"
 * Visual Basic module before the "delta" is determined.
 *
 * @param {{
 *  load: number,
 *  genA: number,
 *  genB: number,
 *  edgeA: number,
 *  edgeB: number
 * }} options
 */
function calculateLinear(options) {
  const { load, genA, genB, edgeA, edgeB } = options;
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - slope * edgeA;
  return load * slope + intercept;
}

// /**
//  * Rounds a number a specified number of decimal places.
//  *
//  * @param {{
//  *  number: number,
//  *  decimalPlaces: number,
//  * }} options
//  */
// function roundToDecimalPlaces(options) {
//   const { number, decimalPlaces } = options;
//   const factor = Math.pow(10, decimalPlaces);
//   return Math.round(number * factor) / factor;
// }

/**
 * Calculates emissions changes for a provided region.
 *
 * Excel: "m_3_displaced_gen_emissions" Visual Basic module, starting on line 82
 * which begins with the following code:  
 * ```vb
 *  'This gets the dimensions of various arrays
 *  Sheets("Data").Activate
 *  Dim lastColRow2 As Double
 *  Dim lastRowColA As Double
 *  Dim lastRowColJ As Double
 * ```
 *
 * @param {{
 *  year: number,
 *  rdf: RDFJSON,
 *  neiEmissionRates: NEIEmissionRatesByEGU[],
 *  hourlyChanges: number[]
 * }} options
 */
function calculateEmissionsChanges(options) {
  const { year, rdf, neiEmissionRates, hourlyChanges } = options;

  /**
   * NOTE: `hourly`, `monthly`, and `yearly` values are commented out below and
   * not returned from this function, as their values are not used, as we really
   * need at a minimum, monthly data at the county level (which we can then
   * build up to state, region, and total monthly and annual values). We'll
   * leave the `hourly`, `monthly`, and `yearly` calculations here (commented
   * out) as they can be useful in validating/testing values with the Excel app
   * when developing locally.
   */

  // /**
  //  * Cumulative hourly emissions impacts from all electric generating units
  //  * (EGUs) for each pollutant/emissions field.
  //  *
  //  * Excel: Columns I, J, and K of the various pollutant/emissions sheets
  //  * ("Generation", "SO2", "NOx", "CO2", "PM25", "VOCs", and "NH3"). For example,
  //  * for the "SO2" sheet, those columns are:
  //  *   - "Orig SO2 (lb)" (column I) which is the hourly "pre" value.
  //  *   - "Post Change SO2 (lb)" (column J) which is the hourly "post" value.
  //  *   - "Sum: All Units (lb)" (column K) which is the hourly "impacts" value.
  //  * Also the "totalArray" variable in the "m_3_displaced_gen_emissions" Visual
  //  * Basic module.
  //  *
  //  * @type {{
  //  *  [regionId: string]: {
  //  *    [field: string]: {
  //  *      [hour: number]: {
  //  *        pre: number,
  //  *        post: number,
  //  *        impacts: number
  //  *      }
  //  *    }
  //  *  }
  //  * }}
  //  */
  // const hourly = {};

  // /**
  //  * Cumulative monthly emissions impacts from all electric generating units
  //  * (EGUs) for each pollutant/emissions field.
  //  *
  //  * Excel: This value isn't stored in Excel, but each EGU's monthly impacts
  //  * values are – see the 12 rows of monthly data for each EGU below the last
  //  * hourly row and below the EGU annual totals row and NEI emission rates row
  //  * (emissions rates row shown for NEI pollutants only). So this monthly value
  //  * could be calculated as the sum of each EGU's the monthly impacts values.
  //  * 
  //  * @type {{
  //  *  [regionId: string]: {
  //  *    [field: string]: {
  //  *      [month: number]: {
  //  *        pre: number,
  //  *        post: number,
  //  *        impacts: number
  //  *      }
  //  *    }
  //  *  }
  //  * }}
  //  */
  // const monthly = {};

  // /**
  //  * Total yearly emissions impacts from all electric generating units for each
  //  * pollutant/emissions field.
  //  *
  //  * NOTE: This value isn't stored in Excel, but the yearly impacts value could
  //  * be calculated as the sum of the hourly impacts (which are stored in Excel):
  //  * `=SUM(K4:K8787)`.
  //  *
  //  * @type {{
  //  *  [regionId: string]: {
  //  *    [field: string]: {
  //  *      pre: number,
  //  *      post: number,
  //  *      impacts: number
  //  *    }
  //  *  }
  //  * }}
  //  */
  // const yearly = {};

  /**
   * Monthly emissions changes data for each electric generating unit.
   *
   * NOTE: Emissions rates for generation, so2, nox, and co2 are calculated with
   * data in the RDF's `data` object under it's corresponding key: ozone season
   * data matches the field exactly (e.g. `data.so2`, `data.nox`) and non-ozone
   * season data has a `_not` suffix in the field name (e.g. `data.so2_not`,
   * `data.nox_not`). There's no non-ozone season for generation, so it always
   * uses `data.generation`, regardless of ozone season.
   *
   * Emissions rates for pm2.5, vocs, and nh3 are calculated with both annual
   * point-source data from the National Emissions Inventory
   * (`neiEmissionRates`) and the `heat` and `heat_not` fields in the RDF's
   * `data` object (for ozone and non-ozone season respectively).
   * 
   * Excel: The "Total, Post Change" row below the last hourly row store the
   * monthly impacts value for each EGU (pre and post values are not stored in
   * Excel).
   *
   * @type {{
   *  [eguId: string]: {
   *    region: string,
   *    state: string,
   *    county: string,
   *    lat: number,
   *    lon: number,
   *    fuelType: string,
   *    orisplCode: number,
   *    unitCode: string,
   *    name: string,
   *    emissionsFlags: ("generation" | "so2" | "nox" | "co2" | "heat")[];
   *    data: {
   *      monthly: {
   *        [field: "generation" | "so2" | "nox" | "co2" | "pm25" | "vocs" | "nh3"]: {
   *          [month: number]: {
   *            pre: number,
   *            post: number,
   *          }
   *        }
   *      }
   *    }
   *  }
   * }}
   */
  const egus = {};

  const regionId = rdf.region.region_abbv;
  const regionName = rdf.region.region_name;

  const regionalNeiEmissionRates = neiEmissionRates.filter((item) => {
    return item.region === regionName;
  });

  /**
   * Excel: "genBlockArray" variable in the "m_3_displaced_gen_emissions" Visual
   * Basic module.
   */
  const loadBinEdges = rdf.load_bin_edges;

  const firstLoadBinEdge = loadBinEdges[0];
  const lastLoadBinEdge = loadBinEdges[loadBinEdges.length - 1];

  /**
   * Iterate over each hour in the year (8760 hours for non-leap years or 8784
   * hours for leap years).
   */
  for (const [i, hourlyLoad] of rdf.regional_load.entries()) {
    // const hour = hourlyLoad.hour_of_year;
    const month = hourlyLoad.month;

    /**
     * Original regional load (mwh) for the hour.
     *
     * Excel: "Regional Load (MW)" (column D) of the various pollutant/emissions
     * sheets ("Generation", "SO2", "NOx", etc.) and also the first item in the
     * "loadArray" variable in the "m_3_displaced_gen_emissions" Visual Basic
     * module.
     */
    const preLoad = hourlyLoad.regional_load_mw;

    /**
     * Post impacts regional load (mwh) for the hour.
     *
     * Excel: "Load after Energy Change" (column F) of the various pollutant/
     * emissions sheets ("Generation", "SO2", "NOx", etc.) and also the third
     * item in the "loadArray" variable in the "m_3_displaced_gen_emissions"
     * Visual Basic module.
     *
     * NOTE: `hourlyChanges[i]` is the "Energy Change Profile" (column E) of the
     * various pollutant/emissions sheets ("Generation", "SO2", "NOx", etc.) and
     * also the second item in the "loadArray" variable in the
     * "m_3_displaced_gen_emissions" Visual Basic module.
     */
    const postLoad = preLoad + hourlyChanges[i];

    /** Ensure the pre and post load is in bounds. */
    const preLoadInBounds = preLoad >= firstLoadBinEdge && preLoad <= lastLoadBinEdge;
    const postLoadInBounds = postLoad >= firstLoadBinEdge && postLoad <= lastLoadBinEdge;

    if (!(preLoadInBounds && postLoadInBounds)) continue;

    /** Get the index of the load bin edge closest to the preLoad and postLoad values. */
    const preLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, preLoad);
    const postLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, postLoad);

    /** Iterate over each of the RDF's ozone data fields */
    ["generation", "so2", "nox", "co2", "heat"].forEach((field) => {
      /** @type {EGUData[]} */
      const ozoneSeasonData = rdf.data[field];

      /** @type {?EGUData[]} */
      const nonOzoneSeasonData =
        field === "generation"
          ? null // NOTE: there's no non-ozone season for generation
          : rdf.data[`${field}_not`];

      const ozoneSeasonMedians = ozoneSeasonData.map((egu) => egu.medians);

      const nonOzoneSeasonMedians = nonOzoneSeasonData
        ? nonOzoneSeasonData.map((egu) => egu.medians)
        : null;

      /**
       * Ozone season is between May and September, so use the correct medians
       * dataset for the current month.
       *
       * Excel: "plantDataArray" in the "m_3_displaced_gen_emissions" Visual
       * Basic module.
       */
      const datasetMedians = !nonOzoneSeasonMedians
        ? ozoneSeasonMedians
        : month >= 5 && month <= 9
        ? ozoneSeasonMedians
        : nonOzoneSeasonMedians;

      /**
       * Iterate over each electric generating unit (EGU). The total number of
       * EGUs varries per region (less than 100 for the RM region; more than
       * 1000 for the SE region).
       */
      ozoneSeasonData.forEach((egu, eguIndex) => {
        const {
          state,
          county,
          lat,
          lon,
          fuel_type,
          orispl_code,
          unit_code,
          full_name,
          infreq_emissions_flag,
        } = egu;

        const eguId = `${regionId}_${state}_${orispl_code}_${unit_code}`;
        const medians = datasetMedians[eguIndex];

        /**
         * Excel: "pre" calculation from the "m_3_displaced_gen_emissions"
         * Visual Basic module before the "delta" is determined.
         */
        const calculatedPre = calculateLinear({
          load: preLoad,
          genA: medians[preLoadBinEdgeIndex],
          genB: medians[preLoadBinEdgeIndex + 1],
          edgeA: loadBinEdges[preLoadBinEdgeIndex],
          edgeB: loadBinEdges[preLoadBinEdgeIndex + 1],
        });

        /**
         * Handle special exclusions for emissions changes at specific EGUs
         * (specifically added for errors with SO2 reporting, but the RDFs were
         * updated to include the `infreq_emissions_flag` for all pollutants for
         * consistency, which allows other pollutants at specific EGUs to be
         * excluded in the future).
         *
         * Excel: "post" calculation from the "m_3_displaced_gen_emissions"
         * Visual Basic module before the "delta" is determined.
         */
        const calculatedPost =
          infreq_emissions_flag === 1
            ? calculatedPre
            : calculateLinear({
                load: postLoad,
                genA: medians[postLoadBinEdgeIndex],
                genB: medians[postLoadBinEdgeIndex + 1],
                edgeA: loadBinEdges[postLoadBinEdgeIndex],
                edgeB: loadBinEdges[postLoadBinEdgeIndex + 1],
              });

        // /**
        //  * Determine the number of decimal places to values to, based on the
        //  * pollution/emissions field.
        //  */
        // const decimalPlaces =
        // field === "generation" ||
        // field === "co2" ||
        // field === "so2" ||
        // field === "nox"
        //   ? 3
        //   : field === "pm25" || field === "vocs" || field === "nh3"
        //     ? 6
        //     : 0;

        /**
         * NOTE: PM2.5, VOCs, and NH3 always use the `heat` or `heat_not` fields
         * of the RDF's `data` object, and their calculated `pre` and `post`
         * values need to be multiplied by the NEI emission rates for the EGU.
         */
        (field === "heat"
          ? ["pm25", "vocs", "nh3"]
          : [field]
        ).forEach((emissionsField) => {
          /**
           * Conditionally multiply NEI factor to calculated pre and post values.
           */
          const conditionallyMatchedEgu =
            field === "heat"
              ? regionalNeiEmissionRates.find((item) => {
                  return item.orspl === orispl_code && item.unit === unit_code;
                })
              : null;

          /** @type NEIPollutantsEmissionRates | undefined */
          const neiEguData = conditionallyMatchedEgu?.years?.[year.toString()];

          /** @type number | undefined */
          const neiFieldData = neiEguData?.[emissionsField];

          const pre =
            neiFieldData !== undefined
              ? calculatedPre * neiFieldData
              : calculatedPre;

          const post =
            neiFieldData !== undefined
              ? calculatedPost * neiFieldData
              : calculatedPost;

          // const pre =
          //   neiFieldData !== undefined
          //     ? roundToDecimalPlaces({
          //         number: calculatedPre * neiFieldData,
          //         decimalPlaces,
          //       })
          //     : calculatedPre;

          // const post =
          //   neiFieldData !== undefined
          //     ? roundToDecimalPlaces({
          //         number: calculatedPost * neiFieldData,
          //         decimalPlaces,
          //       })
          //     : calculatedPost;

          // const impacts = post - pre;

          // /**
          //  * Conditionally initialize the emissionsField's hourly impacts from
          //  * all EGUs.
          //  */
          // hourly[regionId] ??= {
          //   generation: {},
          //   so2: {},
          //   nox: {},
          //   co2: {},
          //   pm25: {},
          //   vocs: {},
          //   nh3: {},
          // };
          // hourly[regionId][emissionsField][hour] ??= {
          //   pre: 0,
          //   post: 0,
          //   impacts: 0,
          // };

          // /**
          //  * Increment the emissionsField's hourly pre, post, and impacts values
          //  * from all EGUs and round the accumulated impacts value.
          //  */
          // hourly[regionId][emissionsField][hour].pre += pre;
          // hourly[regionId][emissionsField][hour].post += post;
          // hourly[regionId][emissionsField][hour].impacts += impacts;

          // hourly[regionId][emissionsField][hour].impacts = roundToDecimalPlaces({
          //   number: hourly[regionId][emissionsField][hour].impacts,
          //   decimalPlaces,
          // });

          // /**
          //  * Conditionally initialize the emissionsField's monthly impacts from
          //  * all EGUs.
          //  */
          // monthly[regionId] ??= {
          //   generation: {},
          //   so2: {},
          //   nox: {},
          //   co2: {},
          //   pm25: {},
          //   vocs: {},
          //   nh3: {},
          // };
          // monthly[regionId][emissionsField][month] ??= {
          //   pre: 0,
          //   post: 0,
          //   impacts: 0,
          // };

          // /**
          //  * Increment the emissionsField's monthly pre, post, and impacts values
          //  * from all EGUs and round the accumulated impacts value.
          //  */
          // monthly[regionId][emissionsField][month].pre += pre;
          // monthly[regionId][emissionsField][month].post += post;
          // monthly[regionId][emissionsField][month].impacts += impacts;

          // monthly[regionId][emissionsField][month].impacts = roundToDecimalPlaces({
          //   number: monthly[regionId][emissionsField][month].impacts,
          //   decimalPlaces,
          // });

          // /**
          //  * Conditionally initialize the emissionsField's yearly impacts from
          //  * all EGUs.
          //  */
          // yearly[regionId] ??= {
          //   generation: { pre: 0, post: 0, impacts: 0 },
          //   so2: { pre: 0, post: 0, impacts: 0 },
          //   nox: { pre: 0, post: 0, impacts: 0 },
          //   co2: { pre: 0, post: 0, impacts: 0 },
          //   pm25: { pre: 0, post: 0, impacts: 0 },
          //   vocs: { pre: 0, post: 0, impacts: 0 },
          //   nh3: { pre: 0, post: 0, impacts: 0 },
          // };

          // /**
          //  * Increment the emissionsField's yearly pre, post, and impacts values
          //  * from all EGUs and round the accumulated impacts value.
          //  */
          // yearly[regionId][emissionsField].pre += pre;
          // yearly[regionId][emissionsField].post += post;
          // yearly[regionId][emissionsField].impacts += impacts;

          // yearly[regionId][emissionsField].impacts = roundToDecimalPlaces({
          //   number: yearly[regionId][emissionsField].impacts,
          //   decimalPlaces,
          // });

          /**
           * Conditionally initialize each EGU's metadata and monthly data
           * structure for each emissionsField.
           */
          egus[eguId] ??= {
            region: regionId,
            state: state,
            county: county,
            lat: lat,
            lon: lon,
            fuelType: fuel_type,
            orisplCode: orispl_code,
            unitCode: unit_code,
            name: full_name,
            emissionsFlags: [],
            data: {
              monthly: {
                generation: {},
                so2: {},
                nox: {},
                co2: {},
                pm25: {},
                vocs: {},
                nh3: {},
              },
            },
          };

          /**
           * Conditionally add emissionsField (e.g. so2, nox, co2) to EGU's
           * emissions flags, as emissions "replacement" will be needed for that
           * emissions field/pollutant.
           */
          if (
            infreq_emissions_flag === 1 &&
            !egus[eguId].emissionsFlags.includes(emissionsField)
          ) {
            egus[eguId].emissionsFlags.push(emissionsField);
          }

          /**
           * Conditionally initialize the EGU's monthly data for the
           * emissionsField.
           */
          egus[eguId].data.monthly[emissionsField][month] ??= {
            pre: 0,
            post: 0,
          };

          /**
           * Increment the EGU's monthly pre and post values for the
           * emissionsField.
           */
          egus[eguId].data.monthly[emissionsField][month].pre += pre;
          egus[eguId].data.monthly[emissionsField][month].post += post;
        });
      });
    });
  }

  // return { hourly, monthly, yearly, egus };
  return {  egus };
}

module.exports = { calculateEmissionsChanges };
