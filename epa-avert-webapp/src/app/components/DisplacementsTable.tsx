/** @jsx jsx */

import React from 'react';
import { jsx, css } from '@emotion/core';
// reducers
import { useTypedSelector } from 'app/redux/index';
// config
import { RegionId } from 'app/config';

const rowLabelStyles = css`
  padding: 0.375rem 1.25rem !important;
`;

function formatNumber(number: any) {
  if (number < 10 && number > -10) return '--';
  let output = Math.ceil(number / 10) * 10;
  return output.toLocaleString();
}

function DisplacementsTable() {
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const regionalDisplacements = useTypedSelector(
    ({ displacement }) => displacement.regionalDisplacements,
  );

  // add up displacement values from each region
  const generation = { original: 0, post: 0, impact: 0 };
  const so2 = { original: 0, post: 0, impact: 0 };
  const nox = { original: 0, post: 0, impact: 0 };
  const co2 = { original: 0, post: 0, impact: 0 };
  const pm25 = { original: 0, post: 0, impact: 0 };

  for (const regionId in regionalDisplacements) {
    // regional displacement data
    const data = regionalDisplacements[regionId as RegionId];

    generation.original += data?.generation?.original || 0;
    generation.post += data?.generation?.post || 0;
    generation.impact += data?.generation?.impact || 0;

    so2.original += data?.so2?.original || 0;
    so2.post += data?.so2?.post || 0;
    so2.impact += data?.so2?.impact || 0;

    nox.original += data?.nox?.original || 0;
    nox.post += data?.nox?.post || 0;
    nox.impact += data?.nox?.impact || 0;

    co2.original += data?.co2?.original || 0;
    co2.post += data?.co2?.post || 0;
    co2.impact += data?.co2?.impact || 0;

    pm25.original += data?.pm25?.original || 0;
    pm25.post += data?.pm25?.post || 0;
    pm25.impact += data?.pm25?.impact || 0;
  }

  const so2EmissionsOrig = so2.original / generation.original;
  const so2EmissionsPost = so2.post / generation.post;

  const noxEmissionsOrig = nox.original / generation.original;
  const noxEmissionsPost = nox.post / generation.post;

  const co2EmissionsOrig = co2.original / generation.original;
  const co2EmissionsPost = co2.post / generation.post;

  const pm25EmissionsOrig = pm25.original / generation.original;
  const pm25EmissionsPost = pm25.post / generation.post;

  if (status !== 'complete') return null;

  return (
    <React.Fragment>
      <table className="avert-table">
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>Original</th>
            <th>Post-EE/RE</th>
            <th>EE/RE Impacts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td css={rowLabelStyles}>Generation (MWh)</td>
            <td className="avert-table-data">
              {formatNumber(generation.original)}
            </td>
            <td className="avert-table-data">
              {formatNumber(generation.post)}
            </td>
            <td className="avert-table-data">
              {formatNumber(generation.impact)}
            </td>
          </tr>
          <tr className="avert-table-group">
            <td colSpan={4}>Total emissions of fossil EGUs</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              SO<sub>2</sub> (lbs)
            </td>
            <td className="avert-table-data">{formatNumber(so2.original)}</td>
            <td className="avert-table-data">{formatNumber(so2.post)}</td>
            <td className="avert-table-data">{formatNumber(so2.impact)}</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              NO<sub>X</sub> (lbs)
            </td>
            <td className="avert-table-data">{formatNumber(nox.original)}</td>
            <td className="avert-table-data">{formatNumber(nox.post)}</td>
            <td className="avert-table-data">{formatNumber(nox.impact)}</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              CO<sub>2</sub> (tons)
            </td>
            <td className="avert-table-data">{formatNumber(co2.original)}</td>
            <td className="avert-table-data">{formatNumber(co2.post)}</td>
            <td className="avert-table-data">{formatNumber(co2.impact)}</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              PM<sub>2.5</sub> (lbs)
            </td>
            <td className="avert-table-data">{formatNumber(pm25.original)}</td>
            <td className="avert-table-data">{formatNumber(pm25.post)}</td>
            <td className="avert-table-data">{formatNumber(pm25.impact)}</td>
          </tr>
          <tr className="avert-table-group">
            <td colSpan={4}>Emission rates of fossil EGUs</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              SO<sub>2</sub> (lbs/MWh)
            </td>
            <td className="avert-table-data">{so2EmissionsOrig.toFixed(2)}</td>
            <td className="avert-table-data">{so2EmissionsPost.toFixed(2)}</td>
            <td className="avert-table-data">&nbsp;</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              NO<sub>X</sub> (lbs/MWh)
            </td>
            <td className="avert-table-data">{noxEmissionsOrig.toFixed(2)}</td>
            <td className="avert-table-data">{noxEmissionsPost.toFixed(2)}</td>
            <td className="avert-table-data">&nbsp;</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              CO<sub>2</sub> (tons/MWh)
            </td>
            <td className="avert-table-data">{co2EmissionsOrig.toFixed(2)}</td>
            <td className="avert-table-data">{co2EmissionsPost.toFixed(2)}</td>
            <td className="avert-table-data">&nbsp;</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              PM<sub>2.5</sub> (lbs/MWh)
            </td>
            <td className="avert-table-data">{pm25EmissionsOrig.toFixed(2)}</td>
            <td className="avert-table-data">{pm25EmissionsPost.toFixed(2)}</td>
            <td className="avert-table-data">&nbsp;</td>
          </tr>
        </tbody>
      </table>

      <p className="avert-small-text">
        Negative numbers indicate displaced generation and emissions. All
        results are rounded to the nearest ten. A dash ('–') indicates a result
        greater than zero, but lower than the level of reportable significance.
      </p>
    </React.Fragment>
  );
}

export default DisplacementsTable;
