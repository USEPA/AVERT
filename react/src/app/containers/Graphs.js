// Deps
import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { store } from '../store';

// App
import AnnualDisplacement from '../components/AnnualDisplacement';
import EmissionsByState from '../components/EmissionsByState';
import MonthlyEmissions from '../components/MonthlyEmissions';
import '../../styles/Graphs.css';

class Graphs extends Component {
    render() {
        return (
            <div className="graph-container">
                <h3>Graphs</h3>
                <AnnualDisplacement />
                <EmissionsByState />
                <MonthlyEmissions />
            </div>
        )
    }
}

export default Graphs;