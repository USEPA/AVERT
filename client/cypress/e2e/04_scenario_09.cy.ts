describe('Test Scenario 9', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select State').filter('button').click();

    cy.findAllByText('Select State').filter('option').filter(':visible').parent().as('stateSelect'); // prettier-ignore
    cy.get('@stateSelect').select('Florida');

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get('@impactsBtn').click();

    cy.findByText('Solar photovoltaic (PV)').as('toggleD');
    cy.get('@toggleD').click();

    cy.findByLabelText('Distributed (rooftop) solar PV total capacity:').as('rooftopSolar'); // prettier-ignore
    cy.get('@rooftopSolar').type('100');

    cy.findByText('Electric vehicles').as('toggleE');
    cy.get('@toggleE').click();

    cy.findByLabelText('Electric transit buses:').as('transitBuses');
    cy.get('@transitBuses').type('100');

    cy.findByLabelText('ICE vehicles being replaced:').as('iceReplacementVehicle'); // prettier-ignore
    cy.get('@iceReplacementVehicle').select('Existing');

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

    cy.get('@so2').eq(1).should('contain', '-35,730');
    cy.get('@so2').eq(2).should('contain', '-110');
    cy.get('@so2').eq(3).should('contain', '-35,840');

    cy.get('@nox').eq(1).should('contain', '-59,440');
    cy.get('@nox').eq(2).should('contain', '-41,460');
    cy.get('@nox').eq(3).should('contain', '-100,900');

    cy.get('@co2').eq(1).should('contain', '-86,800');
    cy.get('@co2').eq(2).should('contain', '-14,400');
    cy.get('@co2').eq(3).should('contain', '-101,210');

    cy.get('@pm25').eq(1).should('contain', '-10,530');
    cy.get('@pm25').eq(2).should('contain', '-430');
    cy.get('@pm25').eq(3).should('contain', '-10,960');

    cy.get('@vocs').eq(1).should('contain', '-2,620');
    cy.get('@vocs').eq(2).should('contain', '-10,190');
    cy.get('@vocs').eq(3).should('contain', '-12,820');

    cy.get('@nh3').eq(1).should('contain', '-5,240');
    cy.get('@nh3').eq(2).should('contain', '-1,990');
    cy.get('@nh3').eq(3).should('contain', '-7,240');
  });
});
