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
      <a href="/" data-active={active} onClick={(ev) => ev.preventDefault()}>
        {title}
      </a>
    </li>
  );
}

export default StepProgressItem;
