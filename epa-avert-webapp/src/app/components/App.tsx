import React from 'react';
// components
import PanelTabs from 'app/components/PanelTabs';
import Panels from 'app/components/Panels';
// styles
import 'app/styles.css';

function App() {
  return (
    <div className="avert-container avert-copy">
      <PanelTabs />
      <Panels />
    </div>
  );
}

export default App;