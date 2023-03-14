import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { ImpactsTextInput } from 'app/components/ImpactsTextInput';
import { ImpactsSelectInput } from 'app/components/ImpactsSelectInput';
import { useTypedSelector } from 'app/redux/index';

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

  if (!combinedSectorsEmissionsData) return null;

  return (
    <div className="avert-box padding-105">
      <h3 className="avert-box-heading font-serif-md">Energy Impacts Inputs</h3>

      <div className="font-sans-xs">
        <div className="margin-top-105">
          <p className="avert-blue margin-0 text-bold">Energy Efficiency</p>

          {eeInputsEmpty ? (
            <p>No energy efficiency inputs entered.</p>
          ) : (
            <>
              <div className="tablet:display-flex">
                <div className="flex-1 tablet:margin-right-2">
                  <ImpactsTextInput
                    label={<>Reduce total annual generation by:</>}
                    ariaLabel="Number of GWh expected to be saved in a single year"
                    suffix="GWh"
                    value={annualGwh}
                    fieldName="annualGwh"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>

                <div className="flex-1 tablet:margin-left-2">
                  <ImpactsTextInput
                    className="margin-top-1 tablet:margin-top-0"
                    label={<>Reduce hourly generation by:</>}
                    ariaLabel="Constant reduction for every hour of the year, in MW"
                    suffix="MW"
                    value={constantMwh}
                    fieldName="constantMwh"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>
              </div>

              <div className="tablet:display-flex">
                <div className="flex-1 tablet:margin-right-2">
                  <ImpactsTextInput
                    label={
                      <>
                        <em>Broad-based program:</em> Reduce generation by:
                      </>
                    }
                    ariaLabel="Load reduction percentage applied to all hours of the year"
                    suffix="%&nbsp;in&nbsp;all&nbsp;hours"
                    value={broadProgram}
                    fieldName="broadProgram"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>

                <div className="flex-1 tablet:margin-left-2">
                  <ImpactsTextInput
                    className="margin-top-1 tablet:margin-top-0"
                    label={
                      <>
                        <em>Targeted program:</em> Reduce generation by:
                      </>
                    }
                    ariaLabel="Load reduction (as a fraction of peaking load) that would be targeted"
                    suffix="%&nbsp;during&nbsp;the&nbsp;peak:&nbsp;&nbsp;"
                    value={reduction}
                    fieldName="reduction"
                    disabled="true"
                    onChange={(value) => {}}
                  />

                  <ImpactsTextInput
                    ariaLabel="Fraction of high-demand hours that the program is expected to affect"
                    suffix="%&nbsp;of&nbsp;hours"
                    value={topHours}
                    fieldName="topHours"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="margin-top-105">
          <p className="avert-blue margin-0 text-bold">Renewable Energy</p>

          {reInputsEmpty ? (
            <p>No renewable energy inputs entered.</p>
          ) : (
            <>
              <div className="tablet:display-flex">
                <div className="flex-1 tablet:margin-right-2">
                  <ImpactsTextInput
                    label={<>Onshore wind total capacity:</>}
                    ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                    suffix="MW"
                    value={onshoreWind}
                    fieldName="onshoreWind"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>

                <div className="flex-1 tablet:margin-left-2">
                  <ImpactsTextInput
                    label={<>Offshore wind total capacity:</>}
                    ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                    suffix="MW"
                    value={offshoreWind}
                    fieldName="offshoreWind"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>
              </div>

              <div className="tablet:display-flex">
                <div className="flex-1 tablet:margin-right-2">
                  <ImpactsTextInput
                    label={<>Utility-scale solar PV total capacity:</>}
                    ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                    suffix="MW"
                    value={utilitySolar}
                    fieldName="utilitySolar"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>

                <div className="flex-1 tablet:margin-left-2">
                  <ImpactsTextInput
                    className="margin-top-1 tablet:margin-top-0"
                    label={<>Distributed (rooftop) solar PV total capacity:</>}
                    ariaLabel="Total capacity (maximum potential electricity generation) in MW"
                    suffix="MW"
                    value={rooftopSolar}
                    fieldName="rooftopSolar"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="margin-top-105">
          <p className="avert-blue margin-0 text-bold">Electric Vehicles</p>

          {evInputsEmpty ? (
            <p>No electric vehicles inputs entered.</p>
          ) : (
            <>
              <div className="tablet:display-flex desktop:margin-right-2">
                <div className="flex-1 tablet:margin-right-2">
                  <ImpactsTextInput
                    label={<>Light-duty battery EVs:</>}
                    ariaLabel="Number of light-duty battery EVs to be added to the road"
                    value={batteryEVs}
                    fieldName="batteryEVs"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>

                <div className="flex-1 tablet:margin-left-2">
                  <ImpactsTextInput
                    className="margin-top-1 tablet:margin-top-0"
                    label={<>Light-duty plug-in hybrid EVs:</>}
                    ariaLabel="Number of light-duty plug-in hybrid EVs to be added to the road"
                    value={hybridEVs}
                    fieldName="hybridEVs"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>
              </div>

              <div className="tablet:display-flex desktop:margin-right-2">
                <div className="flex-1 tablet:margin-right-2">
                  <ImpactsTextInput
                    className="margin-top-1"
                    label={<>Electric transit buses:</>}
                    ariaLabel="Number of electric transit buses to be added to the road"
                    value={transitBuses}
                    fieldName="transitBuses"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>

                <div className="flex-1 tablet:margin-left-2">
                  <ImpactsTextInput
                    className="margin-top-1"
                    label={<>Electric school buses:</>}
                    ariaLabel="Number of electric school buses to be added to the road"
                    value={schoolBuses}
                    fieldName="schoolBuses"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>
              </div>

              <div className="desktop:display-flex">
                <div className="flex-1 desktop:margin-right-2">
                  <ImpactsSelectInput
                    className="margin-top-1"
                    label="Location of EV deployment:"
                    ariaLabel="Location of EV deployment"
                    options={evDeploymentLocationOptions}
                    value={evDeploymentLocation}
                    fieldName="evDeploymentLocation"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>

                <div className="flex-1 desktop:margin-x-2">
                  <ImpactsSelectInput
                    className="margin-top-1"
                    label="EV model year:"
                    ariaLabel="Model year of the modeled electric vehicles"
                    options={evModelYearOptions}
                    value={evModelYear}
                    fieldName="evModelYear"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>

                <div className="flex-1 desktop:margin-left-2">
                  <ImpactsSelectInput
                    className="margin-top-1"
                    label="ICE vehicles being replaced:"
                    ariaLabel="EV to displace a “new” or the average “existing” internal combustion engine vehicle"
                    options={iceReplacementVehicleOptions}
                    value={iceReplacementVehicle}
                    fieldName="iceReplacementVehicle"
                    disabled="true"
                    onChange={(value) => {}}
                  />
                </div>
              </div>
            </>
          )}
        </div>
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
