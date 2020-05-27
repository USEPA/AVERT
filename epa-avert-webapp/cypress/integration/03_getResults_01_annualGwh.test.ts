describe('Get Results – annualGwh', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Rocky Mountains');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Reductions spread evenly throughout the year').click();
    cy.findByText('Reduce total annual generation by').next().type('888');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    cy.findByText('Generation (MWh)')
      .next()
      .should('contain', '49,701,740') // Original
      .next()
      .should('contain', '48,732,350') // Post-EE/RE
      .next()
      .should('contain', '-969,380'); // EE/RE Impacts

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
      .should('contain', '43,237,650') // Post-EE/RE
      .next()
      .should('contain', '-490,080'); // EE/RE Impacts

    cy.get('@so2Totals')
      .next()
      .as('noxTotals')
      .children()
      .eq(1)
      .should('contain', '54,606,950') // Original
      .next()
      .should('contain', '53,587,900') // Post-EE/RE
      .next()
      .should('contain', '-1,019,050'); // EE/RE Impacts

    cy.get('@noxTotals')
      .next()
      .as('co2Totals')
      .children()
      .eq(1)
      .should('contain', '46,303,390') // Original
      .next()
      .should('contain', '45,518,300') // Post-EE/RE
      .next()
      .should('contain', '-785,090'); // EE/RE Impacts

    cy.get('@co2Totals')
      .next()
      .as('pm25Totals')
      .children()
      .eq(1)
      .should('contain', '1,309,910') // Original
      .next()
      .should('contain', '1,278,750') // Post-EE/RE
      .next()
      .should('contain', '-31,160'); // EE/RE Impacts

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
      .should('contain', '0.93'); // Post-EE/RE

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
      .should('contain', '-414,728') // SO2 (lbs)
      .next()
      .should('contain', '-930,247') // NOX (lbs)
      .next()
      .should('contain', '-706,823') // CO2 (tons)
      .next()
      .should('contain', '-30,067'); // PM2.5 (lbs)

    cy.get('@coloradoEmissions')
      .next()
      .as('newMexicoEmissions')
      .children()
      .eq(1)
      .should('contain', '-31,235') // SO2 (lbs)
      .next()
      .should('contain', '-49,305') // NOX (lbs)
      .next()
      .should('contain', '-12,078') // CO2 (tons)
      .next()
      .should('contain', '-152'); // PM2.5 (lbs)

    cy.get('@newMexicoEmissions')
      .next()
      .as('southDakotaEmissions')
      .children()
      .eq(1)
      .should('contain', '0') // SO2 (lbs)
      .next()
      .should('contain', '-803') // NOX (lbs)
      .next()
      .should('contain', '-705') // CO2 (tons)
      .next()
      .should('contain', '0'); // PM2.5 (lbs)

    cy.get('@southDakotaEmissions')
      .next()
      .as('wyomingEmissions')
      .children()
      .eq(1)
      .should('contain', '-44,117') // SO2 (lbs)
      .next()
      .should('contain', '-38,700') // NOX (lbs)
      .next()
      .should('contain', '-65,485') // CO2 (tons)
      .next()
      .should('contain', '-945'); // PM2.5 (lbs)
  });
});
