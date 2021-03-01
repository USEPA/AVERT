describe('Get Results – onshoreWind', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Northwest');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Wind').click();
    cy.findByText('Onshore wind total capacity:').next().type('1000');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['132,221,430', '130,011,250', '-2,210,170'];

    cy.findByText('Generation (MWh)')
      .next()
      .should('contain', generation[0]) // Original
      .next()
      .should('contain', generation[1]) // Post-EE/RE
      .next()
      .should('contain', generation[2]); // EE/RE Impacts

    cy.findByText('Total emissions of fossil EGUs')
      .parent()
      .as('emissionTotals');

    const so2Totals = ['98,957,630', '97,521,880', '-1,435,750'];

    cy.get('@emissionTotals')
      .next()
      .as('so2Totals')
      .children()
      .eq(1)
      .should('contain', so2Totals[0]) // Original
      .next()
      .should('contain', so2Totals[1]) // Post-EE/RE
      .next()
      .should('contain', so2Totals[2]); // EE/RE Impacts

    const noxTotals = ['147,857,220', '145,516,610', '-2,340,600'];

    cy.get('@so2Totals')
      .next()
      .as('noxTotals')
      .children()
      .eq(1)
      .should('contain', noxTotals[0]) // Original
      .next()
      .should('contain', noxTotals[1]) // Post-EE/RE
      .next()
      .should('contain', noxTotals[2]); // EE/RE Impacts

    const co2Totals = ['104,194,060', '102,544,120', '-1,649,940'];

    cy.get('@noxTotals')
      .next()
      .as('co2Totals')
      .children()
      .eq(1)
      .should('contain', co2Totals[0]) // Original
      .next()
      .should('contain', co2Totals[1]) // Post-EE/RE
      .next()
      .should('contain', co2Totals[2]); // EE/RE Impacts

    const pm25Totals = ['10,933,310', '10,748,240', '-185,060'];

    cy.get('@co2Totals')
      .next()
      .as('pm25Totals')
      .children()
      .eq(1)
      .should('contain', pm25Totals[0]) // Original
      .next()
      .should('contain', pm25Totals[1]) // Post-EE/RE
      .next()
      .should('contain', pm25Totals[2]); // EE/RE Impacts

    cy.findByText('Emission rates of fossil EGUs').parent().as('emissionRates');

    const so2Rates = ['0.75', '0.75'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .should('contain', so2Rates[1]); // Post-EE/RE

    const noxRates = ['1.12', '1.12'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .should('contain', noxRates[1]); // Post-EE/RE

    const co2Rates = ['0.79', '0.79'];

    cy.get('@noxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .should('contain', co2Rates[1]); // Post-EE/RE

    const pm25Rates = ['0.08', '0.08'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .should('contain', pm25Rates[1]); // Post-EE/RE
  });

  it('Annual State Emission Changes table displays the correct results', () => {
    const idaho = ['-510', '-36,756', '-60,338', '-6,924'];

    cy.findByText('Idaho')
      .parent()
      .as('idaho')
      .children()
      .eq(1)
      .should('contain', idaho[0]) // SO2 (lbs)
      .next()
      .should('contain', idaho[1]) // NOX (lbs)
      .next()
      .should('contain', idaho[2]) // CO2 (tons)
      .next()
      .should('contain', idaho[3]); // PM2.5 (lbs)

    const montana = ['-314,168', '-435,499', '-203,856', '-39,810'];

    cy.get('@idaho')
      .next()
      .as('montana')
      .children()
      .eq(1)
      .should('contain', montana[0]) // SO2 (lbs)
      .next()
      .should('contain', montana[1]) // NOX (lbs)
      .next()
      .should('contain', montana[2]) // CO2 (tons)
      .next()
      .should('contain', montana[3]); // PM2.5 (lbs)

    const nevada = ['-179,217', '-171,835', '-225,973', '-29,591'];

    cy.get('@montana')
      .next()
      .as('nevada')
      .children()
      .eq(1)
      .should('contain', nevada[0]) // SO2 (lbs)
      .next()
      .should('contain', nevada[1]) // NOX (lbs)
      .next()
      .should('contain', nevada[2]) // CO2 (tons)
      .next()
      .should('contain', nevada[3]); // PM2.5 (lbs)

    const oregon = ['-314,611', '-264,848', '-233,076', '-42,320'];

    cy.get('@nevada')
      .next()
      .as('oregon')
      .children()
      .eq(1)
      .should('contain', oregon[0]) // SO2 (lbs)
      .next()
      .should('contain', oregon[1]) // NOX (lbs)
      .next()
      .should('contain', oregon[2]) // CO2 (tons)
      .next()
      .should('contain', oregon[3]); // PM2.5 (lbs)

    const utah = ['-232,561', '-610,178', '-313,997', '-30,729'];

    cy.get('@oregon')
      .next()
      .as('utah')
      .children()
      .eq(1)
      .should('contain', utah[0]) // SO2 (lbs)
      .next()
      .should('contain', utah[1]) // NOX (lbs)
      .next()
      .should('contain', utah[2]) // CO2 (tons)
      .next()
      .should('contain', utah[3]); // PM2.5 (lbs)

    const washington = ['-6,373', '-388,271', '-357,515', '-20,387'];

    cy.get('@utah')
      .next()
      .as('washington')
      .children()
      .eq(1)
      .should('contain', washington[0]) // SO2 (lbs)
      .next()
      .should('contain', washington[1]) // NOX (lbs)
      .next()
      .should('contain', washington[2]) // CO2 (tons)
      .next()
      .should('contain', washington[3]); // PM2.5 (lbs)

    const wyoming = ['-388,316', '-433,221', '-255,190', '-15,307'];

    cy.get('@washington')
      .next()
      .as('wyoming')
      .children()
      .eq(1)
      .should('contain', wyoming[0]) // SO2 (lbs)
      .next()
      .should('contain', wyoming[1]) // NOX (lbs)
      .next()
      .should('contain', wyoming[2]) // CO2 (tons)
      .next()
      .should('contain', wyoming[3]); // PM2.5 (lbs)
  });
});
