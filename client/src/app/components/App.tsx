/** @jsxImportSource @emotion/react */

import { jsx, css } from '@emotion/react';
// components
import PanelTabs from 'app/components/PanelTabs';
import Panels from 'app/components/Panels';
// styles
import 'app/styles.css';

const containerStyles = css`
  margin: 0rem auto;
  max-width: 45rem;
`;

function App() {
  return (
    <div css={containerStyles} className="avert-copy">
      <PanelTabs />
      <Panels />
    </div>
  );
}

export default App;
