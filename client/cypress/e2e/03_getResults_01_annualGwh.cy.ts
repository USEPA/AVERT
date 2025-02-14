describe("Get Results – annualGwh", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("Southwest");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Reductions spread evenly throughout the year").as("toggleA");
    cy.get("@toggleA").click();

    cy.findByLabelText("Reduce total annual generation by:").as("annualGwh");
    cy.get("@annualGwh").type("5000");

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
    cy.get("@geneartion").eq(2).should("contain", "76,337,370");
    cy.get("@geneartion").eq(3).should("contain", "-5,480,110");

    cy.get("@so2Totals").eq(1).should("contain", "20,267,870");
    cy.get("@so2Totals").eq(2).should("contain", "19,101,360");
    cy.get("@so2Totals").eq(3).should("contain", "-1,166,500");

    cy.get("@noxTotals").eq(1).should("contain", "50,192,120");
    cy.get("@noxTotals").eq(2).should("contain", "47,838,960");
    cy.get("@noxTotals").eq(3).should("contain", "-2,353,150");

    cy.get("@ozoneNoxTotals").eq(1).should("contain", "23,510,450");
    cy.get("@ozoneNoxTotals").eq(2).should("contain", "22,419,170");
    cy.get("@ozoneNoxTotals").eq(3).should("contain", "-1,091,280");

    cy.get("@co2Totals").eq(1).should("contain", "56,778,630");
    cy.get("@co2Totals").eq(2).should("contain", "53,423,830");
    cy.get("@co2Totals").eq(3).should("contain", "-3,354,800");

    cy.get("@pm25Totals").eq(1).should("contain", "6,763,290");
    cy.get("@pm25Totals").eq(2).should("contain", "6,332,970");
    cy.get("@pm25Totals").eq(3).should("contain", "-430,320");

    cy.get("@vocsTotals").eq(1).should("contain", "1,821,690");
    cy.get("@vocsTotals").eq(2).should("contain", "1,716,770");
    cy.get("@vocsTotals").eq(3).should("contain", "-104,930");

    cy.get("@nh3Totals").eq(1).should("contain", "2,110,700");
    cy.get("@nh3Totals").eq(2).should("contain", "1,948,170");
    cy.get("@nh3Totals").eq(3).should("contain", "-162,530");

    cy.get("@so2Rates").eq(1).should("contain", "0.248");
    cy.get("@so2Rates").eq(3).should("contain", "0.213");

    cy.get("@noxRates").eq(1).should("contain", "0.613");
    cy.get("@noxRates").eq(3).should("contain", "0.429");

    cy.get("@ozoneNoxRates").eq(1).should("contain", "0.590");
    cy.get("@ozoneNoxRates").eq(3).should("contain", "0.475");

    cy.get("@co2Rates").eq(1).should("contain", "0.694");
    cy.get("@co2Rates").eq(3).should("contain", "0.612");

    cy.get("@pm25Rates").eq(1).should("contain", "0.083");
    cy.get("@pm25Rates").eq(3).should("contain", "0.079");

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
    cy.get("@azGen").eq(2).should("contain", "-1,105,350");
    cy.get("@azGen").eq(3).should("contain", "-2,083,050");
    cy.get("@azGen").eq(4).should("contain", "-2,598,270");
    cy.get("@azGen").eq(5).should("contain", "-279,610");
    cy.get("@azGen").eq(6).should("contain", "-67,750");
    cy.get("@azGen").eq(7).should("contain", "-114,310");

    cy.get("@azVehicles").eq(1).should("contain", "0");
    cy.get("@azVehicles").eq(2).should("contain", "0");
    cy.get("@azVehicles").eq(3).should("contain", "0");
    cy.get("@azVehicles").eq(4).should("contain", "0");
    cy.get("@azVehicles").eq(5).should("contain", "0");
    cy.get("@azVehicles").eq(6).should("contain", "0");

    cy.get("@azChange").eq(1).should("contain", "-1,105,350");
    cy.get("@azChange").eq(2).should("contain", "-2,083,050");
    cy.get("@azChange").eq(3).should("contain", "-2,598,270");
    cy.get("@azChange").eq(4).should("contain", "-279,610");
    cy.get("@azChange").eq(5).should("contain", "-67,750");
    cy.get("@azChange").eq(6).should("contain", "-114,310");

    // California
    cy.get("@caGen").eq(2).should("contain", "-840");
    cy.get("@caGen").eq(3).should("contain", "-8,860");
    cy.get("@caGen").eq(4).should("contain", "-94,000");
    cy.get("@caGen").eq(5).should("contain", "-9,770");
    cy.get("@caGen").eq(6).should("contain", "-2,810");
    cy.get("@caGen").eq(7).should("contain", "-6,140");

    cy.get("@caVehicles").eq(1).should("contain", "0");
    cy.get("@caVehicles").eq(2).should("contain", "0");
    cy.get("@caVehicles").eq(3).should("contain", "0");
    cy.get("@caVehicles").eq(4).should("contain", "0");
    cy.get("@caVehicles").eq(5).should("contain", "0");
    cy.get("@caVehicles").eq(6).should("contain", "0");

    cy.get("@caChange").eq(1).should("contain", "-840");
    cy.get("@caChange").eq(2).should("contain", "-8,860");
    cy.get("@caChange").eq(3).should("contain", "-94,000");
    cy.get("@caChange").eq(4).should("contain", "-9,770");
    cy.get("@caChange").eq(5).should("contain", "-2,810");
    cy.get("@caChange").eq(6).should("contain", "-6,140");

    // New Mexico
    cy.get("@nmGen").eq(2).should("contain", "-59,000");
    cy.get("@nmGen").eq(3).should("contain", "-168,680");
    cy.get("@nmGen").eq(4).should("contain", "-524,350");
    cy.get("@nmGen").eq(5).should("contain", "-125,690");
    cy.get("@nmGen").eq(6).should("contain", "-21,650");
    cy.get("@nmGen").eq(7).should("contain", "-33,120");

    cy.get("@nmVehicles").eq(1).should("contain", "0");
    cy.get("@nmVehicles").eq(2).should("contain", "0");
    cy.get("@nmVehicles").eq(3).should("contain", "0");
    cy.get("@nmVehicles").eq(4).should("contain", "0");
    cy.get("@nmVehicles").eq(5).should("contain", "0");
    cy.get("@nmVehicles").eq(6).should("contain", "0");

    cy.get("@nmChange").eq(1).should("contain", "-59,000");
    cy.get("@nmChange").eq(2).should("contain", "-168,680");
    cy.get("@nmChange").eq(3).should("contain", "-524,350");
    cy.get("@nmChange").eq(4).should("contain", "-125,690");
    cy.get("@nmChange").eq(5).should("contain", "-21,650");
    cy.get("@nmChange").eq(6).should("contain", "-33,120");

    // Texas
    cy.get("@txGen").eq(2).should("contain", "-1,310");
    cy.get("@txGen").eq(3).should("contain", "-92,560");
    cy.get("@txGen").eq(4).should("contain", "-138,180");
    cy.get("@txGen").eq(5).should("contain", "-15,240");
    cy.get("@txGen").eq(6).should("contain", "-12,710");
    cy.get("@txGen").eq(7).should("contain", "-8,960");

    cy.get("@txVehicles").eq(1).should("contain", "0");
    cy.get("@txVehicles").eq(2).should("contain", "0");
    cy.get("@txVehicles").eq(3).should("contain", "0");
    cy.get("@txVehicles").eq(4).should("contain", "0");
    cy.get("@txVehicles").eq(5).should("contain", "0");
    cy.get("@txVehicles").eq(6).should("contain", "0");

    cy.get("@txChange").eq(1).should("contain", "-1,310");
    cy.get("@txChange").eq(2).should("contain", "-92,560");
    cy.get("@txChange").eq(3).should("contain", "-138,180");
    cy.get("@txChange").eq(4).should("contain", "-15,240");
    cy.get("@txChange").eq(5).should("contain", "-12,710");
    cy.get("@txChange").eq(6).should("contain", "-8,960");
  });
});
