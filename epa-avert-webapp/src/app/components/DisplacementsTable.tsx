/** @jsx jsx */

import React from 'react';
import { jsx, css } from '@emotion/core';
// reducers
import { useTypedSelector } from 'app/redux/index';

const rowLabelStyles = css`
  padding: 0.375rem 1.25rem !important;
`;

function formatNumber(number: any) {
  if (number < 10 && number > -10) return '--';
  const output = Math.ceil(number / 10) * 10;
  return output.toLocaleString();
}

function DisplacementsTable() {
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const data = useTypedSelector(
    ({ displacement }) => displacement.annualRegionalDisplacements,
  );

  const so2RateOrig = data.so2.original / data.generation.original;
  const so2RatePost = data.so2.postEere / data.generation.postEere;

  const noxRateOrig = data.nox.original / data.generation.original;
  const noxRatePost = data.nox.postEere / data.generation.postEere;

  const co2RateOrig = data.co2.original / data.generation.original;
  const co2RatePost = data.co2.postEere / data.generation.postEere;

  const pm25RateOrig = data.pm25.original / data.generation.original;
  const pm25RatePost = data.pm25.postEere / data.generation.postEere;

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
              {formatNumber(data.generation.original)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.generation.postEere)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.generation.impacts)}
            </td>
          </tr>
          <tr className="avert-table-group">
            <td colSpan={4}>Total emissions of fossil EGUs</td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              SO<sub>2</sub> (lbs)
            </td>
            <td className="avert-table-data">
              {formatNumber(data.so2.original)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.so2.postEere)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.so2.impacts)}
            </td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              NO<sub>X</sub> (lbs)
            </td>
            <td className="avert-table-data">
              {formatNumber(data.nox.original)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.nox.postEere)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.nox.impacts)}
            </td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              CO<sub>2</sub> (tons)
            </td>
            <td className="avert-table-data">
              {formatNumber(data.co2.original)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.co2.postEere)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.co2.impacts)}
            </td>
          </tr>
          <tr>
            <td css={rowLabelStyles}>
              PM<sub>2.5</sub> (lbs)
            </td>
            <td className="avert-table-data">
              {formatNumber(data.pm25.original)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.pm25.postEere)}
            </td>
            <td className="avert-table-data">
              {formatNumber(data.pm25.impacts)}
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
