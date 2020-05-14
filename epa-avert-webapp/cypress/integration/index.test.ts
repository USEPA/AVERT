// enums
import Regions, { RegionKeys } from '../../src/app/enums/Regions';

describe('AVERT', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Regions Select', () => {
    beforeEach(() => {
      cy.findAllByText('Select Region')
        .filter('option')
        .parent()
        .as('regionsSelect');
    });

    it('Select changes should highlight the corresponding region on the map', () => {
      for (const key in Regions) {
        const { label, slug } = Regions[key as RegionKeys];
        cy.get('@regionsSelect').select(label);
        cy.get(`#region-${slug.toLowerCase()}`).parent(); // TODO assert data-active is true
      }
    });
  });
});
