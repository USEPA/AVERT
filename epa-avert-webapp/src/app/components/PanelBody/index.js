// @flow

import React from 'react';
// styles
import './styles.css';
// types
import type { Node } from 'react';

type Props = {
  heading: string,
  children: Node,
};

const PanelBody = (props: Props) => (
  <div className='avert-step-body'>
    <h2 className='avert-heading-two'>{props.heading}</h2>
    {props.children}
  </div>
);

export default PanelBody;
