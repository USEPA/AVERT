import { ReactNode } from 'react';
// —-
import { ErrorBoundary } from 'app/components/ErrorBoundary';
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import type { EmissionsReplacements } from 'app/redux/reducers/results';
import type { CombinedSectorsEmissionsData } from 'app/calculations/emissions';

type AnnualMonthlyData = ReturnType<typeof setAnnualMonthlyData>;

/**
 * Round number to the nearest 10 and conditionally display '—' if number is
 * within 10 of zero.
 */
function formatNumber(number: number) {
  if (number < 10 && number > -10) return '—';
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

/**
 * Calculate numerator ÷ denominator, formatted to three decimal places, but
 * display '—' if the denominator is zero.
 */
function calculateNumber(numerator: number, denominator: number) {
  return denominator !== 0 ? (numerator / denominator).toFixed(3) : '—';
}

/**
 * Sum the the total annual original, post-EERE, and impacts (difference between
 * the two) values from the monthly values for each field (pollutant).
 *
 * NOTE: normally we'd just use the annual data from each field, but we need
 * to use the monthly data for ozone season generation and ozone season nox, so
 * we might as well build up every field from their monthly values.
 */
function setAnnualMonthlyData(
  combinedSectorsEmissionsData: CombinedSectorsEmissionsData,
) {
  if (!combinedSectorsEmissionsData) {
    return {
      generation: { original: 0, postEere: 0, impacts: 0 },
      ozoneGeneration: { original: 0, postEere: 0, impacts: 0 },
      so2: { original: 0, postEere: 0, impacts: 0 },
      nox: { original: 0, postEere: 0, impacts: 0 },
      ozoneNox: { original: 0, postEere: 0, impacts: 0 },
      co2: { original: 0, postEere: 0, impacts: 0 },
      pm25: { original: 0, postEere: 0, impacts: 0 },
      vocs: { original: 0, postEere: 0, impacts: 0 },
      nh3: { original: 0, postEere: 0, impacts: 0 },
    };
  }

  const result = Object.entries(combinedSectorsEmissionsData.total).reduce(
    (object, [key, value]) => {
      const field = key as keyof typeof combinedSectorsEmissionsData.total;
      const totalPowerData = value.power;

      if (totalPowerData) {
        Object.entries(totalPowerData.monthly).forEach(
          ([monthlyKey, monthlyData]) => {
            const month = Number(monthlyKey);
            const { original, postEere } = monthlyData;

            /**
             * Build up ozone season generation and ozone season nox
             * (Ozone season is between May and September)
             */
            if (month >= 5 && month <= 9) {
              if (field === 'generation') {
                object.ozoneGeneration.original += original;
                object.ozoneGeneration.postEere += postEere;
                object.ozoneGeneration.impacts += postEere - original;
              }

              if (field === 'nox') {
                object.ozoneNox.original += original;
                object.ozoneNox.postEere += postEere;
                object.ozoneNox.impacts += postEere - original;
              }
            }

            object[field].original += original;
            object[field].postEere += postEere;
            object[field].impacts += postEere - original;
          },
        );
      }

      return object;
    },
    {
      generation: { original: 0, postEere: 0, impacts: 0 },
      ozoneGeneration: { original: 0, postEere: 0, impacts: 0 },
      so2: { original: 0, postEere: 0, impacts: 0 },
      nox: { original: 0, postEere: 0, impacts: 0 },
      ozoneNox: { original: 0, postEere: 0, impacts: 0 },
      co2: { original: 0, postEere: 0, impacts: 0 },
      pm25: { original: 0, postEere: 0, impacts: 0 },
      vocs: { original: 0, postEere: 0, impacts: 0 },
      nh3: { original: 0, postEere: 0, impacts: 0 },
    },
  );

  return result;
}

/**
 * If "replacement" is needed for a pollutant, we'll change the calculated
 * `original` value for that pollutant to the pollutant's replacement value for
 * the region (found in the config file), and change the `postEere` value to be
 * the sum of the replaced `original` value and the calculated `impacts` value.
 */
function applyEmissionsReplacement(options: {
  annualMonthlyData: AnnualMonthlyData;
  emissionsReplacements: EmissionsReplacements | {};
}) {
  const { annualMonthlyData, emissionsReplacements } = options;
  const result = { ...annualMonthlyData };

  if (Object.keys(emissionsReplacements).length === 0) return result;

  Object.entries(emissionsReplacements).forEach(([key, replacementValue]) => {
    const pollutant = key as keyof typeof annualMonthlyData;

    const pollutantData = annualMonthlyData[pollutant];

    if (pollutantData) {
      pollutantData.original = replacementValue;
      pollutantData.postEere = replacementValue + pollutantData.impacts;
    }
  });

  return result;
}

function EmissionsReplacementTooltip(props: {
  field: 'generation' | 'so2' | 'nox' | 'co2';
}) {
  const { field } = props;

  // prettier-ignore
  const fieldMarkup = new Map<'generation' | 'so2' | 'nox' | 'co2', ReactNode>()
    .set('generation', <>Generation</>)
    .set('so2', <>SO<sub>2</sub></>)
    .set('nox', <>NO<sub>X</sub></>)
    .set('co2', <>CO<sub>2</sub></>);

  return (
    <Tooltip id={`power-sector-${field}-infrequent-emissions-event`}>
      <p className="margin-0">
        This region features one or more power plants with an infrequent{' '}
        {fieldMarkup.get(field)} emissions event. {fieldMarkup.get(field)}{' '}
        emissions changes from these plants are not included in this analysis.
        See Section 2 of the{' '}
        <a className="usa-link" href="https://www.epa.gov/avert">
          AVERT User Manual
        </a>{' '}
        for more information.
      </p>
    </Tooltip>
  );
}

function PowerEmissionsTableContent() {
  const inputs = useTypedSelector(({ eere }) => eere.inputs);
  const combinedSectorsEmissionsData = useTypedSelector(
    ({ results }) => results.combinedSectorsEmissionsData,
  );
  const emissionsReplacements = useTypedSelector(
    ({ results }) => results.emissionsReplacements,
  );

  const annualMonthlyData = setAnnualMonthlyData(combinedSectorsEmissionsData);

  const data = applyEmissionsReplacement({
    annualMonthlyData,
    emissionsReplacements,
  });

  const { batteryEVs, hybridEVs, transitBuses, schoolBuses } = inputs;

  const evInputsEmpty =
    (batteryEVs === '' || batteryEVs === '0') &&
    (hybridEVs === '' || hybridEVs === '0') &&
    (transitBuses === '' || transitBuses === '0') &&
    (schoolBuses === '' || schoolBuses === '0');

  const {
    generation,
    ozoneGeneration,
    so2,
    nox,
    ozoneNox,
    co2,
    pm25,
    vocs,
    nh3,
  } = data;

  if (!combinedSectorsEmissionsData) return null;

  return (
    <>
      <div className="overflow-auto">
        <div className="avert-table-container">
          <table className="avert-table avert-table-striped width-full">
            <thead>
              <tr>
                <th>&nbsp;</th>
                <th className="text-right">Original</th>
                <th className="text-right">Post-EE/RE</th>
                <th className="text-right">EE/RE Impacts</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <span className="padding-left-105">
                    Generation <small>(MWh)</small>&nbsp;
                    {emissionsReplacements.hasOwnProperty('generation') && (
                      <EmissionsReplacementTooltip field="generation" />
                    )}
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(generation.original)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(generation.postEere)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(generation.impacts)}
                </td>
              </tr>

              <tr>
                <td colSpan={4} className="text-bold">
                  Total Emissions from Fossil Generation Fleet
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    SO<sub>2</sub> <small>(lb)</small>&nbsp;
                    {emissionsReplacements.hasOwnProperty('so2') && (
                      <EmissionsReplacementTooltip field="so2" />
                    )}
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(so2.original)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(so2.postEere)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(so2.impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb)</small>&nbsp;
                    {emissionsReplacements.hasOwnProperty('nox') && (
                      <EmissionsReplacementTooltip field="nox" />
                    )}
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nox.original)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nox.postEere)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nox.impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-3 text-italic">
                    Ozone season NO<sub>X</sub> <small>(lb)</small>{' '}
                    <Tooltip id="power-sector-ozone-season-nox-total">
                      <p className="margin-0 text-no-italic">
                        Ozone season is defined as May 1 — September 30. Ozone
                        season emissions are a subset of annual emissions.
                      </p>
                    </Tooltip>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(ozoneNox.original)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(ozoneNox.postEere)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(ozoneNox.impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    CO<sub>2</sub> <small>(tons)</small>&nbsp;
                    {emissionsReplacements.hasOwnProperty('co2') && (
                      <EmissionsReplacementTooltip field="co2" />
                    )}
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(co2.original)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(co2.postEere)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(co2.impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(pm25.original)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(pm25.postEere)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(pm25.impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(vocs.original)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(vocs.postEere)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(vocs.impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nh3.original)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nh3.postEere)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nh3.impacts)}
                </td>
              </tr>

              <tr>
                <td className="text-bold">AVERT-derived Emission Rates:</td>
                <td className="text-bold text-right">Average Fossil</td>
                <td className="text-bold text-right">&nbsp;</td>
                <td className="text-bold text-right">Marginal Fossil</td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    SO<sub>2</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {calculateNumber(so2.original, generation.original)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {evInputsEmpty ? (
                    calculateNumber(so2.impacts, generation.impacts)
                  ) : (
                    <span className="font-sans-2xs text-italic">Ø</span>
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {calculateNumber(nox.original, generation.original)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {evInputsEmpty ? (
                    calculateNumber(nox.impacts, generation.impacts)
                  ) : (
                    <span className="font-sans-2xs text-italic">Ø</span>
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-3 text-italic">
                    Ozone season NO<sub>X</sub> <small>(lb/MWh)</small>{' '}
                    <Tooltip id="power-sector-ozone-season-nox-rates">
                      <p className="margin-0 text-no-italic">
                        Ozone season is defined as May 1 — September 30. Ozone
                        season emissions are a subset of annual emissions.
                      </p>
                    </Tooltip>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {calculateNumber(ozoneNox.original, ozoneGeneration.original)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {evInputsEmpty ? (
                    calculateNumber(ozoneNox.impacts, ozoneGeneration.impacts)
                  ) : (
                    <span className="font-sans-2xs text-italic">Ø</span>
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    CO<sub>2</sub> <small>(tons/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {calculateNumber(co2.original, generation.original)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {evInputsEmpty ? (
                    calculateNumber(co2.impacts, generation.impacts)
                  ) : (
                    <span className="font-sans-2xs text-italic">Ø</span>
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {calculateNumber(pm25.original, generation.original)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {evInputsEmpty ? (
                    calculateNumber(pm25.impacts, generation.impacts)
                  ) : (
                    <span className="font-sans-2xs text-italic">Ø</span>
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {calculateNumber(vocs.original, generation.original)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {evInputsEmpty ? (
                    calculateNumber(vocs.impacts, generation.impacts)
                  ) : (
                    <span className="font-sans-2xs text-italic">Ø</span>
                  )}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {calculateNumber(nh3.original, generation.original)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {evInputsEmpty ? (
                    calculateNumber(nh3.impacts, generation.impacts)
                  ) : (
                    <span className="font-sans-2xs text-italic">Ø</span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ul className="margin-top-2 margin-bottom-0 font-sans-3xs line-height-sans-3 text-base-dark">
        <li>Negative numbers indicate displaced generation and emissions.</li>
        <li>All results are rounded to the nearest ten.</li>
        <li>
          A dash (“&thinsp;—&thinsp;”) indicates a result greater than zero, but
          lower than the level of reportable significance.
        </li>
        <li>
          When users evaluate a portfolio scenario including EVs and EE or RE,
          marginal fossil values are not reported and a null sign (“&thinsp;
          <span className="text-italic">Ø</span>&thinsp;”) is shown.
        </li>
        <li>
          Data does not include changes to ICE vehicle emissions (e.g.,
          emissions from tailpipes).
        </li>
      </ul>

      <p className="display-none">
        {/* NOTE: hidden paragraph is intentional to get around EPA's
         * `ul:last-child { margin-bottom: revert; }` style
         */}
      </p>
    </>
  );
}

export function PowerEmissionsTable() {
  return (
    <ErrorBoundary
      message={
        <>
          Error loading power sector emissions table. Please contact AVERT
          support at{' '}
          <a className="usa-link" href="mailto:avert@epa.gov">
            avert@epa.gov
          </a>
        </>
      }
    >
      <PowerEmissionsTableContent />
    </ErrorBoundary>
  );
}
