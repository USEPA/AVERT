describe("Test Scenario 8", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText('Select Region').filter('option').parent().as('regionSelect'); // prettier-ignore
    cy.get("@regionSelect").select("Northwest");

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Reductions spread evenly throughout the year").as("toggleA");
    cy.get("@toggleA").click();

    cy.findByLabelText("Reduce hourly generation by:").as("constantMwh");
    cy.get("@constantMwh").type("50");

    cy.findByText("Wind").as("toggleC");
    cy.get("@toggleC").click();

    cy.findByLabelText("Onshore wind total capacity:").as("onshoreWind");
    cy.get("@onshoreWind").type("200");

    cy.findByLabelText('Utility-scale solar PV total capacity:').as('utilitySolar'); // prettier-ignore
    cy.get("@utilitySolar").type("100");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("Light-duty battery EVs:").as("batteryEVs");
    cy.get("@batteryEVs").type("5000");

    cy.findByLabelText("Light-duty plug-in hybrid EVs:").as("hybridEVs");
    cy.get("@hybridEVs").type("5000");

    cy.findByLabelText("Electric transit buses:").as("transitBuses");
    cy.get("@transitBuses").type("10");

    cy.findByLabelText("Electric school buses:").as("schoolBuses");
    cy.get("@schoolBuses").type("50");

    cy.findByLabelText("Location of EV deployment:").as("evDeploymentLocation");
    cy.get("@evDeploymentLocation").select("Oregon");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Including Vehicles) table displays the correct results", () => {
    const so2 = ["-558,770", "-250", "-559,020"];
    const nox = ["-1,005,480", "-6,770", "-1,012,260"];
    const co2 = ["-850,220", "-24,990", "-875,210"];
    const pm25 = ["-97,600", "-310", "-97,910"];
    const vocs = ["-34,050", "-9,220", "-43,270"];
    const nh3 = ["-22,590", "-3,180", "-25,770"];

    /* prettier-ignore */
    cy.findByText('Total Emissions')
      .parent().next().children().as('so2')
      .parent().next().children().as('nox')
      .parent().next().children().as('co2')
      .parent().next().children().as('pm25')
      .parent().next().children().as('vocs')
      .parent().next().children().as('nh3');

    cy.get("@so2").eq(1).should("contain", so2[0]);
    cy.get("@so2").eq(2).should("contain", so2[1]);
    cy.get("@so2").eq(3).should("contain", so2[2]);

    cy.get("@nox").eq(1).should("contain", nox[0]);
    cy.get("@nox").eq(2).should("contain", nox[1]);
    cy.get("@nox").eq(3).should("contain", nox[2]);

    cy.get("@co2").eq(1).should("contain", co2[0]);
    cy.get("@co2").eq(2).should("contain", co2[1]);
    cy.get("@co2").eq(3).should("contain", co2[2]);

    cy.get("@pm25").eq(1).should("contain", pm25[0]);
    cy.get("@pm25").eq(2).should("contain", pm25[1]);
    cy.get("@pm25").eq(3).should("contain", pm25[2]);

    cy.get("@vocs").eq(1).should("contain", vocs[0]);
    cy.get("@vocs").eq(2).should("contain", vocs[1]);
    cy.get("@vocs").eq(3).should("contain", vocs[2]);

    cy.get("@nh3").eq(1).should("contain", nh3[0]);
    cy.get("@nh3").eq(2).should("contain", nh3[1]);
    cy.get("@nh3").eq(3).should("contain", nh3[2]);
  });
});
