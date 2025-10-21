import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppSelector } from "@/redux/index";
import { type HourlyChangesValidation } from "@/calculations/impacts";
import { averageAnnualElectricityUsePerUSHome } from "@/config";

function EquivalentHomesText(props: { hourlyChanges: number[] }) {
  const { hourlyChanges } = props;

  const totalLoadMwh = hourlyChanges.reduce((a, b) => a + b, 0);
  const totalLoadGwh = Math.round(totalLoadMwh / -1_000);

  const equivalentHomes = Math.round(
    (totalLoadMwh / averageAnnualElectricityUsePerUSHome) * -1_000,
  );

  return (
    <p className={clsx("margin-top-2 text-base-dark")}>
      This load profile will {totalLoadMwh < 0 ? "displace" : "add"}{" "}
      <strong>{Math.abs(totalLoadGwh).toLocaleString()} GWh</strong> of regional
      fossil fuel generation over the course of a year. For reference, this
      equals the annual electricity consumed by{" "}
      <strong>{Math.abs(equivalentHomes).toLocaleString()}</strong> average
      homes in the United States.
    </p>
  );
}

function ValidationMessage(props: {
  direction: "upper" | "lower";
  severity: "error" | "warning";
  exceedanceData: HourlyChangesValidation[keyof HourlyChangesValidation];
}) {
  const { direction, severity, exceedanceData } = props;

  if (!exceedanceData) return null;

  const {
    regionName,
    regionHourlyLimit,
    month,
    day,
    hour,
    percentChange,
    postImpactsLoad,
  } = exceedanceData;

  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month - 1];
  const hourNumber = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const meridiem = hour > 12 ? "PM" : "AM";

  const percentOverRegionalLimit =
    ((postImpactsLoad - regionHourlyLimit) / regionHourlyLimit) * 100;

  const upperLimitPercent = percentOverRegionalLimit.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const lowerLimitPercent = Math.abs(percentChange).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return (
    <div
      className={clsx(`usa-alert usa-alert--${severity}`, "margin-bottom-0")}
    >
      <div className={clsx("usa-alert__body")}>
        <h4 className={clsx("usa-alert__heading")}>
          {severity === "error" ? "ERROR" : "WARNING"}
        </h4>

        {direction === "upper" && (
          <>
            <p className={clsx("margin-top-0")}>
              The combined impact of your proposed programs would exceed the
              range of hourly energy changes that AVERT is able to calculate.
              &nbsp;&nbsp;
              <em>
                (Maximum value: <strong>{upperLimitPercent}</strong>% above the
                maximum calculable load for the {regionName} region on{" "}
                <strong>
                  {monthName} {day} at {hourNumber}:00 {meridiem}
                </strong>
                .)
              </em>
            </p>

            <p className={clsx("margin-0")}>
              Please reduce your electric vehicle inputs or add energy
              efficiency or renewable energy inputs to keep total load within
              the calculable range.
            </p>
          </>
        )}

        {direction === "lower" && (
          <>
            <p className={clsx("margin-top-0")}>
              The combined impact of your proposed programs would displace more
              than <strong>{severity === "error" ? 30 : 15}%</strong> of
              regional fossil generation in at least one hour of the
              year.&nbsp;&nbsp;
              <em>
                (Maximum value: <strong>{lowerLimitPercent}</strong>% on{" "}
                <strong>
                  {monthName} {day} at {hourNumber}:00 {meridiem}
                </strong>
                .)
              </em>
            </p>

            <p className={clsx("margin-0")}>
              The recommended limit for AVERT is 15%, as AVERT is designed to
              simulate marginal operational changes in load, rather than
              large-scale changes that may change fundamental dynamics. Please
              reduce one or more of your energy efficiency or renewable energy
              inputs to ensure more reliable results.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function EVWarningMessage() {
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);

  const {
    annualGwhReduction,
    hourlyMwReduction,
    broadProgramReduction,
    targetedProgramReduction,
    topHours,
    onshoreWind,
    offshoreWind,
    utilitySolar,
    rooftopSolar,
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    shortHaulTrucks,
    comboLongHaulTrucks,
    refuseTrucks,
  } = inputs;

  const eeInputsEmpty =
    (annualGwhReduction === "" || annualGwhReduction === "0") &&
    (hourlyMwReduction === "" || hourlyMwReduction === "0") &&
    (broadProgramReduction === "" || broadProgramReduction === "0") &&
    (targetedProgramReduction === "" || targetedProgramReduction === "0") &&
    (topHours === "" || topHours === "0");

  const reInputsEmpty =
    (onshoreWind === "" || onshoreWind === "0") &&
    (offshoreWind === "" || offshoreWind === "0") &&
    (utilitySolar === "" || utilitySolar === "0") &&
    (rooftopSolar === "" || rooftopSolar === "0");

  const evInputsEmpty =
    (batteryEVs === "" || batteryEVs === "0") &&
    (hybridEVs === "" || hybridEVs === "0") &&
    (transitBuses === "" || transitBuses === "0") &&
    (schoolBuses === "" || schoolBuses === "0") &&
    (shortHaulTrucks === "" || shortHaulTrucks === "0") &&
    (comboLongHaulTrucks === "" || comboLongHaulTrucks === "0") &&
    (refuseTrucks === "" || refuseTrucks === "0");

  if (eeInputsEmpty && reInputsEmpty && !evInputsEmpty) {
    return (
      <div className={clsx("usa-alert usa-alert--warning")}>
        <div className={clsx("usa-alert__body")}>
          <h4 className={clsx("usa-alert__heading")}>WARNING</h4>
          <p className={clsx("margin-top-0")}>
            <strong>
              You have entered a quantity of EVs, but have not entered any
              energy efficiency or renewable energy generation.
            </strong>
          </p>

          <p className={clsx("margin-top-0")}>
            Recent trends show significant amounts of energy efficiency and
            renewables coming online. Consider adding these resources alongside
            EVs in order to examine the portfolio effects of adding multiple
            resources at the same time. The “EV Demand Relative to EE/RE Growth”
            table above summarizes recent historical EE/RE additions and
            compares these with the EE/RE required to offset your entered EV
            demand.
          </p>

          <p className={clsx("margin-top-0")}>
            For more ideas on how to model EVs in AVERT, see Appendix J in the{" "}
            <a
              className={clsx("usa-link")}
              href="https://www.epa.gov/avert/avert-user-manual"
              target="_parent"
              rel="noreferrer"
            >
              AVERT user manual
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return null;
}

function ImpactsMessagesContent() {
  const hourlyEnergyProfile = useAppSelector(
    ({ impacts }) => impacts.hourlyEnergyProfile,
  );
  const { data, validation } = hourlyEnergyProfile;
  const totalHourlyChanges = data.total.hourlyChanges;

  if (Object.keys(totalHourlyChanges).length === 0) {
    return null;
  }

  return (
    <>
      <EquivalentHomesText hourlyChanges={Object.values(totalHourlyChanges)} />

      <EVWarningMessage />

      {validation.upperError !== null && (
        <ValidationMessage
          direction="upper"
          severity="error"
          exceedanceData={validation.upperError}
        />
      )}

      {validation.lowerWarning !== null && validation.lowerError === null && (
        <ValidationMessage
          direction="lower"
          severity="warning"
          exceedanceData={validation.lowerWarning}
        />
      )}

      {validation.lowerError !== null && (
        <ValidationMessage
          direction="lower"
          severity="error"
          exceedanceData={validation.lowerError}
        />
      )}
    </>
  );
}

export function ImpactsMessages() {
  return (
    <ErrorBoundary
      message={
        <>
          Energy Impacts messages error. Please contact AVERT support at{" "}
          <a
            className={clsx("usa-link")}
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <ImpactsMessagesContent />
    </ErrorBoundary>
  );
}
