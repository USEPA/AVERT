class EereProfile {
  constructor() {
    this._limits = {
      annualGwh: false,
      constantMwh: false,
      renewables: false,
      softPercent: 15,
    };
    this._errors = [];
    this._annualGwh = 0;
    this._constantMw = 0;
    this._topHours = 0;
    this._reduction = 0;
    this._windCapacity = 0;
    this._utilitySolar = 0;
    this._rooftopSolar = 0;
  }

  set limits(obj) {
    // calculate constantMwh (hourly) from annualGwh (total for year)
    const hourly = obj.annualGwh * 1000 / obj.hours;
    this._limits = {
      annualGwh: obj.annualGwh,
      constantMwh: Math.round(hourly * 100) / 100,
      renewables: obj.renewables,
      softPercent: 15,
    };
  }

  get limits() {
    return this._limits;
  }

  get isValid() {
    return this._errors.length === 0;
  }

  get errors() {
    return this._errors;
  }

  _addError(string) {
    if (this._errors.indexOf(string) === -1) this._errors.push(string);
    return this;
  }

  _removeError(string) {
    const index = this._errors.indexOf(string);
    if (index === -1) return;
    this._errors.splice(index, 1);
    return this;
  }

  _isNegativeOrNaN(string) {
    return string < 0 || isNaN(string);
  }

  set annualGwh(input) {
    this._removeError('annualGwh');
    if (this._isNegativeOrNaN(input) || input > this._limits.annualGwh) {
      this._addError('annualGwh');
    }
    this._annualGwh = input;
  }

  get annualGwh() {
    return this._annualGwh;
  }

  set constantMw(input) {
    this._removeError('constantMw');
    if (this._isNegativeOrNaN(input) || input > this._limits.constantMwh) {
      this._addError('constantMw');
    }
    this._constantMw = input;
  }

  get constantMw() {
    return this._constantMw;
  }

  set topHours(input) {
    this._removeError('topHours');
    if (this._isNegativeOrNaN(input) || input > 100) {
      this._addError('topHours');
    }
    this._topHours = input;
  }

  get topHours() {
    return this._topHours;
  }

  set reduction(input) {
    this._removeError('reduction');
    if (this._isNegativeOrNaN(input) || input > this._limits.softPercent) {
      this._addError('reduction');
    }
    this._reduction = input;
  }

  get reduction() {
    return this._reduction;
  }

  set windCapacity(input) {
    this._removeError('windCapacity');
    if (this._isNegativeOrNaN(input) || input > this._limits.renewables) {
      this._addError('windCapacity');
    }
    this._windCapacity = input;
  }

  get windCapacity() {
    return this._windCapacity;
  }

  set utilitySolar(input) {
    this._removeError('utilitySolar');
    if (this._isNegativeOrNaN(input) || input > this._limits.renewables) {
      this._addError('utilitySolar');
    }
    this._utilitySolar = input;
  }

  get utilitySolar() {
    return this._utilitySolar;
  }

  set rooftopSolar(input) {
    this._removeError('rooftopSolar');
    if (this._isNegativeOrNaN(input) || input > this._limits.renewables) {
      this._addError('rooftopSolar');
    }
    this._rooftopSolar = input;
  }

  get rooftopSolar() {
    return this._rooftopSolar;
  }

  reset() {
    this._errors = [];
    this._annualGwh = 0;
    this._constantMw = 0;
    this._topHours = 0;
    this._reduction = 0;
    this._windCapacity = 0;
    this._utilitySolar = 0;
    this._rooftopSolar = 0;
  }
}

export default EereProfile;
