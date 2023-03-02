describe('Get Results – annualGwh', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Southwest');
    cy.findAllByText('Set Energy Impacts').filter('.avert-button').click();

    cy.findByText('Reductions spread evenly throughout the year').click();
    cy.findByText('Reduce total annual generation by:').next().type('5000');
    cy.findByText('Calculate Energy Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-button').click();
    cy.findByText('LOADING...', { timeout: 120000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['83,333,400', '77,884,800', '-5,448,600'];

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

    const so2Totals = ['22,118,090', '21,196,240', '-921,850'];

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

    const noxTotals = ['55,145,710', '52,613,710', '-2,532,000'];

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

    const ozoneSeasonNoxTotals = ['26,859,350', '25,721,660', '-1,137,690'];

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

    const co2Totals = ['58,409,010', '55,026,520', '-3,382,490'];

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

    const pm25Totals = ['5,365,130', '5,019,410', '-345,720'];

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

    const vocsTotals = ['1,895,450', '1,776,590', '-118,860'];

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

    const nh3Totals = ['2,400,670', '2,239,280', '-161,380'];

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

    const noxRates = ['0.662', '0.465'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .next()
      .should('contain', noxRates[1]); // EE/RE Impacts

    const ozoneSeasonNoxRates = ['0.632', '0.497'];

    cy.get('@noxRates')
      .next()
      .as('ozoneSeasonNoxRates')
      .children()
      .eq(1)
      .should('contain', ozoneSeasonNoxRates[0]) // Original
      .next()
      .next()
      .should('contain', ozoneSeasonNoxRates[1]); // EE/RE Impacts

    const co2Rates = ['0.701', '0.621'];

    cy.get('@ozoneSeasonNoxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .next()
      .should('contain', co2Rates[1]); // EE/RE Impacts

    const pm25Rates = ['0.064', '0.063'];

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
    const arizona = ['-564,810', '-1,695,730', '-2,336,970', '-266,410', '-72,500', '-112,310'];

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
    const california = ['-950', '-11,450', '-99,800', '-10,730', '-2,890', '-6,380'];

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
    const newMexico = ['-354,380', '-610,090', '-792,640', '-56,160', '-27,480', '-30,550'];

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
    const texas = ['-1,710', '-214,720', '-153,090', '-12,420', '-15,990', '-12,140'];

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
