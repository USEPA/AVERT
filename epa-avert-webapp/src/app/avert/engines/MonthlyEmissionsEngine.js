import _ from 'lodash';

class MonthlyEmissionsEngine {

    extract(annualData) {
        const statesAndCounties = this.extractStatesCounties(annualData);
        return {
            statesAndCounties: statesAndCounties,
            emissions: this.extractEmissions(annualData,statesAndCounties),
            percentages: this.extractPercentages(annualData,statesAndCounties),
        };
    }

    extractStatesCounties(annualData) {
        const states = Object.keys(annualData.totalEmissions.so2.monthlyChanges.emissions.state).sort();
        let results = {};
        states.forEach((state) => {
            results[state] = Object.keys(annualData.totalEmissions.so2.monthlyChanges.emissions.county[state]).sort();
        });

        return results
    }

    extractEmissions(annualData, statesAndCounties) {

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