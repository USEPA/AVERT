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
      cy.get('@regionsSelect').select('Rocky Mountains');
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
      cy.findAllByText('Get Results').filter('.avert-next').as('resultsBtn');
    });

    it('Entering a value for wind capacity displays the EE/RE profile chart and enables the “Get Results” button', () => {
      cy.get('@toggleC').click();
      cy.get('@windCapacity').type('444');
      cy.get('@resultsBtn').should('have.class', 'avert-button-disabled');
      cy.get('@calculateBtn').click();
      cy.findByText('EE/RE profile based on values entered:');
      cy.get('@resultsBtn').should('not.have.class', 'avert-button-disabled');
    });

    it('Entering a value over the 15% threshold for wind capacity displays the warning message below the chart', () => {
      cy.get('@toggleC').click();
      cy.get('@windCapacity').type('888');
      cy.get('@calculateBtn').click();
      cy.findAllByText('WARNING:').filter(':visible');
      cy.findByText('25.06');
      cy.findByText('March 18 at 0:00 AM');
    });

    it('Entering a value over the 30% threshold for annual generation and wind capacity displays the error message below the chart', () => {
      cy.get('@toggleA').click();
      cy.get('@annualGwh').type('2222');
      cy.get('@toggleC').click();
      cy.get('@windCapacity').type('888');
      cy.get('@calculateBtn').click();
      cy.findAllByText('ERROR:').filter(':visible');
      cy.findByText('33.2');
      cy.findByText('March 18 at 0:00 AM');
    });

    it('Entering a value over the vaild limit for wind capacity displays the error message below the input', () => {
      cy.get('@toggleC').click();
      cy.get('@windCapacity').type('889');
      cy.findByText('Please enter a number between 0 and 888.6.');
      cy.get('@calculateBtn').should('have.class', 'avert-button-disabled');
      cy.get('@resultsBtn').should('have.class', 'avert-button-disabled');
    });
  });

  describe('Get Results', () => {
    beforeEach(() => {
      cy.get('@regionsSelect').select('Rocky Mountains');
      cy.findAllByText('Set EE/RE Impacts').filter('.avert-next').click();

      cy.findByText('Wind').click();
      cy.findAllByText('Total capacity:').filter(':visible').next().type('888');
      cy.findByText('Calculate EE/RE Impacts').click();
      cy.findAllByText('Get Results').filter('.avert-next').click();
      cy.findByText('LOADING...', { timeout: 60000 }).should('not.exist');
    });

    it('Annual Regional Displacements table should display the correct results', () => {
      cy.findByText('Generation (MWh)')
        .next()
        .should('contain', '49,701,740') // Original
        .next()
        .should('contain', '46,985,610') // Post-EE/RE
        .next()
        .should('contain', '-2,716,120'); // EE/RE Impacts

      cy.findByText('Total emissions of fossil EGUs')
        .parent()
        .as('emissionTotals');

      cy.get('@emissionTotals')
        .next()
        .as('so2Totals')
        .children()
        .eq(1)
        .should('contain', '43,727,730') // Original
        .next()
        .should('contain', '42,277,640') // Post-EE/RE
        .next()
        .should('contain', '-1,450,080'); // EE/RE Impacts

      cy.get('@so2Totals')
        .next()
        .as('noxTotals')
        .children()
        .eq(1)
        .should('contain', '54,606,950') // Original
        .next()
        .should('contain', '51,565,750') // Post-EE/RE
        .next()
        .should('contain', '-3,041,200'); // EE/RE Impacts

      cy.get('@noxTotals')
        .next()
        .as('co2Totals')
        .children()
        .eq(1)
        .should('contain', '46,303,390') // Original
        .next()
        .should('contain', '44,052,640') // Post-EE/RE
        .next()
        .should('contain', '-2,250,750'); // EE/RE Impacts

      cy.get('@co2Totals')
        .next()
        .as('pm25Totals')
        .children()
        .eq(1)
        .should('contain', '1,309,910') // Original
        .next()
        .should('contain', '1,229,080') // Post-EE/RE
        .next()
        .should('contain', '-80,820'); // EE/RE Impacts

      cy.findByText('Emission rates of fossil EGUs')
        .parent()
        .as('emissionRates');

      cy.get('@emissionRates')
        .next()
        .as('so2Rates')
        .children()
        .eq(1)
        .should('contain', '0.88') // Original
        .next()
        .should('contain', '0.90'); // Post-EE/RE

      cy.get('@so2Rates')
        .next()
        .as('noxRates')
        .children()
        .eq(1)
        .should('contain', '1.10') // Original
        .next()
        .should('contain', '1.10'); // Post-EE/RE

      cy.get('@noxRates')
        .next()
        .as('co2Rates')
        .children()
        .eq(1)
        .should('contain', '0.93') // Original
        .next()
        .should('contain', '0.94'); // Post-EE/RE

      cy.get('@co2Rates')
        .next()
        .as('pm25Rates')
        .children()
        .eq(1)
        .should('contain', '0.03') // Original
        .next()
        .should('contain', '0.03'); // Post-EE/RE
    });
  });
});
