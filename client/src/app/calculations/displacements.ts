import type { RDFJSON } from 'app/redux/reducers/geography';
/**
 * Annual point-source data from the National Emissions Inventory (NEI) for
 * every electric generating unit (EGU), organized by AVERT region
 */
import neiData from 'app/data/annual-emission-factors.json';

type NEIData = {
  regions: {
    name: string;
    egus: {
      state: string;
      county: string;
      plant: string;
      orispl_code: number;
      unit_code: string;
      full_name: string;
      annual_data: {
        year: number;
        generation: number;
        heat: number;
        pm25: number;
        vocs: number;
        nh3: number;
      }[];
    }[];
  }[];
};

type RDFDataField = keyof RDFJSON['data'];

/**
 * Adds a number to an array of numbers, sorts it, and returns the index of the
 * number directly before the one that was inserted
 */
function getPrecedingIndex(array: number[], number: number) {
  // insert provided number into the provided array and sort it
  const sortedArray = array.concat(number).sort((a, b) => a - b);
  const numberIndex = sortedArray.indexOf(number);
  // return the index of the number directly before the inserted number
  if (array[numberIndex] === number) return numberIndex;
  return numberIndex - 1;
}

/**
 * TODO
 */
function calculateLinear(options: {
  load: number;
  genA: number;
  genB: number;
  edgeA: number;
  edgeB: number;
}) {
  const { load, genA, genB, edgeA, edgeB } = options;
  const slope = (genA - genB) / (edgeA - edgeB);
  const intercept = genA - slope * edgeA;
  return load * slope + intercept;
}

/**
 * TODO
 */
