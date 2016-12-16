class EereProfile {
    constructor() {
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
            softPercent: 15,
        }
    }

    get limits() {
        return this._limits;
    }

    set limits(limits) {
        this._limits = {
            annualGwh: limits.constantReductions,
            constantMwh: parseInt((limits.constantReductions * 1000) / 8760,10),
            renewables: limits.renewables,
            softPercent: 15,
        };
    }

    get isValid() {

        return this._errors.length === 0;
    }

    get errors() {
        return this._errors;
    }

    set errors(value) {

        this._errors = value;

        return this;
    }

    addError(field) {
        if(this._errors.indexOf(field) === -1) this._errors.push(field);

        return this;
    }

    removeError(field) {
        const index = this._errors.indexOf(field);
        if(index === -1) return;

        this._errors.splice(index,1);

        return this;
    }

    get topHours() {
        return this._topHours;
    }

    set topHours(value) {
        this.removeError('topHours');

        if (value > 100 || value < 0) this.addError('topHours');

        this._topHours = value;

        return this;
    }

    get reduction() {
        return this._reduction;
    }

    set reduction(value) {
        this.removeError('reduction');

        if (value > this.limits.softPercent || value < 0) this.addError('reduction');

        this._reduction = value;

        return this;
    }

    get annualGwh() {
        return this._annualGwh;
    }

    set annualGwh(value) {
        this.removeError('annualGwh');

        if(value > this.limits.annualGwh) this.addError('annualGwh');

        this._annualGwh = value;

        return this;
    }

    get constantMw() {
        return this._constantMw;
    }

    set constantMw(value) {
        this.removeError('constantMw');

        if(value > this.limits.constantMwh) this.addError('constantMw');

        this._constantMw = value;

        return this;
    }

    get windCapacity() {
        return this._windCapacity;
    }

    set windCapacity(value) {
        this.removeError('windCapacity');

        if(value > this.limits.renewables) this.addError('windCapacity');

        this._windCapacity = value;

        return this;
    }

    get utilitySolar() {
        return this._utilitySolar;
    }

    set utilitySolar(value) {
        this.removeError('utilitySolar');

        if(value > this.limits.renewables) this.addError('utilitySolar');

        this._utilitySolar = value;

        return this;
    }

    get rooftopSolar() {
        return this._rooftopSolar;
    }

    set rooftopSolar(value) {
        this.removeError('rooftopSolar');

        if(value > this.limits.renewables) this.addError('rooftopSolar');

        this._rooftopSolar = value;

        return this;
    }

    reset() {
      
    }
}

export default EereProfile;
