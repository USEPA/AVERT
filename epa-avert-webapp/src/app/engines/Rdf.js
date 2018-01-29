class Rdf {
  constructor(options) {
    this._regionName = ''; // not actually used (for debugging)
    this._maxAnnualGwh = null;
    this._maxRenewableMwh = null;
    this._regionalLoads = [];
    this._softLimits = [];
    this._hardLimits = [];
    this._months = [];
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
    this._maxAnnualGwh = rdf.limits.max_ee_yearly_gwh;
    this._maxRenewableMwh = rdf.limits.max_solar_wind_mwh;
    this._regionalLoads = [];
    this._softLimits = [];
    this._hardLimits = [];
    this._months = [];

    rdf.regional_load.forEach(item => {
      const load = item.regional_load_mw;
      this._regionalLoads.push(load);
      this._softLimits.push(load * -1 * rdf.limits.max_ee_percent / 100); // -0.15
      this._hardLimits.push(load * -0.3);
      this._months.push(item.month);
    });
  }

  setDefaults(defaults) {
    this._defaults = defaults;
  }

  get maxAnnualGwh() {
    return this._maxAnnualGwh;
  }

  get maxRenewableMwh() {
    return this._maxRenewableMwh;
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

  get months() {
    return this._months;
  }

  get defaults() {
    return this._defaults;
  }
}

export default Rdf;
