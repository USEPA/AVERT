describe("Test Scenario 1", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText('Select Region').filter('option').parent().as('regionSelect'); // prettier-ignore
    cy.get("@regionSelect").select("New York");

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Solar photovoltaic (PV)").as("toggleD");
    cy.get("@toggleD").click();

    cy.findByLabelText('Utility-scale solar PV total capacity:').as('utilitySolar'); // prettier-ignore
    cy.get("@utilitySolar").type("400");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("Electric school buses:").as("schoolBuses");
    cy.get("@schoolBuses").type("200");

    cy.findByLabelText('ICE vehicles being replaced:').as('iceReplacementVehicle'); // prettier-ignore
    cy.get("@iceReplacementVehicle").select("Existing");

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

    cy.get("@so2").eq(1).should("contain", "-126,880");
    cy.get("@so2").eq(2).should("contain", "-10");
    cy.get("@so2").eq(3).should("contain", "-126,890");

    cy.get("@nox").eq(1).should("contain", "-317,960");
    cy.get("@nox").eq(2).should("contain", "-8,090");
    cy.get("@nox").eq(3).should("contain", "-326,050");

    cy.get("@co2").eq(1).should("contain", "-346,080");
    cy.get("@co2").eq(2).should("contain", "-1,510");
    cy.get("@co2").eq(3).should("contain", "-347,590");

    cy.get("@pm25").eq(1).should("contain", "-96,390");
    cy.get("@pm25").eq(2).should("contain", "-270");
    cy.get("@pm25").eq(3).should("contain", "-96,650");

    cy.get("@vocs").eq(1).should("contain", "-43,840");
    cy.get("@vocs").eq(2).should("contain", "-870");
    cy.get("@vocs").eq(3).should("contain", "-44,700");

    cy.get("@nh3").eq(1).should("contain", "-45,260");
    cy.get("@nh3").eq(2).should("contain", "-120");
    cy.get("@nh3").eq(3).should("contain", "-45,380");
  });
});
