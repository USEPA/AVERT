// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';

// App
import { statusEnum } from '../utils/statusEnum';

class EmissionsByState extends Component {
    render() {
        const statusIndicator = statusEnum[this.props.state_status].lang
        const { data, states } = this.props;
        return(
            <div>
                <h4>Emissions by State</h4>
                <span>{ statusIndicator }</span>
                <table className="annual-displacement-table">
                    <thead>
                    <tr>
                        <th>State</th>
                        <th>SO<sub>2</sub> (lbs)</th>
                        <th>NO<sub>X</sub> (lbs)</th>
                        <th>CO<sub>2</sub> (tons)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>FOO</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                    {states.map((state,index) => {
                        return (
                            <tr>
                                <td>{state}</td>
                                <td>{data[index].so2}</td>
                                <td>{data[index].nox}</td>
                                <td>{data[index].co2}</td>
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
        state_status: state.stateEmissions.status,
        data: state.stateEmissions.results.data ? state.stateEmissions.results.data : {},
        states: state.stateEmissions.results.states ? state.stateEmissions.results.states : [],
    }
}

export default connect(mapStateToProps)(EmissionsByState);
