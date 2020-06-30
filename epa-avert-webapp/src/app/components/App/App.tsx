import React from 'react';
// components
import PanelTabs from 'app/components/PanelTabs';
import StepPanels from 'app/components/StepPanels/StepPanels';
// styles
import './styles.css';

function App() {
  return (
    <div className="avert-container avert-copy">
      <PanelTabs />
      <StepPanels />
    </div>
  );
}

export default App;
