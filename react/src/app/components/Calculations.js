import React, { Component } from 'react';
import EngineUtil from '../utils/EngineUtil';

class Calculations extends Component {
    
    render() {

        let Engine = new EngineUtil({
            regions: 'NW',
            years: ['2015']
        });

        Engine.exampleFunction();

        return (
            <div className="Calculations">
                Calculating...
            </div>
        );
    }
}

export default Calculations;
