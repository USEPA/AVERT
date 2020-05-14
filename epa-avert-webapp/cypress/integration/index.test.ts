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
      const region = 'Southeast';
      cy.get('@regionsSelect').select(region);
      cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

      cy.findByText('Reductions spread evenly throughout the year').as(
        'toggleA',
      );
      cy.findByText('Percentage reductions in some or all hours').as('toggleB');
      cy.findByText('Wind').as('toggleC');
      cy.findByText('Utility-scale solar photovoltaic').as('toggleD');
      cy.findByText('Distributed (rooftop) solar photovoltaic').as('toggleE');
    });

    it('Toggle A inputs', () => {
      cy.get('@toggleA').click();
      cy.findByText('Reduce total annual generation by').next().as('annualGwh');
      cy.findByText('Reduce hourly generation by').next().as('constantMwh');
    });

    it('Toggle B inputs', () => {
      cy.get('@toggleB').click();
      cy.findByText('Broad-based program: Reduce generation by')
        .next()
        .as('broadProgram');
      cy.findByText('Targeted program: Reduce generation by')
        .next()
        .as('reduction');
      cy.findByText('% during the peak').next().as('topHours');
    });

    it('Toggle C inputs', () => {
      cy.get('@toggleC').click();
      cy.findAllByText('Total capacity:')
        .filter(':visible')
        .next()
        .as('windCapacity');
    });

    it('Toggle D inputs', () => {
      cy.get('@toggleD').click();
      cy.findAllByText('Total capacity:')
        .filter(':visible')
        .next()
        .as('utilitySolar');
    });

    it('Toggle E inputs', () => {
      cy.get('@toggleD').click();
      cy.findAllByText('Total capacity:')
        .filter(':visible')
        .next()
        .as('rooftopSolar');
    });
  });
});
