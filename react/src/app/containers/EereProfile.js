// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';

// App
// import Calculations from '../components/Calculations';
import { updateEereTopHours, 
        updateEereReduction,
        updateEereAnnualGwh,
        updateEereConstantMw,
        updateEereWindCapacity,
        updateEereUtilitySolar,
        updateEereRooftopSolar } from '../actions';
import TextInput from '../components/TextInput';

class EereProfile extends Component {
    render() {
        return (
            <div>
                <h3>EERE Profile</h3>
                <TextInput label="Top Hours" value={ this.props.topHours } onChange={(e) => this.props.onTopHoursChange(e.target.value) } />
                <TextInput label="Reduction" value={ this.props.reduction } onChange={(e) => this.props.onReductionChange(e.target.value) } />
                <TextInput label="Annual GWH" value={ this.props.annualGwh } onChange={(e) => this.props.onAnnualGwhChange(e.target.value) } />
                <TextInput label="Constant MW" value={ this.props.constantMw } onChange={(e) => this.props.onConstantMwChange(e.target.value) } />
                <TextInput label="Wind Capacity" value={ this.props.capacity } onChange={(e) => this.props.onWindCapacityChange(e.target.value) } />
                <TextInput label="Utility Solar" value={ this.props.utilitySolar } onChange={(e) => this.props.onUtilitySolarChange(e.target.value) } />
                <TextInput label="Rooftop Solar" value={ this.props.rooftopSolar } onChange={(e) => this.props.onRooftopSolarChange(e.target.value) } />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        topHours: state.eere.topHours,
        reduction: state.eere.reduction,
        annualGwh: state.eere.annualGwh,
        constantMw: state.eere.constantMw,
        capacity: state.eere.capacity,
        utilitySolar: state.eere.utilitySolar,
        rooftopSolar: state.eere.rooftopSolar,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onTopHoursChange: (text) => {
            store.dispatch(updateEereTopHours(text));
        },
        onReductionChange: (text) => {
            store.dispatch(updateEereReduction(text));
        },
        onAnnualGwhChange: (text) => {
            store.dispatch(updateEereAnnualGwh(text));
        },
        onConstantMwChange: (text) => {
            store.dispatch(updateEereConstantMw(text));
        },
        onWindCapacityChange: (text) => {
            store.dispatch(updateEereWindCapacity(text));
        },
        onUtilitySolarChange: (text) => {
            store.dispatch(updateEereUtilitySolar(text));
        },
        onRooftopSolarChange: (text) => {
            store.dispatch(updateEereRooftopSolar(text));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EereProfile);