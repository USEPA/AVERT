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
    const generation = ['48,854,680', '43,749,710', '-5,104,960'];

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

    const so2Totals = ['1,824,010', '1,391,810', '-432,200'];

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

    const noxTotals = ['6,798,130', '5,861,840', '-936,290'];

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

    const ozoneSeasonNoxTotals = ['3,253,040', '2,662,840', '-590,200'];

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

    const co2Totals = ['24,740,750', '22,142,040', '-2,598,710'];

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

    const pm25Totals = ['1,352,820', '1,189,690', '-163,130'];

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

    const vocsTotals = ['806,410', '712,600', '-93,820'];

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

    const nh3Totals = ['1,354,100', '1,197,660', '-156,440'];

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

    const so2Rates = ['0.037', '0.085'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .next()
      .should('contain', so2Rates[1]); // EE/RE Impacts

    const noxRates = ['0.139', '0.183'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .next()
      .should('contain', noxRates[1]); // EE/RE Impacts

    const ozoneSeasonNoxRates = ['0.143', '0.219'];

    cy.get('@noxRates')
      .next()
      .as('ozoneSeasonNoxRates')
      .children()
      .eq(1)
      .should('contain', ozoneSeasonNoxRates[0]) // Original
      .next()
      .next()
      .should('contain', ozoneSeasonNoxRates[1]); // EE/RE Impacts

    const co2Rates = ['0.506', '0.509'];

    cy.get('@ozoneSeasonNoxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .next()
      .should('contain', co2Rates[1]); // EE/RE Impacts

    const pm25Rates = ['0.028', '0.032'];

    cy.get('@co2Rates')
      .next()
      .as('pm25Rates')
      .children()
      .eq(1)
      .should('contain', pm25Rates[0]) // Original
      .next()
      .next()
      .should('contain', pm25Rates[1]); // EE/RE Impacts

    const vocsRates = ['0.017', '0.018'];

    cy.get('@pm25Rates')
      .next()
      .as('vocsRates')
      .children()
      .eq(1)
      .should('contain', vocsRates[0]) // Original
      .next()
      .next()
      .should('contain', vocsRates[1]); // EE/RE Impacts

    const nh3Rates = ['0.028', '0.031'];

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
    const connecticut = ['-120,550', '-235,730', '-474,440', '-31,190', '-18,300', '-28,450'];

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
    const maine = ['-47,500', '-56,760', '-310,430', '-12,480', '-6,370', '-6,850'];

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
    const massachusetts = ['-116,430', '-275,610', '-1,086,060', '-69,790', '-34,140', '-58,260'];

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
    const newHampshire = ['-140,840', '-246,370', '-402,820', '-26,420', '-6,140', '-23,760'];

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
    const rhodeIsland = ['-6,800', '-112,330', '-311,470', '-21,380', '-26,820', '-38,190'];

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
    const vermont = ['-90', '-9,500', '-13,500', '-1,860', '-2,040', '-930'];

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
