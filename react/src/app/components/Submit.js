import React, { Component } from 'react';
import '../../styles/Submit.css';

class Submit extends Component {
    render() {
        return(
            <div className="input-group">
                <button type="submit" onClick={ this.props.onClick } disabled={this.props.submitted}>Submit</button>
            </div>
        )
    }
}

export default Submit;