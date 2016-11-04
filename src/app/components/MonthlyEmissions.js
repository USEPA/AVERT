// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';

// App
import { statusEnum } from '../utils/statusEnum';

class MonthlyEmissions extends Component {
    render() {
        const statusIndicator = statusEnum[this.props.monthly_status].lang
        const { data } = this.props;
        return (
            <div>
                <h4>Monthly Emissions</h4>
                <span>{ statusIndicator }</span>
                <ul>
                    { data.map((item,index) => <li key={index}>{item}</li> )}
                </ul>

                <fieldset>
                    <label>Select level of aggregation:</label>
                    <div><input type="radio" name="aggregation" value="region"/> Region</div>
                    <div><input type="radio" name="aggregation" value="state"/> State</div>
                    <div><input type="radio" name="aggregation" value="county"/> County</div>
                </fieldset>

                <fieldset>
                    <label>Select units:</label>
                    <div><input type="radio" name="units" value="emission"/> Emission changes (lbs or tons)</div>
                    <div><input type="radio" name="units" value="percent"/> Percent change</div>
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
                        <tr>
                            <td>January</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>February</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>March</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>April</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>May</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>June</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>July</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>August</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>September</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>October</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>November</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                        <tr>
                            <td>December</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                            <td>&ndash;</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        monthly_status: state.monthlyEmissions.status,
        data: state.monthlyEmissions.results
        // data: state.annualDisplacement.results,
    }
}

export default connect(mapStateToProps)(MonthlyEmissions);
