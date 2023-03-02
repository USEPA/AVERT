describe('Get Results – constantMwh', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Southwest');
    cy.findAllByText('Set Energy Impacts').filter('.avert-button').click();

    cy.findByText('Reductions spread evenly throughout the year').click();
    cy.findByText('Reduce hourly generation by:').next().type('500');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-button').click();
    cy.findByText('LOADING...', { timeout: 120000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['83,333,400', '78,562,530', '-4,770,860'];

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

    const so2Totals = ['22,118,090', '21,309,560', '-808,530'];

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

    const noxTotals = ['55,145,710', '52,910,910', '-2,234,800'];

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

    const ozoneSeasonNoxTotals = ['26,859,350', '25,855,460', '-1,003,880'];

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

    const co2Totals = ['58,409,010', '55,442,220', '-2,966,780'];

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

    const pm25Totals = ['5,365,130', '5,060,870', '-304,260'];

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

    const vocsTotals = ['1,895,450', '1,790,850', '-104,600'];

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

    const nh3Totals = ['2,400,670', '2,259,050', '-141,610'];

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

    const so2Rates = ['0.265', '0.169'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .next()
      .should('contain', so2Rates[1]); // EE/RE Impacts

    const noxRates = ['0.662', '0.468'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .next()
      .should('contain', noxRates[1]); // EE/RE Impacts

    const ozoneSeasonNoxRates = ['0.632', '0.501'];

    cy.get('@noxRates')
      .next()
      .as('ozoneSeasonNoxRates')
      .children()
      .eq(1)
      .should('contain', ozoneSeasonNoxRates[0]) // Original
      .next()
      .next()
      .should('contain', ozoneSeasonNoxRates[1]); // EE/RE Impacts

    const co2Rates = ['0.701', '0.622'];

    cy.get('@ozoneSeasonNoxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .next()
      .should('contain', co2Rates[1]); // EE/RE Impacts

    const pm25Rates = ['0.064', '0.064'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .next()
      .should('contain', pm25Rates[1]); // EE/RE Impacts

    const vocsRates = ['0.023', '0.022'];

    cy.get('@pm25Rates')
      .next()
      .as('vocsRates')
      .children()
      .eq(1)
      .should('contain', vocsRates[0]) // Original
      .next()
      .next()
      .should('contain', vocsRates[1]); // EE/RE Impacts

    const nh3Rates = ['0.029', '0.030'];

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
    const arizona = ['-496,530', '-1,496,620', '-2,050,400', '-234,720', '-63,940', '-98,550'];

    cy.findAllByText('Arizona')
      .filter(':visible')
      .parent()
      .as('arizona')
      .children()
      .eq(1)
      .should('contain', arizona[0]) // SO2 (lbs)
      .next()
      .should('contain', arizona[1]) // NOX (lbs)
      .next()
      .should('contain', arizona[2]) // CO2 (tons)
      .next()
      .should('contain', arizona[3]) // PM2.5 (lbs)
      .next()
      .should('contain', arizona[4]) // VOCS (lbs)
      .next()
      .should('contain', arizona[5]); // NH3 (lbs)

    /* prettier-ignore */
    const california = ['-830', '-9,980', '-87,360', '-9,390', '-2,530', '-5,580'];

    cy.get('@arizona')
      .next()
      .as('california')
      .children()
      .eq(1)
      .should('contain', california[0]) // SO2 (lbs)
      .next()
      .should('contain', california[1]) // NOX (lbs)
      .next()
      .should('contain', california[2]) // CO2 (tons)
      .next()
      .should('contain', california[3]) // PM2.5 (lbs)
      .next()
      .should('contain', california[4]) // VOCS (lbs)
      .next()
      .should('contain', california[5]); // NH3 (lbs)

    /* prettier-ignore */
    const newMexico = ['-309,670', '-539,190', '-694,890', '-49,300', '-24,110', '-26,830'];

    cy.get('@california')
      .next()
      .as('newMexico')
      .children()
      .eq(1)
      .should('contain', newMexico[0]) // SO2 (lbs)
      .next()
      .should('contain', newMexico[1]) // NOX (lbs)
      .next()
      .should('contain', newMexico[2]) // CO2 (tons)
      .next()
      .should('contain', newMexico[3]) // PM2.5 (lbs)
      .next()
      .should('contain', newMexico[4]) // VOCS (lbs)
      .next()
      .should('contain', newMexico[5]); // NH3 (lbs)

    /* prettier-ignore */
    const texas = ['-1,510', '-189,020', '-134,130', '-10,850', '-14,010', '-10,660'];

    cy.get('@newMexico')
      .next()
      .as('texas')
      .children()
      .eq(1)
      .should('contain', texas[0]) // SO2 (lbs)
      .next()
      .should('contain', texas[1]) // NOX (lbs)
      .next()
      .should('contain', texas[2]) // CO2 (tons)
      .next()
      .should('contain', texas[3]) // PM2.5 (lbs)
      .next()
      .should('contain', texas[4]) // VOCS (lbs)
      .next()
      .should('contain', texas[5]); // NH3 (lbs)
  });
});
