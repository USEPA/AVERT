// Deps
// import _ from 'lodash';
import math from 'mathjs';
// import stats from 'stats-lite'

// Engine

// App
// import so2 from './so2';

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
        return matchedIndex;
    }

    getDisplacedGeneration(dataSet,dataSetNonOzone,no){
        // if(no) return { original: '', post: '', impact: '' };
        console.time('prep');
        
        const _this = this;
        const edges = Object.keys(this.rdf.load_bin_edges).map((key) => this.rdf.load_bin_edges[key]);
        
        const medians = dataSet.map((item) => item.medians);
        const mediansNonOzone = dataSetNonOzone ? dataSetNonOzone.map((item) => item.medians) : false;
        const loadArrayMonth = this.rdf.regional_load.map((item) => item.month );
        const loadArrayOriginal = this.rdf.regional_load.map((item) => item.regional_load_mw);
        const loadArrayPost = loadArrayOriginal.map((item,index) => math.sum(item,_this.hourlyEere[index].final_mw));
        const min = edges[0];
        const max = edges[edges.length - 1];

        let preTotalArray = [];
        let postTotalArray = [];
        let deltaVArray = [];
        const monthlyEmissions = {
            regional: {},
            state: {},
            // county: {},
        };
        console.timeEnd('prep')

        console.time('iterations');
        for (let i = 0; i < loadArrayOriginal.length; i++) {
            const load = loadArrayOriginal[i];
            const month = loadArrayMonth[i];
            const postLoad = loadArrayPost[i];
            
            monthlyEmissions.regional[month] = monthlyEmissions.regional[month] ? monthlyEmissions.regional[month] : 0;

            preTotalArray[i] = 0;
            postTotalArray[i] = 0;
            deltaVArray[i] = 0;

            if( ! (load >= min && load <= max && postLoad >= min && postLoad <= max)) continue;

            let activeMedians = medians;
            if(mediansNonOzone) {
                activeMedians = (month >= 5 && month <= 9) ? medians : mediansNonOzone;    
            }

            const preGenIndex = this.excelMatch(edges,load);
            const postGenIndex = this.excelMatch(edges,postLoad);

            for (let j = 0; j < activeMedians.length; j++) {
                const median = activeMedians[j];
                const state = dataSet[j].state;
                const county = dataSet[j].county;
                const preVal = this.calculateLinear(load,median[preGenIndex],median[preGenIndex + 1],edges[preGenIndex],edges[preGenIndex + 1]);
                const postVal = this.calculateLinear(postLoad,median[postGenIndex],median[postGenIndex + 1],edges[postGenIndex],edges[postGenIndex + 1]);
                const deltaV = math.subtract(postVal,preVal);

                preTotalArray[i] += preVal;
                postTotalArray[i] += postVal;
                deltaVArray[i] += deltaV;
                
                monthlyEmissions.state[state] = monthlyEmissions.state[state] ? monthlyEmissions.state[state] : { data: {}, counties: {} };
                monthlyEmissions.state[state].data[month] = monthlyEmissions.state[state].data[month] ? monthlyEmissions.state[state].data[month] : 0;
                monthlyEmissions.state[state].data[month] += deltaV;

                monthlyEmissions.state[state].counties[county] = monthlyEmissions.state[state].counties[county] ? monthlyEmissions.state[state].counties[county] : {};
                monthlyEmissions.state[state].counties[county][month] = monthlyEmissions.state[state].counties[county][month] ? monthlyEmissions.state[state].counties[county][month] : 0;
                monthlyEmissions.state[state].counties[county][month] += deltaV;
            }

            monthlyEmissions.regional[month] += deltaVArray[i];
        }
        console.timeEnd('iterations');

        console.time('end');
        
        const preTotal = preTotalArray.reduce(function(sum,n){ return sum + (n || 0) },0);
        const postTotal = postTotalArray.reduce(function(sum,n){ return sum + (n || 0) },0);

        console.timeEnd('end');
        return {
            original: parseInt(preTotal,10),
            post: parseInt(postTotal,10),
            impact: parseInt(math.subtract(postTotal,preTotal),10),
            monthlyEmissions: monthlyEmissions,
        };
    }

    calculateLinear(load,genA,genB,edgeA,edgeB){
        const slope = math.divide(math.subtract(genA,genB),math.subtract(edgeA, edgeB)).toString();
        const intercept = math.subtract(genA,math.multiply(slope,edgeA)).toString();
        const val = math.add(math.multiply(load,slope),intercept);

        return val;
    }

    get generation() {
        console.time('_________ get generation __________');
        const totals = this.getDisplacedGeneration(this.rdf.data.generation,false,false);
        console.timeEnd('_________ get generation __________');
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
        console.time('_________ get so2 total __________');
        const totals = this.getDisplacedGeneration(this.rdf.data.so2,this.rdf.data.so2_not,true);
        this.so2Original = totals.original;
        this.so2Post = totals.post;
        console.timeEnd('_________ get so2 total __________');
        return totals;
    }

    get noxTotal() {
        console.time('_________ get nox total __________');
        const totals = this.getDisplacedGeneration(this.rdf.data.nox,this.rdf.data.nox_not,true);
        this.noxOriginal = totals.original;
        this.noxPost = totals.post;
        console.timeEnd('_________ get nox total __________');
        return totals;
    }

    get co2Total() {
        console.time('_________ get co2 total __________');
        const totals = this.getDisplacedGeneration(this.rdf.data.co2,this.rdf.data.co2_not,true);
        this.co2Original = totals.original;
        this.co2Post = totals.post;
        console.timeEnd('_________ get co2 total __________');
        return totals;
    }

    get so2Rate() {
        console.time('_________ get so2 rate __________');
        const original = math.round(math.divide(this.so2Original,this.generationOriginal),2);
        const post = math.round(math.divide(this.so2Post,this.generationPost),2);
        console.timeEnd('_________ get so2 rate __________');
        return {
            original: original.toString(),
            post: post.toString(),
        }
    }

    get noxRate() {
        console.time('_________ get nox rate __________');
        const original = math.round(math.divide(this.noxOriginal,this.generationOriginal),2);
        const post = math.round(math.divide(this.noxPost,this.generationPost),2);
        console.timeEnd('_________ get nox rate __________');
        return {
            original: original.toString(),
            post: post.toString(),
        }
    }

    get co2Rate() {
        console.time('_________ get co2 rate __________');
        const original = math.round(math.divide(this.co2Original,this.generationOriginal),2);
        const post = math.round(math.divide(this.co2Post,this.generationPost),2);
        console.timeEnd('_________ get co2 rate __________');
        return {
            original: original.toString(),
            post: post.toString(),
        }
    }
}

export default AnnualDisplacementEngine;