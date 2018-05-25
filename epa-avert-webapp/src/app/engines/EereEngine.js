import stats from 'stats-lite';

class EereEngine {
  constructor(profile, rdf, region) {
    this._eereProfile = profile;
    this._rdf = rdf;
    this._region = region;

    this._gridLoss = this._calculateGridLoss();
    this._topPercentile = this._calculateTopPercentile();
    this._hourlyMwReduction = this._calculateHourlyMwReduction();

    this._softExceedances = [];
    this._hardExceedances = [];
    this._hourlyEere = [];
    // build up above instance arrays
    this._rdf.regionalLoads.forEach((load, index) => {
      this._calculateExceedancesAndHourlyEere(load, index);
    });
  }

  _calculateGridLoss() {
    return 1 / (1 - this._region.grid_loss / 100);
  }

  _calculateTopPercentile() {
    const k = 1 - this._eereProfile.topHours / 100;
    return stats.percentile(this._rdf.regionalLoads, k);
  }

  _calculateHourlyMwReduction() {
    const hours = this._rdf.regionalLoads.length;
    return this._eereProfile.annualGwh * 1000 / hours;
  }

  // prettier-ignore
  _calculateExceedancesAndHourlyEere(load, index) {
    const softLimit = this._rdf.softLimits[index];
    const hardLimit = this._rdf.hardLimits[index];
    const hourlyDefault = this._rdf.defaults.data[index];

    // A: Base Load
    const hourlyMwReduction = this._hourlyMwReduction * this._gridLoss;
    const constantMwh = this._eereProfile.constantMwh * this._gridLoss;
    // B: Peak Hours
    const percentReduction = -(this._eereProfile.reduction / 100) * this._gridLoss;
    // C: Wind
    // D: Utility-scale solar photovoltaic
    // E: Distributed rooftop solar photovoltaic
    const windCapacity = (this._eereProfile.windCapacity * hourlyDefault.wind);
    const utilitySolar = (this._eereProfile.utilitySolar * hourlyDefault.utility_pv);
    const rooftopSolar = (this._eereProfile.rooftopSolar * hourlyDefault.rooftop_pv * this._gridLoss);
    const renewableProfile = -1 * (windCapacity + utilitySolar + rooftopSolar);

    const initialLoad = (load > this._topPercentile) ? (load * percentReduction) : 0;
    const calculatedLoad = initialLoad + renewableProfile - hourlyMwReduction - constantMwh;

    const softExceedance = this._doesExceed(calculatedLoad, softLimit, 15)
    const hardExceedance = this._doesExceed(calculatedLoad, hardLimit, 30)

    // build up instance arrays
    this._softExceedances[index] = softExceedance;
    this._hardExceedances[index] = hardExceedance;
    this._hourlyEere[index] = {
      index: index,
      constant: this._hourlyMwReduction,
      current_load_mw: load,
      percent: initialLoad,
      final_mw: calculatedLoad,
      renewable_energy_profile: renewableProfile,
      soft_limit: softLimit,
      hard_limit: hardLimit,
      soft_exceedance: softExceedance,
      hard_exceedance: hardExceedance,
    }
  }

  _doesExceed(load, limit, number) {
    if (Math.abs(load) > Math.abs(limit)) {
      const exceedance = Math.abs(load) / Math.abs(limit) - 1;
      return exceedance * number + number;
    }
    return 0;
  }

  get hourlyEere() {
    return this._hourlyEere;
  }

  get softExceedances() {
    return this._softExceedances;
  }

  get hardExceedances() {
    return this._hardExceedances;
  }
}

export default EereEngine;
