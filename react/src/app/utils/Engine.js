import _ from 'lodash';
import math from 'mathjs';
import stats from 'stats-lite'
import RegionEnum from './RegionEnum';
import GasesEnum from './GasesEnum';
import YearsEnum from './YearsEnum';

// Temporary
import northeast from '../../assets/data/rdf_northeast_2015.json';
import california from '../../assets/data/rdf_california_2015.json';

class Engine {

    constructor(params) {
        this.setRegion(params.region);
        this.setGases(params.gases);
        this.years = params.years || ['2007','2008','2009','2010','2011','2012','2013','2014','2015'];
        this.loadCell = params.loadCell || [];
        this.dateRange = params.dateRange || { start: 'January 1, 2015', end: 'December 31, 2015' };
        this.scaleType = params.scaleType || 'peak';
        this.setData(params.data);
        this.setProfile(params.profile);
    }

    /**
     * @param {string|array|undefined}
     */
    setRegion(regions) {
        if ( ! regions) this.regions = '';
        
        if (typeof regions === 'string') this.region = RegionEnum[regions];

        if (Array.isArray(regions)) {
            this.region = regions.map(function(region){
                return RegionEnum[region];
            }); 
        }
        
        return this;
    }

    /**
     * @param {string|array|undefined}
     */
    setGases(gases) {
        if ( ! gases) this.gases = '';
        
        if (typeof gases === 'string') this.region = RegionEnum[gases];

        if (Array.isArray(gases)) {
            this.gases = gases.map(function(gas) {
                return GasesEnum[gas];
            });
        }
        
        return this;
    }

    /**
     * @param {int|array|undefined}
     */
    setYears(years) {
        if ( ! years) this.years = '';
        
        if (typeof years === 'string') this.region = RegionEnum[years];

        if (Array.isArray(years)) {
            this.years = years.map(function(year) {
                return YearsEnum[year];
            });
        }
        
        return this;
    }

    /**
     * Set the Load Cell value
     * @param {array} loadCell = [{ name: 'name', values: [] }]
     */
    setLoadCell(loadCell) {
        this.loadCell = loadCell;

        return this;
    }

    setDateRange(dateStart,dateEnd) {
        this.dateRange = {
            start: dateStart,
            end: dateEnd
        };

        return this;
    }

    setScaleType(type) {
        this.scaleType = type;

        return this;
    }

    setData(data) {
        this.data = data;

        return this;
    }

    getData() {
        switch (this.region) {
            case 'NE':
                return northeast;
            case 'CA':
            default:
                return california;
        }
    }

    setProfile(eere) {
        this.profile = eere;
    }

    calculateEERE() {
        const _this = this;
        const data = this.getData();
        const regionalLoad = _.map(data.regional_load,'regional_load_mw');
        const k = 1 - (this.profile.top_hours / 100);
        const top_percentile = stats.percentile(regionalLoad, k);
        const resulting_hourly_mw_reduction = math.chain(this.profile.annual_gwh).multiply(1000).divide(regionalLoad.length).done();
        const manual_eere_entry = math.zeros(regionalLoad.length);
        const hourly_eere = _.map(regionalLoad, function(load, index) {
            let renewable_energy_profile = 0; // [(WindCapacity * EEREDefaultRegionalWindForThatHour + UtilitySolarPV * EEREDefaultRegionalUtilitySolarPVForThatHour + RooftopSolarPV * EEREDefaultRegionalRooftopSolarPVForThatHour)]
            let initialLoad = (load > top_percentile) ? load * (-_this.profile.reduction) : 0
            let calculatedLoad = math.chain(initialLoad)
                                     .subtract(manual_eere_entry.toArray()[index])
                                     .add(renewable_energy_profile)
                                     .subtract(resulting_hourly_mw_reduction)
                                     .add(_this.profile.constant_mw)
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

        return hourly_eere;
    }
}

export default Engine;