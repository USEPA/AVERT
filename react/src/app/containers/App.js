// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';

// App
import { updateYear, submitCalculation } from '../actions';
import EereProfile from './EereProfile';
import EereLoadOutput from '../components/EereLoadOutput';
import Graphs from './Graphs';
import RegionList from '../components/RegionList';
import YearSelector from '../components/YearSelector';
import Submit from '../components/Submit';

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
                    <Submit label="Calculate" submitted={ this.props.calculating } onClick={(e) => this.props.onCalculate()} />
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
        calculating: state.eere.calculating,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onYearChange: (year) => {
            store.dispatch(updateYear(year));
        },
        onCalculate: () => {
            store.dispatch(submitCalculation());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);