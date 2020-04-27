// enums
import Regions from '../../src/app/enums/Regions';

describe('AVERT', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Select Region', () => {
    beforeEach(() => {
      cy.findAllByText('Select Region')
        .filter('option')
        .parent()
        .as('regions');
    });

    it('Select each region from the regions select', () => {
      for (const RegionName in Regions) {
        cy.get('@regions').select(Regions[RegionName].label);
      }
    });
  });
});
