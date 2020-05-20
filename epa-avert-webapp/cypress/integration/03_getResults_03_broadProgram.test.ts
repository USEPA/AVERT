describe('Get Results – broadProgram', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Rocky Mountains');
    cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

    cy.findByText('Percentage reductions in some or all hours').click();
    cy.findByText('Broad-based program: Reduce generation by')
      .next()
      .type('22');
    cy.findByText('Calculate EE/RE Impacts').click();
    cy.findAllByText('Get Results').filter('.avert-next').click();
    cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
  });

  it('Annual Regional Displacements table displays the correct results', () => {
    //
  });

  it('Annual State Emission Changes table displays the correct results', () => {
    //
  });
});
