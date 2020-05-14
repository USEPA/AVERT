// config
import { RegionKeys, regions } from '../../src/app/config';

describe('AVERT', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .as('regionsSelect');
  });

  describe('Select Region', () => {
    it('Selecting a region in the “Select Region” dropdown menu highlights the corresponding region in the map', () => {
      for (const key in regions) {
        const { label, slug } = regions[key as RegionKeys];
        cy.get('@regionsSelect').select(label);
        cy.get(`#region-${slug.toLowerCase()}`)
          .parent()
          .should('have.attr', 'data-active', 'true');
      }
    });

    it('Clicking a region on the map selects the corresponding region in the “Select Region” dropdown menu', () => {
      for (const key in regions) {
        const { number, slug } = regions[key as RegionKeys];
        cy.get(`#region-${slug.toLowerCase()}`).parent().click({ force: true });
        cy.get('@regionsSelect').should('have.value', number.toString());
      }
    });
  });

  describe('Set EE/RE Impacts', () => {
    beforeEach(() => {
      const region = 'Rocky Mountains';
      cy.get('@regionsSelect').select(region);
      cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

      cy.findByText('Reductions spread evenly throughout the year').as(
        'toggleA',
      );
      cy.get('@toggleA').click();
      cy.findByText('Reduce total annual generation by').next().as('annualGwh');
      cy.findByText('Reduce hourly generation by').next().as('constantMwh');
      cy.get('@toggleA').click();

      cy.findByText('Percentage reductions in some or all hours').as('toggleB');
      cy.get('@toggleB').click();
      cy.findByText('Broad-based program: Reduce generation by')
        .next()
        .as('broadProgram');
      cy.findByText('Targeted program: Reduce generation by')
        .next()
        .as('reduction');
      cy.findByText('% during the peak').next().as('topHours');
      cy.get('@toggleB').click();

      cy.findByText('Wind').as('toggleC');
      cy.get('@toggleC').click();
      cy.findAllByText('Total capacity:')
        .filter(':visible')
        .next()
        .as('windCapacity');
      cy.get('@toggleC').click();

      cy.findByText('Utility-scale solar photovoltaic').as('toggleD');
      cy.get('@toggleD').click();
      cy.findAllByText('Total capacity:')
        .filter(':visible')
        .next()
        .as('utilitySolar');
      cy.get('@toggleD').click();

      cy.findByText('Distributed (rooftop) solar photovoltaic').as('toggleE');
      cy.get('@toggleE').click();
      cy.findAllByText('Total capacity:')
        .filter(':visible')
        .next()
        .as('rooftopSolar');
      cy.get('@toggleE').click();

      cy.findByText('Calculate EE/RE Impacts').as('calculateBtn');
    });

    it('Entering a value for wind capacity and clicking the calculate button displays the EE/RE profile chart', () => {
      const amount = '800';
      cy.get('@toggleC').click();
      cy.get('@windCapacity').type(amount);
      cy.get('@calculateBtn').click();

      cy.findByText('EE/RE profile based on values entered:');
    });
  });

  describe('Get Results', () => {
    beforeEach(() => {
      const region = 'Rocky Mountains';
      cy.get('@regionsSelect').select(region);
      cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

      const amount = '800';
      cy.findByText('Wind').click();
      cy.findAllByText('Total capacity:')
        .filter(':visible')
        .next()
        .type(amount);

      cy.findByText('Calculate EE/RE Impacts').click();

      cy.findAllByText('Get Results').filter('.avert-next').click();
    });

    it('TODO', () => {
      cy.findByText('Total emissions of fossil EGUs', { timeout: 60000 });
    });
  });
});
