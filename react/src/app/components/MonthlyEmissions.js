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
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        monthly_status: state.monthlyEmissions.status,
        data: state.monthlyEmissions.results
    }
}

export default connect(mapStateToProps)(MonthlyEmissions);
