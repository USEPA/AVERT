describe('Get Results – reduction & topHours', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('New England');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-button').click();

    cy.findByText('Percentage reductions in some or all hours').click();
    cy.findByText('Targeted program: Reduce generation by').next().type('15');
    cy.findByText('% during the peak').next().type('50');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-button').click();
    cy.findByText('LOADING...', { timeout: 120000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['41,694,430', '37,330,120', '-4,364,300'];

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

    const so2Totals = ['1,616,030', '1,036,510', '-579,510'];

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

    const noxTotals = ['6,972,500', '5,920,740', '-1,051,750'];

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

    const co2Totals = ['22,259,760', '19,956,860', '-2,302,890'];

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

    const pm25Totals = ['1,208,640', '1,061,020', '-147,620'];

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

    const vocsTotals = ['709,120', '620,710', '-88,410'];

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

    const nh3Totals = ['1,125,560', '976,580', '-148,980'];

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

    const so2Rates = ['0.039', '0.028'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .should('contain', so2Rates[1]); // Post-EE/RE

    const noxRates = ['0.167', '0.159'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .should('contain', noxRates[1]); // Post-EE/RE

    const co2Rates = ['0.534', '0.535'];

    cy.get('@noxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .should('contain', co2Rates[1]); // Post-EE/RE

    const pm25Rates = ['0.029', '0.028'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .should('contain', pm25Rates[1]); // Post-EE/RE

    const vocsRates = ['0.017', '0.017'];

    cy.get('@pm25Rates')
      .next()
      .as('vocsRates')
      .children()
      .eq(1)
      .should('contain', vocsRates[0]) // Original
      .next()
      .should('contain', vocsRates[1]); // Post-EE/RE

    const nh3Rates = ['0.027', '0.026'];

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
    const connecticut = ['-67,347', '-260,842', '-415,768', '-16,594', '-16,122', '-24,915'];

    cy.findAllByText('Connecticut')
      .filter(':visible')
      .parent()
      .as('connecticut')
      .children()
      .eq(1)
      .should('contain', connecticut[0]) // SO2 (lbs)
      .next()
      .should('contain', connecticut[1]) // NOX (lbs)
      .next()
      .should('contain', connecticut[2]) // CO2 (tons)
      .next()
      .should('contain', connecticut[3]) // PM2.5 (lbs)
      .next()
      .should('contain', connecticut[4]) // VOCS (lbs)
      .next()
      .should('contain', connecticut[5]); // NH3 (lbs)

    /* prettier-ignore */
    const maine = ['-38,470', '-52,344', '-177,276', '-7,434', '-3,456', '-3,743'];

    cy.get('@connecticut')
      .next()
      .as('maine')
      .children()
      .eq(1)
      .should('contain', maine[0]) // SO2 (lbs)
      .next()
      .should('contain', maine[1]) // NOX (lbs)
      .next()
      .should('contain', maine[2]) // CO2 (tons)
      .next()
      .should('contain', maine[3]) // PM2.5 (lbs)
      .next()
      .should('contain', maine[4]) // VOCS (lbs)
      .next()
      .should('contain', maine[5]); // NH3 (lbs)

    /* prettier-ignore */
    const massachusetts = ['-216,679', '-318,888', '-984,311', '-65,427', '-29,875', '-46,590'];

    cy.get('@maine')
      .next()
      .as('massachusetts')
      .children()
      .eq(1)
      .should('contain', massachusetts[0]) // SO2 (lbs)
      .next()
      .should('contain', massachusetts[1]) // NOX (lbs)
      .next()
      .should('contain', massachusetts[2]) // CO2 (tons)
      .next()
      .should('contain', massachusetts[3]) // PM2.5 (lbs)
      .next()
      .should('contain', massachusetts[4]) // VOCS (lbs)
      .next()
      .should('contain', massachusetts[5]); // NH3 (lbs)

    /* prettier-ignore */
    const newHampshire = ['-252,251', '-340,517', '-392,154', '-31,338', '-7,276', '-21,532'];

    cy.get('@massachusetts')
      .next()
      .as('newHampshire')
      .children()
      .eq(1)
      .should('contain', newHampshire[0]) // SO2 (lbs)
      .next()
      .should('contain', newHampshire[1]) // NOX (lbs)
      .next()
      .should('contain', newHampshire[2]) // CO2 (tons)
      .next()
      .should('contain', newHampshire[3]) // PM2.5 (lbs)
      .next()
      .should('contain', newHampshire[4]) // VOCS (lbs)
      .next()
      .should('contain', newHampshire[5]); // NH3 (lbs)

    /* prettier-ignore */
    const rhodeIsland = ['-4,676', '-65,205', '-312,346', '-22,766', '-28,508', '-50,762'];

    cy.get('@newHampshire')
      .next()
      .as('rhodeIsland')
      .children()
      .eq(1)
      .should('contain', rhodeIsland[0]) // SO2 (lbs)
      .next()
      .should('contain', rhodeIsland[1]) // NOX (lbs)
      .next()
      .should('contain', rhodeIsland[2]) // CO2 (tons)
      .next()
      .should('contain', rhodeIsland[3]) // PM2.5 (lbs)
      .next()
      .should('contain', rhodeIsland[4]) // VOCS (lbs)
      .next()
      .should('contain', rhodeIsland[5]); // NH3 (lbs)

    /* prettier-ignore */
    const vermont = ['-93', '-13,962', '-21,038', '-4,066', '-3,176', '-1,441'];

    cy.get('@rhodeIsland')
      .next()
      .as('vermont')
      .children()
      .eq(1)
      .should('contain', vermont[0]) // SO2 (lbs)
      .next()
      .should('contain', vermont[1]) // NOX (lbs)
      .next()
      .should('contain', vermont[2]) // CO2 (tons)
      .next()
      .should('contain', vermont[3]) // PM2.5 (lbs)
      .next()
      .should('contain', vermont[4]) // VOCS (lbs)
      .next()
      .should('contain', vermont[5]); // NH3 (lbs)
  });
});
