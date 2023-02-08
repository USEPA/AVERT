import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { useTypedSelector } from 'app/redux/index';
import type { RegionalLoadData } from 'app/redux/reducers/geography';

function EquivalentHomesText(props: { hourlyEere: number[] }) {
  const { hourlyEere } = props;

  const totalLoadMwh = hourlyEere.reduce((a, b) => a + b, 0);
  const totalLoadGwh = Math.round(totalLoadMwh / -1_000);

  /**
   * the annual kwh of electricity used by the average american home is 12,146
   */
  const equivalentHomes = Math.round((totalLoadMwh / 12_146) * -1_000);

  return (
    <p className="margin-top-2 text-base-dark">
      This EE/RE profile will {totalLoadMwh < 0 ? 'displace' : 'add'}{' '}
      <strong>{Math.abs(totalLoadGwh).toLocaleString()} GWh</strong> of regional
      fossil fuel generation over the course of a year. For reference, this
      equals the annual electricity consumed by{' '}
      <strong>{Math.abs(equivalentHomes).toLocaleString()}</strong> average
      homes in the United States.
    </p>
  );
}

function ValidationMessage(props: {
  type: 'error' | 'warning';
  value: number;
  timestamp: RegionalLoadData;
}) {
  const { type, value, timestamp } = props;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const month = months[timestamp.month - 1];
  const day = timestamp.day;
  const hour =
    timestamp.hour === 0
      ? 12
      : timestamp.hour > 12
      ? timestamp.hour - 12
      : timestamp.hour;
  const ampm = timestamp.hour > 12 ? 'PM' : 'AM';
  const percentage = value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div className={`usa-alert usa-alert--${type} margin-bottom-0`}>
      <div className="usa-alert__body">
        <h4 className="usa-alert__heading">
          {type === 'error' ? 'ERROR' : 'WARNING'}
        </h4>
        <p>
          The combined impact of your proposed programs would displace more than{' '}
          <strong>{type === 'error' ? '30' : '15'}%</strong> of regional fossil
          generation in at least one hour of the year.&nbsp;&nbsp;
          <em>
            (Maximum value: <strong>{percentage}</strong>% on{' '}
            <strong>
              {month} {day} at {hour}:00 {ampm}
            </strong>
            ).
          </em>
        </p>

        <p className="margin-0">
          The recommended limit for AVERT is 15%, as AVERT is designed to
          simulate marginal operational changes in load, rather than large-scale
          changes that may change fundamental dynamics. Please reduce one or
          more of your inputs to ensure more reliable results.
        </p>
      </div>
    </div>
  );
}

export function EVWarningMessage() {
  const constantMwh = useTypedSelector(({ eere }) => eere.inputs.constantMwh);
  const annualGwh = useTypedSelector(({ eere }) => eere.inputs.annualGwh);
  const broadProgram = useTypedSelector(({ eere }) => eere.inputs.broadProgram);
  const reduction = useTypedSelector(({ eere }) => eere.inputs.reduction);
  const topHours = useTypedSelector(({ eere }) => eere.inputs.topHours);
  const onshoreWind = useTypedSelector(({ eere }) => eere.inputs.onshoreWind);
  const offshoreWind = useTypedSelector(({ eere }) => eere.inputs.offshoreWind);
  const utilitySolar = useTypedSelector(({ eere }) => eere.inputs.utilitySolar);
  const rooftopSolar = useTypedSelector(({ eere }) => eere.inputs.rooftopSolar);
  const batteryEVs = useTypedSelector(({ eere }) => eere.inputs.batteryEVs);
  const hybridEVs = useTypedSelector(({ eere }) => eere.inputs.hybridEVs);
  const transitBuses = useTypedSelector(({ eere }) => eere.inputs.transitBuses);
  const schoolBuses = useTypedSelector(({ eere }) => eere.inputs.schoolBuses);

  const eeInputsEmpty =
    (constantMwh === '' || constantMwh === '0') &&
    (annualGwh === '' || annualGwh === '0') &&
    (broadProgram === '' || broadProgram === '0') &&
    (reduction === '' || reduction === '0') &&
    (topHours === '' || topHours === '0');

  const reInputsEmpty =
    (onshoreWind === '' || onshoreWind === '0') &&
    (offshoreWind === '' || offshoreWind === '0') &&
    (utilitySolar === '' || utilitySolar === '0') &&
    (rooftopSolar === '' || rooftopSolar === '0');

  const evInputsEmpty =
    (batteryEVs === '' || batteryEVs === '0') &&
    (hybridEVs === '' || hybridEVs === '0') &&
    (transitBuses === '' || transitBuses === '0') &&
    (schoolBuses === '' || schoolBuses === '0');

  if (eeInputsEmpty && reInputsEmpty && !evInputsEmpty) {
    return (
      <div className="usa-alert usa-alert--warning">
        <div className="usa-alert__body">
          <h4 className="usa-alert__heading">WARNING</h4>
          <p>
            <strong>
              You have entered a quantity of EVs, but have not entered any
              energy efficiency or renewable energy.
            </strong>
          </p>

          <p>
            Recent trends show significant amounts of energy efficiency and
            renewables coming online. Consider adding these resources alongside
            EVs in order to examine the portfolio effects of adding multiple
            resources at the same time. The “EE/RE and EV Comparison” table
            above summarizes recent historical ERE additions and compares these
            with the EERE required to offset your entered EV demand.
          </p>

          <p>
            For more ideas on how to model EVs in AVERT, see Appendix J in the
            AVERT user manual.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function EEREMessagesContent() {
  const softValid = useTypedSelector(
    ({ eere }) => eere.combinedProfile.softValid,
  );
  const softTopExceedanceValue = useTypedSelector(
    ({ eere }) => eere.combinedProfile.softTopExceedanceValue,
  );
  const softTopExceedanceTimestamp = useTypedSelector(
    ({ eere }) => eere.combinedProfile.softTopExceedanceTimestamp,
  );
  const hardValid = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hardValid,
  );
  const hardTopExceedanceValue = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hardTopExceedanceValue,
  );
  const hardTopExceedanceTimestamp = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hardTopExceedanceTimestamp,
  );
  const hourlyEere = useTypedSelector(
    ({ eere }) => eere.combinedProfile.hourlyEere,
  );

  if (hourlyEere?.length === 0) return null;

  return (
    <>
      <EquivalentHomesText hourlyEere={hourlyEere} />

      <EVWarningMessage />

      {!hardValid && (
        <ValidationMessage
          type="error"
          value={hardTopExceedanceValue}
          timestamp={hardTopExceedanceTimestamp}
        />
      )}

      {hardValid && !softValid && (
        <ValidationMessage
          type="warning"
          value={softTopExceedanceValue}
          timestamp={softTopExceedanceTimestamp}
        />
      )}
    </>
  );
}

export function EEREMessages() {
  return (
    <ErrorBoundary
      message={
        <>
          EE/RE Impacts messages error. Please contact AVERT support at{' '}
          <a className="usa-link" href="mailto:avert@epa.gov">
            avert@epa.gov
          </a>
        </>
      }
    >
      <EEREMessagesContent />
    </ErrorBoundary>
  );
}
