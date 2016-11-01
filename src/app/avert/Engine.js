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
import northeastEere from '../../assets/data/northeast-eere-defaults.json';

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
        this.eereDefault = northeastEere;

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
        const annualDisplacement = new AnnualDisplacementEngine(this.rdf,this.hourlyEere);
        const stateEmissions = new StateEmissionsEngine();
        const monthlyEmissions = new MonthlyEmissionsEngine();

        store.dispatch(completeAnnual(annualDisplacement.output));
        
        setTimeout(() => {
            store.dispatch(completeStateEmissions(stateEmissions.emissions));
        }, 50)

        setTimeout(() => {
            store.dispatch(completeMonthlyEmissions(monthlyEmissions.emissions));
        }, 50)
        
    }

    calculateEereLoad(){
        const regionalLoad = _.map(this.rdf.regional_load,'regional_load_mw');
        const k = 1 - (this.eereProfile.topHours / 100);
        this.topPercentile = stats.percentile(regionalLoad, k);
        this.resultingHourlyMwReduction = math.chain(this.eereProfile.annualGwh).multiply(1000).divide(regionalLoad.length).done();
        this.manualEereEntry = math.zeros(regionalLoad.length);
        this.hourlyEere = _.map(regionalLoad, this.hourlyEereCb.bind(this));
        
        store.dispatch(completeCalculation(this.hourlyEere));
    }

    hourlyEereCb(load,index){
        const hourlyEereDefault = northeastEere.data[index];
        const renewable_energy_profile = -math.sum(math.multiply(this.eereProfile.windCapacity,hourlyEereDefault.wind),
                                                math.multiply(this.eereProfile.utilitySolar,hourlyEereDefault.utility_pv),
                                                math.multiply(this.eereProfile.rooftopSolar,hourlyEereDefault.rooftop_pv))
        const initialLoad = (load > this.topPercentile) ? load * (- (this.eereProfile.reduction / 100)) : 0
        const calculatedLoad = math.chain(initialLoad)
                                   .subtract(this.manualEereEntry.toArray()[index])
                                   .add(renewable_energy_profile)
                                   .subtract(this.resultingHourlyMwReduction)
                                   .add(this.eereProfile.constantMw)
                                   .done();
        const finalMw = this.rdf.regional_load[index].year < 1990 ? 0 : calculatedLoad;
        // if(finalMw < -100){
        //     console.log('_______',index,finalMw,load,this.eereProfile.reduction,load*(-(this.eereProfile.reduction/100)),load*(-this.eereProfile.reduction),'________')
        // }
        return {
            index: index,
            manual_eere_entry: this.manualEereEntry.toArray()[index],
            renewable_energy_profile: renewable_energy_profile, 
            final_mw: finalMw,
            current_load_mw: load,
            flag: 0
        }
    }
}

export default Engine;