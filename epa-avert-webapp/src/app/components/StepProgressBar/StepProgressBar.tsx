import React from 'react';
// components
import StepProgressItem from 'app/components/StepProgressItem/StepProgressItem';
// reducers
import { useTypedSelector } from 'app/redux/index';
// styles
import './styles.css';

function StepProgressBar() {
  const activeStep = useTypedSelector(({ panel }) => panel.activeStep);

  return (
    <nav className="avert-nav">
      <ol>
        <StepProgressItem
          step={1}
          active={activeStep === 1}
          title="Select Region"
        />
        <StepProgressItem
          step={2}
          active={activeStep === 2}
          title="Set EE/RE Impacts"
        />
        <StepProgressItem
          step={3}
          active={activeStep === 3}
          title="Get Results"
        />
      </ol>
    </nav>
  );
}

export default StepProgressBar;
