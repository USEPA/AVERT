// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';

// App
import { statusEnum } from '../utils/statusEnum';

// Styles
import '../../styles/EereLoadOutput.css';

class EereLoadOutput extends Component {
    render() {
        const statusIndicator = statusEnum[this.props.status].lang;
        const { hourlyEere } = this.props;
        return(
            <div className="eere-load-output">
                { statusIndicator }
                <table className="eere-table">
                    <thead>
                        <tr>
                            <th>Hour</th>
                            <th>Current Load (MW)</th>
                            <th>Manual EERE Entry</th>
                            <th>Constant</th>
                            <th>Percent</th>
                            <th>Renewable Energy Profile</th>
                            <th>Final (MW)</th>
                            <th>Limit</th>
                            <th>Exceedence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hourlyEere.map((item,index) =>
                            <tr key={index}>
                                <td>{item.index + 1}</td>
                                <td>{item.current_load_mw}</td>
                                <td>{item.manual_eere_entry}</td>
                                <td>{item.constant}</td>
                                <td>{item.percent}</td>
                                <td>{item.renewable_energy_profile}</td>
                                <td>{item.final_mw}</td>
                                <td>{item.limit}</td>
                                <td>{item.exceedence}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        status: state.eere.status,
        hourlyEere: state.eere.hourlyEere,
    }
}

export default connect(mapStateToProps)(EereLoadOutput);