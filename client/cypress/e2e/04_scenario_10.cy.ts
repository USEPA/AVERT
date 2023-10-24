describe('Test Scenario 10', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region').filter('option').parent().as('regionSelect'); // prettier-ignore
    cy.get('@regionSelect').select('California');

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get('@impactsBtn').click();

    cy.findByText('Reductions spread evenly throughout the year').as('toggleA');
    cy.get('@toggleA').click();

    cy.findByLabelText('Broad-based program:', { exact: false }).as('broadProgram'); // prettier-ignore
    cy.get('@broadProgram').type('5');

    cy.findByText('Electric vehicles').as('toggleE');
    cy.get('@toggleE').click();

    cy.findByLabelText('Light-duty plug-in hybrid EVs:').as('hybridEVs');
    cy.get('@hybridEVs').type('200000');

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

    cy.get('@so2').eq(1).should('contain', '-250,170');
    cy.get('@so2').eq(2).should('contain', '-1,610');
    cy.get('@so2').eq(3).should('contain', '-251,780');

    cy.get('@nox').eq(1).should('contain', '-1,369,230');
    cy.get('@nox').eq(2).should('contain', '-50,170');
    cy.get('@nox').eq(3).should('contain', '-1,419,400');

    cy.get('@co2').eq(1).should('contain', '-2,201,350');
    cy.get('@co2').eq(2).should('contain', '-353,720');
    cy.get('@co2').eq(3).should('contain', '-2,555,070');

    cy.get('@pm25').eq(1).should('contain', '-200,290');
    cy.get('@pm25').eq(2).should('contain', '-3,510');
    cy.get('@pm25').eq(3).should('contain', '-203,810');

    cy.get('@vocs').eq(1).should('contain', '-65,240');
    cy.get('@vocs').eq(2).should('contain', '-97,440');
    cy.get('@vocs').eq(3).should('contain', '-162,680');

    cy.get('@nh3').eq(1).should('contain', '-136,790');
    cy.get('@nh3').eq(2).should('contain', '-45,080');
    cy.get('@nh3').eq(3).should('contain', '-181,880');
  });
});
