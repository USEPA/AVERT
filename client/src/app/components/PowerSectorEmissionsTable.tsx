import { ReactNode } from 'react';
// ---
import { Tooltip } from 'app/components/Tooltip';
import { useTypedSelector } from 'app/redux/index';
import { ReplacementPollutantName } from 'app/redux/reducers/displacement';

function formatNumber(number: number) {
  if (number < 10 && number > -10) return '--';
  const output = Math.round(number / 10) * 10;
  return output.toLocaleString();
}

export function PowerSectorEmissionsTable() {
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const data = useTypedSelector(
    ({ displacement }) => displacement.annualRegionalDisplacements,
  );
  const egusNeedingReplacement = useTypedSelector(
    ({ displacement }) => displacement.egusNeedingReplacement,
  );

  const genOrig = data.generation.replacedOriginal || data.generation.original;
  const genPost = data.generation.replacedPostEere || data.generation.postEere;
  const genImpacts = data.generation.impacts;

  const ozoneGenOrig =
    data.ozoneGeneration.replacedOriginal || data.ozoneGeneration.original;
  // const ozoneGenPost =
  //   data.ozoneGeneration.replacedPostEere || data.ozoneGeneration.postEere;
  const ozoneGenImpacts = data.ozoneGeneration.impacts;

  const so2Orig = data.so2.replacedOriginal || data.so2.original;
  const so2Post = data.so2.replacedPostEere || data.so2.postEere;
  const so2Impacts = data.so2.impacts;

  const noxOrig = data.nox.replacedOriginal || data.nox.original;
  const noxPost = data.nox.replacedPostEere || data.nox.postEere;
  const noxImpacts = data.nox.impacts;

  const ozoneNoxOrig = data.ozoneNox.replacedOriginal || data.ozoneNox.original;
  const ozoneNoxPost = data.ozoneNox.replacedPostEere || data.ozoneNox.postEere;
  const ozoneNoxImpacts = data.ozoneNox.impacts;

  const co2Orig = data.co2.replacedOriginal || data.co2.original;
  const co2Post = data.co2.replacedPostEere || data.co2.postEere;
  const co2Impacts = data.co2.impacts;

  const pm25Orig = data.pm25.original;
  const pm25Post = data.pm25.postEere;
  const pm25Impacts = data.pm25.impacts;

  const vocsOrig = data.vocs.original;
  const vocsPost = data.vocs.postEere;
  const vocsImpacts = data.vocs.impacts;

  const nh3Orig = data.nh3.original;
  const nh3Post = data.nh3.postEere;
  const nh3Impacts = data.nh3.impacts;

  function replacementTooltip(pollutant: ReplacementPollutantName) {
    // prettier-ignore
    const pollutantMarkup = new Map<ReplacementPollutantName, ReactNode>()
      .set('generation', <>Generation</>)
      .set('so2', <>SO<sub>2</sub></>)
      .set('nox', <>NO<sub>X</sub></>)
      .set('co2', <>CO<sub>2</sub></>);

    return (
      <Tooltip id={`power-sector-${pollutant}-infrequent-emissions-event`}>
        <p className="margin-0">
          This region features one or more power plants with an infrequent{' '}
          {pollutantMarkup.get(pollutant)} emissions event.{' '}
          {pollutantMarkup.get(pollutant)} emissions changes from these plants
          are not included in this analysis. See Section 2 of the{' '}
          <a className="usa-link" href="https://www.epa.gov/avert">
            AVERT User Manual
          </a>{' '}
          for more information.
        </p>
      </Tooltip>
    );
  }

  if (status !== 'complete') return null;

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
                    {egusNeedingReplacement.generation.length > 0 &&
                      replacementTooltip('generation')}
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(genOrig)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(genPost)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(genImpacts)}
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
                    {egusNeedingReplacement.so2.length > 0 &&
                      replacementTooltip('so2')}
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(so2Orig)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(so2Post)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(so2Impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb)</small>&nbsp;
                    {egusNeedingReplacement.nox.length > 0 &&
                      replacementTooltip('nox')}
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(noxOrig)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(noxPost)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(noxImpacts)}
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
                  {formatNumber(ozoneNoxOrig)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(ozoneNoxPost)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(ozoneNoxImpacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    CO<sub>2</sub> <small>(tons)</small>&nbsp;
                    {egusNeedingReplacement.co2.length > 0 &&
                      replacementTooltip('co2')}
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(co2Orig)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(co2Post)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(co2Impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(pm25Orig)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(pm25Post)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(pm25Impacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(vocsOrig)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(vocsPost)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(vocsImpacts)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nh3Orig)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nh3Post)}
                </td>
                <td className="font-mono-xs text-right">
                  {formatNumber(nh3Impacts)}
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
                  {(so2Orig / genOrig).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(so2Impacts / genImpacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NO<sub>X</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(noxOrig / genOrig).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(noxImpacts / genImpacts).toFixed(3)}
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
                  {(ozoneNoxOrig / ozoneGenOrig).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(ozoneNoxImpacts / ozoneGenImpacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    CO<sub>2</sub> <small>(tons/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(co2Orig / genOrig).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(co2Impacts / genImpacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    PM<sub>2.5</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(pm25Orig / genOrig).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(pm25Impacts / genImpacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    VOCs <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(vocsOrig / genOrig).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(vocsImpacts / genImpacts).toFixed(3)}
                </td>
              </tr>

              <tr>
                <td>
                  <span className="padding-left-105">
                    NH<sub>3</sub> <small>(lb/MWh)</small>
                  </span>
                </td>
                <td className="font-mono-xs text-right">
                  {(nh3Orig / genOrig).toFixed(3)}
                </td>
                <td className="font-mono-xs text-right">&nbsp;</td>
                <td className="font-mono-xs text-right">
                  {(nh3Impacts / genImpacts).toFixed(3)}
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
