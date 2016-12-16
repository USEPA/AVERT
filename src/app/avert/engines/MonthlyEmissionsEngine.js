import _ from 'lodash';

class MonthlyEmissionsEngine {

    // extract(annualData) {
    //     // console.warn('extracting generation...',annualData.generation.monthlyEmissions);
    //     // console.warn('extracting so2...',annualData.totalEmissions.so2.monthlyEmissions);
    //     // console.warn('extracting nox...',annualData.totalEmissions.nox.monthlyEmissions);
    //     // console.warn('extracting co2...',annualData.totalEmissions.co2.monthlyEmissions);
    //
    //     return {
    //         generation: {
    //             regional: _.values(annualData.generation.monthlyEmissions.regional).slice(0,12),
    //             state: annualData.generation.monthlyEmissions.state,
    //         },
    //         so2: {
    //             regional: _.values(annualData.totalEmissions.so2.monthlyEmissions.regional).slice(0,12),
    //             state: annualData.totalEmissions.so2.monthlyEmissions.state,
    //         },
    //         nox: {
    //             regional: _.values(annualData.totalEmissions.nox.monthlyEmissions.regional).slice(0,12),
    //             state: annualData.totalEmissions.nox.monthlyEmissions.state,
    //         },
    //         co2: {
    //             regional: _.values(annualData.totalEmissions.co2.monthlyEmissions.regional).slice(0,12),
    //             state: annualData.totalEmissions.co2.monthlyEmissions.state,
    //         }
    //     }
    // }

    extract(annualData) {
        const statesAndCounties = this.extractStatesCounties(annualData);
        return {
            statesAndCounties: statesAndCounties,
            emissions: this.extractEmissions(annualData,statesAndCounties),
            percentages: this.extractPercentages(annualData,statesAndCounties),
        };
    }

    extractStatesCounties(annualData) {
        const states = Object.keys(annualData.totalEmissions.so2.monthlyChanges.emissions.state);
        let results = {};
        states.forEach((state) => {
            results[state] = Object.keys(annualData.totalEmissions.so2.monthlyChanges.emissions.county[state]);
        });

        return results
    }

    extractEmissions(annualData, statesAndCounties) {
        // const results = {};
        // const gasses = ['so2','nox','co2'];
        // gasses.forEach((gas) => {
        //
        //     results[gas].regional = _.values(annualData[gas].monthlyChanges.emissions.region);
        //
        //     statesAndCounties.forEach((state) => {
        //         state = Object.keys(state)[0];
        //         results[gas].state[state] = _.values(annualData.totalEmissions[gas].monthlyChanges.emissions.state[state]);
        //
        //         annualData.totalEmissions[gas].monthlyChanges.emissions.county[state].forEach((county) => {
        //             county = Object.keys(county)[0];
        //             results[gas].county[state] = {};
        //             results[gas].county[state][county] =  _.values(annualData.totalEmissions[gas].monthlyChanges.emissions.county[state][county]);
        //         })
        //     });
        // });
        //
        // return results;
        return {
            generation: {
                regional: _.values(annualData.generation.monthlyChanges.emissions.region),
                state: annualData.generation.monthlyChanges.emissions.state,
                county: annualData.generation.monthlyChanges.emissions.county,
            },
            so2: {
                regional: _.values(annualData.totalEmissions.so2.monthlyChanges.emissions.region),
                state: annualData.totalEmissions.so2.monthlyChanges.emissions.state,
                county: annualData.totalEmissions.so2.monthlyChanges.emissions.county,
            },
            nox: {
                regional: _.values(annualData.totalEmissions.nox.monthlyChanges.emissions.region),
                state: annualData.totalEmissions.nox.monthlyChanges.emissions.state,
                county: annualData.totalEmissions.nox.monthlyChanges.emissions.county,
            },
            co2: {
                regional: _.values(annualData.totalEmissions.co2.monthlyChanges.emissions.region),
                state: annualData.totalEmissions.co2.monthlyChanges.emissions.state,
                county: annualData.totalEmissions.co2.monthlyChanges.emissions.county,
            }
        }
    }

    extractPercentages(annualData, statesAndCounties) {
        return {
            generation: {
                regional: _.values(annualData.generation.monthlyChanges.percentages.region),
                state: annualData.generation.monthlyChanges.percentages.state,
                county: annualData.generation.monthlyChanges.percentages.county,
            },
            so2: {
                regional: _.values(annualData.totalEmissions.so2.monthlyChanges.percentages.region),
                state: annualData.totalEmissions.so2.monthlyChanges.percentages.state,
                county: annualData.totalEmissions.so2.monthlyChanges.percentages.county,
            },
            nox: {
                regional: _.values(annualData.totalEmissions.nox.monthlyChanges.percentages.region),
                state: annualData.totalEmissions.nox.monthlyChanges.percentages.state,
                county: annualData.totalEmissions.nox.monthlyChanges.percentages.county,
            },
            co2: {
                regional: _.values(annualData.totalEmissions.co2.monthlyChanges.percentages.region),
                state: annualData.totalEmissions.co2.monthlyChanges.percentages.state,
                county: annualData.totalEmissions.co2.monthlyChanges.percentages.county,
            }
        };
    }
}

export default MonthlyEmissionsEngine;