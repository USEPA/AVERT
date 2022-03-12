describe('Get Results – utilitySolar', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Central');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-button').click();

    cy.findByText('Solar photovoltaic').click();
    cy.findByText('Utility-scale solar photovoltaic total capacity:')
      .next()
      .type('1000');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-button').click();
    cy.findByText('LOADING...', { timeout: 120000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['142,354,950', '140,093,890', '-2,261,070'];

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

    const so2Totals = ['232,257,610', '229,364,660', '-2,892,950'];

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

    const noxTotals = ['170,470,050', '167,708,000', '-2,762,050'];

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

    const ozoneSeasonNoxTotals = ['85,725,960', '84,360,600', '-1,365,360'];

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

    const co2Totals = ['131,115,900', '129,196,550', '-1,919,350'];

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

    const pm25Totals = ['10,889,130', '10,735,070', '-154,060'];

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

    const vocsTotals = ['4,039,700', '3,973,860', '-65,840'];

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

    const nh3Totals = ['3,546,680', '3,485,270', '-61,410'];

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

    const so2Rates = ['1.632', '1.279'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .next()
      .should('contain', so2Rates[1]); // EE/RE Impacts

    const noxRates = ['1.197', '1.222'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .next()
      .should('contain', noxRates[1]); // EE/RE Impacts

    const ozoneSeasonNoxRates = ['1.193', '1.270'];

    cy.get('@noxRates')
      .next()
      .as('ozoneSeasonNoxRates')
      .children()
      .eq(1)
      .should('contain', ozoneSeasonNoxRates[0]) // Original
      .next()
      .next()
      .should('contain', ozoneSeasonNoxRates[1]); // EE/RE Impacts

    const co2Rates = ['0.921', '0.849'];

    cy.get('@ozoneSeasonNoxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .next()
      .should('contain', co2Rates[1]); // EE/RE Impacts

    const pm25Rates = ['0.076', '0.068'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .next()
      .should('contain', pm25Rates[1]); // EE/RE Impacts

    const vocsRates = ['0.028', '0.029'];

    cy.get('@pm25Rates')
      .next()
      .as('vocsRates')
      .children()
      .eq(1)
      .should('contain', vocsRates[0]) // Original
      .next()
      .next()
      .should('contain', vocsRates[1]); // EE/RE Impacts

    const nh3Rates = ['0.025', '0.027'];

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
    const arkansas = ['-30,840', '-88,810', '-83,820', '-940', '-1,360', '-1,660'];

    cy.findAllByText('Arkansas')
      .filter(':visible')
      .parent()
      .as('arkansas')
      .children()
      .eq(1)
      .should('contain', arkansas[0]) // SO2 (lbs)
      .next()
      .should('contain', arkansas[1]) // NOX (lbs)
      .next()
      .should('contain', arkansas[2]) // CO2 (tons)
      .next()
      .should('contain', arkansas[3]) // PM2.5 (lbs)
      .next()
      .should('contain', arkansas[4]) // VOCS (lbs)
      .next()
      .should('contain', arkansas[5]); // NH3 (lbs)

    /* prettier-ignore */
    const iowa = ['-20', '-390', '-210', '-110', '-10', '-20'];

    cy.get('@arkansas')
      .next()
      .as('iowa')
      .children()
      .eq(1)
      .should('contain', iowa[0]) // SO2 (lbs)
      .next()
      .should('contain', iowa[1]) // NOX (lbs)
      .next()
      .should('contain', iowa[2]) // CO2 (tons)
      .next()
      .should('contain', iowa[3]) // PM2.5 (lbs)
      .next()
      .should('contain', iowa[4]) // VOCS (lbs)
      .next()
      .should('contain', iowa[5]); // NH3 (lbs)

    /* prettier-ignore */
    const kansas = ['-130,650', '-392,580', '-331,060', '-32,350', '-11,690', '-6,540'];

    cy.get('@iowa')
      .next()
      .as('kansas')
      .children()
      .eq(1)
      .should('contain', kansas[0]) // SO2 (lbs)
      .next()
      .should('contain', kansas[1]) // NOX (lbs)
      .next()
      .should('contain', kansas[2]) // CO2 (tons)
      .next()
      .should('contain', kansas[3]) // PM2.5 (lbs)
      .next()
      .should('contain', kansas[4]) // VOCS (lbs)
      .next()
      .should('contain', kansas[5]); // NH3 (lbs)

    /* prettier-ignore */
    const louisiana = ['-70', '-9,660', '-10,160', '-1,140', '-510', '-610'];

    cy.get('@kansas')
      .next()
      .as('louisiana')
      .children()
      .eq(1)
      .should('contain', louisiana[0]) // SO2 (lbs)
      .next()
      .should('contain', louisiana[1]) // NOX (lbs)
      .next()
      .should('contain', louisiana[2]) // CO2 (tons)
      .next()
      .should('contain', louisiana[3]) // PM2.5 (lbs)
      .next()
      .should('contain', louisiana[4]) // VOCS (lbs)
      .next()
      .should('contain', louisiana[5]); // NH3 (lbs)

    /* prettier-ignore */
    const missouri = ['-135,260', '-188,690', '-238,470', '-20,180', '-5,180', '-6,610'];

    cy.get('@louisiana')
      .next()
      .as('missouri')
      .children()
      .eq(1)
      .should('contain', missouri[0]) // SO2 (lbs)
      .next()
      .should('contain', missouri[1]) // NOX (lbs)
      .next()
      .should('contain', missouri[2]) // CO2 (tons)
      .next()
      .should('contain', missouri[3]) // PM2.5 (lbs)
      .next()
      .should('contain', missouri[4]) // VOCS (lbs)
      .next()
      .should('contain', missouri[5]); // NH3 (lbs)

    /* prettier-ignore */
    const montana = ['0', '-2,120', '-1,460', '-330', '-70', '-160'];

    cy.get('@missouri')
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
    const nebraska = ['-988,120', '-507,380', '-280,000', '-9,590', '-8,890', '-10,900'];

    cy.get('@montana')
      .next()
      .as('nebraska')
      .children()
      .eq(1)
      .should('contain', nebraska[0]) // SO2 (lbs)
      .next()
      .should('contain', nebraska[1]) // NOX (lbs)
      .next()
      .should('contain', nebraska[2]) // CO2 (tons)
      .next()
      .should('contain', nebraska[3]) // PM2.5 (lbs)
      .next()
      .should('contain', nebraska[4]) // VOCS (lbs)
      .next()
      .should('contain', nebraska[5]); // NH3 (lbs)

    /* prettier-ignore */
    const newMexico = ['-280', '-26,480', '-24,260', '-2,180', '-780', '-1,700'];

    cy.get('@nebraska')
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
    const northDakota = ['-148,230', '-145,560', '-95,030', '-12,370', '-3,300', '-2,920'];

    cy.get('@newMexico')
      .next()
      .as('northDakota')
      .children()
      .eq(1)
      .should('contain', northDakota[0]) // SO2 (lbs)
      .next()
      .should('contain', northDakota[1]) // NOX (lbs)
      .next()
      .should('contain', northDakota[2]) // CO2 (tons)
      .next()
      .should('contain', northDakota[3]) // PM2.5 (lbs)
      .next()
      .should('contain', northDakota[4]) // VOCS (lbs)
      .next()
      .should('contain', northDakota[5]); // NH3 (lbs)

    /* prettier-ignore */
    const oklahoma = ['-414,710', '-789,540', '-472,640', '-55,740', '-21,720', '-18,560'];

    cy.get('@northDakota')
      .next()
      .as('oklahoma')
      .children()
      .eq(1)
      .should('contain', oklahoma[0]) // SO2 (lbs)
      .next()
      .should('contain', oklahoma[1]) // NOX (lbs)
      .next()
      .should('contain', oklahoma[2]) // CO2 (tons)
      .next()
      .should('contain', oklahoma[3]) // PM2.5 (lbs)
      .next()
      .should('contain', oklahoma[4]) // VOCS (lbs)
      .next()
      .should('contain', oklahoma[5]); // NH3 (lbs)

    /* prettier-ignore */
    const southDakota = ['-70', '-17,760', '-12,500', '-580', '-330', '-990'];

    cy.get('@oklahoma')
      .next()
      .as('southDakota')
      .children()
      .eq(1)
      .should('contain', southDakota[0]) // SO2 (lbs)
      .next()
      .should('contain', southDakota[1]) // NOX (lbs)
      .next()
      .should('contain', southDakota[2]) // CO2 (tons)
      .next()
      .should('contain', southDakota[3]) // PM2.5 (lbs)
      .next()
      .should('contain', southDakota[4]) // VOCS (lbs)
      .next()
      .should('contain', southDakota[5]); // NH3 (lbs)

    /* prettier-ignore */
    const texas = ['-1,044,690', '-593,080', '-369,730', '-18,530', '-12,010', '-10,740'];

    cy.get('@southDakota')
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
