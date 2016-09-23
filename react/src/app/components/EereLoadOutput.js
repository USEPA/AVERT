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
                            <th>Current Load (MW)</th>
                            <th>Final (MW)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hourlyEere.map((item,index) =>
                            <tr key={index}>
                                <td>{item.current_load_mw}</td>
                                <td>{item.final_mw}</td>
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