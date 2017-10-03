// Deps
import _ from 'lodash';

// Engine
import Regions from '../utils/Regions';
import YearsEnum from './enums/YearsEnum';
import AnnualDisplacementEngine from './engines/AnnualDisplacementEngine';
import StateEmissionsEngine from './engines/StateEmissionsEngine';
import MonthlyEmissionsEngine from './engines/MonthlyEmissionsEngine';
import Rdf from './entities/Rdf';
import EereEngine from './engines/EereEngine';

// App
import store from '../store';
import {
    completeEereCalculation,
    completeAnnual,
    completeAnnualGeneration,
    completeAnnualSo2,
    completeAnnualNox,
    completeAnnualCo2,
    completeAnnualRates,
    completeStateEmissions,
    completeMonthlyEmissions,
    updateExceedances,
} from '../actions';

class Engine {

    constructor(){
        this._year = YearsEnum.CURRENT;
        this.regionData = false;
        this._region = false;
        this.rdf = false;
        this.rdfClass = false;
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
    }

    setRdfClass(rdf) {
        this.rdfClass = rdf;
    }

    setRdf(rdf) {
        this.rdf = (new Rdf(rdf)).raw;

        if(this.rdfClass) {
            return this.rdfClass.setRdf(rdf);
        }

        return this.setRdfClass(new Rdf({ rdf: rdf }));
    }

    setDefaults(defaults) {
        this.eereDefault = defaults;

        if(this.rdfClass){
            return this.rdfClass.setDefaults(defaults);
        }

        return this.setRdfClass(new Rdf({ defaults: defaults }));
    }

    get firstLimits() {
        return this.rdfClass.raw.limits;
    }

    setEereProfile(profile) {
        this.eereProfile = profile;
    }

    calculateEereLoad(){

        const regionAbbv = this.rdfClass.raw.region.region_abbv;
        const regionKey = _.findKey(Regions, (o) => o.original_slug === regionAbbv);
        const regionData = Regions[regionKey];

        this.eereEngine = new EereEngine(this.eereProfile,this.rdfClass,regionData);
        this.eereEngine.calculateEereLoad();
        this.hourlyEere = this.eereEngine.hourlyEere;
        store.dispatch(completeEereCalculation(this.eereEngine.hourlyEere));
        store.dispatch(updateExceedances(this.eereEngine.exceedances,this.eereEngine.softExceedances,this.eereEngine.hardExceedances));
    }

    calculateDisplacement() {
        this.annualDisplacement = new AnnualDisplacementEngine(this.rdfClass,this.hourlyEere);
        this.stateEmissions = new StateEmissionsEngine();
        this.monthlyEmissions = new MonthlyEmissionsEngine();

        this.getGeneration();
    }

    getGeneration() {
        this.generation = this.annualDisplacement.generation;
        store.dispatch(completeAnnualGeneration(this.generation));
    }

    getSo2() {
        this.so2 = this.annualDisplacement.so2Total;
        store.dispatch(completeAnnualSo2(this.so2));
    }

    getNox() {
        this.nox = this.annualDisplacement.noxTotal;
        store.dispatch(completeAnnualNox(this.nox));
    }

    getCo2() {
        this.co2 = this.annualDisplacement.co2Total;
        store.dispatch(completeAnnualCo2(this.co2));
    }

    getEmissionRates() {
        this.rates = this.annualDisplacement.emissionRates;
        store.dispatch(completeAnnualRates(this.rates));
    }

    getAnnual() {
        this.annualOutput = {
            generation: this.generation,
            totalEmissions: {
                so2: this.so2,
                nox: this.nox,
                co2: this.co2,
            },
            emissionRates: this.rates,
        };
        store.dispatch(completeAnnual(this.annualOutput));
    }

    getStateEmissions() {
        store.dispatch(completeStateEmissions(this.stateEmissions.extract(this.annualOutput)));
    }

    getMonthlyEmissions() {
        store.dispatch(completeMonthlyEmissions(this.monthlyEmissions.extract(this.annualOutput)));
    }
}

export default Engine;
