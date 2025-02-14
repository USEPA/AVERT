describe("Get Results – constantMwh", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("Southwest");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Reductions spread evenly throughout the year").as("toggleA");
    cy.get("@toggleA").click();

    cy.findByLabelText("Reduce hourly generation by:").as("constantMwh");
    cy.get("@constantMwh").type("500");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Power Sector Only) table displays the correct results", () => {
    /* prettier-ignore */
    cy.findByText('Generation')
      .parent().parent().children().as('geneartion')
      .parent().next().next().children().as('so2Totals')
      .parent().next().children().as('noxTotals')
      .parent().next().children().as('ozoneNoxTotals')
      .parent().next().children().as('co2Totals')
      .parent().next().children().as('pm25Totals')
      .parent().next().children().as('vocsTotals')
      .parent().next().children().as('nh3Totals')
      .parent().next().next().children().as('so2Rates')
      .parent().next().children().as('noxRates')
      .parent().next().children().as('ozoneNoxRates')
      .parent().next().children().as('co2Rates')
      .parent().next().children().as('pm25Rates')
      .parent().next().children().as('vocsRates')
      .parent().next().children().as('nh3Rates');

    cy.get("@geneartion").eq(1).should("contain", "81,817,480");
    cy.get("@geneartion").eq(2).should("contain", "77,014,950");
    cy.get("@geneartion").eq(3).should("contain", "-4,802,530");

    cy.get("@so2Totals").eq(1).should("contain", "20,267,870");
    cy.get("@so2Totals").eq(2).should("contain", "19,247,090");
    cy.get("@so2Totals").eq(3).should("contain", "-1,020,780");

    cy.get("@noxTotals").eq(1).should("contain", "50,192,120");
    cy.get("@noxTotals").eq(2).should("contain", "48,129,550");
    cy.get("@noxTotals").eq(3).should("contain", "-2,062,570");

    cy.get("@ozoneNoxTotals").eq(1).should("contain", "23,510,450");
    cy.get("@ozoneNoxTotals").eq(2).should("contain", "22,553,800");
    cy.get("@ozoneNoxTotals").eq(3).should("contain", "-956,650");

    cy.get("@co2Totals").eq(1).should("contain", "56,778,630");
    cy.get("@co2Totals").eq(2).should("contain", "53,839,940");
    cy.get("@co2Totals").eq(3).should("contain", "-2,938,690");

    cy.get("@pm25Totals").eq(1).should("contain", "6,763,290");
    cy.get("@pm25Totals").eq(2).should("contain", "6,386,640");
    cy.get("@pm25Totals").eq(3).should("contain", "-376,650");

    cy.get("@vocsTotals").eq(1).should("contain", "1,821,690");
    cy.get("@vocsTotals").eq(2).should("contain", "1,729,740");
    cy.get("@vocsTotals").eq(3).should("contain", "-91,960");

    cy.get("@nh3Totals").eq(1).should("contain", "2,110,700");
    cy.get("@nh3Totals").eq(2).should("contain", "1,967,900");
    cy.get("@nh3Totals").eq(3).should("contain", "-142,800");

    cy.get("@so2Rates").eq(1).should("contain", "0.248");
    cy.get("@so2Rates").eq(3).should("contain", "0.213");

    cy.get("@noxRates").eq(1).should("contain", "0.613");
    cy.get("@noxRates").eq(3).should("contain", "0.429");

    cy.get("@ozoneNoxRates").eq(1).should("contain", "0.590");
    cy.get("@ozoneNoxRates").eq(3).should("contain", "0.475");

    cy.get("@co2Rates").eq(1).should("contain", "0.694");
    cy.get("@co2Rates").eq(3).should("contain", "0.612");

    cy.get("@pm25Rates").eq(1).should("contain", "0.083");
    cy.get("@pm25Rates").eq(3).should("contain", "0.078");

    cy.get("@vocsRates").eq(1).should("contain", "0.022");
    cy.get("@vocsRates").eq(3).should("contain", "0.019");

    cy.get("@nh3Rates").eq(1).should("contain", "0.026");
    cy.get("@nh3Rates").eq(3).should("contain", "0.030");
  });

  it("Annual Emissions Changes By State table displays the correct results", () => {
    cy.findByLabelText("All states").click({ force: true });

    /* prettier-ignore */
    cy.findAllByText('Arizona').filter('th')
      .parent().children().as('azGen')
      .parent().next().children().as('azVehicles')
      .parent().next().children().as('azChange')
      .parent().next().children().as('caGen')
      .parent().next().children().as('caVehicles')
      .parent().next().children().as('caChange')
      .parent().next().children().as('nmGen')
      .parent().next().children().as('nmVehicles')
      .parent().next().children().as('nmChange')
      .parent().next().children().as('txGen')
      .parent().next().children().as('txVehicles')
      .parent().next().children().as('txChange');

    // Arizona
    cy.get("@azGen").eq(2).should("contain", "-969,290");
    cy.get("@azGen").eq(3).should("contain", "-1,829,210");
    cy.get("@azGen").eq(4).should("contain", "-2,280,110");
    cy.get("@azGen").eq(5).should("contain", "-245,470");
    cy.get("@azGen").eq(6).should("contain", "-59,510");
    cy.get("@azGen").eq(7).should("contain", "-100,440");

    cy.get("@azVehicles").eq(1).should("contain", "0");
    cy.get("@azVehicles").eq(2).should("contain", "0");
    cy.get("@azVehicles").eq(3).should("contain", "0");
    cy.get("@azVehicles").eq(4).should("contain", "0");
    cy.get("@azVehicles").eq(5).should("contain", "0");
    cy.get("@azVehicles").eq(6).should("contain", "0");

    cy.get("@azChange").eq(1).should("contain", "-969,290");
    cy.get("@azChange").eq(2).should("contain", "-1,829,210");
    cy.get("@azChange").eq(3).should("contain", "-2,280,110");
    cy.get("@azChange").eq(4).should("contain", "-245,470");
    cy.get("@azChange").eq(5).should("contain", "-59,510");
    cy.get("@azChange").eq(6).should("contain", "-100,440");

    // California
    cy.get("@caGen").eq(2).should("contain", "-740");
    cy.get("@caGen").eq(3).should("contain", "-7,830");
    cy.get("@caGen").eq(4).should("contain", "-82,110");
    cy.get("@caGen").eq(5).should("contain", "-8,540");
    cy.get("@caGen").eq(6).should("contain", "-2,460");
    cy.get("@caGen").eq(7).should("contain", "-5,370");

    cy.get("@caVehicles").eq(1).should("contain", "0");
    cy.get("@caVehicles").eq(2).should("contain", "0");
    cy.get("@caVehicles").eq(3).should("contain", "0");
    cy.get("@caVehicles").eq(4).should("contain", "0");
    cy.get("@caVehicles").eq(5).should("contain", "0");
    cy.get("@caVehicles").eq(6).should("contain", "0");

    cy.get("@caChange").eq(1).should("contain", "-740");
    cy.get("@caChange").eq(2).should("contain", "-7,830");
    cy.get("@caChange").eq(3).should("contain", "-82,110");
    cy.get("@caChange").eq(4).should("contain", "-8,540");
    cy.get("@caChange").eq(5).should("contain", "-2,460");
    cy.get("@caChange").eq(6).should("contain", "-5,370");

    // New Mexico
    cy.get("@nmGen").eq(2).should("contain", "-49,610");
    cy.get("@nmGen").eq(3).should("contain", "-144,090");
    cy.get("@nmGen").eq(4).should("contain", "-455,320");
    cy.get("@nmGen").eq(5).should("contain", "-109,290");
    cy.get("@nmGen").eq(6).should("contain", "-18,870");
    cy.get("@nmGen").eq(7).should("contain", "-29,130");

    cy.get("@nmVehicles").eq(1).should("contain", "0");
    cy.get("@nmVehicles").eq(2).should("contain", "0");
    cy.get("@nmVehicles").eq(3).should("contain", "0");
    cy.get("@nmVehicles").eq(4).should("contain", "0");
    cy.get("@nmVehicles").eq(5).should("contain", "0");
    cy.get("@nmVehicles").eq(6).should("contain", "0");

    cy.get("@nmChange").eq(1).should("contain", "-49,610");
    cy.get("@nmChange").eq(2).should("contain", "-144,090");
    cy.get("@nmChange").eq(3).should("contain", "-455,320");
    cy.get("@nmChange").eq(4).should("contain", "-109,290");
    cy.get("@nmChange").eq(5).should("contain", "-18,870");
    cy.get("@nmChange").eq(6).should("contain", "-29,130");

    // Texas
    cy.get("@txGen").eq(2).should("contain", "-1,140");
    cy.get("@txGen").eq(3).should("contain", "-81,440");
    cy.get("@txGen").eq(4).should("contain", "-121,150");
    cy.get("@txGen").eq(5).should("contain", "-13,360");
    cy.get("@txGen").eq(6).should("contain", "-11,120");
    cy.get("@txGen").eq(7).should("contain", "-7,870");

    cy.get("@txVehicles").eq(1).should("contain", "0");
    cy.get("@txVehicles").eq(2).should("contain", "0");
    cy.get("@txVehicles").eq(3).should("contain", "0");
    cy.get("@txVehicles").eq(4).should("contain", "0");
    cy.get("@txVehicles").eq(5).should("contain", "0");
    cy.get("@txVehicles").eq(6).should("contain", "0");

    cy.get("@txChange").eq(1).should("contain", "-1,140");
    cy.get("@txChange").eq(2).should("contain", "-81,440");
    cy.get("@txChange").eq(3).should("contain", "-121,150");
    cy.get("@txChange").eq(4).should("contain", "-13,360");
    cy.get("@txChange").eq(5).should("contain", "-11,120");
    cy.get("@txChange").eq(6).should("contain", "-7,870");
  });
});
