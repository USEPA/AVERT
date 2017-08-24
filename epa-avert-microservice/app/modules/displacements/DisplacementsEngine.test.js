const engine = require('./DisplacementsEngine');

console.log('Running');

console.time('performance');

var someNumber = 0.5;
for (var i = 0; i < 10; i++) {
    someNumber += (i/10);
}

console.timeEnd('performance');