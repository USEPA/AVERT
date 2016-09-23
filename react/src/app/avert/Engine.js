// Deps
import _ from 'lodash';
import math from 'mathjs';
import stats from 'stats-lite'

// Engine
import RegionEnum from './enums/RegionEnum';
import GasesEnum from './enums/GasesEnum';
import YearsEnum from './enums/YearsEnum';
import RdfEnum from './enums/RdfEnum';
// import EereEngine from './EereEngine';
import AnnualDisplacementEngine from './AnnualDisplacementEngine';
import StateEmissionsEngine from './StateEmissionsEngine';
import MonthlyEmissionsEngine from './MonthlyEmissionsEngine';

// App
import { store } from '../store';
import { 
    completeCalculation, 
    completeAnnual, 
    completeStateEmissions, 
    completeMonthlyEmissions 
} from '../actions';

class Engine {

    constructor(){
        this.gas = [GasesEnum.CO2,GasesEnum.SO2,GasesEnum.NOx];
        this.year = YearsEnum.CURRENT;
        this.filepath = '../../assets/data/';
    }

    setRegion(region) {
        this.region = RegionEnum[region];
        this.rdf = RdfEnum[this.region];

        return this;
    }

    getRegion(){
        return this.region;
    }

    setYear(year) {
        this.year = YearsEnum[year];

        return this;
    }

    getYear() {
        return this.year;
    }

    setEereProfile(eereProfile) {
        this.eereProfile = eereProfile;
    }

    calculateDisplacement() {
        const annualDisplacement = new AnnualDisplacementEngine(this.rdf);
        const stateEmissions = new StateEmissionsEngine();
        const monthlyEmissions = new MonthlyEmissionsEngine();

        store.dispatch(completeAnnual(annualDisplacement.output));
        store.dispatch(completeStateEmissions(stateEmissions.emissions));
        store.dispatch(completeMonthlyEmissions(monthlyEmissions.emissions));
    }

    calculateEereLoad(){
        const regionalLoad = _.map(this.rdf.regional_load,'regional_load_mw');
        const k = 1 - (this.eereProfile.topHours / 100);
        this.top_percentile = stats.percentile(regionalLoad, k);
        this.resulting_hourly_mw_reduction = math.chain(this.eereProfile.annualGwh).multiply(1000).divide(regionalLoad.length).done();
        this.manual_eere_entry = math.zeros(regionalLoad.length);
        this.hourly_eere = _.map(regionalLoad, this.hourlyEereCb.bind(this));
        
        store.dispatch(completeCalculation(this.hourly_eere));
    }

    hourlyEereCb(load,index){

        let renewable_energy_profile = 0; // [(WindCapacity * EEREDefaultRegionalWindForThatHour + UtilitySolarPV * EEREDefaultRegionalUtilitySolarPVForThatHour + RooftopSolarPV * EEREDefaultRegionalRooftopSolarPVForThatHour)]
        let initialLoad = (load > this.top_percentile) ? load * (- this.eereProfile.reduction) : 0
        let calculatedLoad = math.chain(initialLoad)
                                 .subtract(this.manual_eere_entry.toArray()[index])
                                 .add(renewable_energy_profile)
                                 .subtract(this.resulting_hourly_mw_reduction)
                                 .add(this.eereProfile.constantMw)
                                 .done();
        let finalMw = this.rdf.regional_load[index].year < 1990 ? 0 : calculatedLoad;
        
        return {
            manual_eere_entry: this.manual_eere_entry.toArray()[index],
            renewable_energy_profile: renewable_energy_profile, 
            final_mw: finalMw,
            current_load_mw: load,
            flag: 0
        }
    }
}

export default Engine;