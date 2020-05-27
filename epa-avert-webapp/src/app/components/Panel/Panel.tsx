import React from 'react';
// components
import PanelBody from 'app/components/PanelBody/PanelBody';
import PanelFooter from 'app/components/PanelFooter/PanelFooter';
// styles
import './styles.css';

type Props = {
  active: boolean;
  children: React.ReactElement<typeof PanelBody | typeof PanelFooter>[];
};

function Panel({ active, children }: Props) {
  return (
    <section className="avert-step" data-active={active}>
      {children}
    </section>
  );
}

export default Panel;
