import React from 'react';
// styles
import './styles.css';

type Props = {
  step: number;
  active: boolean;
  title: string;
};

function StepProgressItem({ step, active, title }: Props) {
  return (
    <li className={`avert-tab${step}`}>
      <a data-active={active}>{title}</a>
    </li>
  );
}

export default StepProgressItem;
