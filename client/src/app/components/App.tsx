import '@uswds/uswds';
import '@uswds/uswds/css/uswds.css';
// ---
import { PanelTabs } from 'app/components/PanelTabs';
import { Panels } from 'app/components/Panels';
import 'app/styles.css';

export function App() {
  return (
    <>
      <PanelTabs />
      <Panels />
    </>
  );
}
