// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';

// App
// import Calculations from '../components/Calculations';
import { 
    updateEereTopHours, 
    updateEereReduction,
    updateEereAnnualGwh,
    updateEereConstantMw,
    updateEereWindCapacity,
    updateEereUtilitySolar,
    updateEereRooftopSolar 
} from '../actions';
        
import TextInput from '../components/TextInput';

class EereProfile extends Component {
    render() {

        const {
            topHours,
            reduction,
            annualGwh,
            constantMw,
            capacity,
            utilitySolar,
            rooftopSolar,
            valid,
            errors,
            softValid,
            softTopExceedanceValue,
            softTopExceedanceHour,
            hardValid,
            hardTopExceedanceValue,
            hardTopExceedanceHour,
            onTopHoursChange,
            onReductionChange,
            onAnnualGwhChange,
            onConstantMwChange,
            onWindCapacityChange,
            onUtilitySolarChange,
            onRooftopSolarChange,
        } = this.props;

        console.warn('Errors',errors,'Soft val',softTopExceedanceValue,'Hard val',hardTopExceedanceValue);
        return (
            <div>
                <h3>EERE Profile</h3>

                <div>Is First Pass Valid? { valid ? 'Yes' : 'No'}</div>
                <div>Did second pass stay under 15% {softValid ? 'Yes': 'No'} (Value: {softTopExceedanceValue}, Hour: {softTopExceedanceHour})</div>
                <div>Did second pass stay under 30% {hardValid ? 'Yes': 'No'} (Value: {hardTopExceedanceValue}, Hour: {hardTopExceedanceHour})</div>

                <TextInput label="Top Hours" value={ topHours } onChange={(e) => onTopHoursChange(e.target.value) } />
                {this.getError(errors,'topHours')}

                <TextInput label="Reduction" value={ reduction } onChange={(e) => onReductionChange(e.target.value) } />
                {this.getError(errors,'reduction')}

                <TextInput label="Annual GWH" value={ annualGwh } onChange={(e) => onAnnualGwhChange(e.target.value) } />
                {this.getError(errors,'annualGwh')}

                <TextInput label="Constant MW" value={ constantMw } onChange={(e) => onConstantMwChange(e.target.value) } />
                {this.getError(errors,'constantMw')}

                <TextInput label="Wind Capacity" value={ capacity } onChange={(e) => onWindCapacityChange(e.target.value) } />
                {this.getError(errors,'windCapacity')}

                <TextInput label="Utility Solar" value={ utilitySolar } onChange={(e) => onUtilitySolarChange(e.target.value) } />
                {this.getError(errors,'utilitySolar')}

                <TextInput label="Rooftop Solar" value={ rooftopSolar } onChange={(e) => onRooftopSolarChange(e.target.value) } />
                {this.getError(errors,'rooftopSolar')}
            </div>
        )
    }

    getError(errors,label){
        return errors.indexOf(label) !== -1 ? `Errors in ${label}` : '';
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
        valid: state.eere.valid,
        errors: state.eere.errors,
        softValid: state.eere.soft_valid,
        softExceedances: state.eere.soft_exceedances,
        softTopExceedanceValue: state.eere.soft_top_exceedance_value,
        softTopExceedanceHour: state.eere.soft_top_exceedance_hour,
        hardValid: state.eere.hard_valid,
        hardExceedances: state.eere.hard_exceedances,
        hardTopExceedanceValue: state.eere.hard_top_exceedance_value,
        hardTopExceedanceHour: state.eere.hard_top_exceedance_hour,
    }
};

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