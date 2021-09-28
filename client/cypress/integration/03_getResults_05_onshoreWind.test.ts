describe('Get Results – onshoreWind', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Northwest');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-button').click();

    cy.findByText('Wind').click();
    cy.findByText('Onshore wind total capacity:').next().type('1000');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-button').click();
    cy.findByText('LOADING...', { timeout: 120000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['132,302,160', '129,891,530', '-2,410,630'];

    cy.findByText('Generation')
      .next()
      .should('contain', generation[0]) // Original
      .next()
      .should('contain', generation[1]) // Post-EE/RE
      .next()
      .should('contain', generation[2]); // EE/RE Impacts

    cy.findByText('Total emissions of fossil EGUs')
      .parent()
      .as('emissionTotals');

    const so2Totals = ['95,417,940', '93,768,250', '-1,649,680'];

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

    const noxTotals = ['144,287,390', '141,764,660', '-2,522,720'];

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

    const co2Totals = ['104,233,730', '102,437,850', '-1,795,870'];

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

    const pm25Totals = ['11,417,310', '11,214,200', '-203,110'];

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

    const vocsTotals = ['4,331,900', '4,251,470', '-80,430'];

    cy.get('@pm25Totals')
      .next()
      .as('vocsTotals')
      .children()
      .eq(1)
      .should('contain', vocsTotals[0]) // Original
      .next()
      .should('contain', vocsTotals[1]) // Post-EE/RE
      .next()
      .should('contain', vocsTotals[2]); // EE/RE Impacts

    const nh3Totals = ['2,340,410', '2,291,200', '-49,200'];

    cy.get('@vocsTotals')
      .next()
      .as('nh3Totals')
      .children()
      .eq(1)
      .should('contain', nh3Totals[0]) // Original
      .next()
      .should('contain', nh3Totals[1]) // Post-EE/RE
      .next()
      .should('contain', nh3Totals[2]); // EE/RE Impacts

    cy.findByText('Emission rates of fossil EGUs').parent().as('emissionRates');

    const so2Rates = ['0.721', '0.722'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .should('contain', so2Rates[1]); // Post-EE/RE

    const noxRates = ['1.091', '1.091'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .should('contain', noxRates[1]); // Post-EE/RE

    const co2Rates = ['0.788', '0.789'];

    cy.get('@noxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .should('contain', co2Rates[1]); // Post-EE/RE

    const pm25Rates = ['0.086', '0.086'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .should('contain', pm25Rates[1]); // Post-EE/RE

    const vocsRates = ['0.033', '0.033'];

    cy.get('@pm25Rates')
      .next()
      .as('vocsRates')
      .children()
      .eq(1)
      .should('contain', vocsRates[0]) // Original
      .next()
      .should('contain', vocsRates[1]); // Post-EE/RE

    const nh3Rates = ['0.018', '0.018'];

    cy.get('@vocsRates')
      .next()
      .as('nh3Rates')
      .children()
      .eq(1)
      .should('contain', nh3Rates[0]) // Original
      .next()
      .should('contain', nh3Rates[1]); // Post-EE/RE
  });

  it('Annual State Emission Changes table displays the correct results', () => {
    /* prettier-ignore */
    const idaho = ['-571', '-42,999', '-68,703', '-4,482', '-1,365', '-6,110'];

    cy.findAllByText('Idaho')
      .filter(':visible')
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
      .should('contain', idaho[3]) // PM2.5 (lbs)
      .next()
      .should('contain', idaho[4]) // VOCS (lbs)
      .next()
      .should('contain', idaho[5]); // NH3 (lbs)

    /* prettier-ignore */
    const montana = ['-340,149', '-457,009', '-214,280', '-40,298', '-8,499', '-329'];

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
      .should('contain', montana[3]) // PM2.5 (lbs)
      .next()
      .should('contain', montana[4]) // VOCS (lbs)
      .next()
      .should('contain', montana[5]); // NH3 (lbs)

    /* prettier-ignore */
    const nevada = ['-189,893', '-190,050', '-256,417', '-30,667', '-17,069', '-15,944'];

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
      .should('contain', nevada[3]) // PM2.5 (lbs)
      .next()
      .should('contain', nevada[4]) // VOCS (lbs)
      .next()
      .should('contain', nevada[5]); // NH3 (lbs)

    /* prettier-ignore */
    const oregon = ['-339,321', '-266,889', '-249,585', '-40,579', '-7,997', '-13,312'];

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
      .should('contain', oregon[3]) // PM2.5 (lbs)
      .next()
      .should('contain', oregon[4]) // VOCS (lbs)
      .next()
      .should('contain', oregon[5]); // NH3 (lbs)

    /* prettier-ignore */
    const utah = ['-252,804', '-676,785', '-346,780', '-26,446', '-9,304', '-5,753'];

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
      .should('contain', utah[3]) // PM2.5 (lbs)
      .next()
      .should('contain', utah[4]) // VOCS (lbs)
      .next()
      .should('contain', utah[5]); // NH3 (lbs)

    /* prettier-ignore */
    const washington = ['-114,280', '-423,540', '-385,476', '-39,792', '-27,770', '-7,632'];

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
      .should('contain', washington[3]) // PM2.5 (lbs)
      .next()
      .should('contain', washington[4]) // VOCS (lbs)
      .next()
      .should('contain', washington[5]); // NH3 (lbs)

    /* prettier-ignore */
    const wyoming = ['-412,669', '-465,456', '-274,638', '-20,851', '-8,431', '-122'];

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
      .should('contain', wyoming[3]) // PM2.5 (lbs)
      .next()
      .should('contain', wyoming[4]) // VOCS (lbs)
      .next()
      .should('contain', wyoming[5]); // NH3 (lbs)
  });
});
