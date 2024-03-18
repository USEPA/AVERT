import '@uswds/uswds';
import '@uswds/uswds/css/uswds.css';
import Highcharts from 'highcharts';
// ---
import { ErrorBoundary } from '@/app/components/ErrorBoundary';
import { PanelTabs } from '@/app/components/PanelTabs';
import { Panels } from '@/app/components/Panels';
import { ModalDialog } from '@/app/components/ModalDialog';

/* Apply a theme like Highcharts v10 */
const fontFamily = '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif'; // prettier-ignore
const colors = ['#7cb5ec','#434348','#90ed7d','#f7a35c','#8085e9','#f15c80','#e4d354','#2b908f','#f45b5b','#91e8e1']; // prettier-ignore
const labels = { distance: 8, style: { color: '#666666', fontSize: '11px' } };

Highcharts.setOptions({
  colors,
  chart: { style: { fontFamily, fontSize: '16px' } },
  title: { style: { fontWeight: 'normal', fontSize: '18px' } },
  plotOptions: {
    area: { lineWidth: 2 },
    column: { borderRadius: 0 },
    pie: { borderRadius: 0, dataLabels: { connectorShape: 'fixedOffset' } },
    line: { lineWidth: 2 },
    spline: { lineWidth: 2 },
  },
  tooltip: { borderWidth: 1 },
  legend: {
    itemStyle: { fontWeight: 'bold' },
    itemHiddenStyle: { color: '#cccccc', textDecoration: 'none' },
  },
  xAxis: { labels, lineColor: '#ccd6eb' },
  yAxis: { labels },
  colorAxis: { labels, maxColor: '#003399', minColor: '#e6ebf5' },
  scrollbar: {
    barBorderRadius: 0,
    barBorderWidth: 1,
    buttonsEnabled: true,
    height: 14,
    margin: 0,
    rifleColor: '#333',
    trackBackgroundColor: '#f2f2f2',
    trackBorderRadius: 0,
  },
});

export function App() {
  return (
    <div className="avert-container">
      <ErrorBoundary>
        <PanelTabs />
        <Panels />
        <ModalDialog />
      </ErrorBoundary>
    </div>
  );
}
