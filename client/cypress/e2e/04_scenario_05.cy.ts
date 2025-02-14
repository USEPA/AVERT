describe("Test Scenario 5", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText('Select Region').filter('option').parent().as('regionSelect'); // prettier-ignore
    cy.get("@regionSelect").select("Carolinas");

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Reductions spread evenly throughout the year").as("toggleA");
    cy.get("@toggleA").click();

    cy.findByLabelText("Reduce hourly generation by:").as("constantMwh");
    cy.get("@constantMwh").type("100");

    cy.findByText("Wind").as("toggleC");
    cy.get("@toggleC").click();

    cy.findByLabelText("Onshore wind total capacity:").as("onshoreWind");
    cy.get("@onshoreWind").type("100");

    cy.findByLabelText("Offshore wind total capacity:").as("offshoreWind");
    cy.get("@offshoreWind").type("100");

    // cy.findByText('Solar photovoltaic (PV)').as('toggleD');
    // cy.get('@toggleD').click();

    cy.findByLabelText('Utility-scale solar PV total capacity:').as('utilitySolar'); // prettier-ignore
    cy.get("@utilitySolar").type("100");

    cy.findByLabelText('Distributed (rooftop) solar PV total capacity:').as('rooftopSolar'); // prettier-ignore
    cy.get("@rooftopSolar").type("100");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("Light-duty battery EVs:").as("batteryEVs");
    cy.get("@batteryEVs").type("10000");

    cy.findByLabelText("Light-duty plug-in hybrid EVs:").as("hybridEVs");
    cy.get("@hybridEVs").type("10000");

    cy.findByLabelText("Electric transit buses:").as("transitBuses");
    cy.get("@transitBuses").type("10");

    cy.findByLabelText("Electric school buses:").as("schoolBuses");
    cy.get("@schoolBuses").type("100");

    cy.findByLabelText("Location of EV deployment:").as("evDeploymentLocation");
    cy.get("@evDeploymentLocation").select("North Carolina");

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

    cy.get("@so2").eq(1).should("contain", "-640,980");
    cy.get("@so2").eq(2).should("contain", "-730");
    cy.get("@so2").eq(3).should("contain", "-641,710");

    cy.get("@nox").eq(1).should("contain", "-1,055,720");
    cy.get("@nox").eq(2).should("contain", "-16,410");
    cy.get("@nox").eq(3).should("contain", "-1,072,140");

    cy.get("@co2").eq(1).should("contain", "-1,146,620");
    cy.get("@co2").eq(2).should("contain", "-73,260");
    cy.get("@co2").eq(3).should("contain", "-1,219,880");

    cy.get("@pm25").eq(1).should("contain", "-198,150");
    cy.get("@pm25").eq(2).should("contain", "-840");
    cy.get("@pm25").eq(3).should("contain", "-198,990");

    cy.get("@vocs").eq(1).should("contain", "-100,940");
    cy.get("@vocs").eq(2).should("contain", "-23,690");
    cy.get("@vocs").eq(3).should("contain", "-124,630");

    cy.get("@nh3").eq(1).should("contain", "-63,260");
    cy.get("@nh3").eq(2).should("contain", "-9,250");
    cy.get("@nh3").eq(3).should("contain", "-72,500");
  });
});
