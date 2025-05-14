import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppSelector } from "@/redux/index";

/** Boolean check if provided input value exists or is not zero */
function inputExists(value: string) {
  return value !== "" && value !== "0";
}

function ResultsImpactsInputsContent() {
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useAppSelector(({ impacts }) => impacts.selectOptions);
  const combinedSectorsEmissionsData = useAppSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );

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
    utilityStorage,
    rooftopStorage,
    maxAnnualDischargeCycles,
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    shortHaulTrucks,
    comboLongHaulTrucks,
    refuseTrucks,
    evDeploymentLocation,
    evModelYear,
    iceReplacementVehicle,
  } = inputs;

  const {
    maxAnnualDischargeCyclesOptions,
    evModelYearOptions,
    iceReplacementVehicleOptions,
    evDeploymentLocationOptions,
  } = selectOptions;

  const evInputsNotEmpty =
    inputExists(batteryEVs) ||
    inputExists(hybridEVs) ||
    inputExists(transitBuses) ||
    inputExists(schoolBuses) ||
    inputExists(shortHaulTrucks) ||
    inputExists(comboLongHaulTrucks) ||
    inputExists(refuseTrucks);

  const esInputsNotEmpty =
    inputExists(utilityStorage) || inputExists(rooftopStorage);

  if (!combinedSectorsEmissionsData) return null;

  const maxAnnualDischargeCyclesName = maxAnnualDischargeCyclesOptions.find(
    (opt) => opt.id === maxAnnualDischargeCycles,
  )?.name;

  const evDeploymentLocationName = evDeploymentLocationOptions.find((opt) => {
    return opt.id === evDeploymentLocation;
  })?.name;

  const evModelYearName = evModelYearOptions.find((opt) => {
    return opt.id === evModelYear;
  })?.name;

  const iceReplacementVehicleName = iceReplacementVehicleOptions.find((opt) => {
    return opt.id === iceReplacementVehicle;
  })?.name;

  return (
    <div className={clsx("avert-box", "padding-105")}>
      <h3
        className={clsx(
          "avert-box-heading",
          "font-serif-2xs line-height-serif-2",
        )}
      >
        Energy Impacts Inputs:
      </h3>

      <div className={clsx("avert-columns")}>
        {inputExists(annualGwhReduction) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Reduce total annual generation by:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {annualGwhReduction}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>GWh</span>
          </p>
        )}

        {inputExists(hourlyMwReduction) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Reduce hourly generation by:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {hourlyMwReduction}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>MW</span>
          </p>
        )}

        {inputExists(broadProgramReduction) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              <em>Broad-based program:</em> Reduce generation by:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {broadProgramReduction}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>
              %&nbsp;in&nbsp;all&nbsp;hours
            </span>
          </p>
        )}

        {(inputExists(targetedProgramReduction) || inputExists(topHours)) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              <em>Targeted program:</em> Reduce generation by:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {targetedProgramReduction}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>
              %&nbsp;during&nbsp;the&nbsp;peak:{" "}
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>{topHours}</span>{" "}
            <span className={clsx("font-sans-3xs")}>%&nbsp;of&nbsp;hours</span>
          </p>
        )}

        {inputExists(onshoreWind) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Onshore wind total capacity:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {onshoreWind}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>MW</span>
          </p>
        )}

        {inputExists(offshoreWind) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Offshore wind total capacity:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {offshoreWind}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>MW</span>
          </p>
        )}

        {inputExists(utilitySolar) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Utility-scale solar PV total capacity:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {utilitySolar}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>MW</span>
          </p>
        )}

        {inputExists(rooftopSolar) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Distributed (rooftop) solar PV total capacity:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {rooftopSolar}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>MW</span>
          </p>
        )}

        {inputExists(batteryEVs) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Light-duty battery EVs:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>{batteryEVs}</span>
          </p>
        )}

        {inputExists(hybridEVs) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Light-duty plug-in hybrid EVs:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>{hybridEVs}</span>
          </p>
        )}

        {inputExists(transitBuses) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Electric transit buses:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {transitBuses}
            </span>
          </p>
        )}

        {inputExists(schoolBuses) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Electric school buses:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {schoolBuses}
            </span>
          </p>
        )}

        {inputExists(shortHaulTrucks) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>Short-haul trucks:</span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {shortHaulTrucks}
            </span>
          </p>
        )}

        {inputExists(comboLongHaulTrucks) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Combination long-haul trucks:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {comboLongHaulTrucks}
            </span>
          </p>
        )}

        {inputExists(refuseTrucks) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>Refuse trucks:</span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {refuseTrucks}
            </span>
          </p>
        )}

        {evInputsNotEmpty && evDeploymentLocationName && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Location of EV deployment:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {evDeploymentLocationName}
            </span>
          </p>
        )}

        {evInputsNotEmpty && evModelYearName && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>EV model year:</span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {evModelYearName}
            </span>
          </p>
        )}

        {evInputsNotEmpty && iceReplacementVehicleName && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              ICE vehicles being replaced:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {iceReplacementVehicleName}
            </span>
          </p>
        )}

        {inputExists(utilityStorage) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Utility-scale storage capacity (paired with PV):
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {utilityStorage}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>MW</span>
          </p>
        )}

        {inputExists(rooftopStorage) && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Distributed storage capacity (paired with PV):
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {rooftopStorage}
            </span>{" "}
            <span className={clsx("font-sans-3xs")}>MW</span>
          </p>
        )}

        {esInputsNotEmpty && maxAnnualDischargeCyclesName && (
          <p className={clsx("margin-0 padding-top-1 line-height-sans-2")}>
            <span className={clsx("font-sans-2xs")}>
              Maximum allowable discharge cycles per year:
            </span>{" "}
            <span className={clsx("font-mono-xs text-bold")}>
              {maxAnnualDischargeCyclesName}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

export function ResultsImpactsInputs() {
  return (
    <ErrorBoundary
      message={
        <>
          Error loading impacts inputs display. Please contact AVERT support at{" "}
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
      <ResultsImpactsInputsContent />
    </ErrorBoundary>
  );
}
