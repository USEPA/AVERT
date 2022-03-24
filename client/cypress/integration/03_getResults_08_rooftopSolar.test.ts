describe('Get Results – rooftopSolar', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Central');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-button').click();

    cy.findByText('Solar photovoltaic').click();
    cy.findByText('Distributed (rooftop) solar photovoltaic total capacity:')
      .next()
      .type('1000');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-button').click();
    cy.findByText('LOADING...', { timeout: 120000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['142,354,950', '140,438,140', '-1,916,810'];

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

    const so2Totals = ['232,257,610', '229,811,900', '-2,445,710'];

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

    const noxTotals = ['170,470,050', '168,125,600', '-2,344,460'];

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

    const ozoneSeasonNoxTotals = ['85,725,960', '84,623,050', '-1,102,910'];

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

    const co2Totals = ['131,115,900', '129,488,560', '-1,627,340'];

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

    const pm25Totals = ['10,889,130', '10,758,410', '-130,720'];

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

    const vocsTotals = ['4,039,700', '3,983,770', '-55,930'];

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

    const nh3Totals = ['3,546,680', '3,494,520', '-52,160'];

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

    const so2Rates = ['1.632', '1.276'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .next()
      .should('contain', so2Rates[1]); // EE/RE Impacts

    const noxRates = ['1.197', '1.223'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .next()
      .should('contain', noxRates[1]); // EE/RE Impacts

    const ozoneSeasonNoxRates = ['1.193', '1.272'];

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
    const arkansas = ['-25,910', '-74,320', '-70,340', '-800', '-1,130', '-1,410'];

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
    const iowa = ['-20', '-330', '-170', '-90', '-0', '-10'];

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
    const kansas = ['-111,570', '-333,300', '-281,390', '-27,400', '-9,940', '-5,560'];

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
    const louisiana = ['-60', '-8,270', '-8,660', '-970', '-430', '-520'];

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
    const missouri = ['-114,820', '-159,880', '-201,760', '-17,070', '-4,400', '-5,600'];

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
    const montana = ['0', '-1,810', '-1,250', '-290', '-60', '-140'];

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
    const nebraska = ['-838,500', '-430,550', '-237,520', '-8,150', '-7,540', '-9,240'];

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
    const newMexico = ['-240', '-22,630', '-20,680', '-1,860', '-670', '-1,450'];

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
    const northDakota = ['-126,540', '-123,980', '-80,800', '-10,520', '-2,800', '-2,470'];

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
    const oklahoma = ['-349,010', '-672,870', '-401,450', '-47,350', '-18,480', '-15,790'];

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
    const southDakota = ['-60', '-15,180', '-10,440', '-490', '-270', '-830'];

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
    const texas = ['-878,980', '-501,330', '-312,880', '-15,730', '-10,190', '-9,150'];

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
