describe('Get Results – reduction & topHours', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('New England');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Percentage reductions in some or all hours').click();
    cy.findByText('Targeted program: Reduce generation by').next().type('15');
    cy.findByText('% during the peak').next().type('50');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['38,646,290', '34,572,510', '-4,073,770'];

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

    const so2Totals = ['1,593,280', '1,020,500', '-572,770'];

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

    const noxTotals = ['7,868,290', '6,753,790', '-1,114,500'];

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

    const co2Totals = ['20,985,550', '18,827,660', '-2,157,880'];

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

    const pm25Totals = ['1,125,940', '1,000,070', '-125,860'];

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

    const so2Rates = ['0.04', '0.03'];

    cy.get('@emissionRates')
      .next()
      .as('so2Rates')
      .children()
      .eq(1)
      .should('contain', so2Rates[0]) // Original
      .next()
      .should('contain', so2Rates[1]); // Post-EE/RE

    const noxRates = ['0.20', '0.20'];

    cy.get('@so2Rates')
      .next()
      .as('noxRates')
      .children()
      .eq(1)
      .should('contain', noxRates[0]) // Original
      .next()
      .should('contain', noxRates[1]); // Post-EE/RE

    const co2Rates = ['0.54', '0.54'];

    cy.get('@noxRates')
      .next()
      .as('co2Rates')
      .children()
      .eq(1)
      .should('contain', co2Rates[0]) // Original
      .next()
      .should('contain', co2Rates[1]); // Post-EE/RE

    const pm25Rates = ['0.03', '0.03'];

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
    const connecticut = ['-66,040', '-297,331', '-405,436', '-30,915'];

    cy.findByText('Connecticut')
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
      .should('contain', connecticut[3]); // PM2.5 (lbs)

    const massachusetts = ['-222,581', '-353,669', '-948,073', '-70,123'];

    cy.get('@connecticut')
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
      .should('contain', massachusetts[3]); // PM2.5 (lbs)

    const maine = ['-30,630', '-55,684', '-175,542', '-11,781'];

    cy.get('@massachusetts')
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
      .should('contain', maine[3]); // PM2.5 (lbs)

    const newHampshire = ['-248,961', '-334,349', '-373,903', '-9,834'];

    cy.get('@maine')
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
      .should('contain', newHampshire[3]); // PM2.5 (lbs)

    const rhodeIsland = ['-4,464', '-59,031', '-233,233', '-3,113'];

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
      .should('contain', rhodeIsland[3]); // PM2.5 (lbs)

    const vermont = ['-101', '-14,442', '-21,700', '-103'];

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
      .should('contain', vermont[3]); // PM2.5 (lbs)
  });
});
