'use strict';

module.exports = (function () {
  function Rdf (options) {
    this.raw = {};
    this.regionName = '';
    this.regionalLoads = [];
    this.percentLimit = [];
    this.defaults = {};
    this.months = [];
    this.edges = [];

    if (options && typeof options.rdf !== 'undefined') this.setRdf(options.rdf);
    if (options && typeof options.defaults !== 'undefined') this.setDefaults(options.defaults);
  }

  Rdf.prototype.toJSON = function () {
    return {
      raw: this.raw,
      regionName: this.regionName,
      regionalLoads: this.regionalLoads,
      percentLimit: this.percentLimit,
      defaults: this.defaults,
      months: this.months,
      edges: this.edges,
    }
  };

  Rdf.prototype.setRdf = function (rdf) {
    this.raw = rdf;
    this.regionName = rdf.region.region_name;
    this.regionalLoads = rdf.regional_load.map(function (data) {
      return data.regional_load_mw
    });
    this.edges = Object.keys(rdf.load_bin_edges).map(function (key) {
      return rdf.load_bin_edges[key]
    });
    this.months = rdf.regional_load.map(function (item) {
      return item.month
    });
  };

  Rdf.prototype.setDefaults = function (defaults) {
    this.defaults = defaults;
  };

  return Rdf;
})();
