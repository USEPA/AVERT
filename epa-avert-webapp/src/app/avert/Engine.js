import Regions from 'app/utils/Regions';
import Rdf from 'app/avert/entities/Rdf';
import EereEngine from 'app/avert/engines/EereEngine';

class Engine {
  constructor() {
    this._region = {};
    this._rdf = false;
    this._eereDefaults = {};
    this._eereProfile = {};
    this._eereEngine = {};
  }

  set region(regionId) {
    const regionKey = Object.keys(Regions).find(key => Regions[key].id === regionId);
    this._region = Regions[regionKey];
  }

  get regionSlug() {
    return this._region.slug;
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

  get rdf() {
    return this._rdf;
  }

  set eereProfile(profile) {
    this._eereProfile = profile;
  }

  calculateEereLoad() {
    this._eereEngine = new EereEngine(this._eereProfile, this._rdf, this._region);
  }

  get eereLoad() {
    return this._eereEngine;
  }
}

export default Engine;
