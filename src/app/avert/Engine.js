// Deps
import _ from 'lodash';
import math from 'mathjs';
import stats from 'stats-lite'

// Engine
import Regions from '../utils/Regions';
import YearsEnum from './enums/YearsEnum';
import AnnualDisplacementEngine from './AnnualDisplacementEngine';
import StateEmissionsEngine from './StateEmissionsEngine';
import MonthlyEmissionsEngine from './MonthlyEmissionsEngine';

// App
import store from '../store';
import {
    completeCalculation,
    completeAnnual,
    completeStateEmissions,
    foo_completeStateEmissions,
    completeMonthlyEmissions,
    foo_completeMonthlyEmissions,
    updateExceedances,
} from '../actions';

class Engine {

    constructor(){
        this._year = YearsEnum.CURRENT;
        this.regionData = false;
        this._region = false;
        this.rdf = false;
        this._eereDefault = false;
        this.eereProfile = false;
    }

    set year(year) {
        this._year = YearsEnum[year];
    }

    get year() {
        return this._year;
    }

    get region() {
        return this._region;
    }

    set region(region) {
        const regionKey = _.findKey(Regions, (o) => o.id === region);
        this.regionData = Regions[regionKey];
        this._region = this.regionData.slug;

        // this.rdf = this.regionData.rdf;
        // this.eereDefault = this.regionData.defaults;
    }

    setRdf(rdf) {
        this.rdf = rdf;
    }

    setDefaults(defaults) {
        this.eereDefault = defaults;
    }

    get firstLimits() {
        return this.rdf.limits;
    }

    setEereProfile(profile) {
        this.eereProfile = profile;
    }

    calculateDisplacement() {
        const annualDisplacement = new AnnualDisplacementEngine(this.rdf,this.hourlyEere);
        const stateEmissions = new StateEmissionsEngine();
        const monthlyEmissions = new MonthlyEmissionsEngine();

        const annualOutput = annualDisplacement.output;
        store.dispatch(completeAnnual(annualOutput));

        setTimeout(() => {
            store.dispatch(completeStateEmissions(stateEmissions.emissions));
            store.dispatch(foo_completeStateEmissions(stateEmissions.extract(annualOutput)));
        }, 50);

        setTimeout(() => {
            store.dispatch(completeMonthlyEmissions(monthlyEmissions.emissions));
            store.dispatch(foo_completeMonthlyEmissions(monthlyEmissions.extract(annualOutput)));
        }, 50)

    }

    calculateEereLoad(){
        const regionalLoad = _.map(this.rdf.regional_load,'regional_load_mw');
        const k = 1 - (this.eereProfile.topHours / 100);
        const percentLimit = this.rdf.limits.max_ee_percent / 100;
        const softLimit = .15;
        const hardLimit = .3;

        this.limits = regionalLoad.map((load) => (load * -percentLimit));
        this.softLimits = regionalLoad.map((load) => (load * -softLimit));
        this.hardLimits = regionalLoad.map((load) => (load * -hardLimit));
        this.topPercentile = stats.percentile(regionalLoad, k);
        this.resultingHourlyMwReduction = math.chain(this.eereProfile.annualGwh).multiply(1000).divide(regionalLoad.length).done();
        this.manualEereEntry = math.zeros(regionalLoad.length);

        this.hourlyEere = _.map(regionalLoad, this.hourlyEereCb.bind(this));
        this.exceedances = _.map(this.hourlyEere,'exceedance');
        this.softExceedances = _.map(this.hourlyEere,'soft_exceedance');
        this.hardExceedances = _.map(this.hourlyEere,'hard_exceedance');

        store.dispatch(completeCalculation(this.hourlyEere));
        store.dispatch(updateExceedances(this.exceedances,this.softExceedances,this.hardExceedances));
    }

    hourlyEereCb(load,index){
        setTimeout(() => {}, 0);
        const limit = this.limits[index];
        const softLimit = this.softLimits[index];
        const hardLimit = this.hardLimits[index];
        const hourlyEereDefault = this.eereDefault.data[index];

        const renewable_energy_profile = -math.sum(math.multiply(this.eereProfile.windCapacity,hourlyEereDefault.wind),
                                                math.multiply(this.eereProfile.utilitySolar,hourlyEereDefault.utility_pv),
                                                math.multiply(this.eereProfile.rooftopSolar,hourlyEereDefault.rooftop_pv));

        const percentReduction = -(this.eereProfile.reduction / 100);
        const initialLoad = (load > this.topPercentile) ? (load * percentReduction) : 0;
        const calculatedLoad = math.chain(initialLoad)
                                   .subtract(this.manualEereEntry.toArray()[index])
                                   .add(renewable_energy_profile)
                                   .subtract(this.resultingHourlyMwReduction)
                                   .subtract(this.eereProfile.constantMw)
                                   .done();

        const finalMw = this.rdf.regional_load[index].year < 1990 ? 0 : calculatedLoad;

        return {
            index: index,
            manual_eere_entry: this.manualEereEntry.toArray()[index],
            renewable_energy_profile: renewable_energy_profile,
            final_mw: finalMw,
            percent: initialLoad,
            constant: this.resultingHourlyMwReduction,
            current_load_mw: load,
            flag: 0,
            limit: limit,
            soft_limit: softLimit,
            hard_limit: hardLimit,
            exceedance: (finalMw < limit) ? ((finalMw/limit) - 1) : 0,
            soft_exceedance: Engine.doesExceed(finalMw,softLimit),
            hard_exceedance: Engine.doesExceed(finalMw,hardLimit),
        }
    }

    static doesExceed(mw,limit) {
        return (mw < limit) ? ((mw / limit) - 1) : 0;
    }
}

export default Engine;
