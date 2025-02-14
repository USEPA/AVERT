describe("Get Results – offshoreWind", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("Northwest");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Wind").as("toggleC");
    cy.get("@toggleC").click();

    cy.findByLabelText("Offshore wind total capacity:").as("offshoreWind");
    cy.get("@offshoreWind").type("1000");

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

    cy.get("@geneartion").eq(1).should("contain", "117,886,750");
    cy.get("@geneartion").eq(2).should("contain", "115,677,560");
    cy.get("@geneartion").eq(3).should("contain", "-2,209,190");

    cy.get("@so2Totals").eq(1).should("contain", "72,180,720");
    cy.get("@so2Totals").eq(2).should("contain", "71,369,530");
    cy.get("@so2Totals").eq(3).should("contain", "-811,180");

    cy.get("@noxTotals").eq(1).should("contain", "109,484,910");
    cy.get("@noxTotals").eq(2).should("contain", "107,939,240");
    cy.get("@noxTotals").eq(3).should("contain", "-1,545,670");

    cy.get("@ozoneNoxTotals").eq(1).should("contain", "45,473,740");
    cy.get("@ozoneNoxTotals").eq(2).should("contain", "44,875,420");
    cy.get("@ozoneNoxTotals").eq(3).should("contain", "-598,320");

    cy.get("@co2Totals").eq(1).should("contain", "89,446,980");
    cy.get("@co2Totals").eq(2).should("contain", "87,954,310");
    cy.get("@co2Totals").eq(3).should("contain", "-1,492,680");

    cy.get("@pm25Totals").eq(1).should("contain", "10,667,880");
    cy.get("@pm25Totals").eq(2).should("contain", "10,495,510");
    cy.get("@pm25Totals").eq(3).should("contain", "-172,370");

    cy.get("@vocsTotals").eq(1).should("contain", "2,970,160");
    cy.get("@vocsTotals").eq(2).should("contain", "2,917,370");
    cy.get("@vocsTotals").eq(3).should("contain", "-52,790");

    cy.get("@nh3Totals").eq(1).should("contain", "2,585,230");
    cy.get("@nh3Totals").eq(2).should("contain", "2,530,390");
    cy.get("@nh3Totals").eq(3).should("contain", "-54,840");

    cy.get("@so2Rates").eq(1).should("contain", "0.612");
    cy.get("@so2Rates").eq(3).should("contain", "0.367");

    cy.get("@noxRates").eq(1).should("contain", "0.929");
    cy.get("@noxRates").eq(3).should("contain", "0.700");

    cy.get("@ozoneNoxRates").eq(1).should("contain", "0.931");
    cy.get("@ozoneNoxRates").eq(3).should("contain", "0.786");

    cy.get("@co2Rates").eq(1).should("contain", "0.759");
    cy.get("@co2Rates").eq(3).should("contain", "0.676");

    cy.get("@pm25Rates").eq(1).should("contain", "0.090");
    cy.get("@pm25Rates").eq(3).should("contain", "0.078");

    cy.get("@vocsRates").eq(1).should("contain", "0.025");
    cy.get("@vocsRates").eq(3).should("contain", "0.024");

    cy.get("@nh3Rates").eq(1).should("contain", "0.022");
    cy.get("@nh3Rates").eq(3).should("contain", "0.025");
  });

  it("Annual Emissions Changes By State table displays the correct results", () => {
    cy.findByLabelText("All states").click({ force: true });

    /* prettier-ignore */
    cy.findAllByText('California').filter('th')
      .parent().children().as('caGen')
      .parent().next().children().as('caVehicles')
      .parent().next().children().as('caChange')
      .parent().next().children().as('idGen')
      .parent().next().children().as('idVehicles')
      .parent().next().children().as('idChange')
      .parent().next().children().as('mtGen')
      .parent().next().children().as('mtVehicles')
      .parent().next().children().as('mtChange')
      .parent().next().children().as('nvGen')
      .parent().next().children().as('nvVehicles')
      .parent().next().children().as('nvChange')
      .parent().next().children().as('orGen')
      .parent().next().children().as('orVehicles')
      .parent().next().children().as('orChange')
      .parent().next().children().as('utGen')
      .parent().next().children().as('utVehicles')
      .parent().next().children().as('utChange')
      .parent().next().children().as('waGen')
      .parent().next().children().as('waVehicles')
      .parent().next().children().as('waChange')
      .parent().next().children().as('wyGen')
      .parent().next().children().as('wyVehicles')
      .parent().next().children().as('wyChange');

    // California
    cy.get("@caGen").eq(2).should("contain", "0");
    cy.get("@caGen").eq(3).should("contain", "0");
    cy.get("@caGen").eq(4).should("contain", "0");
    cy.get("@caGen").eq(5).should("contain", "0");
    cy.get("@caGen").eq(6).should("contain", "0");
    cy.get("@caGen").eq(7).should("contain", "0");

    cy.get("@caVehicles").eq(1).should("contain", "0");
    cy.get("@caVehicles").eq(2).should("contain", "0");
    cy.get("@caVehicles").eq(3).should("contain", "0");
    cy.get("@caVehicles").eq(4).should("contain", "0");
    cy.get("@caVehicles").eq(5).should("contain", "0");
    cy.get("@caVehicles").eq(6).should("contain", "0");

    cy.get("@caChange").eq(1).should("contain", "0");
    cy.get("@caChange").eq(2).should("contain", "0");
    cy.get("@caChange").eq(3).should("contain", "0");
    cy.get("@caChange").eq(4).should("contain", "0");
    cy.get("@caChange").eq(5).should("contain", "0");
    cy.get("@caChange").eq(6).should("contain", "0");

    // Idaho
    cy.get("@idGen").eq(2).should("contain", "-540");
    cy.get("@idGen").eq(3).should("contain", "-38,060");
    cy.get("@idGen").eq(4).should("contain", "-70,410");
    cy.get("@idGen").eq(5).should("contain", "-8,310");
    cy.get("@idGen").eq(6).should("contain", "-2,520");
    cy.get("@idGen").eq(7).should("contain", "-6,700");

    cy.get("@idVehicles").eq(1).should("contain", "0");
    cy.get("@idVehicles").eq(2).should("contain", "0");
    cy.get("@idVehicles").eq(3).should("contain", "0");
    cy.get("@idVehicles").eq(4).should("contain", "0");
    cy.get("@idVehicles").eq(5).should("contain", "0");
    cy.get("@idVehicles").eq(6).should("contain", "0");

    cy.get("@idChange").eq(1).should("contain", "-540");
    cy.get("@idChange").eq(2).should("contain", "-38,060");
    cy.get("@idChange").eq(3).should("contain", "-70,410");
    cy.get("@idChange").eq(4).should("contain", "-8,310");
    cy.get("@idChange").eq(5).should("contain", "-2,520");
    cy.get("@idChange").eq(6).should("contain", "-6,700");

    // Montana
    cy.get("@mtGen").eq(2).should("contain", "-112,750");
    cy.get("@mtGen").eq(3).should("contain", "-182,120");
    cy.get("@mtGen").eq(4).should("contain", "-121,990");
    cy.get("@mtGen").eq(5).should("contain", "-26,090");
    cy.get("@mtGen").eq(6).should("contain", "-5,260");
    cy.get("@mtGen").eq(7).should("contain", "-920");

    cy.get("@mtVehicles").eq(1).should("contain", "0");
    cy.get("@mtVehicles").eq(2).should("contain", "0");
    cy.get("@mtVehicles").eq(3).should("contain", "0");
    cy.get("@mtVehicles").eq(4).should("contain", "0");
    cy.get("@mtVehicles").eq(5).should("contain", "0");
    cy.get("@mtVehicles").eq(6).should("contain", "0");

    cy.get("@mtChange").eq(1).should("contain", "-112,750");
    cy.get("@mtChange").eq(2).should("contain", "-182,120");
    cy.get("@mtChange").eq(3).should("contain", "-121,990");
    cy.get("@mtChange").eq(4).should("contain", "-26,090");
    cy.get("@mtChange").eq(5).should("contain", "-5,260");
    cy.get("@mtChange").eq(6).should("contain", "-920");

    // Nevada
    cy.get("@nvGen").eq(2).should("contain", "-37,710");
    cy.get("@nvGen").eq(3).should("contain", "-104,470");
    cy.get("@nvGen").eq(4).should("contain", "-225,850");
    cy.get("@nvGen").eq(5).should("contain", "-27,050");
    cy.get("@nvGen").eq(6).should("contain", "-11,040");
    cy.get("@nvGen").eq(7).should("contain", "-14,860");

    cy.get("@nvVehicles").eq(1).should("contain", "0");
    cy.get("@nvVehicles").eq(2).should("contain", "0");
    cy.get("@nvVehicles").eq(3).should("contain", "0");
    cy.get("@nvVehicles").eq(4).should("contain", "0");
    cy.get("@nvVehicles").eq(5).should("contain", "0");
    cy.get("@nvVehicles").eq(6).should("contain", "0");

    cy.get("@nvChange").eq(1).should("contain", "-37,710");
    cy.get("@nvChange").eq(2).should("contain", "-104,470");
    cy.get("@nvChange").eq(3).should("contain", "-225,850");
    cy.get("@nvChange").eq(4).should("contain", "-27,050");
    cy.get("@nvChange").eq(5).should("contain", "-11,040");
    cy.get("@nvChange").eq(6).should("contain", "-14,860");

    // Oregon
    cy.get("@orGen").eq(2).should("contain", "-1,310");
    cy.get("@orGen").eq(3).should("contain", "-27,010");
    cy.get("@orGen").eq(4).should("contain", "-154,290");
    cy.get("@orGen").eq(5).should("contain", "-11,890");
    cy.get("@orGen").eq(6).should("contain", "-5,140");
    cy.get("@orGen").eq(7).should("contain", "-16,820");

    cy.get("@orVehicles").eq(1).should("contain", "0");
    cy.get("@orVehicles").eq(2).should("contain", "0");
    cy.get("@orVehicles").eq(3).should("contain", "0");
    cy.get("@orVehicles").eq(4).should("contain", "0");
    cy.get("@orVehicles").eq(5).should("contain", "0");
    cy.get("@orVehicles").eq(6).should("contain", "0");

    cy.get("@orChange").eq(1).should("contain", "-1,310");
    cy.get("@orChange").eq(2).should("contain", "-27,010");
    cy.get("@orChange").eq(3).should("contain", "-154,290");
    cy.get("@orChange").eq(4).should("contain", "-11,890");
    cy.get("@orChange").eq(5).should("contain", "-5,140");
    cy.get("@orChange").eq(6).should("contain", "-16,820");

    // Utah
    cy.get("@utGen").eq(2).should("contain", "-135,370");
    cy.get("@utGen").eq(3).should("contain", "-376,390");
    cy.get("@utGen").eq(4).should("contain", "-242,000");
    cy.get("@utGen").eq(5).should("contain", "-27,340");
    cy.get("@utGen").eq(6).should("contain", "-7,510");
    cy.get("@utGen").eq(7).should("contain", "-8,090");

    cy.get("@utVehicles").eq(1).should("contain", "0");
    cy.get("@utVehicles").eq(2).should("contain", "0");
    cy.get("@utVehicles").eq(3).should("contain", "0");
    cy.get("@utVehicles").eq(4).should("contain", "0");
    cy.get("@utVehicles").eq(5).should("contain", "0");
    cy.get("@utVehicles").eq(6).should("contain", "0");

    cy.get("@utChange").eq(1).should("contain", "-135,370");
    cy.get("@utChange").eq(2).should("contain", "-376,390");
    cy.get("@utChange").eq(3).should("contain", "-242,000");
    cy.get("@utChange").eq(4).should("contain", "-27,340");
    cy.get("@utChange").eq(5).should("contain", "-7,510");
    cy.get("@utChange").eq(6).should("contain", "-8,090");

    // Washington
    cy.get("@waGen").eq(2).should("contain", "-88,340");
    cy.get("@waGen").eq(3).should("contain", "-242,060");
    cy.get("@waGen").eq(4).should("contain", "-316,600");
    cy.get("@waGen").eq(5).should("contain", "-31,470");
    cy.get("@waGen").eq(6).should("contain", "-9,860");
    cy.get("@waGen").eq(7).should("contain", "-6,740");

    cy.get("@waVehicles").eq(1).should("contain", "0");
    cy.get("@waVehicles").eq(2).should("contain", "0");
    cy.get("@waVehicles").eq(3).should("contain", "0");
    cy.get("@waVehicles").eq(4).should("contain", "0");
    cy.get("@waVehicles").eq(5).should("contain", "0");
    cy.get("@waVehicles").eq(6).should("contain", "0");

    cy.get("@waChange").eq(1).should("contain", "-88,340");
    cy.get("@waChange").eq(2).should("contain", "-242,060");
    cy.get("@waChange").eq(3).should("contain", "-316,600");
    cy.get("@waChange").eq(4).should("contain", "-31,470");
    cy.get("@waChange").eq(5).should("contain", "-9,860");
    cy.get("@waChange").eq(6).should("contain", "-6,740");

    // Wyoming
    cy.get("@wyGen").eq(2).should("contain", "-435,170");
    cy.get("@wyGen").eq(3).should("contain", "-575,560");
    cy.get("@wyGen").eq(4).should("contain", "-361,530");
    cy.get("@wyGen").eq(5).should("contain", "-40,220");
    cy.get("@wyGen").eq(6).should("contain", "-11,460");
    cy.get("@wyGen").eq(7).should("contain", "-710");

    cy.get("@wyVehicles").eq(1).should("contain", "0");
    cy.get("@wyVehicles").eq(2).should("contain", "0");
    cy.get("@wyVehicles").eq(3).should("contain", "0");
    cy.get("@wyVehicles").eq(4).should("contain", "0");
    cy.get("@wyVehicles").eq(5).should("contain", "0");
    cy.get("@wyVehicles").eq(6).should("contain", "0");

    cy.get("@wyChange").eq(1).should("contain", "-435,170");
    cy.get("@wyChange").eq(2).should("contain", "-575,560");
    cy.get("@wyChange").eq(3).should("contain", "-361,530");
    cy.get("@wyChange").eq(4).should("contain", "-40,220");
    cy.get("@wyChange").eq(5).should("contain", "-11,460");
    cy.get("@wyChange").eq(6).should("contain", "-710");
  });
});
