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
	}

    get isValid() {
        
        if(this._errors.length) return false;

        return true;
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

        this._topHours = value;

        return this;
    }

    get reduction() {
        return this._reduction;
    }

    set reduction(value) {
        this.removeError('reduction');

        this._reduction = value;

        return this;
    }

    get annualGwh() {
        return this._annualGwh;
    }

    set annualGwh(value) {
        this.removeError('annualGwh');

        if(value > 41900) this.addError('annualGwh');

        this._annualGwh = value;

        return this;        
    }
    
    get constantMw() {
        return this._constantMw;
    }

    set constantMw(value) {
        this.removeError('constantMw');

        this._constantMw = value;

        return this;
    }

    get windCapacity() {
        return this._windCapacity;
    }

    set windCapacity(value) {
        this.removeError('windCapacity');

        if(value > 4780) this.addError('windCapacity');

        this._windCapacity = value;

        return this;
    }

    get utilitySolar() {
        return this._utilitySolar;
    }

    set utilitySolar(value) {
        this.removeError('utilitySolar');

        if(value > 4780) this.addError('utilitySolar');

        this._utilitySolar = value;

        return this;
    }

    get rooftopSolar() {
        return this._rooftopSolar;
    }

    set rooftopSolar(value) {
        this.removeError('rooftopSolar');

        if(value > 4780) this.addError('rooftopSolar');

        this._rooftopSolar = value;

        return this;
    }
}

export default EereProfile;