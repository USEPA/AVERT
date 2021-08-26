describe('Get Results – constantMwh', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Southwest');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-button').click();

    cy.findByText('Reductions spread evenly throughout the year').click();
    cy.findByText('Reduce hourly generation by').next().type('1000');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-button').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['91,706,380', '82,077,310', '-9,629,060'];

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

    const so2Totals = ['30,774,290', '28,146,060', '-2,628,230'];

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

    const noxTotals = ['80,223,900', '72,129,350', '-8,094,540'];

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

    const co2Totals = ['69,083,200', '62,330,410', '-6,752,780'];

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

    const pm25Totals = ['10,487,290', '9,463,780', '-1,023,510'];

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

    const vocsTotals = ['2,271,230', '2,025,750', '-245,470'];

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

    const nh3Totals = ['2,203,790', '1,949,060', '-254,720'];

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

    const so2Rates = ['0.336', '0.343'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .should('contain', so2Rates[1]); // Post-EE/RE

    const noxRates = ['0.875', '0.879'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .should('contain', noxRates[1]); // Post-EE/RE

    const co2Rates = ['0.753', '0.759'];

    cy.get('@noxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .should('contain', co2Rates[1]); // Post-EE/RE

    const pm25Rates = ['0.114', '0.115'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .should('contain', pm25Rates[1]); // Post-EE/RE

    const vocsRates = ['0.025', '0.025'];

    cy.get('@pm25Rates')
      .next()
      .as('vocsRates')
      .children()
      .eq(1)
      .should('contain', vocsRates[0]) // Original
      .next()
      .should('contain', vocsRates[1]); // Post-EE/RE

    const nh3Rates = ['0.024', '0.024'];

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
    const arizona = ['-1,926,081', '-5,958,119', '-4,848,318', '-747,562'];

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
      .should('contain', arizona[3]); // PM2.5 (lbs)

    const california = ['-509', '-7,459', '-51,881', '-5,324'];

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
      .should('contain', california[3]); // PM2.5 (lbs)

    const newMexico = ['-700,457', '-1,775,158', '-1,662,140', '-255,970'];

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
      .should('contain', newMexico[3]); // PM2.5 (lbs)

    const texas = ['-1,185', '-353,813', '-190,446', '-14,656'];

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
      .should('contain', texas[3]); // PM2.5 (lbs)
  });
});
