import _ from 'lodash';
import math from 'mathjs';
import RegionEnum from './RegionEnum';
import GasesEnum from './GasesEnum';
import YearsEnum from './YearsEnum';

class EngineUtil {

	constructor(params) {
		console.log('- EngineUtil','Constructor');

		this.region = this.setRegion(params.region);
		this.gases = this.setGases(params.gases);
		this.years = params.years || ['2007','2008','2009','2010','2011','2012','2013','2014','2015'];
		this.loadCell = params.loadCell || [];
		this.dateRange = params.dateRange || { start: 'January 1, 2015', end: 'December 31, 2015' };
		this.scaleType = params.scaleType || 'peak';
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
	}

	setDateRange(dateStart,dateEnd) {
		this.dateRange = {
			start: dateStart,
			end: dateEnd
		};
	}

	setScaleType(type) {
		this.scaleType = type;
	}

	exampleFunction() {
		console.log('- EngineUtil','exampleFunction');

		let someArray = [1,2,3];
		
		someArray = _.map(someArray, function(n) {
			return math.eval(n * 3);
		});

		console.log(someArray);
		console.log(this.region);
	}
}

export default EngineUtil;