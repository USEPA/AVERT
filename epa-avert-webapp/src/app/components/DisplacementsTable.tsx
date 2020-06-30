/** @jsx jsx */

import React from 'react';
import { jsx, css } from '@emotion/core';
// reducers
import { useTypedSelector } from 'app/redux/index';

const rowLabelStyles = css`
  padding: 0.375rem 1.25rem !important;
`;

function formatEmissions(number: any) {
  if (number < 10 && number > -10) return '--';
  let output = Math.ceil(number / 10) * 10;
  return output.toLocaleString();
}

type Props = {
  heading: string;
};

const DisplacementsTable = ({ heading }: Props) => {
  const status = useTypedSelector(({ displacement }) => displacement.status);
  const generationData = useTypedSelector(
    ({ displacement }) => displacement.generation.data,
  );
  const so2Data = useTypedSelector(({ displacement }) => displacement.so2.data);
  const noxData = useTypedSelector(({ displacement }) => displacement.nox.data);
  const co2Data = useTypedSelector(({ displacement }) => displacement.co2.data);
  const pm25Data = useTypedSelector(
    ({ displacement }) => displacement.pm25.data,
  );

  const so2EmissionsOriginal = so2Data.original / generationData.original;
  const so2EmissionsPost = so2Data.post / generationData.post;

  const noxEmissionsOriginal = noxData.original / generationData.original;
  const noxEmissionsPost = noxData.post / generationData.post;

  const co2EmissionsOriginal = co2Data.original / generationData.original;
  const co2EmissionsPost = co2Data.post / generationData.post;

  const pm25EmissionsOriginal = pm25Data.original / generationData.original;
  const pm25EmissionsPost = pm25Data.post / generationData.post;

  // rendering is ready when state displacement status is 'complete'
  const readyToRender = status === 'complete';

  let table;
  // conditionally re-define table when ready to render
  if (readyToRender) {
    table = (
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
                {formatEmissions(generationData.original)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(generationData.post)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(generationData.impact)}
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
                {formatEmissions(so2Data.original)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(so2Data.post)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(so2Data.impact)}
              </td>
            </tr>
            <tr>
              <td css={rowLabelStyles}>
                NO<sub>X</sub> (lbs)
              </td>
              <td className="avert-table-data">
                {formatEmissions(noxData.original)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(noxData.post)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(noxData.impact)}
              </td>
            </tr>
            <tr>
              <td css={rowLabelStyles}>
                CO<sub>2</sub> (tons)
              </td>
              <td className="avert-table-data">
                {formatEmissions(co2Data.original)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(co2Data.post)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(co2Data.impact)}
              </td>
            </tr>
            <tr>
              <td css={rowLabelStyles}>
                PM<sub>2.5</sub> (lbs)
              </td>
              <td className="avert-table-data">
                {formatEmissions(pm25Data.original)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(pm25Data.post)}
              </td>
              <td className="avert-table-data">
                {formatEmissions(pm25Data.impact)}
              </td>
            </tr>
            <tr className="avert-table-group">
              <td colSpan={4}>Emission rates of fossil EGUs</td>
            </tr>
            <tr>
              <td css={rowLabelStyles}>
                SO<sub>2</sub> (lbs/MWh)
              </td>
              <td className="avert-table-data">
                {so2EmissionsOriginal.toFixed(2)}
              </td>
              <td className="avert-table-data">
                {so2EmissionsPost.toFixed(2)}
              </td>
              <td className="avert-table-data">&nbsp;</td>
            </tr>
            <tr>
              <td css={rowLabelStyles}>
                NO<sub>X</sub> (lbs/MWh)
              </td>
              <td className="avert-table-data">
                {noxEmissionsOriginal.toFixed(2)}
              </td>
              <td className="avert-table-data">
                {noxEmissionsPost.toFixed(2)}
              </td>
              <td className="avert-table-data">&nbsp;</td>
            </tr>
            <tr>
              <td css={rowLabelStyles}>
                CO<sub>2</sub> (tons/MWh)
              </td>
              <td className="avert-table-data">
                {co2EmissionsOriginal.toFixed(2)}
              </td>
              <td className="avert-table-data">
                {co2EmissionsPost.toFixed(2)}
              </td>
              <td className="avert-table-data">&nbsp;</td>
            </tr>
            <tr>
              <td css={rowLabelStyles}>
                PM<sub>2.5</sub> (lbs/MWh)
              </td>
              <td className="avert-table-data">
                {pm25EmissionsOriginal.toFixed(2)}
              </td>
              <td className="avert-table-data">
                {pm25EmissionsPost.toFixed(2)}
              </td>
              <td className="avert-table-data">&nbsp;</td>
            </tr>
          </tbody>
        </table>

        <p className="avert-small-text">
          Negative numbers indicate displaced generation and emissions. All
          results are rounded to the nearest ten. A dash ('–') indicates a
          result greater than zero, but lower than the level of reportable
          significance.
        </p>
      </React.Fragment>
    );
  }

  return (
    <div className="avert-displacement-table">
      <h3 className="avert-heading-three">{heading}</h3>
      {table}
    </div>
  );
};

export default DisplacementsTable;
