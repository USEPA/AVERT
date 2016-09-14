import React, { Component, PropTypes } from 'react';
import '../../styles/Dropdown.css';

class YearSelector extends Component {
    render() {
        return(
            <div className="input-group">

                <label>{ this.props.label }:</label>
                <select onChange={ this.props.onChange } value={ this.props.value ? this.props.value : '' }>
                    <option value="" disabled defaultValue> - select an option - </option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                </select>
            </div>
        )
    }
}

YearSelector.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

export default YearSelector;