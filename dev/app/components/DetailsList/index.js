import React from 'react';
// styles
import './styles.css';

const DetailsList = () => (
  <div className='avert-details-block'>
    <header>
      <p>Energy Efficiency</p>
    </header>

    <details>
      <summary data-label='A'>Reductions spread evenly throughout the year</summary>
      <section>
        <p><strong>Choose one:</strong></p>
        <ul>
          <li>Reduce hourly generation by <input type='text' /> <span>MW</span></li>
          <li>Reduce total annual generation by <input type='text' /> <span>GWh</span></li>
        </ul>
      </section>
    </details>

    <details>
      <summary data-label='B'>Percentage reductions in some or all hours</summary>
      <section>
        <p><strong>Choose one:</strong></p>
        <ul>
          <li>Broad-based program: Reduce generation by <input type='text' /> <span>% in all hours</span></li>
          <li>Targeted program: Reduce generation by <input type='text' /> <span>% during the peak</span> <input type='text' /> <span>% of hours</span></li>
        </ul>
      </section>
    </details>

    <header>
      <p>Renewable Energy</p>
    </header>

    <details>
      <summary data-label='C'>Wind</summary>
      <section>
        <p>Total capacity: <input type='text' /> <span>MW</span></p>
      </section>
    </details>

    <details>
      <summary data-label='D'>Utility-scale solar photovoltaic</summary>
      <section>
        <p>Total capacity: <input type='text' /> <span>MW</span></p>
      </section>
    </details>

    <details>
      <summary data-label='E'>Distributed (rooftop) solar photovoltaic</summary>
      <section>
        <p>Total capacity: <input type='text' /> <span>MW</span></p>
      </section>
    </details>
  </div>
);

export default DetailsList;
