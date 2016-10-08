// Deps
// import _ from 'lodash';
import math from 'mathjs';
// import stats from 'stats-lite'

// Engine

// App

class AnnualDisplacementEngine {
    constructor(rdf, hourlyEere) {
        this.rdf = rdf;
        this.hourlyEere = hourlyEere;
        this.generationOriginal = 0;
        this.generationPost = 0;

        this.so2Original = 0;
        this.so2Post = 0;
        this.noxOriginal = 0;
        this.noxPost = 0;
        this.co2Original = 0;
        this.co2Post = 0;
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

    calculateSlope(m,x,b) {
        return math.add(math.multiply(m,x),b);
    }

    getDisplacedGeneration(dataSet,no){
        // if(no) return { original: '', post: '', impact: '' };
        
        console.warn('- AnnualDisplacementEngine','generation',this.rdf);
        const _this = this;
        const edges = Object.keys(this.rdf.load_bin_edges).map((key) => this.rdf.load_bin_edges[key]);
        const medians = dataSet.map((item) => { return item.medians });
        const loadArrayOriginal = this.rdf.regional_load.map((item) => { return item.regional_load_mw });
        const loadArrayPost = loadArrayOriginal.map((item,index) => { 
            return math.sum(item,_this.hourlyEere[index].final_mw) 
        });
        // const loadKeys = Object.keys(this.rdf.load_bin_edges);        
        // const min = this.rdf.load_bin_edges[loadKeys[0]];
        // const max = this.rdf.load_bin_edges[loadKeys[loadKeys.length - 1]];
        const min = edges[0];
        const max = edges[edges.length - 1];
        
        // console.log('.....','medians',medians);
        // console.log('.....','loadArrayOriginal',loadArrayOriginal);
        // console.log('.....','loadArrayPost',loadArrayPost);
        // console.log('.....','min',min);
        // console.log('.....','max',max);
        // console.log('.....','edges',edges);
        // console.warn('.....','load keys',loadKeys,loadKeys.length,loadKeys[loadKeys.length]);
        
        // const peaks = [];
        // const capacities = [];
        let preTotalArray = [];
        let postTotalArray = [];
        let deltaVArray = [];
        for (let i = 0; i < loadArrayOriginal.length; i++) {
            const load = loadArrayOriginal[i];
            const postLoad = parseInt(loadArrayPost[i],10);
            preTotalArray[i] = 0;
            postTotalArray[i] = 0;
            deltaVArray[i] = 0;

            // console.log(load,min,max,load > min, load < max);
            if( ! (load > min && load < max && postLoad > min && postLoad < max)) {
                console.warn('Skipping value');
                continue;
            }

            for (let j = 0; j < medians.length; j++) {
                const median = medians[j];
                // const preGenMatchIndex = index of gen value closest to load value; Consider sort, get value, then indexOf?
                // const nextPreGenMatchIndex = preGenMatchIndex + 1
                const preGenIndex = this.excelMatch(edges,load);
                const preGenA = Math.trunc(median[preGenIndex] || 0);
                const preGenB = Math.trunc(median[preGenIndex + 1] || 0);
                const preEdgeA = Math.trunc(edges[preGenIndex] || 0); // Edges are 1-indexed
                const preEdgeB = Math.trunc(edges[preGenIndex + 1] || 0);

                const postGenIndex = this.excelMatch(edges,postLoad);
                const postGenA = Math.trunc(median[postGenIndex] || 0);
                const postGenB = Math.trunc(median[postGenIndex + 1] || 0);
                const postEdgeA = Math.trunc(edges[postGenIndex] || 0);
                const postEdgeB = Math.trunc(edges[postGenIndex + 1] || 0);
               
                // const foo = [
                //     { name: 'load', 'value': load },
                //     { name: 'postLoad', 'value': postLoad },
                //     { name: 'median', 'value': median },
                //     { name: 'preGenA', 'value': preGenA },
                //     { name: 'preGenB', 'value': preGenB },
                //     { name: 'preEdgeA', 'value': preEdgeA },
                //     { name: 'preEdgeB', 'value': preEdgeB },
                //     { name: 'postGenA', 'value': postGenA },
                //     { name: 'postGenB', 'value': postGenB },
                //     { name: 'postEdgeA', 'value': postEdgeA },
                //     { name: 'postEdgeB', 'value': postEdgeB },
                // ]

                // console.log('- calculating pre slope -');
                // console.table(foo)

                const preSlope = math.divide(math.subtract(preGenA,preGenB),math.subtract(preEdgeA, preEdgeB)).toString();
                const preIntercept = math.subtract(preGenA,math.multiply(preSlope,preEdgeA)).toString();
                const preVal = parseInt(math.round(math.add(math.multiply(load,preSlope),preIntercept)).toString(),10);

                // console.log('preSlope calculation:',preSlope,preIntercept,preVal);

                const postSlope = math.divide(math.subtract(postGenA,postGenB),math.subtract(postEdgeA,postEdgeB)).toString();
                const postIntercept = math.subtract(postGenA,math.multiply(postSlope,postEdgeA)).toString();
                const postVal = parseInt(math.round(math.add(math.multiply(postLoad,postSlope),postIntercept)).toString(),10);
                // console.log('postSlope calculation:',postSlope,postIntercept,postVal);

                const deltaV = postVal - preVal;

                // console.log('delta V:',deltaV);

                preTotalArray[i] += preVal;
                postTotalArray[i] += postVal;
                deltaVArray[i] += deltaV;

                // console.log('totals','pre:',preTotalArray[i],'post:',postTotalArray[i]);
                // if(j > 5) break;
            }
            // console.log('load total','pre:',preTotalArray[i],'post:',postTotalArray[i]);
            // if(i > 5) break;
        }
        console.log('preTotalArray',preTotalArray.length,'...',preTotalArray);
        console.log('postTotalArray',preTotalArray.length,'...',postTotalArray);
        const preTotal = preTotalArray.reduce(function(sum,n){ return sum + (n || 0) },0);
        const postTotal = postTotalArray.reduce(function(sum,n){ return sum + (n || 0) },0);

        // console.log('array',preTotalArray,postTotalArray);
        // console.log('total',preTotal,postTotal);
        console.log('preTotal',preTotal);
        console.log('postTotal',postTotal);
        return {
            original: preTotal,
            post: postTotal,
            impact: postTotal - preTotal,
        };
    }

    get generation() {
        console.log('_________ get generation __________');
        const totals = this.getDisplacedGeneration(this.rdf.data.generation);
        this.generationOriginal = totals.original;
        this.generationPost = totals.post;
        return totals;
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
        console.log('_________ get so2 total __________');
        // Need to build special so2 array to pass in that combines so2_non for the relevant months
        const totals = this.getDisplacedGeneration(this.rdf.data.so2,false);
        this.so2Original = totals.original;
        this.so2Post = totals.post;
        return totals;
    }

    get noxTotal() {
        console.log('_________ get nox total __________');
        // Need to build special nox array to pass in that combines nox_non for the relevant months
        const totals = this.getDisplacedGeneration(this.rdf.data.nox,true);
        this.noxOriginal = totals.original;
        this.noxPost = totals.post;
        return totals;
    }

    get co2Total() {
        console.log('_________ get co2 total __________');
        // Need to build special co2 array to pass in that combines co2_non for the relevant months
        const totals = this.getDisplacedGeneration(this.rdf.data.co2,true);
        this.co2Original = totals.original;
        this.co2Post = totals.post;
        return totals;
    }

    get so2Rate() {
        console.log('_________ get so2 rate __________');
        // return {
        //     original: '',
        //     post: ''
        // }

        const original = math.round(math.divide(this.so2Original,this.generationOriginal),2);
        const post = math.round(math.divide(this.so2Post,this.generationPost),2);
        return {
            original: original.toString(),
            post: post.toString(),
        }
    }

    get noxRate() {
        console.log('_________ get nox rate __________');
        // return {
        //     original: '',
        //     post: ''
        // }

        const original = math.round(math.divide(this.noxOriginal,this.generationOriginal),2);
        const post = math.round(math.divide(this.noxPost,this.generationPost),2);
        return {
            original: original.toString(),
            post: post.toString(),
        }
    }

    get co2Rate() {
        console.log('_________ get co2 rate __________');
        // return {
        //     original: '',
        //     post: ''
        // }

        const original = math.round(math.divide(this.co2Original,this.generationOriginal),2);
        const post = math.round(math.divide(this.co2Post,this.generationPost),2);
        return {
            original: original.toString(),
            post: post.toString(),
        }
    }
}

export default AnnualDisplacementEngine;