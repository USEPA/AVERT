'use strict';

module.exports = (function () {
  function Rdf (options) {
    this.raw = {};
    this.regionName = '';
    this.edges = [];
    this.regionalLoads = [];
    this.months = [];
    this.defaults = {};

    // if called with options.rdf
    if (options && typeof options.rdf !== 'undefined') {
      this.raw = options.rdf;
      this.regionName = options.rdf.region.region_name;
      this.edges = options.rdf.load_bin_edges;

      options.rdf.regional_load.forEach(function (item) {
        this.regionalLoads.push(item.regional_load_mw);
        this.months.push(item.month);
      }, this);
    }

    // if called with options.defaults
    if (options && typeof options.defaults !== 'undefined') {
      this.defaults = options.defaults;
    }
  }

  Rdf.prototype.toJSON = function () {
    return {
      raw: this.raw,
      regionName: this.regionName,
      edges: this.edges,
      regionalLoads: this.regionalLoads,
      months: this.months,
      defaults: this.defaults,
    }
  };

  return Rdf;
})();
