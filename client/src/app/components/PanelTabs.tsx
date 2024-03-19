import { PanelTab } from '@/app/components/PanelTab';
import { useAppSelector } from '@/app/redux/index';

export function PanelTabs() {
  const activeStep = useAppSelector(({ panel }) => panel.activeStep);

  return (
    <nav
      className={
        `overflow-hidden margin-bottom-1 ` +
        `border-width-1px border-solid border-white ` +
        `tablet:border-base-light`
      }
    >
      <ol className="usa-list--unstyled">
        <PanelTab step={1} active={activeStep === 1} title="Select Geography" />
        <PanelTab
          step={2}
          active={activeStep === 2}
          title="Set Energy Impacts"
        />
        <PanelTab step={3} active={activeStep === 3} title="Get Results" />
      </ol>
    </nav>
  );
}
