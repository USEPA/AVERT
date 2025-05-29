describe("Test Scenario 7", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region").filter("option").parent().as("regionSelect"); // prettier-ignore
    cy.get("@regionSelect").select("Rocky Mountains");

    cy.findAllByText("Set Energy Impacts").filter(".avert-button").as("impactsBtn"); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Reductions spread evenly throughout the year").as("toggleA");
    cy.get("@toggleA").click();

    cy.findByLabelText("Reduce hourly generation by:").as("hourlyMwReduction");
    cy.get("@hourlyMwReduction").type("100");

    cy.findByLabelText("Targeted program:", { exact: false }).as("targetedProgramReduction"); // prettier-ignore
    cy.get("@targetedProgramReduction").type("10");

    cy.findByText("% of hours").prev().as("topHours");
    cy.get("@topHours").type("10");

    cy.findByText("Wind").as("toggleC");
    cy.get("@toggleC").click();

    cy.findByLabelText("Onshore wind total capacity:").as("onshoreWind");
    cy.get("@onshoreWind").type("100");

    cy.findByLabelText("Utility-scale solar PV total capacity:").as("utilitySolar"); // prettier-ignore
    cy.get("@utilitySolar").type("100");

    cy.findByLabelText("Distributed (rooftop) solar PV total capacity:").as("rooftopSolar"); // prettier-ignore
    cy.get("@rooftopSolar").type("100");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("Light-duty battery EVs:").as("batteryEVs");
    cy.get("@batteryEVs").type("10000");

    cy.findByLabelText("Light-duty plug-in hybrid EVs:").as("hybridEVs");
    cy.get("@hybridEVs").type("10000");

    cy.findByLabelText("Transit buses:").as("transitBuses");
    cy.get("@transitBuses").type("10");

    cy.findByLabelText("School buses:").as("schoolBuses");
    cy.get("@schoolBuses").type("100");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Including Vehicles) table displays the correct results", () => {
    const so2 = ["-1,319,090", "-920", "-1,320,010"];
    const nox = ["-2,144,810", "-15,520", "-2,160,320"];
    const co2 = ["-2,072,160", "-67,910", "-2,140,070"];
    const pm25 = ["-130,450", "-1,740", "-132,190"];
    const vocs = ["-68,830", "-29,170", "-98,000"];
    const nh3 = ["-74,020", "-9,540", "-83,560"];

    /* prettier-ignore */
    cy.findByText("Total Emissions")
      .parent().next().children().as("so2")
      .parent().next().children().as("nox")
      .parent().next().children().as("co2")
      .parent().next().children().as("pm25")
      .parent().next().children().as("vocs")
      .parent().next().children().as("nh3");

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
