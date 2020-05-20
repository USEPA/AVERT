class EereProfile {
  constructor() {
    this._limits = {
      annualGwh: false,
      constantMwh: false,
      renewables: false,
      percent: false,
    };
    this._annualGwh = 0;
    this._constantMwh = 0;
    this._topHours = 0;
    this._reduction = 0;
    this._windCapacity = 0;
    this._utilitySolar = 0;
    this._rooftopSolar = 0;
  }

  set limits({ hours, annualGwh, renewables, percent }) {
    // calculate constantMwh (hourly) from annualGwh (total for year)
    const hourly = (annualGwh * 1000) / hours;
    this._limits = {
      annualGwh,
      constantMwh: Math.round(hourly * 100) / 100,
      renewables: renewables * 2,
      percent: percent * 2,
    };
  }

  set annualGwh(input) {
    this._annualGwh = input;
  }

  get annualGwh() {
    return this._annualGwh;
  }

  set constantMwh(input) {
    this._constantMwh = input;
  }

  get constantMwh() {
    return this._constantMwh;
  }

  set topHours(input) {
    this._topHours = input;
  }

  get topHours() {
    return this._topHours;
  }

  set reduction(input) {
    this._reduction = input;
  }

  get reduction() {
    return this._reduction;
  }

  set windCapacity(input) {
    this._windCapacity = input;
  }

  get windCapacity() {
    return this._windCapacity;
  }

  set utilitySolar(input) {
    this._utilitySolar = input;
  }

  get utilitySolar() {
    return this._utilitySolar;
  }

  set rooftopSolar(input) {
    this._rooftopSolar = input;
  }

  get rooftopSolar() {
    return this._rooftopSolar;
  }

  reset() {
    this._annualGwh = 0;
    this._constantMwh = 0;
    this._topHours = 0;
    this._reduction = 0;
    this._windCapacity = 0;
    this._utilitySolar = 0;
    this._rooftopSolar = 0;
  }
}

export default EereProfile;