export function calculateRegionalDisplacement(options: {
  year: number;
  rdf: RDFJSON;
  hourlyEere: number[];
}) {
  const { year, rdf, hourlyEere } = options;

  /**
   * NOTE: Emissions rates for generation, so2, nox, and co2 are calculated with
   * data in the RDF's `data` object under it's corresponding key: ozone season
   * data matches the field exactly (e.g. `data.so2`, `data.nox`) and non-ozone
   * season data has a `_not` suffix in the field name (e.g. `data.so2_not`,
   * `data.nox_not`). There's no non-ozone season for generation, so it always
   * uses `data.generation`, regardless of ozone season.
   *
   * Emissions rates for pm2.5, vocs, and nh3 are calculated with both annual
   * point-source data from the National Emissions Inventory (`neiData` file)
   * and the `heat` and `heat_not` fields in the RDF's `data` object (for ozone
   * and non-ozone season respectively).
   */
  const result = {} as {
    [egu: string]: {
      region: string;
      state: string;
      county: string;
      lat: number;
      lon: number;
      fuelType: string;
      orisplCode: number;
      unitCode: string;
      name: string;
      data: {
        generation: { [month: number]: { original: number; postEere: number } };
        so2: { [month: number]: { original: number; postEere: number } };
        nox: { [month: number]: { original: number; postEere: number } };
        co2: { [month: number]: { original: number; postEere: number } };
        pm25: { [month: number]: { original: number; postEere: number } };
        vocs: { [month: number]: { original: number; postEere: number } };
        nh3: { [month: number]: { original: number; postEere: number } };
      };
    };
  };

  const dataFields = ['generation', 'so2', 'nox', 'co2', 'pm25', 'vocs', 'nh3'] as const; // prettier-ignore

  const regionalNeiEgus = (neiData as NEIData).regions.find((region) => {
    return region.name === rdf.region.region_name;
  })?.egus;

  const loadBinEdges = rdf.load_bin_edges;
  const firstLoadBinEdge = loadBinEdges[0];
  const lastLoadBinEdge = loadBinEdges[loadBinEdges.length - 1];

  /**
   * Iterate over each hour in the year (8760 in non-leap years)
   */
  for (const [i, hourlyLoad] of rdf.regional_load.entries()) {
    const month = hourlyLoad.month; // numeric month of load

    const originalLoad = hourlyLoad.regional_load_mw; // original regional load (mwh) for the hour
    const postEereLoad = originalLoad + hourlyEere[i]; // EERE-merged regional load (mwh) for the hour

    const originalLoadInBounds = originalLoad >= firstLoadBinEdge && originalLoad <= lastLoadBinEdge; // prettier-ignore
    const postEereLoadInBounds = postEereLoad >= firstLoadBinEdge && postEereLoad <= lastLoadBinEdge; // prettier-ignore

    // filter out outliers
    if (!(originalLoadInBounds && postEereLoadInBounds)) continue;

    // get index of load bin edge closest to originalLoad or postEereLoad
    const originalLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, originalLoad); // prettier-ignore
    const postEereLoadBinEdgeIndex = getPrecedingIndex(loadBinEdges, postEereLoad); // prettier-ignore

    /**
     * Iterate over each data field: generation, so2, nox, co2...
     */
    dataFields.forEach((field) => {
      /**
       * NOTE: PM2.5, VOCs, and NH3 always use the `heat` or `heat_not` fields
       * of the RDF's `data` object
       */
      const neiFields = ['pm25', 'vocs', 'nh3'];

      const ozoneSeasonData = neiFields.includes(field)
        ? rdf.data.heat
        : rdf.data[field as RDFDataField];

      const nonOzoneSeasonData =
        field === 'generation'
          ? null // NOTE: there's no non-ozone season for generation
          : neiFields.includes(field)
          ? rdf.data.heat_not
          : rdf.data[`${field}_not` as RDFDataField];

      const ozoneSeasonMedians = ozoneSeasonData.map((egu) => egu.medians);

      const nonOzoneSeasonMedians = nonOzoneSeasonData
        ? nonOzoneSeasonData.map((egu) => egu.medians)
        : null;

      /**
       * Ozone season is between May and September, so use the correct medians
       * dataset for the current month
       */
      const datasetMedians = !nonOzoneSeasonMedians
        ? ozoneSeasonMedians
        : month >= 5 && month <= 9
        ? ozoneSeasonMedians
        : nonOzoneSeasonMedians;

      /**
       * Iterate over each electric generating unit (EGU). The total number of
       * EGUs varries per region (less than 100 for the RM region; more than
       * 1000 for the SE region)
       */
      ozoneSeasonData.forEach((egu, eguIndex) => {
        const eguCode = `${egu.state}_${egu.orispl_code}_${egu.unit_code}`;
        const medians = datasetMedians[eguIndex];

        const calculatedOriginal = calculateLinear({
          load: originalLoad,
          genA: medians[originalLoadBinEdgeIndex],
          genB: medians[originalLoadBinEdgeIndex + 1],
          edgeA: loadBinEdges[originalLoadBinEdgeIndex],
          edgeB: loadBinEdges[originalLoadBinEdgeIndex + 1],
        });

        /**
         * Handle special exclusions for emissions changes at specific EGUs
         * (specifically added for errors with SO2 reporting, but the RDFs were
         * updated to include the `infreq_emissions_flag` for all pollutants for
         * consistency, which allows other pollutants at specific EGUs to be
         * excluded in the future)
         */
        const calculatedPostEere =
          egu.infreq_emissions_flag === 1
            ? calculatedOriginal
            : calculateLinear({
                load: postEereLoad,
                genA: medians[postEereLoadBinEdgeIndex],
                genB: medians[postEereLoadBinEdgeIndex + 1],
                edgeA: loadBinEdges[postEereLoadBinEdgeIndex],
                edgeB: loadBinEdges[postEereLoadBinEdgeIndex + 1],
              });

        /**
         * Conditionally multiply NEI factor to calculated original and postEere
         * values
         */
        const matchedEgu = regionalNeiEgus?.find((n) => {
          const orisplCodeMatches = n.orispl_code === egu.orispl_code;
          const unitCodeMatches = n.unit_code === egu.unit_code;
          return orisplCodeMatches && unitCodeMatches;
        });
        const neiEguData = matchedEgu?.annual_data.find((d) => d.year === year);
        const neiFieldData = neiEguData?.[field as keyof typeof neiEguData];

        const original =
          neiFields.includes(field) && neiFieldData
            ? calculatedOriginal * neiFieldData
            : calculatedOriginal;

        const postEere =
          neiFields.includes(field) && neiFieldData
            ? calculatedPostEere * neiFieldData
            : calculatedPostEere;

        /**
         * Conditionally initialize each EGU's metadata
         */
        result[eguCode] ??= {
          region: rdf.region.region_abbv,
          state: egu.state,
          county: egu.county,
          lat: egu.lat,
          lon: egu.lon,
          fuelType: egu.fuel_type,
          orisplCode: egu.orispl_code,
          unitCode: egu.unit_code,
          name: egu.full_name,
          data: {
            generation: {},
            so2: {},
            nox: {},
            co2: {},
            pm25: {},
            vocs: {},
            nh3: {},
          },
        };

        /**
         * Conditionally initialize the field's monthly data
         */
        result[eguCode].data[field][month] ??= { original: 0, postEere: 0 };

        /**
         * Increment the field's monthly original and postEere values
         */
        result[eguCode].data[field][month].original += original;
        result[eguCode].data[field][month].postEere += postEere;
      });
    });
  }

  return result;
}
