// @flow

import React from 'react';
// styles
import './styles.css';

const formatOutput = (number) => {
  if (number < 10 && number > -10) return '--';
  let output = Math.ceil(number / 10) * 10;
  return output.toLocaleString();
};

const formatNumber = (number) => {
  if (number === 0) return '---';
  return parseFloat(number).toFixed(2); // always display two decimal places
};

type OrigPostImpact = {
  original: number,
  post: number,
  impact: number,
};

type OrigPost = {
  original: number,
  post: number,
};

type Data = {
  generation: OrigPostImpact,
  totalEmissions: {
    so2: OrigPostImpact,
    nox: OrigPostImpact,
    co2: OrigPostImpact,
    pm25: OrigPostImpact,
  },
  emissionRates: {
    so2: OrigPost,
    nox: OrigPost,
    co2: OrigPost,
    pm25: OrigPost,
  },
};

type Props = {
  heading: string,
  // redux connected props
  annualStatus: string,
  data: Data,
};

const DisplacementsTable = (props: Props) => {
  const { generation, totalEmissions, emissionRates } = props.data;

  // rendering is ready when state annual displacement status is 'complete'
  const readyToRender = props.annualStatus === 'complete';

  let Table;
  // conditionally re-define Table when ready to render
  // prettier-ignore
  if (readyToRender) {
    Table = (
      <div>
        <table className='avert-table'>
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
              <td>Generation (MWh)</td>
              <td className="avert-table-data">{formatOutput(generation.original)}</td>
              <td className="avert-table-data">{formatOutput(generation.post)}</td>
              <td className="avert-table-data">{formatOutput(generation.impact)}</td>
            </tr>
            <tr className='avert-table-group'>
              <td colSpan='4'>Total emissions of fossil EGUs</td>
            </tr>
            <tr>
              <td>SO<sub>2</sub> (lbs)</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.so2.original)}</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.so2.post)}</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.so2.impact)}</td>
            </tr>
            <tr>
              <td>NO<sub>X</sub> (lbs)</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.nox.original)}</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.nox.post)}</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.nox.impact)}</td>
            </tr>
            <tr>
              <td>CO<sub>2</sub> (tons)</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.co2.original)}</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.co2.post)}</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.co2.impact)}</td>
            </tr>
            <tr>
              <td>PM<sub>2.5</sub> (lbs)</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.pm25.original)}</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.pm25.post)}</td>
              <td className="avert-table-data">{formatOutput(totalEmissions.pm25.impact)}</td>
            </tr>
            <tr className='avert-table-group'>
              <td colSpan='4'>Emission rates of fossil EGUs</td>
            </tr>
            <tr>
              <td>SO<sub>2</sub> (lbs/MWh)</td>
              <td className="avert-table-data">{formatNumber(emissionRates.so2.original)}</td>
              <td className="avert-table-data">{formatNumber(emissionRates.so2.post)}</td>
              <td className="avert-table-data">&nbsp;</td>
            </tr>
            <tr>
              <td>NO<sub>X</sub> (lbs/MWh)</td>
              <td className="avert-table-data">{formatNumber(emissionRates.nox.original)}</td>
              <td className="avert-table-data">{formatNumber(emissionRates.nox.post)}</td>
              <td className="avert-table-data">&nbsp;</td>
            </tr>
            <tr>
              <td>CO<sub>2</sub> (tons/MWh)</td>
              <td className="avert-table-data">{formatNumber(emissionRates.co2.original)}</td>
              <td className="avert-table-data">{formatNumber(emissionRates.co2.post)}</td>
              <td className="avert-table-data">&nbsp;</td>
            </tr>
            <tr>
              <td>PM<sub>2.5</sub> (lbs/MWh)</td>
              <td className="avert-table-data">{formatNumber(emissionRates.pm25.original)}</td>
              <td className="avert-table-data">{formatNumber(emissionRates.pm25.post)}</td>
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
      </div>
    );
  }

  return (
    <div className="avert-displacement-table">
      <h3 className="avert-heading-three">{props.heading}</h3>
      {Table}
    </div>
  );
};

export default DisplacementsTable;
