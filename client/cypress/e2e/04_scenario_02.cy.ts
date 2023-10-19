describe('Test Scenario 2', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region').filter('option').parent().as('regionSelect'); // prettier-ignore
    cy.get('@regionSelect').select('New England');

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get('@impactsBtn').click();

    cy.findByText('Wind').as('toggleC');
    cy.get('@toggleC').click();

    cy.findByLabelText('Onshore wind total capacity:').as('onshoreWind');
    cy.get('@onshoreWind').type('100');

    cy.findByText('Electric vehicles').as('toggleE');
    cy.get('@toggleE').click();

    cy.findByLabelText('Light-duty battery EVs:').as('batteryEVs');
    cy.get('@batteryEVs').type('1000');

    cy.findByLabelText('EV model year:').as('evModelYear');
    cy.get('@evModelYear').select('2025');

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

    cy.get('@so2').eq(1).should('contain', '-49,900');
    cy.get('@so2').eq(2).should('contain', '-40');
    cy.get('@so2').eq(3).should('contain', '-49,940');

    cy.get('@nox').eq(1).should('contain', '-54,280');
    cy.get('@nox').eq(2).should('contain', '-550');
    cy.get('@nox').eq(3).should('contain', '-54,830');

    cy.get('@co2').eq(1).should('contain', '-122,730');
    cy.get('@co2').eq(2).should('contain', '-3,820');
    cy.get('@co2').eq(3).should('contain', '-126,550');

    cy.get('@pm25').eq(1).should('contain', '-9,600');
    cy.get('@pm25').eq(2).should('contain', '-50');
    cy.get('@pm25').eq(3).should('contain', '-9,650');

    cy.get('@vocs').eq(1).should('contain', '-4,780');
    cy.get('@vocs').eq(2).should('contain', '-1,570');
    cy.get('@vocs').eq(3).should('contain', '-6,360');

    cy.get('@nh3').eq(1).should('contain', '-6,840');
    cy.get('@nh3').eq(2).should('contain', '-500');
    cy.get('@nh3').eq(3).should('contain', '-7,330');
  });
});
