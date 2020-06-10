describe('Set EE/RE Impacts', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Carolinas');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Reductions spread evenly throughout the year').as('toggleA');
    cy.get('@toggleA').click();
    cy.findByText('Reduce total annual generation by').next().as('annualGwh');
    cy.findByText('Reduce hourly generation by').next().as('constantMwh');
    cy.get('@toggleA').click();

    cy.findByText('Percentage reductions in some or all hours').as('toggleB');
    cy.get('@toggleB').click();
    cy.findByText('Broad-based program: Reduce generation by')
      .next()
      .as('broadProgram');
    cy.findByText('Targeted program: Reduce generation by')
      .next()
      .as('reduction');
    cy.findByText('% during the peak').next().as('topHours');
    cy.get('@toggleB').click();

    cy.findByText('Wind').as('toggleC');
    cy.get('@toggleC').click();
    cy.findByText('Onshore wind total capacity:').next().as('onshoreWind');
    cy.findByText('Offshore wind total capacity:').next().as('offshoreWind');
    cy.get('@toggleC').click();

    cy.findByText('Solar photovoltaic').as('toggleD');
    cy.get('@toggleD').click();
    cy.findByText('Utility-scale solar photovoltaic total capacity:')
      .next()
      .as('utilitySolar');
    cy.get('@toggleD').click();
    cy.findByText('Distributed (rooftop) solar voltaic total capacity:')
      .next()
      .as('rooftopSolar');
    cy.get('@toggleD').click();

    cy.findByText('Calculate EE/RE Impacts').as('calculateBtn');
    cy.findAllByText('Get Results').filter('.avert-next').as('resultsBtn');
  });

  it('Entering a value for onshore wind capacity displays the EE/RE profile chart and enables the “Get Results” button', () => {
    cy.get('@toggleC').click();
    cy.get('@onshoreWind').type('1000');
    cy.get('@resultsBtn').should('have.class', 'avert-button-disabled');
    cy.get('@calculateBtn').click();
    cy.findByText('EE/RE profile based on values entered:');
    cy.get('@resultsBtn').should('not.have.class', 'avert-button-disabled');
  });

  it('Entering a value over the 15% threshold for annual generation and onshore wind capacity displays the warning message below the chart', () => {
    cy.get('@toggleA').click();
    cy.get('@annualGwh').type('5000');
    cy.get('@toggleC').click();
    cy.get('@onshoreWind').type('1000');
    cy.get('@calculateBtn').click();
    cy.findAllByText('WARNING:').filter(':visible');
    cy.findByText('19.24');
    cy.findByText('January 1 at 5:00 AM');
  });

  it('Entering a value over the 30% threshold for annual generation and onshore wind capacity displays the error message below the chart', () => {
    cy.get('@toggleA').click();
    cy.get('@annualGwh').type('10000');
    cy.get('@toggleC').click();
    cy.get('@onshoreWind').type('1000');
    cy.get('@calculateBtn').click();
    cy.findAllByText('ERROR:').filter(':visible');
    cy.findByText('31.82');
    cy.findByText('April 20 at 3:00 AM');
  });

  it('Entering a value over the vaild limit for onshore wind capacity displays the error message below the input', () => {
    cy.get('@toggleC').click();
    cy.get('@onshoreWind').type('1376');
    cy.findByText('Please enter a number between 0 and 1375.5.');
    cy.get('@calculateBtn').should('have.class', 'avert-button-disabled');
    cy.get('@resultsBtn').should('have.class', 'avert-button-disabled');
  });
});
