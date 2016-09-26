// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';

// App
import { updateYear, calculateEereProfile, calculateDisplacement } from '../actions';
import EereProfile from './EereProfile';
import EereLoadOutput from '../components/EereLoadOutput';
import Graphs from './Graphs';
import RegionList from '../components/RegionList';
import YearSelector from '../components/YearSelector';
import Submit from '../components/Submit';
import { statusEnum } from '../utils/statusEnum';

// Styles
import '../../styles/EereLoadProfile.css';

class App extends Component {
    
    render() {
    
        return (
            <div>
                <h2>AVERT</h2>

                <div className="eere-load-profile">
                    <RegionList />
                    <YearSelector label="Year" value={ this.props.year } onChange={(e) => this.props.onYearChange(e.target.value) } />
                    <EereProfile />
                    <Submit label="Calculate" submitted={ statusEnum[this.props.eere_status].submitted } onClick={(e) => this.props.onCalculate()} />
                    <Submit label="Displacement" submitted={ statusEnum[this.props.annual_status].submitted } onClick={(e) => this.props.onCalculateGeneration()} />
                </div>
                <EereLoadOutput />
                <Graphs />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        year: state.regions.options.year,
        submitted: state.eere.submitted,
        eere_status: state.eere.status,
        annual_status: state.annualDisplacement.status,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onYearChange: (year) => {
            store.dispatch(updateYear(year));
        },
        onCalculate: () => {
            calculateEereProfile();
        },
        onCalculateGeneration: () => {
            calculateDisplacement();
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);