// Deps
import React, { Component } from 'react';
import { connect } from 'react-redux';

// App
import '../../styles/EereLoadOutput.css';

class EereLoadOutput extends Component {
    render() {
        const statusIndicator = this.props.calculating ? "Calculating..." : "Not calculating";
        const { hourlyEere } = this.props;
        return(
            <div className="eere-load-output">
                { statusIndicator }
                <ul>
                    {hourlyEere.map((item,index) =>
                            <li key={index}>{item.current_load_mw}: {item.final_mw}</li>
                    )}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        calculating: state.eere.calculating,
        hourlyEere: state.eere.hourlyEere,
    }
}

export default connect(mapStateToProps)(EereLoadOutput);