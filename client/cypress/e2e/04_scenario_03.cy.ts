describe("Test Scenario 3", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select State").filter("button").click();

    cy.findAllByText('Select State').filter('option').filter(':visible').parent().as('stateSelect'); // prettier-ignore
    cy.get("@stateSelect").select("Texas");

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Reductions spread evenly throughout the year").as("toggleA");
    cy.get("@toggleA").click();

    cy.findByLabelText("Reduce hourly generation by:").as("constantMwh");
    cy.get("@constantMwh").type("100");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("Light-duty plug-in hybrid EVs:").as("hybridEVs");
    cy.get("@hybridEVs").type("10000");

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

    cy.get("@so2").eq(1).should("contain", "-459,400");
    cy.get("@so2").eq(2).should("contain", "-240");
    cy.get("@so2").eq(3).should("contain", "-459,640");

    cy.get("@nox").eq(1).should("contain", "-533,120");
    cy.get("@nox").eq(2).should("contain", "-2,910");
    cy.get("@nox").eq(3).should("contain", "-536,030");

    cy.get("@co2").eq(1).should("contain", "-548,700");
    cy.get("@co2").eq(2).should("contain", "-22,820");
    cy.get("@co2").eq(3).should("contain", "-571,520");

    cy.get("@pm25").eq(1).should("contain", "-53,810");
    cy.get("@pm25").eq(2).should("contain", "-220");
    cy.get("@pm25").eq(3).should("contain", "-54,030");

    cy.get("@vocs").eq(1).should("contain", "-18,070");
    cy.get("@vocs").eq(2).should("contain", "-6,940");
    cy.get("@vocs").eq(3).should("contain", "-25,010");

    cy.get("@nh3").eq(1).should("contain", "-24,410");
    cy.get("@nh3").eq(2).should("contain", "-2,840");
    cy.get("@nh3").eq(3).should("contain", "-27,250");
  });
});
