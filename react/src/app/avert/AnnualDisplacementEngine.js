// Deps
import _ from 'lodash';
import math from 'mathjs';
// import stats from 'stats-lite'

// Engine

// App

class AnnualDisplacementEngine {
    constructor(rdf, profile) {
        this.rdf = rdf;
        this.profile = profile;
    }

    get output() {
        return {
            generation: this.generation,
            totalEmissions: this.totalEmissions,
            emissionRates: this.emissionRates,
        }
    }

    getDisplacedGeneration(dataSet){
        console.warn('- AnnualDisplacementEngine','generation',this.rdf);
        // const _this = this;
        const medians = dataSet.map((item) => { return item.medians });
        const loadArrayOriginal = this.rdf.regional_load.map((item) => { return item.regional_load_mw });
        // const loadArrayPost = loadArrayOriginal.map((item,index) => { return item - _this.profile[index] });
        // const min = this.rdf.load_bin_edges[0];
        // const max = this.rdf.load_bin_edges[this.rdf.load_bin_edges.length];
        
        // const peaks = [];
        // const capacities = [];
        const totals = loadArrayOriginal.map((item,index) => {
                        
            // Filter out outliers
            // if( ! (item > min && item < max)) return false;
            
            // Calculate pre slope, intercept, val
            const preSlope = 1;
            // const preSlope = loadArrayOriginal.map((value,index) => { 
            //     math.divide(
            //         math.subtract(value, loadArrayOriginal[index + 1]),
            //         math.subtract(median[index], medians[index + 1])
            //     );  
            // }).reduce((sum,n) => { return sum + n });
            // const preSlope = loadArrayOriginal[preMatchIndex] - loadArrayOriginal[postMatchIndex] / medians[preMatchIndex] - medians[postMatchIndex]

            const preIntercept = 1;
            const preVal = math.chain(item).multiply(preSlope).add(preIntercept).done();
            
            // Calculate post slope, intercept, val
            const postSlope = 1;
            const postIntercept = 1;
            const postVal = math.chain(item).multiply(postSlope).add(postIntercept).done();

            // Calculate delta V (postVal - preVal)
            const dV = math.subtract(postVal, preVal);

            // if(postVal > totalGen[0]) peaks[index] = postVal;
            // return postVal;
            
            // peaks[index] = medians[_.sortedIndex(medians,item)];
            // capacities[index] = 0;
            
            return postVal;
            // return _.reduce(medians[index], (sum, n) => { return math.add(sum,n) }, 0);
        });

        const original = _.reduce(totals, (sum, n) => { return math.add(sum,n) }, 0);

        return {
            original: original,
            post: 0,
            impact: 0
        }
    }

    get generation() {
        return this.getDisplacedGeneration(this.rdf.data.generation)
    }

    get totalEmissions() {
        return {
            so2: this.so2Total,
            nox: this.noxTotal,
            co2: this.co2Total,
        }
    }

    get emissionRates() {
        return {
            so2: this.so2Rate,
            nox: this.noxRate,
            co2: this.co2Rate,
        }
    }

    get so2Total() {
        return this.getDisplacedGeneration(this.rdf.data.so2);
    }

    get noxTotal() {
        return this.getDisplacedGeneration(this.rdf.data.nox);
    }

    get co2Total() {
        return this.getDisplacedGeneration(this.rdf.data.co2);
    }

    get so2Rate() {
        return {
            original: 0,
            post: 0,
        }
    }

    get noxRate() {
        return {
            original: 0,
            post: 0,
        }
    }

    get co2Rate() {
        return {
            original: 0,
            post: 0,
        }
    }
}

export default AnnualDisplacementEngine;