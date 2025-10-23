// config
import { StateId, states } from "../../src/config";

describe("Select State", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select State").filter("button").click();

    cy.findAllByText("Select State")
      .filter("option")
      .filter(":visible")
      .parent()
      .as("statesSelect");
  });

  it("Selecting a state in the “Select State dropdown menu highlights the corresponding state in the map", () => {
    for (const key in states) {
      const { id, name } = states[key as StateId];
      cy.get("@statesSelect").select(name);
      cy.get(`[data-avert-state-map] [data-state="${id}"]`)
        .parent()
        .should("have.attr", "data-active", "true");
    }
  });

  it("Clicking a state on the map selects the corresponding state in the “Select State” dropdown menu", () => {
    for (const key in states) {
      const { id } = states[key as StateId];
      cy.get(`[data-avert-state-map] [data-state="${id}"]`)
        .parent()
        .click({ force: true });
      cy.get("@statesSelect").should("have.value", id);
    }
  });
});
