class MonthlyEmissionsEngine {

    extract(annualData) {
        // console.warn('extracting generation...',annualData.generation.monthlyEmissions);
        // console.warn('extracting so2...',annualData.totalEmissions.so2.monthlyEmissions);
        // console.warn('extracting nox...',annualData.totalEmissions.nox.monthlyEmissions);
        // console.warn('extracting co2...',annualData.totalEmissions.co2.monthlyEmissions);
        
        return {
            generation: {
                regional: Object.values(annualData.generation.monthlyEmissions.regional),
                state: annualData.generation.monthlyEmissions.state,
            },
            so2: {
                regional: Object.values(annualData.totalEmissions.so2.monthlyEmissions.regional),
                state: annualData.totalEmissions.so2.monthlyEmissions.state,
            },
            nox: {
                regional: Object.values(annualData.totalEmissions.nox.monthlyEmissions.regional),
                state: annualData.totalEmissions.nox.monthlyEmissions.state,
            },
            co2: {
                regional: Object.values(annualData.totalEmissions.co2.monthlyEmissions.regional),
                state: annualData.totalEmissions.co2.monthlyEmissions.state,
            }
        }
    }

    get emissions() {
        return [this.so2,this.nox,this.co2];
    }

    get gen() {
        return [1,2,3,4,5,6,7,8,9,10,11,12];
    }

    get so2() {
        return [1,2,3,4,5,6,7,8,9,10,11,12];
    }

    get nox() {
        return [1,2,3,4,5,6,7,8,9,10,11,12];
    }

    get co2() {
        return [1,2,3,4,5,6,7,8,9,10,11,12];
    }
}

export default MonthlyEmissionsEngine;