// config
import { type RegionId, regions } from "../../src/config";

describe("Select Region", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .as("regionsSelect");
  });

  it("Selecting a region in the “Select Region” dropdown menu highlights the corresponding region in the map", () => {
    for (const key in regions) {
      const { id, name } = regions[key as RegionId];
      cy.get("@regionsSelect").select(name);
      cy.get(`[data-avert-region-map] [data-region="${id}"]`)
        .parent()
        .should("have.attr", "data-active", "true");
    }
  });

  it("Clicking a region on the map selects the corresponding region in the “Select Region” dropdown menu", () => {
    for (const key in regions) {
      const { id } = regions[key as RegionId];
      cy.get(`[data-avert-region-map] [data-region="${id}"]`)
        .parent()
        .click({ force: true });
      cy.get("@regionsSelect").should("have.value", id);
    }
  });
});
