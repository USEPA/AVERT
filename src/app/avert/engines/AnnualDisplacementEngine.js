// Deps
import math from 'mathjs';

class AnnualDisplacementEngine {
  constructor(rdf, hourlyEere) {
    // this.rdf = rdf instanceof Rdf ? rdf.raw : rdf;
    this.rdf = rdf;
    this.hourlyEere = hourlyEere;
    this.generationOriginal = 0;
    this.generationPost = 0;

    this.so2Original = 0;
    this.so2Post = 0;
    this.noxOriginal = 0;
    this.noxPost = 0;
    this.co2Original = 0;
    this.co2Post = 0;
  }

  get output() {
    return {
      generation: this.generation,
      totalEmissions: this.totalEmissions,
      emissionRates: this.emissionRates,
    }
  }

  get generation() {
    const totals = this.getDisplacedGeneration(this.rdf.generation, false, false);
    this.generationOriginal = totals.original;
    this.generationPost = totals.post;
    return totals;
  }

  get totalEmissions() {
    return {
      so2: this.so2Total,
      nox: this.noxTotal,
      co2: this.co2Total,
    }
  }

  get emissionRates() {
    return {
      so2: this.so2Rate,
      nox: this.noxRate,
      co2: this.co2Rate,
    }
  }

  get so2Total() {
    const totals = this.getDisplacedGeneration(this.rdf.raw.data.so2, this.rdf.raw.data.so2_not, true);
    this.so2Original = totals.original;
    this.so2Post = totals.post;
    return totals;
  }

  get noxTotal() {
    const totals = this.getDisplacedGeneration(this.rdf.raw.data.nox, this.rdf.raw.data.nox_not, true);
    this.noxOriginal = totals.original;
    this.noxPost = totals.post;
    return totals;
  }

  get co2Total() {
    const totals = this.getDisplacedGeneration(this.rdf.raw.data.co2, this.rdf.raw.data.co2_not, true);
    this.co2Original = totals.original;
    this.co2Post = totals.post;
    return totals;
  }

  get so2Rate() {
    const original = math.round(math.divide(this.so2Original, this.generationOriginal), 2);
    const post = math.round(math.divide(this.so2Post, this.generationPost), 2);
    return {
      original: original.toString(),
      post: post.toString(),
    }
  }

  get noxRate() {
    const original = math.round(math.divide(this.noxOriginal, this.generationOriginal), 2);
    const post = math.round(math.divide(this.noxPost, this.generationPost), 2);
    return {
      original: original.toString(),
      post: post.toString(),
    }
  }

  get co2Rate() {
    const original = math.round(math.divide(this.co2Original, this.generationOriginal), 2);
    const post = math.round(math.divide(this.co2Post, this.generationPost), 2);
    return {
      original: original.toString(),
      post: post.toString(),
    }
  }



  getDisplacedGeneration(dataSet, dataSetNonOzone, no) {

    let preTotalArray = [];
    let postTotalArray = [];
    let deltaVArray = [];
    const monthlyEmissions = {
      regional: {
        data: {},
        pre: {},
        post: {},
      },
      state: {},
    };

    const edges = this.rdf.edges;
    const min = edges[0];
    const max = edges[edges.length - 1];

    //Refactor into its own method that generates one median array;
    const medians = dataSet.map((item) => item.medians);
    const mediansNonOzone = dataSetNonOzone ? dataSetNonOzone.map((item) => item.medians) : false;

    const loadArrayMonth = this.rdf.months;
    const loadArrayOriginal = this.rdf.regionalLoads;
    const loadArrayPost = this.getDisplacedLoadArray(loadArrayOriginal, this.hourlyEere);

    for (let i = 0; i < loadArrayOriginal.length; i++) {
      const load = loadArrayOriginal[i];
      const month = loadArrayMonth[i];
      const postLoad = loadArrayPost[i];
      preTotalArray[i] = 0;
      postTotalArray[i] = 0;
      deltaVArray[i] = 0;
      monthlyEmissions.regional[month] = monthlyEmissions.regional[month] ? monthlyEmissions.regional[month] : 0;

      if (this.isOutlier(load, min, max, postLoad)) continue;

      const activeMedians = this.useOzoneOrNon(medians, mediansNonOzone, month);
      const preGenIndex = this.excelMatch(edges, load);
      const postGenIndex = this.excelMatch(edges, postLoad);

      for (let j = 0; j < activeMedians.length; j++) {
        const data = this.calculateMedians(activeMedians, j, dataSet, load, preGenIndex, edges, postLoad, postGenIndex, monthlyEmissions, month);

        preTotalArray[i] += data.pre;
        postTotalArray[i] += data.post;
        deltaVArray[i] += data.delta;
      }

      monthlyEmissions.regional[month] += deltaVArray[i];
    }

    const preTotal = preTotalArray.reduce((sum, n) => sum + (n || 0), 0);
    const postTotal = postTotalArray.reduce((sum, n) => sum + (n || 0), 0);

    return {
      original: parseInt(preTotal, 10),
      post: parseInt(postTotal, 10),
      impact: parseInt(math.subtract(postTotal, preTotal), 10),
      monthlyEmissions: monthlyEmissions,
    };
  }

