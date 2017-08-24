class Rdf {

  constructor(options) {
    this.raw = {};
    this.regionName = '';
    this.regionalLoads = [];
    this.percentLimit = [];
    this.defaults = {};
    this.months = [];
    this.edges = [];
    this._generation = [];

    if(options && typeof options.rdf !== 'undefined') this.setRdf(options.rdf);
    if(options && typeof options.defaults !== 'undefined') this.setDefaults(options.defaults);
  }

  toJsonString() {
    let json = JSON.stringify(this);
    Object.keys(this).filter(key => key[0] === "_").forEach(key => {
      json = json.replace(key, key.substring(1));
    });

    return json;
  }

  get generation() {
    return this.raw.data.generation;
  }

  get so2() {
    return this.raw.data.so2;
  }

  get so2_not() {
    return this.raw.data.so2_not;
  }

  get co2() {
    return this.raw.data.co2;
  }

  get co2_not() {
    return this.raw.data.co2_not;
  }

  get nox() {
    return this.raw.data.nox;
  }

  get nox_nox() {
    return this.raw.data.nox_not;
  }

  setSecondValidationLimits() {
    this.softLimits = this.regionalLoads.map((load) => (load * -this.percentLimit));
    this.hardLimits = this.regionalLoads.map((load) => (load * -0.3));
  }

  setRdf(rdf) {
    this.raw = rdf;
    this.regionName = rdf.region.region_name;
    this.regionalLoads = rdf.regional_load.map((data) => data.regional_load_mw);
    this.percentLimit = rdf.limits.max_ee_percent / 100;
    this.setSecondValidationLimits();
    this.extractLoadBinEdges(rdf);
    this.extractMonths(rdf.regional_load);
  }

  setDefaults(defaults) {
    this.defaults = defaults;
  }

  extractLoadBinEdges(json){
    this.edges = Object.keys(json.load_bin_edges).map((key) => json.load_bin_edges[key]);

    return this.edges;
  }

  extractMonths(data) {
    this.months = data.map((item) => item.month);

    return this.months;
  }
}

export default Rdf;