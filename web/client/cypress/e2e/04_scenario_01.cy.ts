describe("Test Scenario 1", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region").filter("option").parent().as("regionSelect"); // prettier-ignore
    cy.get("@regionSelect").select("New York");

    cy.findAllByText("Set Energy Impacts").filter(".avert-button").as("impactsBtn"); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Solar photovoltaic (PV)").as("toggleD");
    cy.get("@toggleD").click();

    cy.findByLabelText("Utility-scale solar PV total capacity:").as("utilitySolar"); // prettier-ignore
    cy.get("@utilitySolar").type("400");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("School buses:").as("schoolBuses");
    cy.get("@schoolBuses").type("200");

    cy.findByLabelText("ICE vehicles being replaced:").as("iceReplacementVehicle"); // prettier-ignore
    cy.get("@iceReplacementVehicle").select("Existing");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Including Vehicles) table displays the correct results", () => {
    const so2 = ["-24,400", "-30", "-24,430"];
    const nox = ["-257,570", "-11,950", "-269,520"];
    const co2 = ["-325,220", "-2,860", "-328,080"];
    const pm25 = ["-81,270", "-440", "-81,700"];
    const vocs = ["-19,530", "-2,320", "-21,850"];
    const nh3 = ["-39,220", "-310", "-39,530"];

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
