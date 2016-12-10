class StateEmissions {
    get emissions() {
        return [4,5,6];
    }

    extract(annualData) {
        console.warn("StateEmissions","Extract",annualData);
        console.warn("- SO2",annualData.totalEmissions.so2.monthlyEmissions.state);
        console.warn("- NOX",annualData.totalEmissions.nox.monthlyEmissions.state);
        console.warn("- CO2",annualData.totalEmissions.co2.monthlyEmissions.state);
        const states = Object.keys(annualData.totalEmissions.so2.monthlyEmissions.state);
        console.warn("- States",states);

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
    }
}

export default StateEmissions;