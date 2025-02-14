describe("Test Scenario 4", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select State").filter("button").click();

    cy.findAllByText('Select State').filter('option').filter(':visible').parent().as('stateSelect'); // prettier-ignore
    cy.get("@stateSelect").select("Alabama");

    cy.findAllByText('Set Energy Impacts').filter('.avert-button').as('impactsBtn'); // prettier-ignore
    cy.get("@impactsBtn").click();

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();

    cy.findByLabelText("Light-duty battery EVs:").as("batteryEVs");
    cy.get("@batteryEVs").type("15000000");

    cy.findByLabelText("EV model year:").as("evModelYear");
    cy.get("@evModelYear").select("2025");

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

    cy.get("@so2").eq(1).should("contain", "11,815,610");
    cy.get("@so2").eq(2).should("contain", "-706,310");
    cy.get("@so2").eq(3).should("contain", "11,109,300");

    cy.get("@nox").eq(1).should("contain", "27,120,100");
    cy.get("@nox").eq(2).should("contain", "-7,537,570");
    cy.get("@nox").eq(3).should("contain", "19,582,530");

    cy.get("@co2").eq(1).should("contain", "25,487,760");
    cy.get("@co2").eq(2).should("contain", "-69,945,400");
    cy.get("@co2").eq(3).should("contain", "-44,457,640");

    cy.get("@pm25").eq(1).should("contain", "2,866,560");
    cy.get("@pm25").eq(2).should("contain", "-752,090");
    cy.get("@pm25").eq(3).should("contain", "2,114,480");

    cy.get("@vocs").eq(1).should("contain", "1,012,290");
    cy.get("@vocs").eq(2).should("contain", "-20,817,720");
    cy.get("@vocs").eq(3).should("contain", "-19,805,420");

    cy.get("@nh3").eq(1).should("contain", "1,436,780");
    cy.get("@nh3").eq(2).should("contain", "-8,945,450");
    cy.get("@nh3").eq(3).should("contain", "-7,508,670");
  });
});
