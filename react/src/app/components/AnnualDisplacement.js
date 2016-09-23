// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';

// App
import { statusEnum } from '../utils/statusEnum';

class AnnualDisplacement extends Component {
    render() {
        const statusIndicator = statusEnum[this.props.generation_status].lang;
        const { data } = this.props;
        return(
            <div>
                <h4>Annual Displacement</h4>
                <span>{ statusIndicator }</span>
                <ul>
                    {data.map((item,index) => <li key={index}>{item}</li>)}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        generation_status: state.generation.status,
        data: state.generation.results
    }
}

export default connect(mapStateToProps)(AnnualDisplacement);