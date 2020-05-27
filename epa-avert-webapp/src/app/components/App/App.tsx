import React from 'react';
// components
import StepProgressBar from 'app/components/StepProgressBar/StepProgressBar';
import StepPanels from 'app/components/StepPanels/StepPanels';
// styles
import './styles.css';

function App() {
  return (
    <div className="avert-container avert-copy">
      <StepProgressBar />
      <StepPanels />
    </div>
  );
}

export default App;
