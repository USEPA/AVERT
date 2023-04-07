import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { useTypedSelector } from 'app/redux/index';

/** Boolean check if provided input value exists or is not zero */
function inputExists(value: string) {
  return value !== '' && value !== '0';
}

function ResultsImpactsInputsContent() {
  const inputs = useTypedSelector(({ impacts }) => impacts.inputs);
  const selectOptions = useTypedSelector(
    ({ impacts }) => impacts.selectOptions,
  );
  const combinedSectorsEmissionsData = useTypedSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );

  const {
    constantMwh,
    annualGwh,
    broadProgram,
    reduction,
    topHours,
    onshoreWind,
    offshoreWind,
    utilitySolar,
    rooftopSolar,
    batteryEVs,
    hybridEVs,
    transitBuses,
    schoolBuses,
    evDeploymentLocation,
    evModelYear,
    iceReplacementVehicle,
  } = inputs;

  const {
    evModelYearOptions,
    iceReplacementVehicleOptions,
    evDeploymentLocationOptions,
  } = selectOptions;

  const evInputsNotEmpty =
    inputExists(batteryEVs) ||
    inputExists(hybridEVs) ||
    inputExists(transitBuses) ||
    inputExists(schoolBuses);

  if (!combinedSectorsEmissionsData) return null;

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
    <div className="avert-box padding-105">
      <p className="avert-box-heading font-serif-2xs line-height-serif-2">
        Energy Impacts Inputs:
      </p>

      <div className="avert-columns">
        {inputExists(annualGwh) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">
              Reduce total annual generation by:
            </span>{' '}
            <span className="font-mono-xs text-bold">{annualGwh}</span>{' '}
            <span className="font-sans-3xs">GWh</span>
          </p>
        )}

        {inputExists(constantMwh) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">Reduce hourly generation by:</span>{' '}
            <span className="font-mono-xs text-bold">{constantMwh}</span>{' '}
            <span className="font-sans-3xs">MW</span>
          </p>
        )}

        {inputExists(broadProgram) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">
              <em>Broad-based program:</em> Reduce generation by:
            </span>{' '}
            <span className="font-mono-xs text-bold">{broadProgram}</span>{' '}
            <span className="font-sans-3xs">%&nbsp;in&nbsp;all&nbsp;hours</span>
          </p>
        )}

        {(inputExists(reduction) || inputExists(topHours)) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">
              <em>Targeted program:</em> Reduce generation by:
            </span>{' '}
            <span className="font-mono-xs text-bold">{reduction}</span>{' '}
            <span className="font-sans-3xs">
              %&nbsp;during&nbsp;the&nbsp;peak:{' '}
            </span>{' '}
            <span className="font-mono-xs text-bold">{topHours}</span>{' '}
            <span className="font-sans-3xs">%&nbsp;of&nbsp;hours</span>
          </p>
        )}

        {inputExists(onshoreWind) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">Onshore wind total capacity:</span>{' '}
            <span className="font-mono-xs text-bold">{onshoreWind}</span>{' '}
            <span className="font-sans-3xs">MW</span>
          </p>
        )}

        {inputExists(offshoreWind) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">Offshore wind total capacity:</span>{' '}
            <span className="font-mono-xs text-bold">{offshoreWind}</span>{' '}
            <span className="font-sans-3xs">MW</span>
          </p>
        )}

        {inputExists(utilitySolar) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">
              Utility-scale solar PV total capacity:
            </span>{' '}
            <span className="font-mono-xs text-bold">{utilitySolar}</span>{' '}
            <span className="font-sans-3xs">MW</span>
          </p>
        )}

        {inputExists(rooftopSolar) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">
              Distributed (rooftop) solar PV total capacity:
            </span>{' '}
            <span className="font-mono-xs text-bold">{rooftopSolar}</span>{' '}
            <span className="font-sans-3xs">MW</span>
          </p>
        )}

        {inputExists(batteryEVs) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">Light-duty battery EVs:</span>{' '}
            <span className="font-mono-xs text-bold">{batteryEVs}</span>
          </p>
        )}

        {inputExists(hybridEVs) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">
              Light-duty plug-in hybrid EVs:
            </span>{' '}
            <span className="font-mono-xs text-bold">{hybridEVs}</span>
          </p>
        )}

        {inputExists(transitBuses) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">Electric transit buses:</span>{' '}
            <span className="font-mono-xs text-bold">{transitBuses}</span>
          </p>
        )}

        {inputExists(schoolBuses) && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">Electric school buses:</span>{' '}
            <span className="font-mono-xs text-bold">{schoolBuses}</span>
          </p>
        )}

        {evInputsNotEmpty && evDeploymentLocationName && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">Location of EV deployment:</span>{' '}
            <span className="font-mono-xs text-bold">
              {evDeploymentLocationName}
            </span>
          </p>
        )}

        {evInputsNotEmpty && evModelYearName && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">EV model year:</span>{' '}
            <span className="font-mono-xs text-bold">{evModelYearName}</span>
          </p>
        )}

        {evInputsNotEmpty && iceReplacementVehicleName && (
          <p className="margin-bottom-0 padding-top-1 line-height-sans-2">
            <span className="font-sans-2xs">ICE vehicles being replaced:</span>{' '}
            <span className="font-mono-xs text-bold">
              {iceReplacementVehicleName}
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
          Error loading impacts inputs display. Please contact AVERT support at{' '}
          <a className="usa-link" href="mailto:avert@epa.gov">
            avert@epa.gov
          </a>
        </>
      }
    >
      <ResultsImpactsInputsContent />
    </ErrorBoundary>
  );
}
