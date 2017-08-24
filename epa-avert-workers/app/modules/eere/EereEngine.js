'use strict';

const _ = require('lodash');
const math = require('mathjs');
const stats = require('stats-lite');

const EereEngine = (function() {
    function EereEngine (profile, rdf) {
        this.profile = profile;
        this.rdf = rdf;
        this.softLimits = this.rdf.softLimits;
        this.hardLimits = this.rdf.hardLimits;
        this.calculateTopPercentile(this.rdf.regionalLoads);
        this.calculateHourlyReduction(this.rdf.regionalLoads.length);
        // this.manualEereEntry = math.zeros(this.rdf.regionalLoads.length);
        this.hourlyEere = [];
        this.exceedances = [];
        this.softExceedances = [];
        this.hardExceedances = [];
    }

    EereEngine.prototype.calculateEereLoad = function () {
        this.hourlyEere = _.map(this.rdf.regionalLoads, this.hourlyEereCb.bind(this));
        this.exceedances = _.map(this.hourlyEere, 'exceedance');
        this.softExceedances = _.map(this.hourlyEere, 'soft_exceedance');
        this.hardExceedances = _.map(this.hourlyEere, 'hard_exceedance');
    };

    EereEngine.prototype.calculateTopPercentile = function (regionalLoad) {
        const k = 1 - (this.profile.topHours / 100);
        this.topPercentile = stats.percentile(regionalLoad, k);
        return this.topPercentile;
    };

    EereEngine.prototype.calculateHourlyReduction = function (numberOfRegions) {
        const result = math.chain(this.profile.annualGwh).multiply(1000).divide(numberOfRegions).done();
        this.resultingHourlyMwReduction = result;
        return result;
    };

    EereEngine.prototype.hourlyEereCb = function (load, index) {
        const softLimit = this.rdf.softLimits[index];
        const hardLimit = this.rdf.hardLimits[index];
        const hourlyEereDefault = this.rdf.defaults.data[index];

        const renewable_energy_profile = - math.sum(math.multiply(this.profile.windCapacity, hourlyEereDefault.wind),
            math.multiply(this.profile.utilitySolar, hourlyEereDefault.utility_pv),
            math.multiply(this.profile.rooftopSolar, hourlyEereDefault.rooftop_pv));

        const percentReduction = - (this.profile.reduction / 100);
        const initialLoad = (load > this.topPercentile) ? (load * percentReduction) : 0;
        const calculatedLoad = math.chain(initialLoad)
        // .subtract(this.manualEereEntry.toArray()[index])
            .add(renewable_energy_profile)
            .subtract(this.resultingHourlyMwReduction)
            .subtract(this.profile.constantMw)
            .done();

        const finalMw = this.rdf.regionalLoads[index].year < 1990 ? 0 : calculatedLoad;

        return {
            index: index,
            // manual_eere_entry: this.manualEereEntry.toArray()[index],
            renewable_energy_profile: renewable_energy_profile,
            final_mw: finalMw,
            percent: initialLoad,
            constant: this.resultingHourlyMwReduction,
            current_load_mw: load,
            // flag: 0,
            soft_limit: softLimit,
            hard_limit: hardLimit,
            soft_exceedance: this.doesExceedFormatted(finalMw, softLimit, 15),
            hard_exceedance: this.doesExceedFormatted(finalMw, hardLimit, 30),
        }
    };

    EereEngine.prototype.doesExceed = function (mw, limit) {
        return (Math.abs(mw) > Math.abs(limit)) ? ((Math.abs(mw) / Math.abs(limit)) - 1) : 0;
    };

    EereEngine.prototype.doesExceedFromOriginal = function (mw, limit, load) {
        return (Math.abs(mw) > Math.abs(limit)) ? ((Math.abs(mw) / Math.abs(load)) * 100) : 0;
    };

    EereEngine.prototype.doesExceedFormatted = function (mw, limit, numericalLimit) {
        if (Math.abs(mw) > Math.abs(limit)) {
            const exceedance = (Math.abs(mw) / Math.abs(limit)) - 1;

            return exceedance * numericalLimit + numericalLimit;
        }

        return 0;
    };

    return EereEngine;
})();

module.exports = EereEngine;