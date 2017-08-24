'use strict';

const Eere = (function() {
    function Eere() {
        this._topHours = 0;
        this._reduction = 0;
        this._annualGwh = 0;
        this._constantMw = 0;
        this._windCapacity = 0;
        this._utilitySolar = 0;
        this._rooftopSolar = 0;
        this._errors = [];
        this._limits = {
            annualGwh: false,
            constantMwh: false,
            renewables: false,
            softPercent: 15
        }
    }

    Eere.prototype.getLimits = function() {
        return this._limits;
    };

    Eere.prototype.setLimits = function(limits) {
        this._limits = {
            annualGwh: limits.constantReductions,
            constantMwh: parseInt((limits.constantReductions * 1000) / 8760,10),
            renewables: limits.renewables,
            softPercent: 15,
        };
    };

    Eere.prototype.getIsValid = function() {
        return this._errors.length === 0;
    };

    Eere.prototype.getErrors = function() {
        return this._errors;
    };

    Eere.prototype.setErrors = function(value) {

        this._errors = value;

        return this;
    };

    Eere.prototype.addError = function(field) {
        if(this._errors.indexOf(field) === -1) this._errors.push(field);

        return this;
    };

    Eere.prototype.removeError = function(field) {
        const index = this._errors.indexOf(field);
        if(index === -1) return;

        this._errors.splice(index,1);

        return this;
    };

    Eere.prototype.getTopHours = function() {
        return this._topHours;
    };

    Eere.prototype.setTopHours = function(value) {
        this.removeError('topHours');

        if (value > 100 || value < 0) this.addError('topHours');

        this._topHours = value;

        return this;
    };

    Eere.prototype.getReduction = function() {
        return this._reduction;
    };

    Eere.prototype.setReduction = function(value) {
        this.removeError('reduction');

        if (value > this.limits.softPercent || value < 0) this.addError('reduction');

        this._reduction = value;

        return this;
    };

    Eere.prototype.getAnnualGwh = function() {
        return this._annualGwh;
    };

    Eere.prototype.setAnnualGwh = function(value) {
        this.removeError('annualGwh');

        if(value > this.limits.annualGwh) this.addError('annualGwh');

        this._annualGwh = value;

        return this;
    };

    Eere.prototype.getConstantMw = function() {
        return this._constantMw;
    };

    Eere.prototype.setConstantMw = function(value) {
        this.removeError('constantMw');

        if(value > this.limits.constantMwh) this.addError('constantMw');

        this._constantMw = value;

        return this;
    };

    Eere.prototype.getWindCapacity = function() {
        return this._windCapacity;
    };

    Eere.prototype.setWindCapacity = function(value) {
        this.removeError('windCapacity');

        if(value > this.limits.renewables) this.addError('windCapacity');

        this._windCapacity = value;

        return this;
    };

    Eere.prototype.getUtilitySolar = function() {
        return this._utilitySolar;
    };

    Eere.prototype.setUtilitySolar = function(value) {
        this.removeError('utilitySolar');

        if(value > this.limits.renewables) this.addError('utilitySolar');

        this._utilitySolar = value;

        return this;
    };

    Eere.prototype.getRooftopSolar = function() {
        return this._rooftopSolar;
    };

    Eere.prototype.setRooftopSolar = function(value) {
        this.removeError('rooftopSolar');

        if(value > this.limits.renewables) this.addError('rooftopSolar');

        this._rooftopSolar = value;

        return this;
    };

    Eere.prototype.reset = function() {
        this._topHours = 0;
        this._reduction = 0;
        this._annualGwh = 0;
        this._constantMw = 0;
        this._windCapacity = 0;
        this._utilitySolar = 0;
        this._rooftopSolar = 0;
        this._errors = [];
    };

    Eere.prototype.toJSON = function() {
        return {
            topHours: this._topHours,
            reduction: this._reduction,
            annualGwh: this._annualGwh,
            constantMw: this._constantMw,
            windCapacity: this._windCapacity,
            utilitySolar: this._utilitySolar,
            rooftopSolar: this._rooftopSolar,
            errors: this._errors,
            limits: this._limits,
        }
    };

    return Eere;
})();

module.exports = Eere;
