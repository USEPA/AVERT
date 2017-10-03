import React, { PropTypes} from 'react';

const DebugTable = (props) => (
  <table className="avert-table">
    <thead>
    <tr>
      <th>{'Hour'}</th>
      <th>{'Current Load (MW)'}</th>
      <th>{'Manual EERE Entry'}</th>
      <th>{'Constant'}</th>
      <th>{'Percent'}</th>
      <th>{'Renewable Energy Profile'}</th>
      <th>{'Final (MW)'}</th>
      <th>{'Limit'}</th>
      <th>{'Exceedance'}</th>
    </tr>
    </thead>
    <tbody>
    {this.props.hourlyEere.map((item, index) => (
      <tr key={ index }>
        <td>{ item.index + 1 }</td>
        <td>{ item.current_load_mw }</td>
        <td>{ item.manual_eere_entry }</td>
        <td>{ item.constant }</td>
        <td>{ item.percent }</td>
        <td>{ item.renewable_energy_profile }</td>
        <td>{ item.final_mw }</td>
        <td>{ item.limit }</td>
        <td>{ item.exceedance }</td>
      </tr>
    ))}
    </tbody>
  </table>
);

DebugTable.propTypes = {
  hourlyEere: PropTypes.array.isRequired,
}

export default DebugTable;
