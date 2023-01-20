import { ReactNode } from 'react';
import type { EmissionsChanges } from 'app/calculations/emissions';
import type { RegionId } from 'app/config';
import { regions } from 'app/config';
// ---
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import { ReplacementPollutantName } from 'app/redux/reducers/displacement';

type EGUsAnnualData = ReturnType<typeof sumEgusAnnualData>;
type EmissionsReplacements = ReturnType<typeof setEmissionsReplacements>;

function formatNumber(number: number) {
  if (number < 10 && number > -10) return '--';
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

/**
 * Sum the provided EGUs emissions data into total annual original, post-EERE,
 * and impacts (difference between the two) values for each pollutant.
 */
function sumEgusAnnualData(egus: EmissionsChanges) {
  if (Object.keys(egus).length === 0) {
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

  const result = Object.values(egus).reduce(
    (object, eguData) => {
      Object.entries(eguData.data).forEach(([key, annualData]) => {
        const pollutant = key as keyof EmissionsChanges[string]['data'];

        Object.entries(annualData).forEach(([key, monthlyData]) => {
          const month = Number(key);
          const { original, postEere } = monthlyData;

          /**
           * Build up ozone season generation and ozone season nox
           * (Ozone season is between May and September)
           */
          if (month >= 5 && month <= 9) {
            if (pollutant === 'generation') {
              object.ozoneGeneration.original += original;
              object.ozoneGeneration.postEere += postEere;
              object.ozoneGeneration.impacts += postEere - original;
            }

            if (pollutant === 'nox') {
              object.ozoneNox.original += original;
              object.ozoneNox.postEere += postEere;
              object.ozoneNox.impacts += postEere - original;
            }
          }

          object[pollutant].original += original;
          object[pollutant].postEere += postEere;
          object[pollutant].impacts += postEere - original;
        });
      });

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
 * An EGU is marked as needing emissions "replacement" if it's `emissionsFlag`
 * array isn't empty. In calculating the emissions changes (via the server app's
 * `calculateEmissionsChanges()` function), a pollutant that needs replacement
 * will have the `infreq_emissions_flag` property's value of 1 for the given
 * given in the region's RDF.
 */
function getEgusNeedingEmissionsReplacement(egus: EmissionsChanges) {
  if (Object.keys(egus).length === 0) return {};

  const result = Object.entries(egus).reduce((object, [eguId, eguData]) => {
    if (eguData.emissionsFlags.length !== 0) {
      object[eguId] = eguData;
    }

    return object;
  }, {} as EmissionsChanges);

  return result;
}

/**
 * Build up emissions replacement values for each pollutant from provided EGUs
 * needing emissions replacement, and the region's actual emissions value for
 * that particular pollutant.
 */
function setEmissionsReplacements(egus: EmissionsChanges) {
  type EmissionsFlagsField = EmissionsChanges[string]['emissionsFlags'][number];

  if (Object.keys(egus).length === 0) {
    return {} as { [pollutant in EmissionsFlagsField]: number };
  }

  const replacementsByRegion = Object.values(egus).reduce(
    (object, egu) => {
      const regionId = egu.region as RegionId;

      egu.emissionsFlags.forEach((pollutant) => {
        object[pollutant] ??= {};
        object[pollutant][regionId] = regions[regionId].actualEmissions[pollutant]; // prettier-ignore
      });

      return object;
    },
    {} as {
      [pollutant in EmissionsFlagsField]: Partial<{
        [regionId in RegionId]: number;
      }>;
    },
  );

  const result = Object.entries(replacementsByRegion).reduce(
    (object, [key, regionData]) => {
      const pollutant = key as EmissionsFlagsField;
      object[pollutant] = Object.values(regionData).reduce((a, b) => (a += b));
      return object;
    },
    {} as { [pollutant in EmissionsFlagsField]: number },
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
  emissionsReplacements: EmissionsReplacements;
  egusAnnualData: EGUsAnnualData;
}) {
  const { emissionsReplacements, egusAnnualData } = options;
  const result = { ...egusAnnualData };

  if (Object.keys(emissionsReplacements).length === 0) return result;

  Object.entries(emissionsReplacements).forEach(([key, replacementValue]) => {
    const pollutant = key as keyof typeof egusAnnualData;

    const pollutantData = egusAnnualData[pollutant];

    if (pollutantData) {
      pollutantData.original = replacementValue;
      pollutantData.postEere = replacementValue + pollutantData.impacts;
    }
  });

  return result;
}

function EmissionsReplacementTooltip(props: {
  field: ReplacementPollutantName;
}) {
  const { field } = props;

  // prettier-ignore
  const fieldMarkup = new Map<ReplacementPollutantName, ReactNode>()
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

export function PowerSectorEmissionsTable() {
  const emissionsChanges = useTypedSelector(
    ({ results }) => results.emissionsChanges,
  );

  const egusAnnualData = sumEgusAnnualData(emissionsChanges.data);

  const egusNeedingEmissionsReplacement = getEgusNeedingEmissionsReplacement(
    emissionsChanges.data,
  );

  const emissionsReplacements = setEmissionsReplacements(
    egusNeedingEmissionsReplacement,
  );

  const annualData = applyEmissionsReplacement({
    emissionsReplacements,
    egusAnnualData,
  });

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
  } = annualData;

  if (emissionsChanges.status !== 'success') return null;

  return (
    <>
      <div className="overflow-auto">
        <div className="avert-table-container">
          <table className="avert-table width-full">
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
                    {emissionsReplacements.generation !== undefined && (
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
                    {emissionsReplacements.so2 !== undefined && (
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
                    {emissionsReplacements.nox !== undefined && (
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
                    {emissionsReplacements.co2 !== undefined && (
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
                  {(so2.original / generation.original).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(so2.impacts / generation.impacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(nox.original / generation.original).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(nox.impacts / generation.impacts).toFixed(3)}
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
                  {(ozoneNox.original / ozoneGeneration.original).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(ozoneNox.impacts / ozoneGeneration.impacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    CO<sub>2</sub> <small>(tons/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(co2.original / generation.original).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(co2.impacts / generation.impacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(pm25.original / generation.original).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(pm25.impacts / generation.impacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(vocs.original / generation.original).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(vocs.impacts / generation.impacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(nh3.original / generation.original).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(nh3.impacts / generation.impacts).toFixed(3)}
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
          A dash (“–”) indicates a result greater than zero, but lower than the
          level of reportable significance.
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
