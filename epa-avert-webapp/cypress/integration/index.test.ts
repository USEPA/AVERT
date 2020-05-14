// enums
import Regions, { RegionKeys } from '../../src/app/enums/Regions';

describe('AVERT', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Select Region', () => {
    beforeEach(() => {
      cy.findAllByText('Select Region')
        .filter('option')
        .parent()
        .as('regionsSelect');
    });

    it('Selecting a region in the “Select Region” dropdown menu highlights the corresponding region in the map', () => {
      for (const key in Regions) {
        const { label, slug } = Regions[key as RegionKeys];
        cy.get('@regionsSelect').select(label);
        cy.get(`#region-${slug.toLowerCase()}`)
          .parent()
          .should('have.attr', 'data-active', 'true');
      }
    });

    it('Clicking a region on the map selects the corresponding region in the “Select Region” dropdown menu', () => {
      for (const key in Regions) {
        const { number, slug } = Regions[key as RegionKeys];
        cy.get(`#region-${slug.toLowerCase()}`).parent().click({ force: true });
        cy.get('@regionsSelect').should('have.value', number.toString());
      }
    });
  });
});
