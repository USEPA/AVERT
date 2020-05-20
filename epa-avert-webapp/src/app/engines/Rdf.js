class Rdf {
  constructor(options) {
    this._regionName = ''; // not actually used (for debugging)
    this._regionalLoads = [];
    this._softLimits = [];
    this._hardLimits = [];
    this._defaults = {};

    // if constructed with ({ rdf: ___ })
    if (options && typeof options.rdf !== 'undefined') {
      this.setRdf(options.rdf);
    }

    // if constructed with ({ defaults: ___ })
    if (options && typeof options.defaults !== 'undefined') {
      this.setDefaults(options.defaults);
    }
  }

  setRdf(rdf) {
    this._regionName = rdf.region.region_name;
    this._regionalLoads = [];
    this._softLimits = [];
    this._hardLimits = [];

    rdf.regional_load.forEach((item) => {
      const load = item.regional_load_mw;
      this._regionalLoads.push(load);
      this._softLimits.push((load * -1 * rdf.limits.max_ee_percent) / 100); // -0.15
      this._hardLimits.push(load * -0.3);
    });
  }

  setDefaults(defaults) {
    this._defaults = defaults;
  }

  get regionalLoads() {
    return this._regionalLoads;
  }

  get softLimits() {
    return this._softLimits;
  }

  get hardLimits() {
    return this._hardLimits;
  }

  get defaults() {
    return this._defaults;
  }
}

export default Rdf;
