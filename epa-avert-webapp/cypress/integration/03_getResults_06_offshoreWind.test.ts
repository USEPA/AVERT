describe.skip('Get Results – offshoreWind', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .as('regionsSelect');

    cy.get('@regionsSelect').select('Rocky Mountains');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Wind').click();
    cy.findByText('Offshore wind total capacity:').next().type('888');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    cy.findByText('Generation (MWh)')
      .next()
      .should('contain', '') // Original
      .next()
      .should('contain', '') // Post-EE/RE
      .next()
      .should('contain', ''); // EE/RE Impacts

    cy.findByText('Total emissions of fossil EGUs')
      .parent()
      .as('emissionTotals');

    cy.get('@emissionTotals')
      .next()
      .as('so2Totals')
      .children()
      .eq(1)
      .should('contain', '') // Original
      .next()
      .should('contain', '') // Post-EE/RE
      .next()
      .should('contain', ''); // EE/RE Impacts

    cy.get('@so2Totals')
      .next()
      .as('noxTotals')
      .children()
      .eq(1)
      .should('contain', '') // Original
      .next()
      .should('contain', '') // Post-EE/RE
      .next()
      .should('contain', ''); // EE/RE Impacts

    cy.get('@noxTotals')
      .next()
      .as('co2Totals')
      .children()
      .eq(1)
      .should('contain', '') // Original
      .next()
      .should('contain', '') // Post-EE/RE
      .next()
      .should('contain', ''); // EE/RE Impacts

    cy.get('@co2Totals')
      .next()
      .as('pm25Totals')
      .children()
      .eq(1)
      .should('contain', '') // Original
      .next()
      .should('contain', '') // Post-EE/RE
      .next()
      .should('contain', ''); // EE/RE Impacts

    cy.findByText('Emission rates of fossil EGUs').parent().as('emissionRates');

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', '') // Original
      .next()
      .should('contain', ''); // Post-EE/RE

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', '') // Original
      .next()
      .should('contain', ''); // Post-EE/RE

    cy.get('@noxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', '') // Original
      .next()
      .should('contain', ''); // Post-EE/RE

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', '') // Original
      .next()
      .should('contain', ''); // Post-EE/RE
  });

  it('Annual State Emission Changes table displays the correct results', () => {
    cy.findByText('Colorado')
      .parent()
      .as('coloradoEmissions')
      .children()
      .eq(1)
      .should('contain', '') // SO2 (lbs)
      .next()
      .should('contain', '') // NOX (lbs)
      .next()
      .should('contain', '') // CO2 (tons)
      .next()
      .should('contain', ''); // PM2.5 (lbs)

    cy.get('@coloradoEmissions')
      .next()
      .as('newMexicoEmissions')
      .children()
      .eq(1)
      .should('contain', '') // SO2 (lbs)
      .next()
      .should('contain', '') // NOX (lbs)
      .next()
      .should('contain', '') // CO2 (tons)
      .next()
      .should('contain', ''); // PM2.5 (lbs)

    cy.get('@newMexicoEmissions')
      .next()
      .as('southDakotaEmissions')
      .children()
      .eq(1)
      .should('contain', '') // SO2 (lbs)
      .next()
      .should('contain', '') // NOX (lbs)
      .next()
      .should('contain', '') // CO2 (tons)
      .next()
      .should('contain', ''); // PM2.5 (lbs)

    cy.get('@southDakotaEmissions')
      .next()
      .as('wyomingEmissions')
      .children()
      .eq(1)
      .should('contain', '') // SO2 (lbs)
      .next()
      .should('contain', '') // NOX (lbs)
      .next()
      .should('contain', '') // CO2 (tons)
      .next()
      .should('contain', ''); // PM2.5 (lbs)
  });
});
