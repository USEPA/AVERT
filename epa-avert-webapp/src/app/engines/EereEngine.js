import stats from 'stats-lite';

class EereEngine {
  constructor(
    regionMaxEELimit,
    regionLineLoss,
    regionalLoads,
    eereDefaults,
    eereInputs,
  ) {
    this._regionMaxEELimit = regionMaxEELimit; // 15 (percent)
    this._regionLineLoss = 1 / (1 - regionLineLoss / 100);
    this._regionalLoads = regionalLoads;
    this._eereDefaults = eereDefaults;
    this._eereInputs = eereInputs;

    this._topPercentile = this._calculateTopPercentile();
    this._hourlyMwReduction = this._calculateHourlyMwReduction();

    this._softExceedances = [];
    this._hardExceedances = [];
    this._hourlyEere = [];
    // build up above instance arrays
    this._regionalLoads.forEach((hour, index) => {
      this._calculateExceedancesAndHourlyEere(hour.regional_load_mw, index);
    });
  }

  _calculateTopPercentile() {
    const loads = this._regionalLoads.map((hour) => hour.regional_load_mw);
    const broadProgramInput = Number(this._eereInputs.broadProgram);
    const topHoursInput = Number(this._eereInputs.topHours);
    const hours = broadProgramInput ? 100 : topHoursInput;
    const ptile = 1 - hours / 100;
    return stats.percentile(loads, ptile);
  }

  _calculateHourlyMwReduction() {
    const annualGwhInput = Number(this._eereInputs.annualGwh);
    const hours = this._regionalLoads.length;
    return (annualGwhInput * 1000) / hours;
  }

  // prettier-ignore
  _calculateExceedancesAndHourlyEere(load, index) {
    const softLimit = load * -1 * this._regionMaxEELimit / 100;
    const hardLimit = load * -0.3;
    const hourlyDefault = this._eereDefaults[index];

    const constantMwhInput = Number(this._eereInputs.constantMwh);
    const broadProgramInput = Number(this._eereInputs.broadProgram);
    const reductionInput = Number(this._eereInputs.reduction);
    const windCapacityInput = Number(this._eereInputs.windCapacity);
    const utilitySolarInput = Number(this._eereInputs.utilitySolar);
    const rooftopSolarInput = Number(this._eereInputs.rooftopSolar);

    // A: Base Load
    const hourlyMwReduction = this._hourlyMwReduction * this._regionLineLoss;
    const constantMwh = constantMwhInput * this._regionLineLoss;
    // B: Peak Hours
    const percentReduction = -1 * (broadProgramInput || reductionInput) / 100 * this._regionLineLoss;
    // C: Wind
    // D: Utility-scale solar photovoltaic
    // E: Distributed rooftop solar photovoltaic
    const windCapacity = windCapacityInput * hourlyDefault.wind;
    const utilitySolar = utilitySolarInput * hourlyDefault.utility_pv;
    const rooftopSolar = rooftopSolarInput * hourlyDefault.rooftop_pv * this._regionLineLoss;
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
