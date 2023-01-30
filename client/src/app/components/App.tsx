import '@uswds/uswds';
import '@uswds/uswds/css/uswds.css';
// ---
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { PanelTabs } from 'app/components/PanelTabs';
import { Panels } from 'app/components/Panels';

export function App() {
  return (
    <div className="avert-container">
      <ErrorBoundary>
        <PanelTabs />
        <Panels />
      </ErrorBoundary>
    </div>
  );
}
