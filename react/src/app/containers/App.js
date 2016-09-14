// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';

// App
import { updateYear, submitParams } from '../actions';
import EereProfile from './EereProfile';
import RegionList from '../components/RegionList';
import TextInput from '../components/TextInput';
import Submit from '../components/Submit';


class App extends Component {
    render() {
        return (
            <div>
                <h2>AVERT</h2>

                <RegionList />
                <TextInput label="Year" value={ this.props.year } onChange={(e) => this.props.onYearChange(e.target.value) } />
                <EereProfile />
                <Submit submitted={ this.props.submitted } onClick={(e) => this.props.onSubmit()} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        year: state.regions.options.year,
        submitted: state.eere.submitted,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onYearChange: (year) => {
            store.dispatch(updateYear(year));
        },
        onSubmit: () => {
            store.dispatch(submitParams());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);