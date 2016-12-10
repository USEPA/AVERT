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
    completeCalculation,
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
        this.eereEngine = new EereEngine(this.eereProfile,this.rdfClass);
        this.eereEngine.calculateEereLoad();
        this.hourlyEere = this.eereEngine.hourlyEere;
        store.dispatch(completeCalculation(this.eereEngine.hourlyEere));
        store.dispatch(updateExceedances(this.eereEngine.exceedances,this.eereEngine.softExceedances,this.eereEngine.hardExceedances));
    }

    calculateDisplacement() {
        this.annualDisplacement = new AnnualDisplacementEngine(this.rdfClass,this.hourlyEere);
        this.stateEmissions = new StateEmissionsEngine();
        this.monthlyEmissions = new MonthlyEmissionsEngine();

        /*/
        const annualOutput = this.annualDisplacement.output;
        store.dispatch(completeAnnual(annualOutput));

        setTimeout(() => {
            store.dispatch(completeStateEmissions(this.stateEmissions.extract(annualOutput)));
        }, 50);

        setTimeout(() => {
            store.dispatch(completeMonthlyEmissions(this.monthlyEmissions.extract(annualOutput)));
        }, 50);

        /*/
        const functions = [
            this.completeGeneration,
            this.completeSo2,
            this.completeNoxTotal,
            this.completeCo2Total,
            this.completeEmissionRates,
            this.completeAnnual,
            this.completeState,
            this.completeMonthly,
        ];

        setTimeout(this.callFunctions(functions, 0, this), 10);
        //*/

    }

    callFunctions(functions, i, _this){
        functions[i++](_this);
        if(i < functions.length) {
            setTimeout(this.callFunctions(functions, i, _this), 10);
        }
    }

    completeGeneration(_this) {
        _this.generation = _this.annualDisplacement.generation;
        console.warn('...','Complete Generation',_this.generation);
        store.dispatch(completeAnnualGeneration(_this.generation));
    }

    completeSo2(_this) {
        _this.so2 = _this.annualDisplacement.so2Total;
        console.warn('...','Complete SO2',_this.so2);
        store.dispatch(completeAnnualSo2(_this.so2));
    }
    completeNoxTotal(_this) {
        _this.nox = _this.annualDisplacement.noxTotal;
        store.dispatch(completeAnnualNox(_this.nox));
    }
    completeCo2Total(_this) {
        _this.co2 = _this.annualDisplacement.co2Total;
        store.dispatch(completeAnnualCo2(_this.co2));
    }
    completeEmissionRates(_this) {
        _this.rates = _this.annualDisplacement.emissionRates;
        store.dispatch(completeAnnualRates(_this.rates));
    }
    completeAnnual(_this) {
        _this.annualOutput = {
            generation: _this.generation,
            totalEmissions: {
                so2: _this.so2,
                nox: _this.nox,
                co2: _this.co2,
            },
            emissionRates: _this.rates,
        };
        store.dispatch(completeAnnual(_this.annualOutput));
    }
    completeState(_this) {
        store.dispatch(completeStateEmissions(_this.stateEmissions.extract(_this.annualOutput)));
    }
    completeMonthly(_this) {
        store.dispatch(completeMonthlyEmissions(_this.monthlyEmissions.extract(_this.annualOutput)));
    }
}

export default Engine;
