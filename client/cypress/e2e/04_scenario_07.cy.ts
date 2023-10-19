describe('Test Scenario 7', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region').filter('option').parent().as('regionSelect'); // prettier-ignore
    cy.get('@regionSelect').select('Rocky Mountains');

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get('@impactsBtn').click();

    cy.findByText('Reductions spread evenly throughout the year').as('toggleA');
    cy.get('@toggleA').click();

    cy.findByLabelText('Reduce hourly generation by:').as('constantMwh');
    cy.get('@constantMwh').type('100');

    // cy.findByText('Percentage reductions in some or all hours').as('toggleB');
    // cy.get('@toggleB').click();

    cy.findByLabelText('Targeted program:', { exact: false }).as('reduction');
    cy.get('@reduction').type('10');

    cy.findByText('% of hours').prev().as('topHours');
    cy.get('@topHours').type('10');

    cy.findByText('Wind').as('toggleC');
    cy.get('@toggleC').click();

    cy.findByLabelText('Onshore wind total capacity:').as('onshoreWind');
    cy.get('@onshoreWind').type('100');

    // cy.findByText('Solar photovoltaic (PV)').as('toggleD');
    // cy.get('@toggleD').click();

    cy.findByLabelText('Utility-scale solar PV total capacity:').as('utilitySolar'); // prettier-ignore
    cy.get('@utilitySolar').type('100');

    cy.findByLabelText('Distributed (rooftop) solar PV total capacity:').as('rooftopSolar'); // prettier-ignore
    cy.get('@rooftopSolar').type('100');

    cy.findByText('Electric vehicles').as('toggleE');
    cy.get('@toggleE').click();

    cy.findByLabelText('Light-duty battery EVs:').as('batteryEVs');
    cy.get('@batteryEVs').type('10000');

    cy.findByLabelText('Light-duty plug-in hybrid EVs:').as('hybridEVs');
    cy.get('@hybridEVs').type('10000');

    cy.findByLabelText('Electric transit buses:').as('transitBuses');
    cy.get('@transitBuses').type('10');

    cy.findByLabelText('Electric school buses:').as('schoolBuses');
    cy.get('@schoolBuses').type('100');

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

    cy.get('@so2').eq(1).should('contain', '-1,195,410');
    cy.get('@so2').eq(2).should('contain', '-600');
    cy.get('@so2').eq(3).should('contain', '-1,196,010');

    cy.get('@nox').eq(1).should('contain', '-2,054,650');
    cy.get('@nox').eq(2).should('contain', '-13,330');
    cy.get('@nox').eq(3).should('contain', '-2,067,990');

    cy.get('@co2').eq(1).should('contain', '-2,015,560');
    cy.get('@co2').eq(2).should('contain', '-59,370');
    cy.get('@co2').eq(3).should('contain', '-2,074,930');

    cy.get('@pm25').eq(1).should('contain', '-77,810');
    cy.get('@pm25').eq(2).should('contain', '-860');
    cy.get('@pm25').eq(3).should('contain', '-78,680');

    cy.get('@vocs').eq(1).should('contain', '-74,500');
    cy.get('@vocs').eq(2).should('contain', '-26,770');
    cy.get('@vocs').eq(3).should('contain', '-101,270');

    cy.get('@nh3').eq(1).should('contain', '-74,340');
    cy.get('@nh3').eq(2).should('contain', '-7,550');
    cy.get('@nh3').eq(3).should('contain', '-81,890');
  });
});
