describe('Get Results – constantMwh', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Rocky Mountains');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Reductions spread evenly throughout the year').click();
    cy.findByText('Reduce hourly generation by').next().type('444');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    cy.findByText('Generation (MWh)')
      .next()
      .should('contain', '49,701,740') // Original
      .next()
      .should('contain', '45,463,430') // Post-EE/RE
      .next()
      .should('contain', '-4,238,300'); // EE/RE Impacts

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
      .should('contain', '41,491,510') // Post-EE/RE
      .next()
      .should('contain', '-2,236,210'); // EE/RE Impacts

    cy.get('@so2Totals')
      .next()
      .as('noxTotals')
      .children()
      .eq(1)
      .should('contain', '54,606,950') // Original
      .next()
      .should('contain', '49,998,440') // Post-EE/RE
      .next()
      .should('contain', '-4,608,510'); // EE/RE Impacts

    cy.get('@noxTotals')
      .next()
      .as('co2Totals')
      .children()
      .eq(1)
      .should('contain', '46,303,390') // Original
      .next()
      .should('contain', '42,809,320') // Post-EE/RE
      .next()
      .should('contain', '-3,494,060'); // EE/RE Impacts

    cy.get('@co2Totals')
      .next()
      .as('pm25Totals')
      .children()
      .eq(1)
      .should('contain', '1,309,910') // Original
      .next()
      .should('contain', '1,179,400') // Post-EE/RE
      .next()
      .should('contain', '-130,500'); // EE/RE Impacts

    cy.findByText('Emission rates of fossil EGUs').parent().as('emissionRates');

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', '0.88') // Original
      .next()
      .should('contain', '0.91'); // Post-EE/RE

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
      .should('contain', '-1,850,899') // SO2 (lbs)
      .next()
      .should('contain', '-4,173,645') // NOX (lbs)
      .next()
      .should('contain', '-3,086,414') // CO2 (tons)
      .next()
      .should('contain', '-125,778'); // PM2.5 (lbs)

    cy.get('@coloradoEmissions')
      .next()
      .as('newMexicoEmissions')
      .children()
      .eq(1)
      .should('contain', '-143,749') // SO2 (lbs)
      .next()
      .should('contain', '-231,363') // NOX (lbs)
      .next()
      .should('contain', '-57,157') // CO2 (tons)
      .next()
      .should('contain', '-722'); // PM2.5 (lbs)

    cy.get('@newMexicoEmissions')
      .next()
      .as('southDakotaEmissions')
      .children()
      .eq(1)
      .should('contain', '0') // SO2 (lbs)
      .next()
      .should('contain', '-2,917') // NOX (lbs)
      .next()
      .should('contain', '-2,575') // CO2 (tons)
      .next()
      .should('contain', '0'); // PM2.5 (lbs)

    cy.get('@southDakotaEmissions')
      .next()
      .as('wyomingEmissions')
      .children()
      .eq(1)
      .should('contain', '-241,570') // SO2 (lbs)
      .next()
      .should('contain', '-200,592') // NOX (lbs)
      .next()
      .should('contain', '-347,921') // CO2 (tons)
      .next()
      .should('contain', '-4,007'); // PM2.5 (lbs)
  });
});
