// Deps
import _ from 'lodash';
import math from 'mathjs';
// import stats from 'stats-lite'

// Engine

// App

class AnnualDisplacementEngine {
    constructor(rdf, hourlyEere) {
        this.rdf = rdf;
        this.hourlyEere = hourlyEere;
    }

    get output() {
        return {
            generation: this.generation,
            totalEmissions: this.totalEmissions,
            emissionRates: this.emissionRates,
        }
    }

    excelMatch(array,lookup) {
        const sortedHaystack = array.concat(lookup).sort(function(a,b) {
            return a - b;
        });
        const index = sortedHaystack.indexOf(lookup);
// console.warn('excelMatch',sortedHaystack,index);
        return array.indexOf(sortedHaystack[index - 1]);
    }

    getDisplacedGeneration(dataSet,no){
        if(no) return { original: '', post: '', impact: '' };
        
        console.warn('- AnnualDisplacementEngine','generation',this.rdf);
        const _this = this;
        const edges = this.rdf.load_bin_edges;
        const medians = dataSet.map((item) => { return item.medians });
        const loadArrayOriginal = this.rdf.regional_load.map((item) => { return item.regional_load_mw });
        const loadArrayPost = loadArrayOriginal.map((item,index) => { 
            return math.sum(item,_this.hourlyEere[index].final_mw) 
        });
        const min = this.rdf.load_bin_edges[0];
        const max = this.rdf.load_bin_edges[this.rdf.load_bin_edges.length - 1];
        
        console.log('.....','medians',medians);
        console.log('.....','loadArrayOriginal',loadArrayOriginal);
        console.log('.....','loadArrayPost',loadArrayPost);
        console.log('.....','min',min);
        console.log('.....','max',max);
        
        const peaks = [];
        const capacities = [];
        let preTotal = 0;
        let postTotal = 0;
        for (let i = 0; i < loadArrayOriginal.length; i++) {
            const load = loadArrayOriginal[i];
            const postLoad = loadArrayPost[i];

            if( ! (load > min && load < max)) return false;

            for (let j = 0; j < medians.length; j++) {
                const median = medians[j];
                // const preGenMatchIndex = index of gen value closest to load value; Consider sort, get value, then indexOf?
                // const nextPreGenMatchIndex = preGenMatchIndex + 1
                const preGenMatchIndex = this.excelMatch(median,load);
                const nextPreGenMatchIndex = preGenMatchIndex + 1;

                const postGenMatchIndex = this.excelMatch(median,postLoad);
                const nextPostGenMatchIndex = postGenMatchIndex + 1;


                console.log('___calculating pre slope for___',median[preGenMatchIndex],median[nextPreGenMatchIndex],edges[preGenMatchIndex],edges[nextPreGenMatchIndex]);
                const preSlope = math.divide(math.subtract(median[preGenMatchIndex],median[nextPreGenMatchIndex]),
                                             math.subtract(edges[preGenMatchIndex],edges[nextPreGenMatchIndex]));
                const preIntercept = math.subtract(median[preGenMatchIndex], math.multiply(preSlope,edges[preGenMatchIndex]));
                const preVal = math.add(math.multiply(load,preSlope),preIntercept);

                console.log('preSlope calculation:',preSlope.toString(),preIntercept.toString(),preVal.toString());

                const postSlope = math.divide(math.subtract(median[postGenMatchIndex],median[nextPostGenMatchIndex]),
                                             math.subtract(edges[postGenMatchIndex],edges[nextPostGenMatchIndex]));
                const postIntercept = math.subtract(median[postGenMatchIndex], math.multiply(postSlope,edges[postGenMatchIndex]));
                const postVal = math.add(math.multiply(postLoad,postSlope),postIntercept);
                console.log('postSlope calculation:',postSlope.toString(),postIntercept.toString(),postVal.toString());

                const deltaV = math.subtract(postVal,preVal);

                console.log('delta V:',deltaV.toString());

                preTotal += preVal;
                postTotal += postVal;

                console.log('totals','pre:',preTotal,'post:',postTotal);


                if(j > 10) return false;
            }

            if(i > 10) return false;
        }

        // loadArray.forEach(() => {
        //     // Switch to Ozone array if May, NoOzone array if October
        //     if(loadArray)
        // })
        
        // loadArrayOriginal.forEach((item,index) => {
                        
        //     // Filter out outliers
        //     if( ! (item > min && item < max)) return false;

        //     medians.forEach((item,index) => {
        //         // const preSlope = // item[index whose value is closest to load bin edge?] - item[next value above]
        //         const preSlope = item[0]
        //         console.log('preSlope',preSlope);
        //         if(index > 2) return false;
        //     });

        //     if(index > 2) return false;
        //     // Calculate pre slope, intercept, val
        //     // const preSlope = 1;
        //     // const preSlope = loadArrayOriginal.map((value,index) => { 
        //     //     math.divide(
        //     //         math.subtract(value, loadArrayOriginal[index + 1]),
        //     //         math.subtract(median[index], medians[index + 1])
        //     //     );  
        //     // }).reduce((sum,n) => { return sum + n });
        //     // const preSlope = loadArrayOriginal[preMatchIndex] - loadArrayOriginal[postMatchIndex] / medians[preMatchIndex] - medians[postMatchIndex]
        //     if(index < 2) console.log('- Pre values',loadArrayOriginal[index],medians[index]);

        //     // const preIntercept = 1;
        //     // const preVal = math.chain(item).multiply(preSlope).add(preIntercept).done();

        //     // Calculate post slope, intercept, val
        //     const postSlope = 1;
        //     const postIntercept = 1;
        //     const postVal = math.chain(item).multiply(postSlope).add(postIntercept).done();

        //     // Calculate delta V (postVal - preVal)
        //     // const dV = math.subtract(postVal, preVal);

        //     // if(postVal > totalGen[0]) peaks[index] = postVal;
        //     // return postVal;
            
        //     // peaks[index] = medians[_.sortedIndex(medians,item)];
        //     // capacities[index] = 0;
            
        //     return postVal;
        //     // return _.reduce(medians[index], (sum, n) => { return math.add(sum,n) }, 0);
        // });

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
        return this.getDisplacedGeneration(this.rdf.data.so2,true);
    }

    get noxTotal() {
        return this.getDisplacedGeneration(this.rdf.data.nox,true);
    }

    get co2Total() {
        return this.getDisplacedGeneration(this.rdf.data.co2,true);
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