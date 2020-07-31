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
  const generation = { original: 0, postEere: 0 };
  const so2 = { original: 0, postEere: 0 };
  const nox = { original: 0, postEere: 0 };
  const co2 = { original: 0, postEere: 0 };
  const pm25 = { original: 0, postEere: 0 };

  for (const regionId in regionalDisplacements) {
    // regional displacement data
    const data = regionalDisplacements[regionId as RegionId];

    generation.original += data?.generation?.originalTotal || 0;
    generation.postEere += data?.generation?.postEereTotal || 0;

    so2.original += data?.so2?.originalTotal || 0;
    so2.postEere += data?.so2?.postEereTotal || 0;

    nox.original += data?.nox?.originalTotal || 0;
    nox.postEere += data?.nox?.postEereTotal || 0;

    co2.original += data?.co2?.originalTotal || 0;
    co2.postEere += data?.co2?.postEereTotal || 0;

    pm25.original += data?.pm25?.originalTotal || 0;
    pm25.postEere += data?.pm25?.postEereTotal || 0;
  }

  const so2RateOrig = so2.original / generation.original;
  const so2RatePost = so2.postEere / generation.postEere;

  const noxRateOrig = nox.original / generation.original;
  const noxRatePost = nox.postEere / generation.postEere;

  const co2RateOrig = co2.original / generation.original;
  const co2RatePost = co2.postEere / generation.postEere;

  const pm25RateOrig = pm25.original / generation.original;
  const pm25RatePost = pm25.postEere / generation.postEere;

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
              {formatNumber(generation.postEere)}
            </td>
            <td className="avert-table-data">
              {formatNumber(generation.postEere - generation.original)}
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
            <td className="avert-table-data">{formatNumber(so2.postEere)}</td>
            <td className="avert-table-data">
              {formatNumber(so2.postEere - so2.original)}
            </td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              NO<sub>X</sub> (lbs)
            </td>
            <td className="avert-table-data">{formatNumber(nox.original)}</td>
            <td className="avert-table-data">{formatNumber(nox.postEere)}</td>
            <td className="avert-table-data">
              {formatNumber(nox.postEere - nox.original)}
            </td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              CO<sub>2</sub> (tons)
            </td>
            <td className="avert-table-data">{formatNumber(co2.original)}</td>
            <td className="avert-table-data">{formatNumber(co2.postEere)}</td>
            <td className="avert-table-data">
              {formatNumber(co2.postEere - co2.original)}
            </td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              PM<sub>2.5</sub> (lbs)
            </td>
            <td className="avert-table-data">{formatNumber(pm25.original)}</td>
            <td className="avert-table-data">{formatNumber(pm25.postEere)}</td>
            <td className="avert-table-data">
              {formatNumber(pm25.postEere - pm25.original)}
            </td>
          </tr>
          <tr className="avert-table-group">
            <td colSpan={4}>Emission rates of fossil EGUs</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              SO<sub>2</sub> (lbs/MWh)
            </td>
            <td className="avert-table-data">{so2RateOrig.toFixed(3)}</td>
            <td className="avert-table-data">{so2RatePost.toFixed(3)}</td>
            <td className="avert-table-data">&nbsp;</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              NO<sub>X</sub> (lbs/MWh)
            </td>
            <td className="avert-table-data">{noxRateOrig.toFixed(3)}</td>
            <td className="avert-table-data">{noxRatePost.toFixed(3)}</td>
            <td className="avert-table-data">&nbsp;</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              CO<sub>2</sub> (tons/MWh)
            </td>
            <td className="avert-table-data">{co2RateOrig.toFixed(3)}</td>
            <td className="avert-table-data">{co2RatePost.toFixed(3)}</td>
            <td className="avert-table-data">&nbsp;</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              PM<sub>2.5</sub> (lbs/MWh)
            </td>
            <td className="avert-table-data">{pm25RateOrig.toFixed(3)}</td>
            <td className="avert-table-data">{pm25RatePost.toFixed(3)}</td>
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
