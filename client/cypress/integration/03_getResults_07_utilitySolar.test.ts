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
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['161,555,570', '159,222,500', '-2,333,060'];

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

    const so2Totals = ['230,209,180', '227,498,850', '-2,710,320'];

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

    const noxTotals = ['185,564,830', '182,624,090', '-2,940,730'];

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

    const co2Totals = ['142,944,640', '141,007,090', '-1,937,540'];

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

    const pm25Totals = ['13,345,110', '13,158,880', '-186,220'];

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

    const so2Rates = ['1.42', '1.43'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .should('contain', so2Rates[1]); // Post-EE/RE

    const noxRates = ['1.15', '1.15'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .should('contain', noxRates[1]); // Post-EE/RE

    const co2Rates = ['0.88', '0.89'];

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
    const arkansas = ['-27,749', '-92,008', '-73,031', '-5,597'];

    cy.findByText('Arkansas')
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

    const iowa = ['-12', '-1,483', '-1,787', '-1,155'];

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

    const kansas = ['-159,961', '-450,443', '-392,800', '-31,441'];

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

    const louisiana = ['-132', '-10,841', '-17,681', '-1,896'];

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

    const missouri = ['-151,348', '-195,771', '-198,578', '-34,142'];

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

    const montana = ['0', '-3,418', '-2,222', '-354'];

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

    const northDakota = ['-99,892', '-104,845', '-71,868', '-8,430'];

    cy.get('@montana')
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

    const nebraska = ['-968,847', '-512,622', '-264,213', '-11,249'];

    cy.get('@northDakota')
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

    const newMexico = ['-264', '-30,936', '-16,000', '-1,766'];

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

    const oklahoma = ['-229,254', '-730,272', '-432,371', '-57,986'];

    cy.get('@newMexico')
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

    const southDakota = ['-89', '-31,146', '-14,334', '-1,213'];

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

    const texas = ['-1,072,775', '-776,949', '-452,662', '-30,997'];

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
