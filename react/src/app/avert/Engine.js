// Deps
import _ from 'lodash';
import math from 'mathjs';
import stats from 'stats-lite'

// Engine
import RegionEnum from './enums/RegionEnum';
import GasesEnum from './enums/GasesEnum';
import YearsEnum from './enums/YearsEnum';
import RdfEnum from './enums/RdfEnum';

// App
import { store } from '../store';
import { completeCalculation } from '../actions';

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

    calculateEereLoad(){
        const _this = this;
        const data = this.rdf;
        const regionalLoad = _.map(data.regional_load,'regional_load_mw');
        const k = 1 - (this.eereProfile.topHours / 100);
        const top_percentile = stats.percentile(regionalLoad, k);
        const resulting_hourly_mw_reduction = math.chain(this.eereProfile.annualGwh).multiply(1000).divide(regionalLoad.length).done();
        const manual_eere_entry = math.zeros(regionalLoad.length);
        const hourly_eere = _.map(regionalLoad, function(load, index) {
            let renewable_energy_profile = 0; // [(WindCapacity * EEREDefaultRegionalWindForThatHour + UtilitySolarPV * EEREDefaultRegionalUtilitySolarPVForThatHour + RooftopSolarPV * EEREDefaultRegionalRooftopSolarPVForThatHour)]
            let initialLoad = (load > top_percentile) ? load * (-_this.eereProfile.reduction) : 0
            let calculatedLoad = math.chain(initialLoad)
                                     .subtract(manual_eere_entry.toArray()[index])
                                     .add(renewable_energy_profile)
                                     .subtract(resulting_hourly_mw_reduction)
                                     .add(_this.eereProfile.constantMw)
                                     .done();
            let finalMw = data.regional_load[index].year < 1990 ? 0 : calculatedLoad;
                    
            return {
                manual_eere_entry: manual_eere_entry.toArray()[index],
                renewable_energy_profile: renewable_energy_profile, 
                final_mw: finalMw,
                current_load_mw: load,
                flag: 0
            }
        });

        store.dispatch(completeCalculation(hourly_eere));
    }
}

export default Engine;