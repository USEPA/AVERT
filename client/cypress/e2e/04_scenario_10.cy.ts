describe("Test Scenario 10", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region").filter("option").parent().as("regionSelect"); // prettier-ignore
    cy.get("@regionSelect").select("California");

    cy.findAllByText("Set Energy Impacts").filter(".avert-button").as("impactsBtn"); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Percentage reductions in some or all hours").as("toggleB");
    cy.get("@toggleB").click();

    cy.findByLabelText("Broad-based program:", { exact: false }).as("broadProgramReduction"); // prettier-ignore
    cy.get("@broadProgramReduction").type("5");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("Light-duty plug-in hybrid EVs:").as("hybridEVs");
    cy.get("@hybridEVs").type("200000");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Including Vehicles) table displays the correct results", () => {
    const so2 = ["-166,320", "-3,660", "-169,980"];
    const nox = ["-803,300", "-57,020", "-860,320"];
    const co2 = ["-1,761,580", "-474,340", "-2,235,930"];
    const pm25 = ["-147,030", "-8,940", "-155,960"];
    const vocs = ["-51,260", "-117,150", "-168,410"];
    const nh3 = ["-107,770", "-55,360", "-163,120"];

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
