class MonthlyEmissions {
  constructor() {

    const locationLevels = {
      region: {},
      state: {},
      county: {},
    };

    const standardStructure = {
      emissions: locationLevels,
      percentages: locationLevels,
    };

    this.generation = standardStructure;
    this.so2 = standardStructure;
    this.nox = standardStructure;
    this.co2 = standardStructure;

    this.count = 0;
  }

  addRegion(type,emissionsOrPercentages,month,data) {
    if(typeof this[type][emissionsOrPercentages].region[month] === 'undefined'){
      this[type][emissionsOrPercentages].region[month] = 0
    }

    this[type][emissionsOrPercentages].region[month] += data;
  }

  addState(type,emissionsOrPercentages,state,month,data) {
    this.count++;
    if(typeof this[type][emissionsOrPercentages].state[state] === 'undefined'){
      this[type][emissionsOrPercentages].state[state] = {}
    }

    if(typeof this[type][emissionsOrPercentages].state[state][month] === 'undefined') {
      this[type][emissionsOrPercentages].state[state][month] = 0;
    }

    this[type][emissionsOrPercentages].state[state][month] += data;
  }

  addCounty(type,emissionsOrPercentages,state,county,month,data) {
    if(typeof this[type][emissionsOrPercentages].county[state] === 'undefined'){
      this[type][emissionsOrPercentages].county[state] = {}
    }

    if(typeof this[type][emissionsOrPercentages].county[state][county] === 'undefined'){
      this[type][emissionsOrPercentages].county[state][county] = {}
    }

    if(typeof this[type][emissionsOrPercentages].county[state][county][month] === 'undefined') {
      this[type][emissionsOrPercentages].county[state][county][month] = 0;
    }

    this[type][emissionsOrPercentages].county[state][county][month] += data;
  }
}

export default MonthlyEmissions;