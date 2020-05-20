// engines
import EereEngine from 'app/engines/EereEngine';

/**
 * @typedef {Object} EERELoad
 * @property {number[]} softExceedances
 * @property {number[]} hardExceedances
 * @property {any} hourlyEere
 */

class Avert {
  constructor() {
    /** @type {EERELoad} */
    this._eereEngine = {};
  }

  calculateEereLoad({
    regionMaxEELimit,
    regionLineLoss,
    regionalLoads,
    eereDefaults,
    eereInputs,
  }) {
    this._eereEngine = new EereEngine(
      regionMaxEELimit,
      regionLineLoss,
      regionalLoads,
      eereDefaults,
      eereInputs,
    );
  }

  get eereLoad() {
    return this._eereEngine;
  }
}

export default Avert;
