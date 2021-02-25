describe('Get Results – broadProgram', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('New England');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Percentage reductions in some or all hours').click();
    cy.findByText('Broad-based program: Reduce generation by')
      .next()
      .type('10');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    const generation = ['38,646,290', '34,480,570', '-4,165,710'];

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

    const so2Totals = ['1,593,280', '1,136,360', '-456,910'];

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

    const noxTotals = ['7,868,290', '6,841,060', '-1,027,230'];

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

    const co2Totals = ['20,985,550', '18,798,770', '-2,186,780'];

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

    const pm25Totals = ['1,125,940', '1,003,860', '-122,080'];

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

    const co2Rates = ['0.54', '0.55'];

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
    const connecticut = ['-52,869', '-288,219', '-517,384', '-40,331'];

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

    const massachusetts = ['-174,647', '-308,353', '-911,361', '-59,781'];

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

    const maine = ['-21,083', '-51,951', '-148,247', '-9,873'];

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

    const newHampshire = ['-202,912', '-286,851', '-321,482', '-8,453'];

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

    const rhodeIsland = ['-5,251', '-73,915', '-260,600', '-3,513'];

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

    const vermont = ['-156', '-17,947', '-27,707', '-131'];

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
