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
    const generation = ['161,709,120', '159,803,630', '-1,905,480'];

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

    const so2Totals = ['228,302,270', '226,048,840', '-2,253,430'];

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

    const noxTotals = ['184,500,770', '182,094,490', '-2,406,280'];

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

    const co2Totals = ['143,108,490', '141,525,810', '-1,582,680'];

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

    const pm25Totals = ['10,854,240', '10,734,280', '-119,960'];

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

    const vocsTotals = ['4,459,460', '4,403,310', '-56,150'];

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

    const nh3Totals = ['4,202,210', '4,147,230', '-54,970'];

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
    const arkansas = ['-23,314', '-76,750', '-60,715', '-465'];

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
      .should('contain', arkansas[3]); // PM2.5 (lbs)

    const iowa = ['-9', '-1,212', '-1,438', '-833'];

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
      .should('contain', iowa[3]); // PM2.5 (lbs)

    const kansas = ['-129,120', '-367,262', '-317,030', '-29,860'];

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
      .should('contain', kansas[3]); // PM2.5 (lbs)

    const louisiana = ['-109', '-9,072', '-14,612', '-1,715'];

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
      .should('contain', louisiana[3]); // PM2.5 (lbs)

    const missouri = ['-124,436', '-156,211', '-162,040', '-14,761'];

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
      .should('contain', missouri[3]); // PM2.5 (lbs)

    const montana = ['0', '-2,721', '-1,786', '-408'];

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
      .should('contain', montana[3]); // PM2.5 (lbs)

    const nebraska = ['-795,065', '-419,743', '-216,945', '-7,786'];

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
      .should('contain', nebraska[3]); // PM2.5 (lbs)

    const newMexico = ['-218', '-25,479', '-13,836', '-1,411'];

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
      .should('contain', newMexico[3]); // PM2.5 (lbs)

    const northDakota = ['-82,862', '-84,727', '-57,944', '-7,478'];

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
      .should('contain', northDakota[3]); // PM2.5 (lbs)

    const oklahoma = ['-189,126', '-601,392', '-352,311', '-34,298'];

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
      .should('contain', oklahoma[3]); // PM2.5 (lbs)

    const southDakota = ['-71', '-18,231', '-11,503', '-523'];

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
      .should('contain', southDakota[3]); // PM2.5 (lbs)

    const texas = ['-909,109', '-643,480', '-372,525', '-20,423'];

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
      .should('contain', texas[3]); // PM2.5 (lbs)
  });
});
