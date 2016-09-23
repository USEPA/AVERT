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

    get generation() {
        console.warn('- AnnualDisplacementEngine','generation',this.rdf);
        // const _this = this;
        const genArray = this.rdf.data.generation.map((item) => { return item.medians });
        const loadArrayOriginal = this.rdf.regional_load.map((item) => { return item.regional_load_mw });
        // Temporarily make loadArrayPost === loadArrayOriginal
        const temporaryEereProfile = 3; // this.profile[index]
        const loadArrayPost = loadArrayOriginal.map((item,index) => { return item - temporaryEereProfile });
        // const min = this.rdf.load_bin_edges[0];
        // const max = this.rdf.load_bin_edges[this.rdf.load_bin_edges.length];
        
        // let deltas = [];
        const totals = loadArrayOriginal.map((item,index) => {
            // const postValue = loadArrayPost[index];
            
            // if( ! (item > min && item < max) && (postValue < min && postValue > max)) return false;

            return _.reduce(genArray[index], (sum, n) => { return math.add(sum,n) }, 0);
            // const slopePre = 1;
            // const interceptPre = 1;
            // const valPre = item * slopePre + interceptPre;

            // const slopePost = 1;
            // const interceptPost = 1;
            // const valPost = item * slopePost + interceptPost;

            // deltas[index] = valPost - valPre;

            // return {
            //     peak: generation[_.sortedIndex(generation,item)], // See line 265
            //     total: _.reduce(generation, (sum,n) => { return sum + n }, 0), // See line 267
            //     capacity: 1, // See lines 271
            // }
        });

        const original = _.reduce(totals, (sum, n) => { return math.add(sum,n) }, 0);

        return {
            original: original,
            post: 2,
            impact: 3
        }
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
        return {
            original: 1,
            post: 2,
            impact:3 
        }
    }

    get noxTotal() {
        return {
            original: 1,
            post: 2,
            impact:3 
        }
    }

    get co2Total() {
        return {
            original: 1,
            post: 2,
            impact:3 
        }
    }

    get so2Rate() {
        return {
            original: 1,
            post: 2,
        }
    }

    get noxRate() {
        return {
            original: 1,
            post: 2,
        }
    }

    get co2Rate() {
        return {
            original: 1,
            post: 2,
        }
    }
}

export default AnnualDisplacementEngine;