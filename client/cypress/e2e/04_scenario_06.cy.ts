describe("Test Scenario 6", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText('Select Region').filter('option').parent().as('regionSelect'); // prettier-ignore
    cy.get("@regionSelect").select("Mid-Atlantic");

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Wind").as("toggleC");
    cy.get("@toggleC").click();

    cy.findByLabelText("Offshore wind total capacity:").as("offshoreWind");
    cy.get("@offshoreWind").type("200");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("Electric transit buses:").as("transitBuses");
    cy.get("@transitBuses").type("100");

    cy.findByLabelText("Electric school buses:").as("schoolBuses");
    cy.get("@schoolBuses").type("500");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Including Vehicles) table displays the correct results", () => {
    /* prettier-ignore */
    cy.findByText('Total Emissions')
      .parent().next().children().as('so2')
      .parent().next().children().as('nox')
      .parent().next().children().as('co2')
      .parent().next().children().as('pm25')
      .parent().next().children().as('vocs')
      .parent().next().children().as('nh3');

    cy.get("@so2").eq(1).should("contain", "-459,140");
    cy.get("@so2").eq(2).should("contain", "-110");
    cy.get("@so2").eq(3).should("contain", "-459,250");

    cy.get("@nox").eq(1).should("contain", "-375,040");
    cy.get("@nox").eq(2).should("contain", "-28,890");
    cy.get("@nox").eq(3).should("contain", "-403,930");

    cy.get("@co2").eq(1).should("contain", "-429,430");
    cy.get("@co2").eq(2).should("contain", "-15,560");
    cy.get("@co2").eq(3).should("contain", "-444,990");

    cy.get("@pm25").eq(1).should("contain", "-53,650");
    cy.get("@pm25").eq(2).should("contain", "-160");
    cy.get("@pm25").eq(3).should("contain", "-53,810");

    cy.get("@vocs").eq(1).should("contain", "-11,930");
    cy.get("@vocs").eq(2).should("contain", "-4,760");
    cy.get("@vocs").eq(3).should("contain", "-16,690");

    cy.get("@nh3").eq(1).should("contain", "-14,900");
    cy.get("@nh3").eq(2).should("contain", "-1,910");
    cy.get("@nh3").eq(3).should("contain", "-16,820");
  });
});
