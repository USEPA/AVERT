// @flow

import React from 'react';
// components
import StepProgressItem from 'app/components/StepProgressItem';
// styles
import './styles.css';

type Props = {
  activeTab: number,
};

// prettier-ignore
const StepProgressBar = (props: Props) => (
  <nav className="avert-nav">
    <ol>
      <StepProgressItem step={1} active={props.activeTab === 1 ? true : false} title="Select Region" />
      <StepProgressItem step={2} active={props.activeTab === 2 ? true : false} title="Set EE/RE Impacts" />
      <StepProgressItem step={3} active={props.activeTab === 3 ? true : false} title="Get Results" />
    </ol>
  </nav>
);

export default StepProgressBar;
