import _ from 'lodash';
import math from 'mathjs';

class EngineUtil {

	exampleFunction() {
		let someArray = [1,2,3];
		
		someArray = _.map(someArray, function(n) {
			return math.eval(n * 3);
		});

		console.log(someArray);
	}
}

export default EngineUtil;