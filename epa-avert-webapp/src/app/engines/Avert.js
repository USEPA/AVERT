// config
import { regions } from 'app/config';
// engines
import Rdf from 'app/engines/Rdf';
import EereEngine from 'app/engines/EereEngine';

/**
 * @typedef {Object} EERELoad
 * @property {number[]} softExceedances
 * @property {number[]} hardExceedances
 * @property {any} hourlyEere
 */

class Avert {
  constructor() {
    this._rdf = false;
    this._eereDefaults = {};

    /** @type {EERELoad} */
    this._eereEngine = {};
  }

  set rdf(data) {
    // if this._rdf is already set, call setRdf() on the this._rdf object
    if (this._rdf) return this._rdf.setRdf(data);
    // else set this._rdf
    this._rdf = new Rdf({ rdf: data });
  }

  set eereDefaults(data) {
    this._eereDefaults = data;

    // if this._rdf is already set, call setDefaults() on the this._rdf object
    if (this._rdf) return this._rdf.setDefaults(data);
    // else set this._rdf
    this._rdf = new Rdf({ defaults: data });
  }

  calculateEereLoad(regionNumber, eereInputs) {
    const regionKey = Object.keys(regions).find((key) => {
      return regions[key].number === regionNumber;
    });

    this._eereEngine = new EereEngine(
      eereInputs,
      this._rdf,
      regions[regionKey].lineLoss,
    );
  }

  get eereLoad() {
    return this._eereEngine;
  }
}

export default Avert;
