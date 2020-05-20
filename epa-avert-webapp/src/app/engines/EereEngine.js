import stats from 'stats-lite';

class EereEngine {
  constructor(profile, rdf, regionLineLoss) {
    this._eereProfile = profile;
    this._rdf = rdf;

    this._lineLoss = 1 / (1 - regionLineLoss / 100);
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

  _calculateTopPercentile() {
    const broadProgramInput = Number(this._eereProfile.broadProgram);
    const topHoursInput = Number(this._eereProfile.topHours);
    const hours = broadProgramInput ? 100 : topHoursInput;
    const ptile = 1 - hours / 100;
    return stats.percentile(this._rdf.regionalLoads, ptile);
  }

  _calculateHourlyMwReduction() {
    const annualGwhInput = Number(this._eereProfile.annualGwh);
    const hours = this._rdf.regionalLoads.length;
    return (annualGwhInput * 1000) / hours;
  }

  // prettier-ignore
  _calculateExceedancesAndHourlyEere(load, index) {
    const softLimit = this._rdf.softLimits[index];
    const hardLimit = this._rdf.hardLimits[index];
    const hourlyDefault = this._rdf.defaults.data[index];

    const constantMwhInput = Number(this._eereProfile.constantMwh);
    const broadProgramInput = Number(this._eereProfile.broadProgram);
    const reductionInput = Number(this._eereProfile.reduction);
    const windCapacityInput = Number(this._eereProfile.windCapacity);
    const utilitySolarInput = Number(this._eereProfile.utilitySolar);
    const rooftopSolarInput = Number(this._eereProfile.rooftopSolar);

    // A: Base Load
    const hourlyMwReduction = this._hourlyMwReduction * this._lineLoss;
    const constantMwh = constantMwhInput * this._lineLoss;
    // B: Peak Hours
    const percentReduction = -1 * (broadProgramInput || reductionInput) / 100 * this._lineLoss;
    // C: Wind
    // D: Utility-scale solar photovoltaic
    // E: Distributed rooftop solar photovoltaic
    const windCapacity = windCapacityInput * hourlyDefault.wind;
    const utilitySolar = utilitySolarInput * hourlyDefault.utility_pv;
    const rooftopSolar = rooftopSolarInput * hourlyDefault.rooftop_pv * this._lineLoss;
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
