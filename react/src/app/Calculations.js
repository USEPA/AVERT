import React, { Component } from 'react';
import EngineUtil from './utils/EngineUtil';

class Calculations extends Component {
    
    render() {

        let Engine = new EngineUtil();
        Engine.exampleFunction();

        return (
            <div className="Calculations">
                Calculating...
            </div>
        );
    }
}

export default Calculations;