  calculateMedians(medians, index, data, load, preIndex, edges, postLoad, postIndex, monthlyEmissions, month) {
    const median = medians[index];
    const state = data[index].state;
    const county = data[index].county;
    const preVal = this.calculateLinear(load, median[preIndex], median[preIndex + 1], edges[preIndex], edges[preIndex + 1]);
    const postVal = this.calculateLinear(postLoad, median[postIndex], median[postIndex + 1], edges[postIndex], edges[postIndex + 1]);
    const deltaV = this.calculateDeltaV(postVal, preVal);
    this.extractStateEmissions(monthlyEmissions, state, month, deltaV, preVal, postVal);
    this.extractCountyEmissions(monthlyEmissions, state, county, month, deltaV, preVal, postVal);

    return {
      pre: preVal,
      post: postVal,
      delta: deltaV,
    }
  }

  excelMatch(array, lookup) {
    const sortedHaystack = array.concat(lookup).sort(function (a, b) {
      return a - b;
    });
    const index = sortedHaystack.indexOf(lookup);

    if (array[index] === lookup) return array.indexOf(sortedHaystack[index]);

    return array.indexOf(sortedHaystack[index - 1]);
  }

  getDisplacedLoadArray(loadArrayOriginal, hourlyEere) {
    return loadArrayOriginal.map((item, index) => math.sum(item, hourlyEere[index].final_mw));
  }

  useOzoneOrNon(medians, mediansNonOzone, month) {
    let activeMedians = medians;
    if (mediansNonOzone) {
      activeMedians = (month >= 5 && month <= 9) ? medians : mediansNonOzone;
    }
    return activeMedians;
  }

  isOutlier(load, min, max, postLoad) {
    return !(load >= min && load <= max && postLoad >= min && postLoad <= max);
  }

  extractLoadBinEdges(data) {
    return Object.keys(data).map((key) => data[key]);
  }

  calculateLinear(load, genA, genB, edgeA, edgeB) {
    const slope = (genA - genB) / (edgeA - edgeB);
    const intercept = genA - (slope * edgeA);

    return load * slope + intercept;
  }

  calculateDeltaV(postVal, preVal) {
    return postVal - preVal;
  }

  // Move this to MonthlyEmissionsCalculator
  extractStateEmissions(monthlyEmissions, state, month, deltaV, preVal, postVal) {
//Initialize empty States if they don't already exist
    monthlyEmissions.state[state] = monthlyEmissions.state[state]
      ? monthlyEmissions.state[state]
      : {data: {}, pre: {}, post: {}, counties: {}};

    //Initialize 0 value for the month if it hasn't been started
    monthlyEmissions.state[state].data[month] = monthlyEmissions.state[state].data[month]
      ? monthlyEmissions.state[state].data[month]
      : 0;
    monthlyEmissions.state[state].data[month] += deltaV;

    monthlyEmissions.state[state].pre[month] = monthlyEmissions.state[state].pre[month]
      ? monthlyEmissions.state[state].pre[month]
      : 0;
    monthlyEmissions.state[state].pre[month] += preVal;

    monthlyEmissions.state[state].post[month] = monthlyEmissions.state[state].post[month]
      ? monthlyEmissions.state[state].post[month]
      : 0;
    monthlyEmissions.state[state].post[month] += postVal;
  }

  // Move this to MonthlyEmissionsCalculator
  extractCountyEmissions(monthlyEmissions, state, county, month, deltaV, preVal, postVal) {
    //Initialize empty County if it doesn't already exist
    monthlyEmissions.state[state].counties[county] = monthlyEmissions.state[state].counties[county]
      ? monthlyEmissions.state[state].counties[county]
      : {data: {}, pre: {}, post: {}};

    //Initialize 0 value for the month if it hasn't been started
    monthlyEmissions.state[state].counties[county].data[month] = monthlyEmissions.state[state].counties[county].data[month]
      ? monthlyEmissions.state[state].counties[county].data[month]
      : 0;
    monthlyEmissions.state[state].counties[county].data[month] += deltaV;

    monthlyEmissions.state[state].counties[county].pre[month] = monthlyEmissions.state[state].counties[county].pre[month]
      ? monthlyEmissions.state[state].counties[county].pre[month]
      : 0;
    monthlyEmissions.state[state].counties[county].pre[month] += preVal;

    monthlyEmissions.state[state].counties[county].post[month] = monthlyEmissions.state[state].counties[county].post[month]
      ? monthlyEmissions.state[state].counties[county].post[month]
      : 0;
    monthlyEmissions.state[state].counties[county].post[month] += postVal;
  }
}

export default AnnualDisplacementEngine;