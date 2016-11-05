// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';

// App
import { statusEnum } from '../utils/statusEnum';
import { 
    updateMonthlyAggregation, 
    updateMonthlyUnit,
    selectState,
    selectCounty,
} from '../actions';

class MonthlyEmissions extends Component {
    render() {
        const statusIndicator = statusEnum[this.props.monthly_status].lang
        
        const { 
            // data, 
            output,
            aggregation, 
            unit, 
            available_states,
            available_counties,
            selected_state,
            selected_county,
            onAggregationChange, 
            onUnitChange,
            selectState,
            selectCounty,
        } = this.props;

        const showState = {
            display: aggregation === 'region' ? 'none' : 'block',
        };

        const showCounty = {
            display: aggregation === 'county' ? 'block': 'none',
        };

        return (
            <div>
                <h4>Monthly Emissions</h4>
                <span>{ statusIndicator }</span>
                
                <fieldset>
                    <label>Select level of aggregation:</label>
                    <div>
                        <input type="radio" 
                                name="aggregation" 
                                onChange={(e) => onAggregationChange('region')} 
                                defaultChecked={aggregation === "region"}
                                value="region" /> Region
                    </div>
                    <div>
                        <input type="radio" 
                                name="aggregation" 
                                onChange={(e) => onAggregationChange('state')} 
                                defaultChecked={aggregation === "state"}
                                value="state"/> State
                    </div>
                    
                    <div style={showState}>
                        <label>Available States:</label>
                        <select value={selected_state} onChange={(e) => selectState(e.target.value)}>
                            <option value="" disabled defaultValue> - select a state - </option>
                            {available_states.map((state,index) => {
                                return (
                                    <option key={index} value={state}>{state}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div>
                        <input type="radio" 
                                name="aggregation" 
                                onChange={(e) => onAggregationChange('county')} 
                                defaultChecked={aggregation === "county"}
                                value="county"/> County
                    </div>

                    <div style={showCounty}>
                        <label>Available Counties:</label>
                        <select value={selected_county} onChange={(e) => selectCounty(e.target.value)}>
                            <option value="" disabled defaultValue> - select a county - </option>
                            {available_counties.map((county,index) => {
                                return (
                                    <option key={index} value={county}>{county}</option>
                                )
                            })}
                        </select>
                    </div>
                </fieldset>

                <fieldset>
                    <label>Select units:</label>
                    <div>
                        <input type="radio" 
                                name="units" 
                                onChange={(e) => onUnitChange('emission')} 
                                defaultChecked={unit === "emission"}
                                value="emission"/> Emission changes (lbs or tons)
                    </div>
                    <div>
                        <input type="radio" 
                                name="units" 
                                onChange={(e) => onUnitChange('percent')} 
                                defaultChecked={unit === "percent"}
                                value="percent"/> Percent change
                    </div>
                </fieldset>

                <table className="annual-displacement-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>SO<sub>2</sub></th>
                            <th>NO<sub>x</sub></th>
                            <th>CO<sub>2</sub></th>
                        </tr>
                    </thead>
                    <tbody>
                        {output.so2.map((emission,index) => {
                            return (
                                <tr key={index}>
                                    <td>{index}</td>
                                    <td>{emission}</td>
                                    <td>{output.nox[index]}</td>
                                    <td>{output.co2[index]}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        monthly_status: state.monthlyEmissions.status,
        // data: state.monthlyEmissions.results,
        output: state.monthlyEmissions.output,
        aggregation: state.monthlyEmissions.selected_aggregation,
        unit: state.monthlyEmissions.selected_unit,
        available_states: state.monthlyEmissions.available_states,
        available_counties: state.monthlyEmissions.available_counties,
        selected_state: state.monthlyEmissions.selected_state,
        selected_county: state.monthlyEmissions.selected_county,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onAggregationChange: (aggregation) => {
            dispatch(updateMonthlyAggregation(aggregation));
        },
        onUnitChange: (unit) => {
            dispatch(updateMonthlyUnit(unit));
        },
        selectState: (state) => {
            dispatch(selectState(state));
        },
        selectCounty: (county) => {
            dispatch(selectCounty(county));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyEmissions);
