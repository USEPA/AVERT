import React, { Component, PropTypes } from 'react';
// styles
import './styles.css';

class PanelFooter extends Component {
  render() {
    // conditionally define prevButtonElement, if prevButtonText prop exists
    let prevButtonElement;

    if (this.props.prevButtonText) {
      prevButtonElement = (
        <a className='avert-button avert-prev' href='' onClick={(e) => {
            e.preventDefault();
            const step = this.props.activeStep - 1;
            this.props.onButtonClick(step);
          }}
        >{ this.props.prevButtonText }</a>
      );
    }

    const nextButtonElement = (
      <a className='avert-button avert-next' href='' onClick={(e) => {
          e.preventDefault();
          const step = this.props.lastPanel ? 1 : this.props.activeStep + 1;
          this.props.onButtonClick(step);
        }}
      >{ this.props.nextButtonText }</a>
    );

    return (
      <div className='avert-step-footer'>
        <p className='avert-centered'>
          { prevButtonElement }
          { nextButtonElement }
        </p>
      </div>
    )
  }
}

PanelFooter.propTypes = {
  lastPanel: PropTypes.bool,
  activeStep: PropTypes.number.isRequired,
  onButtonClick: PropTypes.func.isRequired,
  prevButtonText: PropTypes.string,
  nextButtonText: PropTypes.string.isRequired,
};

export default PanelFooter;
