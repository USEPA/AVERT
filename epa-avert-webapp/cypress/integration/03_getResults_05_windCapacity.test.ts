describe('Get Results – windCapacity', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .as('regionsSelect');

    cy.get('@regionsSelect').select('Rocky Mountains');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Wind').click();
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
      .should('contain', '46,985,610') // Post-EE/RE
      .next()
      .should('contain', '-2,716,120'); // EE/RE Impacts

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
      .should('contain', '42,277,640') // Post-EE/RE
      .next()
      .should('contain', '-1,450,080'); // EE/RE Impacts

    cy.get('@so2Totals')
      .next()
      .as('noxTotals')
      .children()
      .eq(1)
      .should('contain', '54,606,950') // Original
      .next()
      .should('contain', '51,565,750') // Post-EE/RE
      .next()
      .should('contain', '-3,041,200'); // EE/RE Impacts

    cy.get('@noxTotals')
      .next()
      .as('co2Totals')
      .children()
      .eq(1)
      .should('contain', '46,303,390') // Original
      .next()
      .should('contain', '44,052,640') // Post-EE/RE
      .next()
      .should('contain', '-2,250,750'); // EE/RE Impacts

    cy.get('@co2Totals')
      .next()
      .as('pm25Totals')
      .children()
      .eq(1)
      .should('contain', '1,309,910') // Original
      .next()
      .should('contain', '1,229,080') // Post-EE/RE
      .next()
      .should('contain', '-80,820'); // EE/RE Impacts

    cy.findByText('Emission rates of fossil EGUs').parent().as('emissionRates');

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', '0.88') // Original
      .next()
      .should('contain', '0.90'); // Post-EE/RE

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
      .should('contain', '-1,198,630') // SO2 (lbs)
      .next()
      .should('contain', '-2,758,223') // NOX (lbs)
      .next()
      .should('contain', '-1,980,758') // CO2 (tons)
      .next()
      .should('contain', '-77,839'); // PM2.5 (lbs)

    cy.get('@coloradoEmissions')
      .next()
      .as('newMexicoEmissions')
      .children()
      .eq(1)
      .should('contain', '-93,698') // SO2 (lbs)
      .next()
      .should('contain', '-152,133') // NOX (lbs)
      .next()
      .should('contain', '-37,948') // CO2 (tons)
      .next()
      .should('contain', '-479'); // PM2.5 (lbs)

    cy.get('@newMexicoEmissions')
      .next()
      .as('southDakotaEmissions')
      .children()
      .eq(1)
      .should('contain', '0') // SO2 (lbs)
      .next()
      .should('contain', '-1,439') // NOX (lbs)
      .next()
      .should('contain', '-1,267') // CO2 (tons)
      .next()
      .should('contain', '0'); // PM2.5 (lbs)

    cy.get('@southDakotaEmissions')
      .next()
      .as('wyomingEmissions')
      .children()
      .eq(1)
      .should('contain', '-157,757') // SO2 (lbs)
      .next()
      .should('contain', '-129,414') // NOX (lbs)
      .next()
      .should('contain', '-230,783') // CO2 (tons)
      .next()
      .should('contain', '-2,512'); // PM2.5 (lbs)
  });
});
