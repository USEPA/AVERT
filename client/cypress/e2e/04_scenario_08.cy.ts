describe('Test Scenario 8', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region').filter('option').parent().as('regionSelect'); // prettier-ignore
    cy.get('@regionSelect').select('Northwest');

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get('@impactsBtn').click();

    cy.findByText('Reductions spread evenly throughout the year').as('toggleA');
    cy.get('@toggleA').click();

    cy.findByLabelText('Reduce hourly generation by:').as('constantMwh');
    cy.get('@constantMwh').type('50');

    cy.findByText('Wind').as('toggleC');
    cy.get('@toggleC').click();

    cy.findByLabelText('Onshore wind total capacity:').as('onshoreWind');
    cy.get('@onshoreWind').type('200');

    // cy.findByText('Solar photovoltaic (PV)').as('toggleD');
    // cy.get('@toggleD').click();

    cy.findByLabelText('Utility-scale solar PV total capacity:').as('utilitySolar'); // prettier-ignore
    cy.get('@utilitySolar').type('100');

    cy.findByText('Electric vehicles').as('toggleE');
    cy.get('@toggleE').click();

    cy.findByLabelText('Light-duty battery EVs:').as('batteryEVs');
    cy.get('@batteryEVs').type('5000');

    cy.findByLabelText('Light-duty plug-in hybrid EVs:').as('hybridEVs');
    cy.get('@hybridEVs').type('5000');

    cy.findByLabelText('Electric transit buses:').as('transitBuses');
    cy.get('@transitBuses').type('10');

    cy.findByLabelText('Electric school buses:').as('schoolBuses');
    cy.get('@schoolBuses').type('50');

    cy.findByLabelText('Location of EV deployment:').as('evDeploymentLocation');
    cy.get('@evDeploymentLocation').select('Oregon');

    cy.findByText('Calculate Energy Impacts').as('calculateBtn');
    cy.get('@calculateBtn').click();

    cy.findAllByText('Get Results').filter('.avert-button').as('resultsBtn');
    cy.get('@resultsBtn').click();

    cy.findByText('LOADING...', { timeout: 120000 }).should('not.exist');
  });

  it('Annual Emissions Changes (Including Vehicles) table displays the correct results', () => {
    /* prettier-ignore */
    cy.findByText('Total Emissions')
      .parent().next().children().as('so2')
      .parent().next().children().as('nox')
      .parent().next().children().as('co2')
      .parent().next().children().as('pm25')
      .parent().next().children().as('vocs')
      .parent().next().children().as('nh3');

    cy.get('@so2').eq(1).should('contain', '-446,600');
    cy.get('@so2').eq(2).should('contain', '-250');
    cy.get('@so2').eq(3).should('contain', '-446,850');

    cy.get('@nox').eq(1).should('contain', '-828,450');
    cy.get('@nox').eq(2).should('contain', '-7,260');
    cy.get('@nox').eq(3).should('contain', '-835,710');

    cy.get('@co2').eq(1).should('contain', '-787,620');
    cy.get('@co2').eq(2).should('contain', '-25,290');
    cy.get('@co2').eq(3).should('contain', '-812,910');

    cy.get('@pm25').eq(1).should('contain', '-91,220');
    cy.get('@pm25').eq(2).should('contain', '-310');
    cy.get('@pm25').eq(3).should('contain', '-91,540');

    cy.get('@vocs').eq(1).should('contain', '-27,690');
    cy.get('@vocs').eq(2).should('contain', '-9,340');
    cy.get('@vocs').eq(3).should('contain', '-37,030');

    cy.get('@nh3').eq(1).should('contain', '-28,410');
    cy.get('@nh3').eq(2).should('contain', '-3,230');
    cy.get('@nh3').eq(3).should('contain', '-31,640');
  });
});
