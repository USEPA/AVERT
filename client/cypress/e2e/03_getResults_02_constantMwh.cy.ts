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

    cy.get("@geneartion").eq(1).should("contain", "83,154,460");
    cy.get("@geneartion").eq(2).should("contain", "78,378,140");
    cy.get("@geneartion").eq(3).should("contain", "-4,776,320");

    cy.get("@so2Totals").eq(1).should("contain", "18,903,060");
    cy.get("@so2Totals").eq(2).should("contain", "17,894,050");
    cy.get("@so2Totals").eq(3).should("contain", "-1,009,010");

    cy.get("@noxTotals").eq(1).should("contain", "39,995,770");
    cy.get("@noxTotals").eq(2).should("contain", "37,820,830");
    cy.get("@noxTotals").eq(3).should("contain", "-2,174,940");

    cy.get("@ozoneNoxTotals").eq(1).should("contain", "19,482,170");
    cy.get("@ozoneNoxTotals").eq(2).should("contain", "18,349,800");
    cy.get("@ozoneNoxTotals").eq(3).should("contain", "-1,132,370");

    cy.get("@co2Totals").eq(1).should("contain", "52,249,930");
    cy.get("@co2Totals").eq(2).should("contain", "49,327,890");
    cy.get("@co2Totals").eq(3).should("contain", "-2,922,040");

    cy.get("@pm25Totals").eq(1).should("contain", "6,060,890");
    cy.get("@pm25Totals").eq(2).should("contain", "5,736,070");
    cy.get("@pm25Totals").eq(3).should("contain", "-324,820");

    cy.get("@vocsTotals").eq(1).should("contain", "2,084,640");
    cy.get("@vocsTotals").eq(2).should("contain", "1,971,960");
    cy.get("@vocsTotals").eq(3).should("contain", "-112,680");

    cy.get("@nh3Totals").eq(1).should("contain", "2,222,920");
    cy.get("@nh3Totals").eq(2).should("contain", "2,087,040");
    cy.get("@nh3Totals").eq(3).should("contain", "-135,870");

    cy.get("@so2Rates").eq(1).should("contain", "0.227");
    cy.get("@so2Rates").eq(3).should("contain", "0.211");

    cy.get("@noxRates").eq(1).should("contain", "0.481");
    cy.get("@noxRates").eq(3).should("contain", "0.455");

    cy.get("@ozoneNoxRates").eq(1).should("contain", "0.486");
    cy.get("@ozoneNoxRates").eq(3).should("contain", "0.568");

    cy.get("@co2Rates").eq(1).should("contain", "0.628");
    cy.get("@co2Rates").eq(3).should("contain", "0.612");

    cy.get("@pm25Rates").eq(1).should("contain", "0.073");
    cy.get("@pm25Rates").eq(3).should("contain", "0.068");

    cy.get("@vocsRates").eq(1).should("contain", "0.025");
    cy.get("@vocsRates").eq(3).should("contain", "0.024");

    cy.get("@nh3Rates").eq(1).should("contain", "0.027");
    cy.get("@nh3Rates").eq(3).should("contain", "0.028");
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
    cy.get("@azGen").eq(2).should("contain", "-807,930");
    cy.get("@azGen").eq(3).should("contain", "-1,499,150");
    cy.get("@azGen").eq(4).should("contain", "-2,190,540");
    cy.get("@azGen").eq(5).should("contain", "-207,300");
    cy.get("@azGen").eq(6).should("contain", "-74,680");
    cy.get("@azGen").eq(7).should("contain", "-97,160");

    cy.get("@azVehicles").eq(1).should("contain", "0");
    cy.get("@azVehicles").eq(2).should("contain", "0");
    cy.get("@azVehicles").eq(3).should("contain", "0");
    cy.get("@azVehicles").eq(4).should("contain", "0");
    cy.get("@azVehicles").eq(5).should("contain", "0");
    cy.get("@azVehicles").eq(6).should("contain", "0");

    cy.get("@azChange").eq(1).should("contain", "-807,930");
    cy.get("@azChange").eq(2).should("contain", "-1,499,150");
    cy.get("@azChange").eq(3).should("contain", "-2,190,540");
    cy.get("@azChange").eq(4).should("contain", "-207,300");
    cy.get("@azChange").eq(5).should("contain", "-74,680");
    cy.get("@azChange").eq(6).should("contain", "-97,160");

    // California
    cy.get("@caGen").eq(2).should("contain", "-730");
    cy.get("@caGen").eq(3).should("contain", "-8,710");
    cy.get("@caGen").eq(4).should("contain", "-72,910");
    cy.get("@caGen").eq(5).should("contain", "-6,580");
    cy.get("@caGen").eq(6).should("contain", "-2,020");
    cy.get("@caGen").eq(7).should("contain", "-4,620");

    cy.get("@caVehicles").eq(1).should("contain", "0");
    cy.get("@caVehicles").eq(2).should("contain", "0");
    cy.get("@caVehicles").eq(3).should("contain", "0");
    cy.get("@caVehicles").eq(4).should("contain", "0");
    cy.get("@caVehicles").eq(5).should("contain", "0");
    cy.get("@caVehicles").eq(6).should("contain", "0");

    cy.get("@caChange").eq(1).should("contain", "-730");
    cy.get("@caChange").eq(2).should("contain", "-8,710");
    cy.get("@caChange").eq(3).should("contain", "-72,910");
    cy.get("@caChange").eq(4).should("contain", "-6,580");
    cy.get("@caChange").eq(5).should("contain", "-2,020");
    cy.get("@caChange").eq(6).should("contain", "-4,620");

    // New Mexico
    cy.get("@nmGen").eq(2).should("contain", "-199,040");
    cy.get("@nmGen").eq(3).should("contain", "-535,270");
    cy.get("@nmGen").eq(4).should("contain", "-515,120");
    cy.get("@nmGen").eq(5).should("contain", "-96,110");
    cy.get("@nmGen").eq(6).should("contain", "-22,400");
    cy.get("@nmGen").eq(7).should("contain", "-23,640");

    cy.get("@nmVehicles").eq(1).should("contain", "0");
    cy.get("@nmVehicles").eq(2).should("contain", "0");
    cy.get("@nmVehicles").eq(3).should("contain", "0");
    cy.get("@nmVehicles").eq(4).should("contain", "0");
    cy.get("@nmVehicles").eq(5).should("contain", "0");
    cy.get("@nmVehicles").eq(6).should("contain", "0");

    cy.get("@nmChange").eq(1).should("contain", "-199,040");
    cy.get("@nmChange").eq(2).should("contain", "-535,270");
    cy.get("@nmChange").eq(3).should("contain", "-515,120");
    cy.get("@nmChange").eq(4).should("contain", "-96,110");
    cy.get("@nmChange").eq(5).should("contain", "-22,400");
    cy.get("@nmChange").eq(6).should("contain", "-23,640");

    // Texas
    cy.get("@txGen").eq(2).should("contain", "-1,320");
    cy.get("@txGen").eq(3).should("contain", "-131,810");
    cy.get("@txGen").eq(4).should("contain", "-143,470");
    cy.get("@txGen").eq(5).should("contain", "-14,830");
    cy.get("@txGen").eq(6).should("contain", "-13,580");
    cy.get("@txGen").eq(7).should("contain", "-10,450");

    cy.get("@txVehicles").eq(1).should("contain", "0");
    cy.get("@txVehicles").eq(2).should("contain", "0");
    cy.get("@txVehicles").eq(3).should("contain", "0");
    cy.get("@txVehicles").eq(4).should("contain", "0");
    cy.get("@txVehicles").eq(5).should("contain", "0");
    cy.get("@txVehicles").eq(6).should("contain", "0");

    cy.get("@txChange").eq(1).should("contain", "-1,320");
    cy.get("@txChange").eq(2).should("contain", "-131,810");
    cy.get("@txChange").eq(3).should("contain", "-143,470");
    cy.get("@txChange").eq(4).should("contain", "-14,830");
    cy.get("@txChange").eq(5).should("contain", "-13,580");
    cy.get("@txChange").eq(6).should("contain", "-10,450");
  });
});
