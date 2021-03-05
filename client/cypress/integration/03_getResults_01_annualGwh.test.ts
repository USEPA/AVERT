describe('Get Results – annualGwh', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Southwest');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-button').click();

    cy.findByText('Reductions spread evenly throughout the year').click();
    cy.findByText('Reduce total annual generation by').next().type('10000');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-button').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['91,785,140', '80,830,480', '-10,954,650'];

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

    const so2Totals = ['46,809,850', '44,400,250', '-2,409,600'];

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

    const noxTotals = ['81,524,590', '72,296,180', '-9,228,410'];

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

    const co2Totals = ['69,142,570', '61,482,300', '-7,660,260'];

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

    const pm25Totals = ['7,603,490', '6,850,640', '-752,840'];

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

    const so2Rates = ['0.51', '0.55'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .should('contain', so2Rates[1]); // Post-EE/RE

    const noxRates = ['0.89', '0.89'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .should('contain', noxRates[1]); // Post-EE/RE

    const co2Rates = ['0.75', '0.76'];

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
    const arizona = ['-1,630,380', '-6,777,968', '-5,494,787', '-645,845'];

    cy.findByText('Arizona')
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

    const california = ['-587', '6,019', '-59,559', '-2,069'];

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

    const newMexico = ['-777,280', '-2,020,918', '-1,888,485', '-87,266'];

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

    const texas = ['-1,358', '-435,544', '-217,431', '-17,665'];

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
