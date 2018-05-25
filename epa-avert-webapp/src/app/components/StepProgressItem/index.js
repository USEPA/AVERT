// @flow

import React from 'react';
// styles
import './styles.css';

type Props = {
  step: number,
  active: boolean,
  title: string,
};

const StepProgressItem = (props: Props) => (
  <li className={`avert-tab${props.step}`}>
    <a data-active={props.active}>{props.title}</a>
  </li>
);

export default StepProgressItem;
