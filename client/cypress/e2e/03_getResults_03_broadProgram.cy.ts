describe("Get Results – broadProgram", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("New England");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Percentage reductions in some or all hours").as("toggleB");
    cy.get("@toggleB").click();

    cy.findByLabelText('Broad-based program:', { exact: false }).as('broadProgram'); // prettier-ignore
    cy.get("@broadProgram").type("10");

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

    cy.get("@geneartion").eq(1).should("contain", "49,806,940");
    cy.get("@geneartion").eq(2).should("contain", "44,425,330");
    cy.get("@geneartion").eq(3).should("contain", "-5,381,610");

    cy.get("@so2Totals").eq(1).should("contain", "4,272,680");
    cy.get("@so2Totals").eq(2).should("contain", "3,134,550");
    cy.get("@so2Totals").eq(3).should("contain", "-1,138,130");

    cy.get("@noxTotals").eq(1).should("contain", "8,742,410");
    cy.get("@noxTotals").eq(2).should("contain", "7,412,690");
    cy.get("@noxTotals").eq(3).should("contain", "-1,329,720");

    cy.get("@ozoneNoxTotals").eq(1).should("contain", "4,520,620");
    cy.get("@ozoneNoxTotals").eq(2).should("contain", "3,837,950");
    cy.get("@ozoneNoxTotals").eq(3).should("contain", "-682,670");

    cy.get("@co2Totals").eq(1).should("contain", "25,898,760");
    cy.get("@co2Totals").eq(2).should("contain", "23,099,990");
    cy.get("@co2Totals").eq(3).should("contain", "-2,798,770");

    cy.get("@pm25Totals").eq(1).should("contain", "1,748,910");
    cy.get("@pm25Totals").eq(2).should("contain", "1,520,170");
    cy.get("@pm25Totals").eq(3).should("contain", "-228,740");

    cy.get("@vocsTotals").eq(1).should("contain", "839,210");
    cy.get("@vocsTotals").eq(2).should("contain", "725,490");
    cy.get("@vocsTotals").eq(3).should("contain", "-113,720");

    cy.get("@nh3Totals").eq(1).should("contain", "1,511,020");
    cy.get("@nh3Totals").eq(2).should("contain", "1,343,100");
    cy.get("@nh3Totals").eq(3).should("contain", "-167,920");

    cy.get("@so2Rates").eq(1).should("contain", "0.086");
    cy.get("@so2Rates").eq(3).should("contain", "0.211");

    cy.get("@noxRates").eq(1).should("contain", "0.176");
    cy.get("@noxRates").eq(3).should("contain", "0.247");

    cy.get("@ozoneNoxRates").eq(1).should("contain", "0.185");
    cy.get("@ozoneNoxRates").eq(3).should("contain", "0.259");

    cy.get("@co2Rates").eq(1).should("contain", "0.520");
    cy.get("@co2Rates").eq(3).should("contain", "0.520");

    cy.get("@pm25Rates").eq(1).should("contain", "0.035");
    cy.get("@pm25Rates").eq(3).should("contain", "0.043");

    cy.get("@vocsRates").eq(1).should("contain", "0.017");
    cy.get("@vocsRates").eq(3).should("contain", "0.021");

    cy.get("@nh3Rates").eq(1).should("contain", "0.030");
    cy.get("@nh3Rates").eq(3).should("contain", "0.031");
  });

  it("Annual Emissions Changes By State table displays the correct results", () => {
    cy.findByLabelText("All states").click({ force: true });

    /* prettier-ignore */
    cy.findAllByText('Connecticut').filter('th')
      .parent().children().as('ctGen')
      .parent().next().children().as('ctVehicles')
      .parent().next().children().as('ctChange')
      .parent().next().children().as('meGen')
      .parent().next().children().as('meVehicles')
      .parent().next().children().as('meChange')
      .parent().next().children().as('maGen')
      .parent().next().children().as('maVehicles')
      .parent().next().children().as('maChange')
      .parent().next().children().as('nhGen')
      .parent().next().children().as('nhVehicles')
      .parent().next().children().as('nhChange')
      .parent().next().children().as('riGen')
      .parent().next().children().as('riVehicles')
      .parent().next().children().as('riChange')
      .parent().next().children().as('vtGen')
      .parent().next().children().as('vtVehicles')
      .parent().next().children().as('vtChange');

    // Connecticut
    cy.get("@ctGen").eq(2).should("contain", "-257,440");
    cy.get("@ctGen").eq(3).should("contain", "-290,560");
    cy.get("@ctGen").eq(4).should("contain", "-595,140");
    cy.get("@ctGen").eq(5).should("contain", "-44,310");
    cy.get("@ctGen").eq(6).should("contain", "-17,480");
    cy.get("@ctGen").eq(7).should("contain", "-33,650");

    cy.get("@ctVehicles").eq(1).should("contain", "0");
    cy.get("@ctVehicles").eq(2).should("contain", "0");
    cy.get("@ctVehicles").eq(3).should("contain", "0");
    cy.get("@ctVehicles").eq(4).should("contain", "0");
    cy.get("@ctVehicles").eq(5).should("contain", "0");
    cy.get("@ctVehicles").eq(6).should("contain", "0");

    cy.get("@ctChange").eq(1).should("contain", "-257,440");
    cy.get("@ctChange").eq(2).should("contain", "-290,560");
    cy.get("@ctChange").eq(3).should("contain", "-595,140");
    cy.get("@ctChange").eq(4).should("contain", "-44,310");
    cy.get("@ctChange").eq(5).should("contain", "-17,480");
    cy.get("@ctChange").eq(6).should("contain", "-33,650");

    // Maine
    cy.get("@meGen").eq(2).should("contain", "-266,470");
    cy.get("@meGen").eq(3).should("contain", "-136,730");
    cy.get("@meGen").eq(4).should("contain", "-316,300");
    cy.get("@meGen").eq(5).should("contain", "-14,960");
    cy.get("@meGen").eq(6).should("contain", "-7,900");
    cy.get("@meGen").eq(7).should("contain", "-7,220");

    cy.get("@meVehicles").eq(1).should("contain", "0");
    cy.get("@meVehicles").eq(2).should("contain", "0");
    cy.get("@meVehicles").eq(3).should("contain", "0");
    cy.get("@meVehicles").eq(4).should("contain", "0");
    cy.get("@meVehicles").eq(5).should("contain", "0");
    cy.get("@meVehicles").eq(6).should("contain", "0");

    cy.get("@meChange").eq(1).should("contain", "-266,470");
    cy.get("@meChange").eq(2).should("contain", "-136,730");
    cy.get("@meChange").eq(3).should("contain", "-316,300");
    cy.get("@meChange").eq(4).should("contain", "-14,960");
    cy.get("@meChange").eq(5).should("contain", "-7,900");
    cy.get("@meChange").eq(6).should("contain", "-7,220");

    // Massachusetts
    cy.get("@maGen").eq(2).should("contain", "-337,290");
    cy.get("@maGen").eq(3).should("contain", "-405,680");
    cy.get("@maGen").eq(4).should("contain", "-1,077,740");
    cy.get("@maGen").eq(5).should("contain", "-67,710");
    cy.get("@maGen").eq(6).should("contain", "-41,380");
    cy.get("@maGen").eq(7).should("contain", "-54,540");

    cy.get("@maVehicles").eq(1).should("contain", "0");
    cy.get("@maVehicles").eq(2).should("contain", "0");
    cy.get("@maVehicles").eq(3).should("contain", "0");
    cy.get("@maVehicles").eq(4).should("contain", "0");
    cy.get("@maVehicles").eq(5).should("contain", "0");
    cy.get("@maVehicles").eq(6).should("contain", "0");

    cy.get("@maChange").eq(1).should("contain", "-337,290");
    cy.get("@maChange").eq(2).should("contain", "-405,680");
    cy.get("@maChange").eq(3).should("contain", "-1,077,740");
    cy.get("@maChange").eq(4).should("contain", "-67,710");
    cy.get("@maChange").eq(5).should("contain", "-41,380");
    cy.get("@maChange").eq(6).should("contain", "-54,540");

    // New Hampshire
    cy.get("@nhGen").eq(2).should("contain", "-269,060");
    cy.get("@nhGen").eq(3).should("contain", "-371,710");
    cy.get("@nhGen").eq(4).should("contain", "-387,000");
    cy.get("@nhGen").eq(5).should("contain", "-28,870");
    cy.get("@nhGen").eq(6).should("contain", "-7,880");
    cy.get("@nhGen").eq(7).should("contain", "-18,550");

    cy.get("@nhVehicles").eq(1).should("contain", "0");
    cy.get("@nhVehicles").eq(2).should("contain", "0");
    cy.get("@nhVehicles").eq(3).should("contain", "0");
    cy.get("@nhVehicles").eq(4).should("contain", "0");
    cy.get("@nhVehicles").eq(5).should("contain", "0");
    cy.get("@nhVehicles").eq(6).should("contain", "0");

    cy.get("@nhChange").eq(1).should("contain", "-269,060");
    cy.get("@nhChange").eq(2).should("contain", "-371,710");
    cy.get("@nhChange").eq(3).should("contain", "-387,000");
    cy.get("@nhChange").eq(4).should("contain", "-28,870");
    cy.get("@nhChange").eq(5).should("contain", "-7,880");
    cy.get("@nhChange").eq(6).should("contain", "-18,550");

    // Rhode Island
    cy.get("@riGen").eq(2).should("contain", "-7,720");
    cy.get("@riGen").eq(3).should("contain", "-108,350");
    cy.get("@riGen").eq(4).should("contain", "-397,170");
    cy.get("@riGen").eq(5).should("contain", "-72,790");
    cy.get("@riGen").eq(6).should("contain", "-36,840");
    cy.get("@riGen").eq(7).should("contain", "-52,230");

    cy.get("@riVehicles").eq(1).should("contain", "0");
    cy.get("@riVehicles").eq(2).should("contain", "0");
    cy.get("@riVehicles").eq(3).should("contain", "0");
    cy.get("@riVehicles").eq(4).should("contain", "0");
    cy.get("@riVehicles").eq(5).should("contain", "0");
    cy.get("@riVehicles").eq(6).should("contain", "0");

    cy.get("@riChange").eq(1).should("contain", "-7,720");
    cy.get("@riChange").eq(2).should("contain", "-108,350");
    cy.get("@riChange").eq(3).should("contain", "-397,170");
    cy.get("@riChange").eq(4).should("contain", "-72,790");
    cy.get("@riChange").eq(5).should("contain", "-36,840");
    cy.get("@riChange").eq(6).should("contain", "-52,230");

    // Vermont
    cy.get("@vtGen").eq(2).should("contain", "-160");
    cy.get("@vtGen").eq(3).should("contain", "-16,680");
    cy.get("@vtGen").eq(4).should("contain", "-25,420");
    cy.get("@vtGen").eq(5).should("contain", "-100");
    cy.get("@vtGen").eq(6).should("contain", "-2,220");
    cy.get("@vtGen").eq(7).should("contain", "-1,730");

    cy.get("@vtVehicles").eq(1).should("contain", "0");
    cy.get("@vtVehicles").eq(2).should("contain", "0");
    cy.get("@vtVehicles").eq(3).should("contain", "0");
    cy.get("@vtVehicles").eq(4).should("contain", "0");
    cy.get("@vtVehicles").eq(5).should("contain", "0");
    cy.get("@vtVehicles").eq(6).should("contain", "0");

    cy.get("@vtChange").eq(1).should("contain", "-160");
    cy.get("@vtChange").eq(2).should("contain", "-16,680");
    cy.get("@vtChange").eq(3).should("contain", "-25,420");
    cy.get("@vtChange").eq(4).should("contain", "-100");
    cy.get("@vtChange").eq(5).should("contain", "-2,220");
    cy.get("@vtChange").eq(6).should("contain", "-1,730");
  });
});
