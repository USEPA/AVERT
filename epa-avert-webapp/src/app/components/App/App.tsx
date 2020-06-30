import React from 'react';
// components
import PanelNav from 'app/components/PanelNav';
import StepPanels from 'app/components/StepPanels/StepPanels';
// styles
import './styles.css';

function App() {
  return (
    <div className="avert-container avert-copy">
      <PanelNav />
      <StepPanels />
    </div>
  );
}

export default App;
