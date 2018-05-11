'use strict';

module.exports = (function () {
  function Rdf (data) {
    this._raw = data;
    this._regionName = data.region.region_name; // (for debugging only)
    this._edges = data.load_bin_edges;
    this._regionalLoads = [];
    this._months = [];
    // build up regionalLoads and months arrays
    data.regional_load.forEach(function (item) {
      this._regionalLoads.push(item.regional_load_mw);
      this._months.push(item.month);
    }, this);
  }

  Rdf.prototype.toJSON = function () {
    return {
      raw: this._raw,
      regionName: this._regionName,
      edges: this._edges,
      regionalLoads: this._regionalLoads,
      months: this._months,
    }
  };

  return Rdf;
})();
