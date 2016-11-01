// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';

// App
import { statusEnum } from '../utils/statusEnum';

class EmissionsByState extends Component {
    render() {
        const statusIndicator = statusEnum[this.props.state_status].lang
        const { data } = this.props;
        return(
            <div>
                <h4>Emissions by State</h4>
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
        state_status: state.stateEmissions.status,
        data: state.stateEmissions.results
    }
}

export default connect(mapStateToProps)(EmissionsByState);
