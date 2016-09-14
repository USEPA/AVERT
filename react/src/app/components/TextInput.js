import React, { Component, PropTypes } from 'react';
import '../../styles/Label.css';

class TextInput extends Component {
    render() {
        return(
            <div className="input-group">
                <label>{ this.props.label }:</label>
                <input type="text" value={ this.props.value } onChange={ this.props.onChange } />
            </div>
        )
    }
}

TextInput.propTypes = {
    label: PropTypes.string.isRequired
};

export default TextInput;