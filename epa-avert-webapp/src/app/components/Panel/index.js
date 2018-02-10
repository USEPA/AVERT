// @flow

import React from 'react';
// styles
import './styles.css';
// types
import type { ChildrenArray, Element } from 'react';
import PanelBody from 'app/components/PanelBody';
import PanelFooter from 'app/components/PanelFooter/container.js';


type Props = {
  active: boolean,
  children: ChildrenArray<
    | Element<typeof PanelBody>
    | Element<typeof PanelFooter>
  >,
};

const Panel = (props: Props) => (
  <section className='avert-step' data-active={props.active}>
    {props.children}
  </section>
);

export default Panel;
