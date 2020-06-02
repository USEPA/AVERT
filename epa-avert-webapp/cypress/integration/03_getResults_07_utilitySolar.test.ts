describe('Get Results – utilitySolar', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Rocky Mountains');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Solar photovoltaic').click();
    cy.findByText('Utility-scale solar photovoltaic total capacity:')
      .next()
      .type('888');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    cy.findByText('Generation (MWh)')
      .next()
      .should('contain', '49,701,740') // Original
      .next()
      .should('contain', '47,960,160') // Post-EE/RE
      .next()
      .should('contain', '-1,741,580'); // EE/RE Impacts

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
      .should('contain', '42,855,370') // Post-EE/RE
      .next()
      .should('contain', '-872,350'); // EE/RE Impacts

    cy.get('@so2Totals')
      .next()
      .as('noxTotals')
      .children()
      .eq(1)
      .should('contain', '54,606,950') // Original
      .next()
      .should('contain', '52,807,900') // Post-EE/RE
      .next()
      .should('contain', '-1,799,050'); // EE/RE Impacts

    cy.get('@noxTotals')
      .next()
      .as('co2Totals')
      .children()
      .eq(1)
      .should('contain', '46,303,390') // Original
      .next()
      .should('contain', '44,898,120') // Post-EE/RE
      .next()
      .should('contain', '-1,405,270'); // EE/RE Impacts

    cy.get('@co2Totals')
      .next()
      .as('pm25Totals')
      .children()
      .eq(1)
      .should('contain', '1,309,910') // Original
      .next()
      .should('contain', '1,251,390') // Post-EE/RE
      .next()
      .should('contain', '-58,520'); // EE/RE Impacts

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
      .should('contain', '-723,554') // SO2 (lbs)
      .next()
      .should('contain', '-1,638,483') // NOX (lbs)
      .next()
      .should('contain', '-1,261,651') // CO2 (tons)
      .next()
      .should('contain', '-56,470'); // PM2.5 (lbs)

    cy.get('@coloradoEmissions')
      .next()
      .as('newMexicoEmissions')
      .children()
      .eq(1)
      .should('contain', '-52,902') // SO2 (lbs)
      .next()
      .should('contain', '-85,119') // NOX (lbs)
      .next()
      .should('contain', '-20,409') // CO2 (tons)
      .next()
      .should('contain', '-258'); // PM2.5 (lbs)

    cy.get('@newMexicoEmissions')
      .next()
      .as('southDakotaEmissions')
      .children()
      .eq(1)
      .should('contain', '0') // SO2 (lbs)
      .next()
      .should('contain', '-1,894') // NOX (lbs)
      .next()
      .should('contain', '-1,673') // CO2 (tons)
      .next()
      .should('contain', '0'); // PM2.5 (lbs)

    cy.get('@southDakotaEmissions')
      .next()
      .as('wyomingEmissions')
      .children()
      .eq(1)
      .should('contain', '-95,898') // SO2 (lbs)
      .next()
      .should('contain', '-73,557') // NOX (lbs)
      .next()
      .should('contain', '-121,537') // CO2 (tons)
      .next()
      .should('contain', '-1,794'); // PM2.5 (lbs)
  });
});
