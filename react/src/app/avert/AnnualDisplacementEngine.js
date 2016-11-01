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
        const sortedHaystack = array.concat(lookup).sort(function(a,b) { return a - b; });
        const index = sortedHaystack.indexOf(lookup);
        const matchedIndex = array.indexOf(sortedHaystack[index - 1]);
// console.log('excelMatch',lookup,matchedIndex,array[matchedIndex],array[matchedIndex - 1],array[matchedIndex + 1]);
        return matchedIndex;
    }

    calculateSlope(m,x,b) {
        return math.add(math.multiply(m,x),b);
    }

    getDisplacedGeneration(dataSet,dataSetNonOzone,no){
        console.time('getDisplacedGeneration');
        // if(no) return { original: '', post: '', impact: '' };
        
        console.warn('- AnnualDisplacementEngine','generation',this.rdf);
        const _this = this;
        const edges = Object.keys(this.rdf.load_bin_edges).map((key) => this.rdf.load_bin_edges[key]);
        
        const medians = dataSet.map((item) => item.medians);
        const mediansNonOzone = dataSetNonOzone ? dataSetNonOzone.map((item) => item.medians) : false;
        const loadArrayMonth = this.rdf.regional_load.map((item) => item.month );
        const loadArrayOriginal = this.rdf.regional_load.map((item) => item.regional_load_mw);
        const loadArrayPost = loadArrayOriginal.map((item,index) => math.sum(item,_this.hourlyEere[index].final_mw));
        // const loadKeys = Object.keys(this.rdf.load_bin_edges);        
        // const min = this.rdf.load_bin_edges[loadKeys[0]];
        // const max = this.rdf.load_bin_edges[loadKeys[loadKeys.length - 1]];
        const min = edges[0];
        const max = edges[edges.length - 1];
        
        // console.log('.....','dataSet',dataSet.length,dataSet);
        // console.log('.....','medians',medians.length,medians);
        // console.log('.....','loadArrayMonth',loadArrayMonth.length,loadArrayMonth);
        // console.log('.....','loadArrayOriginal',loadArrayOriginal.length,loadArrayOriginal);
        // console.log('.....','loadArrayPost',loadArrayPost.length,loadArrayPost);
        // console.log('.....','min',min);
        // console.log('.....','max',max);
        // console.log('.....','edges',edges);
        
        // const peaks = [];
        // const capacities = [];
        let preTotalArray = [];
        let postTotalArray = [];
        let deltaVArray = [];
        for (let i = 0; i < loadArrayOriginal.length; i++) {
            
            // console.time('loadArrayOriginal iteration');
            const load = loadArrayOriginal[i];
            const month = loadArrayMonth[i];
            const postLoad = loadArrayPost[i];
            preTotalArray[i] = 0;
            postTotalArray[i] = 0;
            deltaVArray[i] = 0;

            if( ! (load >= min && load <= max && postLoad >= min && postLoad <= max)) continue;
            

            let activeMedians = medians;
            if(mediansNonOzone) {
                activeMedians = (month >= 5 && month <= 10) ? medians : mediansNonOzone;    
            }

            const preGenIndex = this.excelMatch(edges,load);
            const postGenIndex = this.excelMatch(edges,postLoad);

            for (let j = 0; j < activeMedians.length; j++) {
                const median = activeMedians[j];
                
                // console.log('Inputs:',median[preGenIndex],median[preGenIndex + 1],edges[preGenIndex],edges[preGenIndex + 1]);
                
                const preGenA = median[preGenIndex];
                const preGenB = median[preGenIndex + 1];
                const preEdgeA = edges[preGenIndex]; // Edges are 1-indexed
                const preEdgeB = edges[preGenIndex + 1];

                const postGenA = median[postGenIndex];
                const postGenB = median[postGenIndex + 1];
                const postEdgeA = edges[postGenIndex];
                const postEdgeB = edges[postGenIndex + 1];
               
                const preSlope = math.divide(math.subtract(preGenA,preGenB),math.subtract(preEdgeA, preEdgeB)).toString();
                const preIntercept = math.subtract(preGenA,math.multiply(preSlope,preEdgeA)).toString();
                const preVal = math.add(math.multiply(load,preSlope),preIntercept);

                const postSlope = math.divide(math.subtract(postGenA,postGenB),math.subtract(postEdgeA,postEdgeB)).toString();
                const postIntercept = math.subtract(postGenA,math.multiply(postSlope,postEdgeA)).toString();
                const postVal = math.add(math.multiply(postLoad,postSlope),postIntercept);

                const deltaV = math.subtract(postVal,preVal);

                preTotalArray[i] = math.add(preTotalArray[i],preVal);
                postTotalArray[i] = math.add(postTotalArray[i],postVal);
                deltaVArray[i] = math.add(deltaVArray[i],deltaV);

                // if(j === 1){
                    // const debug = [
                    //     { name: 'load', 'value': load },
                    //     { name: 'postLoad', 'value': postLoad + 1 },
                    //     { name: 'median', 'value': median },
                    //     { name: 'preGenIndex', 'value': preGenIndex },
                    //     { name: 'preGenA', 'value': preGenA },
                    //     { name: 'preGenB', 'value': preGenB },
                    //     { name: 'preEdgeA', 'value': preEdgeA },
                    //     { name: 'preEdgeB', 'value': preEdgeB },
                    //     { name: 'preVal', 'value': preVal },
                    //     { name: 'postGenIndex', 'value': postGenIndex + 1},
                    //     { name: 'postGenA', 'value': postGenA },
                    //     { name: 'postGenB', 'value': postGenB },
                    //     { name: 'postEdgeA', 'value': postEdgeA },
                    //     { name: 'postEdgeB', 'value': postEdgeB },
                    //     { name: 'postVal', 'value': postVal },
                    //     { name: 'deltaV', 'value': deltaV },
                    // ]; 
                    // console.log('preSlope calculation:',preSlope,preIntercept,preVal);
                    // console.log('postSlope calculation:',postSlope,postIntercept,postVal);
                    // console.log('delta V:',deltaV);
                    // console.table(debug);
                    // console.log('totals','pre:',preTotalArray[i],'post:',postTotalArray[i]);
                // }
                // if(j > 0) break;
                // 
                // console.log('Values:',preSlope,preIntercept,preVal,postSlope,postIntercept,postVal,deltaV,preTotalArray[i],postTotalArray[i]);
                // console.log(preTotalArray[i]);
            }
            // console.log('load total','pre:',preTotalArray[i],'post:',postTotalArray[i]);
            // if(i > 0) break;
            
            // console.timeEnd('loadArrayOriginal iteration');
        }
        // console.log('Check 8760',loadArrayOriginal.length,preTotalArray.length,medians.length)
        console.log('preTotalArray',preTotalArray.length,'...',preTotalArray);
        console.log('postTotalArray',preTotalArray.length,'...',postTotalArray);
        const preTotal = preTotalArray.reduce(function(sum,n){ return sum + (n || 0) },0);
        const postTotal = postTotalArray.reduce(function(sum,n){ return sum + (n || 0) },0);

        // console.log('array',preTotalArray,postTotalArray);
        // console.log('total',preTotal,postTotal);
        console.log('preTotal',parseInt(preTotal,10));
        console.log('postTotal',parseInt(postTotal,10));
        
        console.timeEnd('getDisplacedGeneration');
        return {
            original: parseInt(preTotal,10),
            post: parseInt(postTotal,10),
            impact: parseInt(math.subtract(postTotal,preTotal),10),
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
        console.log('SO2 data',this.rdf.data.so2);
        console.log('Data',this.rdf.data);
        const totals = this.getDisplacedGeneration(this.rdf.data.so2,this.rdf.data.so2_not,true);
        this.so2Original = totals.original;
        this.so2Post = totals.post;
        return totals;
    }

    get noxTotal() {
        console.log('_________ get nox total __________');
        // Need to build special nox array to pass in that combines nox_non for the relevant months
        const totals = this.getDisplacedGeneration(this.rdf.data.nox,this.rdf.data.nox_not,true);
        this.noxOriginal = totals.original;
        this.noxPost = totals.post;
        return totals;
    }

    get co2Total() {
        console.log('_________ get co2 total __________');
        // Need to build special co2 array to pass in that combines co2_non for the relevant months
        const totals = this.getDisplacedGeneration(this.rdf.data.co2,this.rdf.data.co2_not,true);
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