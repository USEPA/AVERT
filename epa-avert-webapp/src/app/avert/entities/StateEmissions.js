import _ from 'lodash';

class StateEmissions {
  constructor() {
    this.generation = {};
    this.so2 = {};
    this.nox = {};
    this.co2 = {};
  }

  add(type, state, data) {
    this[type][state] = this[type][state] ? this[type][state] : 0;
    this[type][state] += data;
  }

  export() {
    // const states = Object.keys(_.merge(this.generation,this.so2,this.nox,this.co2));
    const states = Object.keys(this.generation);
    const data = states.map((state) => {
      return {
        state: state,
        so2: this.so2,
        nox: this.nox,
        co2: this.co2,
      }
    });

    return {
      states: states,
      data: data,
    };
  }
}

export default StateEmissions;
/*
 extract(annualData) {

 const states = Object.keys(annualData.totalEmissions.so2.monthlyEmissions.state);

 const data = states.map((state) => {
 return {
 state: state,
 so2: Object.values(annualData.totalEmissions.so2.monthlyEmissions.state[state].data).reduce((a,b) => a + b),
 nox: Object.values(annualData.totalEmissions.nox.monthlyEmissions.state[state].data).reduce((a,b) => a + b),
 co2: Object.values(annualData.totalEmissions.co2.monthlyEmissions.state[state].data).reduce((a,b) => a + b),
 }
 });
 console.warn("- Data",data);
 return {
 states: states,
 data: data,
 };
 }*/