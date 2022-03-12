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
    const generation = ['123,946,280', '121,544,310', '-2,401,970'];

    cy.findByText('Generation')
      .next()
      .should('contain', generation[0]) // Original
      .next()
      .should('contain', generation[1]) // Post-EE/RE
      .next()
      .should('contain', generation[2]); // EE/RE Impacts

    cy.findByText('Total Emissions from Fossil Generation Fleet')
      .parent()
      .as('emissionTotals');

    const so2Totals = ['67,142,200', '66,013,250', '-1,128,950'];

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

    const noxTotals = ['112,649,760', '110,615,290', '-2,034,470'];

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

    const ozoneSeasonNoxTotals = ['49,413,100', '48,674,520', '-738,580'];

    cy.get('@noxTotals')
      .next()
      .as('ozoneSeasonNoxTotals')
      .children()
      .eq(1)
      .should('contain', ozoneSeasonNoxTotals[0]) // Original
      .next()
      .should('contain', ozoneSeasonNoxTotals[1]) // Post-EE/RE
      .next()
      .should('contain', ozoneSeasonNoxTotals[2]); // EE/RE Impacts

    const co2Totals = ['92,616,210', '90,886,990', '-1,729,220'];

    cy.get('@ozoneSeasonNoxTotals')
      .next()
      .as('co2Totals')
      .children()
      .eq(1)
      .should('contain', co2Totals[0]) // Original
      .next()
      .should('contain', co2Totals[1]) // Post-EE/RE
      .next()
      .should('contain', co2Totals[2]); // EE/RE Impacts

    const pm25Totals = ['9,068,100', '8,890,230', '-177,870'];

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

    const vocsTotals = ['3,382,560', '3,304,880', '-77,680'];

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

    const nh3Totals = ['2,434,250', '2,385,200', '-49,050'];

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

    cy.findByText('AVERT-derived Emission Rates:').parent().as('emissionRates');

    const so2Rates = ['0.542', '0.470'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .next()
      .should('contain', so2Rates[1]); // EE/RE Impacts

    const noxRates = ['0.909', '0.847'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .next()
      .should('contain', noxRates[1]); // EE/RE Impacts

    const ozoneSeasonNoxRates = ['0.896', '0.851'];

    cy.get('@noxRates')
      .next()
      .as('ozoneSeasonNoxRates')
      .children()
      .eq(1)
      .should('contain', ozoneSeasonNoxRates[0]) // Original
      .next()
      .next()
      .should('contain', ozoneSeasonNoxRates[1]); // EE/RE Impacts

    const co2Rates = ['0.747', '0.720'];

    cy.get('@ozoneSeasonNoxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .next()
      .should('contain', co2Rates[1]); // EE/RE Impacts

    const pm25Rates = ['0.073', '0.074'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .next()
      .should('contain', pm25Rates[1]); // EE/RE Impacts

    const vocsRates = ['0.027', '0.032'];

    cy.get('@pm25Rates')
      .next()
      .as('vocsRates')
      .children()
      .eq(1)
      .should('contain', vocsRates[0]) // Original
      .next()
      .next()
      .should('contain', vocsRates[1]); // EE/RE Impacts

    const nh3Rates = ['0.020', '0.020'];

    cy.get('@vocsRates')
      .next()
      .as('nh3Rates')
      .children()
      .eq(1)
      .should('contain', nh3Rates[0]) // Original
      .next()
      .next()
      .should('contain', nh3Rates[1]); // EE/RE Impacts
  });

  it('Annual State Emission Changes table displays the correct results', () => {
    /* prettier-ignore */
    const idaho = ['-330', '-32,170', '-48,320', '-2,730', '-810', '-4,700'];

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
    const montana = ['-132,040', '-221,720', '-158,430', '-33,200', '-6,650', '-520'];

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
    const nevada = ['-64,840', '-156,640', '-283,710', '-33,960', '-20,960', '-18,170'];

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
    const oregon = ['-1,450', '-28,360', '-133,350', '-9,160', '-3,810', '-12,360'];

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
    const utah = ['-240,410', '-696,060', '-366,440', '-33,010', '-9,980', '-6,450'];

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
    const washington = ['-66,780', '-313,050', '-347,020', '-33,880', '-23,150', '-6,680'];

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
    const wyoming = ['-623,100', '-586,470', '-391,940', '-31,930', '-12,320', '-180'];

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
