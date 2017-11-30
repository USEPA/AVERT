'use strict';

module.exports = (function () {
  function Rdf (options) {
    this.defaults = {};
    this.raw = {};
    this.regionName = '';
    this.regionalLoads = [];
    this.months = [];
    this.edges = [];

    if (options && typeof options.defaults !== 'undefined') {
      this.defaults = options.defaults;
    }

    if (options && typeof options.rdf !== 'undefined') {
      this.raw = options.rdf;
      this.regionName = options.rdf.region.region_name;

      options.rdf.regional_load.forEach(function (item) {
        this.regionalLoads.push(item.regional_load_mw);
        this.months.push(item.month);
      }, this);

      // --- TODO: ensure next version of data files display "load_bin_edges"
      // as an array, so Object.keys map() can be removed ---
      this.edges = Object.keys(options.rdf.load_bin_edges).map(function (key) {
        return options.rdf.load_bin_edges[key]
      });
    }
  }

  Rdf.prototype.toJSON = function () {
    return {
      defaults: this.defaults,
      raw: this.raw,
      regionName: this.regionName,
      regionalLoads: this.regionalLoads,
      months: this.months,
      edges: this.edges,
    }
  };

  return Rdf;
})();
