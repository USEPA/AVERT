describe('Get Results – rooftopSolar', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Rocky Mountains');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Distributed (rooftop) solar photovoltaic').click();
    cy.findAllByText('Total capacity:').filter(':visible').next().type('888');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    cy.findByText('Generation (MWh)')
      .next()
      .should('contain', '49,701,740') // Original
      .next()
      .should('contain', '48,243,280') // Post-EE/RE
      .next()
      .should('contain', '-1,458,450'); // EE/RE Impacts

    cy.findByText('Total emissions of fossil EGUs')
      .parent()
      .as('emissionTotals');

    cy.get('@emissionTotals')
      .next()
      .as('so2Totals')
      .children()
      .eq(1)
      .should('contain', '43,727,730') // Original
      .next()
      .should('contain', '42,996,290') // Post-EE/RE
      .next()
      .should('contain', '-731,430'); // EE/RE Impacts

    cy.get('@so2Totals')
      .next()
      .as('noxTotals')
      .children()
      .eq(1)
      .should('contain', '54,606,950') // Original
      .next()
      .should('contain', '53,096,980') // Post-EE/RE
      .next()
      .should('contain', '-1,509,970'); // EE/RE Impacts

    cy.get('@noxTotals')
      .next()
      .as('co2Totals')
      .children()
      .eq(1)
      .should('contain', '46,303,390') // Original
      .next()
      .should('contain', '45,128,250') // Post-EE/RE
      .next()
      .should('contain', '-1,175,130'); // EE/RE Impacts

    cy.get('@co2Totals')
      .next()
      .as('pm25Totals')
      .children()
      .eq(1)
      .should('contain', '1,309,910') // Original
      .next()
      .should('contain', '1,260,800') // Post-EE/RE
      .next()
      .should('contain', '-49,110'); // EE/RE Impacts

    cy.findByText('Emission rates of fossil EGUs').parent().as('emissionRates');

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', '0.88') // Original
      .next()
      .should('contain', '0.89'); // Post-EE/RE

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', '1.10') // Original
      .next()
      .should('contain', '1.10'); // Post-EE/RE

    cy.get('@noxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', '0.93') // Original
      .next()
      .should('contain', '0.94'); // Post-EE/RE

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', '0.03') // Original
      .next()
      .should('contain', '0.03'); // Post-EE/RE
  });

  it('Annual State Emission Changes table displays the correct results', () => {
    cy.findByText('Colorado')
      .parent()
      .as('coloradoEmissions')
      .children()
      .eq(1)
      .should('contain', '-602,819') // SO2 (lbs)
      .next()
      .should('contain', '-1,377,485') // NOX (lbs)
      .next()
      .should('contain', '-1,054,260') // CO2 (tons)
      .next()
      .should('contain', '-47,388'); // PM2.5 (lbs)

    cy.get('@coloradoEmissions')
      .next()
      .as('newMexicoEmissions')
      .children()
      .eq(1)
      .should('contain', '-43,318') // SO2 (lbs)
      .next()
      .should('contain', '-69,508') // NOX (lbs)
      .next()
      .should('contain', '-16,595') // CO2 (tons)
      .next()
      .should('contain', '-209'); // PM2.5 (lbs)

    cy.get('@newMexicoEmissions')
      .next()
      .as('southDakotaEmissions')
      .children()
      .eq(1)
      .should('contain', '0') // SO2 (lbs)
      .next()
      .should('contain', '-1,621') // NOX (lbs)
      .next()
      .should('contain', '-1,433') // CO2 (tons)
      .next()
      .should('contain', '0'); // PM2.5 (lbs)

    cy.get('@southDakotaEmissions')
      .next()
      .as('wyomingEmissions')
      .children()
      .eq(1)
      .should('contain', '-85,295') // SO2 (lbs)
      .next()
      .should('contain', '-61,358') // NOX (lbs)
      .next()
      .should('contain', '-102,852') // CO2 (tons)
      .next()
      .should('contain', '-1,514'); // PM2.5 (lbs)
  });
});
