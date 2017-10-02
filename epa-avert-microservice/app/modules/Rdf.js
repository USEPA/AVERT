'use strict';

const Rdf = (function () {

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

    Rdf.prototype.getGeneration = function () {
        return this.raw.data.generation;
    };

    Rdf.prototype.getSo2 = function () {
        return this.raw.data.so2;
    };

    Rdf.prototype.getSo2_not = function () {
        return this.raw.data.so2_not;
    };

    Rdf.prototype.getCo2 = function () {
        return this.raw.data.co2;
    };

    Rdf.prototype.getCo2_not = function () {
        return this.raw.data.co2_not;
    };

    Rdf.prototype.getNox = function () {
        return this.raw.data.nox;
    };

    Rdf.prototype.getNox_nox = function () {
        return this.raw.data.nox_not;
    };

    Rdf.prototype.setSecondValidationLimits = function () {
        this.softLimits = this.regionalLoads.map(function (load) {
            return (load * - this.percentLimit)
        });
        this.hardLimits = this.regionalLoads.map(function (load) {
            return (load * - 0.3)
        });
    };

    Rdf.prototype.setRdf = function (rdf) {
        this.raw = rdf;
        this.regionName = rdf.region.region_name;
        this.regionalLoads = rdf.regional_load.map(function (data) {
            return data.regional_load_mw
        });
        // this.percentLimit = rdf.limits.max_ee_percent / 100;
        // this.setSecondValidationLimits();
        this.extractLoadBinEdges(rdf);
        this.extractMonths(rdf.regional_load);
    };

    Rdf.prototype.setDefaults = function (defaults) {
        this.defaults = defaults;
    };

    Rdf.prototype.extractLoadBinEdges = function (json) {
        this.edges = Object.keys(json.load_bin_edges).map(function (key) {
            return json.load_bin_edges[key]
        });

        return this.edges;
    };

    Rdf.prototype.extractMonths = function (data) {
        this.months = data.map(function (item) {
            return item.month
        });

        return this.months;
    };

    return Rdf;
})();

module.exports = Rdf;