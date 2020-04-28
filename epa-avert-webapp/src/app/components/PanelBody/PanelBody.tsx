import React from 'react';
// styles
import './styles.css';

type Props = {
  heading: string;
  children: React.ReactNode;
};

function PanelBody({ heading, children }: Props) {
  return (
    <div className="avert-step-body">
      <h2 className="avert-heading-two">{heading}</h2>
      {children}
    </div>
  );
}

export default PanelBody;
