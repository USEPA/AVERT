import React, { Component } from 'react';
import Engine from '../utils/Engine';
import EERE from '../utils/EERE';

class Calculations extends Component {
    
    runEngine() {
        let AVERT = new Engine({
            region: 'NE',
            years: ['2015']
        });

        let Profile = new EERE({
            top_hours: 5,
            reduction: 2,
            annual_gwh: 3,
            constant_mw: 4,
            wind_capacity: 5,
            utility_solar: 6,
            rooftop_solar: 7
        });

        AVERT.setProfile(Profile);
        const eere = AVERT.calculateEERE()
        console.log('- Calculations','runEngine','eere',eere);
    }

    render() {

        this.runEngine();
        return (
            <div className="Calculations">
                Calculating...
            </div>
        );
    }
}

export default Calculations;
