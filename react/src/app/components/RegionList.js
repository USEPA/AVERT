// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../store';

// App
import Region from './Region';
import { selectRegion } from '../actions';

class RegionList extends Component {
    render() {
        return(
            <ul>
                <Region region="Northeast" selected={ this.props.region === 1 } onClick={() => this.props.onRegionClick(1) } />
                <Region region="California" selected={ this.props.region === 2 } onClick={() => this.props.onRegionClick(2) } />
            </ul>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        region: state.regions.options.region,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onRegionClick: (region_id) => {
            store.dispatch(selectRegion(region_id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegionList);