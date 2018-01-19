class StateEmissions {

  extract(annualData) {
    const states = Object.keys(annualData.totalEmissions.so2.stateChanges).sort();

    const data = states.map((state) => {
      return {
        state: state,
        so2: annualData.totalEmissions.so2.stateChanges[state],
        nox: annualData.totalEmissions.nox.stateChanges[state],
        co2: annualData.totalEmissions.co2.stateChanges[state],
        pm25: annualData.totalEmissions.pm25.stateChanges[state],
      }
    }).sort((a, b) => {
      const stateA = a.state.toUpperCase();
      const stateB = b.state.toUpperCase();

      if (stateA < stateB) return -1;

      if (stateA > stateB) return 1;

      return 0;
    });

    return {
      states: states,
      data: data,
    };
  }
}

export default StateEmissions;
