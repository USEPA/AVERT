// Deps
import _ from 'lodash';
import math from 'mathjs';
import stats from 'stats-lite'

// Engine

// App

class EereEngine {
    
    constructor(rdf,profile) {
        this.rdf = rdf;
        this.profile = profile;
    }

    set regionalLoad(regionalLoad) {
        this._regionalLoad = regionalLoad;
    }

    get regionalLoad() {
        return this.regionalLoad;
    }

    calculateEereLoad(){
        const regionalLoad = _.map(this.rdf.regional_load,'regional_load_mw');
        const k = 1 - (this.profile.topHours / 100);
        
        this.top_percentile = stats.percentile(regionalLoad, k);
        this.resulting_hourly_mw_reduction = math.chain(this.profile.annualGwh).multiply(1000).divide(regionalLoad.length).done();
        this.manual_eere_entry = math.zeros(regionalLoad.length);
        this.hourly_eere = _.map(regionalLoad, this.hourlyEereCb.bind(this));
        
        store.dispatch(completeCalculation(this.hourly_eere));
    }

    hourlyEereCb(load,index){

        let renewable_energy_profile = 0; // [(WindCapacity * EEREDefaultRegionalWindForThatHour + UtilitySolarPV * EEREDefaultRegionalUtilitySolarPVForThatHour + RooftopSolarPV * EEREDefaultRegionalRooftopSolarPVForThatHour)]
        let initialLoad = (load > this.top_percentile) ? load * (- this.profile.reduction) : 0
        let calculatedLoad = math.chain(initialLoad)
                                 .subtract(this.manual_eere_entry.toArray()[index])
                                 .add(renewable_energy_profile)
                                 .subtract(this.resulting_hourly_mw_reduction)
                                 .add(this.profile.constantMw)
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

export default EereEngine;