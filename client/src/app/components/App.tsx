import '@uswds/uswds';
import '@uswds/uswds/css/uswds.css';
// ---
import { PanelTabs } from 'app/components/PanelTabs';
import { Panels } from 'app/components/Panels';

export function App() {
  return (
    <div className="avert-container">
      <PanelTabs />
      <Panels />
    </div>
  );
}
