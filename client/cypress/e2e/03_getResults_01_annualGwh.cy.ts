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

    cy.get("@geneartion").eq(1).should("contain", "83,154,460");
    cy.get("@geneartion").eq(2).should("contain", "77,698,330");
    cy.get("@geneartion").eq(3).should("contain", "-5,456,130");

    cy.get("@so2Totals").eq(1).should("contain", "18,903,060");
    cy.get("@so2Totals").eq(2).should("contain", "17,752,370");
    cy.get("@so2Totals").eq(3).should("contain", "-1,150,690");

    cy.get("@noxTotals").eq(1).should("contain", "39,995,770");
    cy.get("@noxTotals").eq(2).should("contain", "37,516,980");
    cy.get("@noxTotals").eq(3).should("contain", "-2,478,790");

    cy.get("@ozoneNoxTotals").eq(1).should("contain", "19,482,170");
    cy.get("@ozoneNoxTotals").eq(2).should("contain", "18,192,350");
    cy.get("@ozoneNoxTotals").eq(3).should("contain", "-1,289,820");

    cy.get("@co2Totals").eq(1).should("contain", "52,249,930");
    cy.get("@co2Totals").eq(2).should("contain", "48,916,370");
    cy.get("@co2Totals").eq(3).should("contain", "-3,333,560");

    cy.get("@pm25Totals").eq(1).should("contain", "6,060,890");
    cy.get("@pm25Totals").eq(2).should("contain", "5,690,910");
    cy.get("@pm25Totals").eq(3).should("contain", "-369,980");

    cy.get("@vocsTotals").eq(1).should("contain", "2,084,640");
    cy.get("@vocsTotals").eq(2).should("contain", "1,956,270");
    cy.get("@vocsTotals").eq(3).should("contain", "-128,370");

    cy.get("@nh3Totals").eq(1).should("contain", "2,222,920");
    cy.get("@nh3Totals").eq(2).should("contain", "2,068,100");
    cy.get("@nh3Totals").eq(3).should("contain", "-154,820");

    cy.get("@so2Rates").eq(1).should("contain", "0.227");
    cy.get("@so2Rates").eq(3).should("contain", "0.211");

    cy.get("@noxRates").eq(1).should("contain", "0.481");
    cy.get("@noxRates").eq(3).should("contain", "0.454");

    cy.get("@ozoneNoxRates").eq(1).should("contain", "0.486");
    cy.get("@ozoneNoxRates").eq(3).should("contain", "0.566");

    cy.get("@co2Rates").eq(1).should("contain", "0.628");
    cy.get("@co2Rates").eq(3).should("contain", "0.611");

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
    cy.get("@azGen").eq(2).should("contain", "-921,800");
    cy.get("@azGen").eq(3).should("contain", "-1,707,710");
    cy.get("@azGen").eq(4).should("contain", "-2,498,980");
    cy.get("@azGen").eq(5).should("contain", "-235,960");
    cy.get("@azGen").eq(6).should("contain", "-84,990");
    cy.get("@azGen").eq(7).should("contain", "-110,550");

    cy.get("@azVehicles").eq(1).should("contain", "0");
    cy.get("@azVehicles").eq(2).should("contain", "0");
    cy.get("@azVehicles").eq(3).should("contain", "0");
    cy.get("@azVehicles").eq(4).should("contain", "0");
    cy.get("@azVehicles").eq(5).should("contain", "0");
    cy.get("@azVehicles").eq(6).should("contain", "0");

    cy.get("@azChange").eq(1).should("contain", "-921,800");
    cy.get("@azChange").eq(2).should("contain", "-1,707,710");
    cy.get("@azChange").eq(3).should("contain", "-2,498,980");
    cy.get("@azChange").eq(4).should("contain", "-235,960");
    cy.get("@azChange").eq(5).should("contain", "-84,990");
    cy.get("@azChange").eq(6).should("contain", "-110,550");

    // California
    cy.get("@caGen").eq(2).should("contain", "-830");
    cy.get("@caGen").eq(3).should("contain", "-9,960");
    cy.get("@caGen").eq(4).should("contain", "-83,020");
    cy.get("@caGen").eq(5).should("contain", "-7,500");
    cy.get("@caGen").eq(6).should("contain", "-2,300");
    cy.get("@caGen").eq(7).should("contain", "-5,260");

    cy.get("@caVehicles").eq(1).should("contain", "0");
    cy.get("@caVehicles").eq(2).should("contain", "0");
    cy.get("@caVehicles").eq(3).should("contain", "0");
    cy.get("@caVehicles").eq(4).should("contain", "0");
    cy.get("@caVehicles").eq(5).should("contain", "0");
    cy.get("@caVehicles").eq(6).should("contain", "0");

    cy.get("@caChange").eq(1).should("contain", "-830");
    cy.get("@caChange").eq(2).should("contain", "-9,960");
    cy.get("@caChange").eq(3).should("contain", "-83,020");
    cy.get("@caChange").eq(4).should("contain", "-7,500");
    cy.get("@caChange").eq(5).should("contain", "-2,300");
    cy.get("@caChange").eq(6).should("contain", "-5,260");

    // New Mexico
    cy.get("@nmGen").eq(2).should("contain", "-226,570");
    cy.get("@nmGen").eq(3).should("contain", "-611,470");
    cy.get("@nmGen").eq(4).should("contain", "-588,190");
    cy.get("@nmGen").eq(5).should("contain", "-109,650");
    cy.get("@nmGen").eq(6).should("contain", "-25,600");
    cy.get("@nmGen").eq(7).should("contain", "-27,120");

    cy.get("@nmVehicles").eq(1).should("contain", "0");
    cy.get("@nmVehicles").eq(2).should("contain", "0");
    cy.get("@nmVehicles").eq(3).should("contain", "0");
    cy.get("@nmVehicles").eq(4).should("contain", "0");
    cy.get("@nmVehicles").eq(5).should("contain", "0");
    cy.get("@nmVehicles").eq(6).should("contain", "0");

    cy.get("@nmChange").eq(1).should("contain", "-226,570");
    cy.get("@nmChange").eq(2).should("contain", "-611,470");
    cy.get("@nmChange").eq(3).should("contain", "-588,190");
    cy.get("@nmChange").eq(4).should("contain", "-109,650");
    cy.get("@nmChange").eq(5).should("contain", "-25,600");
    cy.get("@nmChange").eq(6).should("contain", "-27,120");

    // Texas
    cy.get("@txGen").eq(2).should("contain", "-1,500");
    cy.get("@txGen").eq(3).should("contain", "-149,650");
    cy.get("@txGen").eq(4).should("contain", "-163,370");
    cy.get("@txGen").eq(5).should("contain", "-16,880");
    cy.get("@txGen").eq(6).should("contain", "-15,480");
    cy.get("@txGen").eq(7).should("contain", "-11,890");

    cy.get("@txVehicles").eq(1).should("contain", "0");
    cy.get("@txVehicles").eq(2).should("contain", "0");
    cy.get("@txVehicles").eq(3).should("contain", "0");
    cy.get("@txVehicles").eq(4).should("contain", "0");
    cy.get("@txVehicles").eq(5).should("contain", "0");
    cy.get("@txVehicles").eq(6).should("contain", "0");

    cy.get("@txChange").eq(1).should("contain", "-1,500");
    cy.get("@txChange").eq(2).should("contain", "-149,650");
    cy.get("@txChange").eq(3).should("contain", "-163,370");
    cy.get("@txChange").eq(4).should("contain", "-16,880");
    cy.get("@txChange").eq(5).should("contain", "-15,480");
    cy.get("@txChange").eq(6).should("contain", "-11,890");
  });
});
