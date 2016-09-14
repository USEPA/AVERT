import React, { Component, PropTypes } from 'react';

class Region extends Component {
    render() {
        const regionUrl = this.props.selected ? <b>{ this.props.region }</b> : <a href="#" onClick={ this.props.onClick }>{ this.props.region }</a>;

        return(
            <li>{ regionUrl }</li>            
        )
    }
}

Region.propTypes = {
    region: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool, 
};

export default Region;