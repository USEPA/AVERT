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
    const generation = ['161,709,120', '159,451,480', '-2,257,630'];

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

    const so2Totals = ['228,302,270', '225,636,170', '-2,666,100'];

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

    const noxTotals = ['184,500,770', '181,661,860', '-2,838,900'];

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

    const co2Totals = ['143,108,490', '141,234,120', '-1,874,370'];

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

    const pm25Totals = ['10,854,240', '10,712,170', '-142,060'];

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

    const vocsTotals = ['4,459,460', '4,392,990', '-66,460'];

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

    const nh3Totals = ['4,202,210', '4,137,170', '-65,030'];

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

    const so2Rates = ['1.412', '1.415'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .should('contain', so2Rates[1]); // Post-EE/RE

    const noxRates = ['1.141', '1.139'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .should('contain', noxRates[1]); // Post-EE/RE

    const co2Rates = ['0.885', '0.886'];

    cy.get('@noxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .should('contain', co2Rates[1]); // Post-EE/RE

    const pm25Rates = ['0.067', '0.067'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .should('contain', pm25Rates[1]); // Post-EE/RE

    const vocsRates = ['0.028', '0.028'];

    cy.get('@pm25Rates')
      .next()
      .as('vocsRates')
      .children()
      .eq(1)
      .should('contain', vocsRates[0]) // Original
      .next()
      .should('contain', vocsRates[1]); // Post-EE/RE

    const nh3Rates = ['0.026', '0.026'];

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
    const arkansas = ['-27,362', '-89,625', '-70,946', '-542', '-1,473', '-1,773'];

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
    const iowa = ['-11', '-1,410', '-1,682', '-977', '-78', '-160'];

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
    const kansas = ['-153,709', '-436,619', '-377,759', '-35,557', '-13,368', '-6,127'];

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
    const louisiana = ['-130', '-10,621', '-17,373', '-2,041', '-801', '-1,070'];

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
    const missouri = ['-145,598', '-183,947', '-191,435', '-17,376', '-4,879', '-5,945'];

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
    const montana = ['0', '-3,222', '-2,113', '-482', '-104', '-234'];

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
    const nebraska = ['-943,886', '-497,488', '-257,865', '-9,249', '-8,221', '-10,517'];

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
    const newMexico = ['-260', '-30,375', '-16,411', '-1,674', '-650', '-1,265'];

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
    const northDakota = ['-97,356', '-101,703', '-69,049', '-8,942', '-2,451', '-2,468'];

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
    const oklahoma = ['-222,008', '-705,839', '-416,045', '-40,450', '-20,382', '-20,098'];

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
    const southDakota = ['-85', '-21,439', '-13,728', '-618', '-374', '-1,070'];

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
    const texas = ['-1,075,700', '-756,614', '-439,969', '-24,159', '-13,688', '-14,311'];

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
