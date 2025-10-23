describe("Get Results – hourlyMwReduction", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("Southwest");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Reductions spread evenly throughout the year").as("toggleA");
    cy.get("@toggleA").click();

    cy.findByLabelText("Reduce hourly generation by:").as("hourlyMwReduction");
    cy.get("@hourlyMwReduction").type("500");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Power Sector Only) table displays the correct results", () => {
    const generation = ["81,798,850", "77,003,270", "-4,795,580"];
    const so2Totals = ["13,644,700", "12,862,250", "-782,450"];
    const noxTotals = ["35,616,540", "33,363,500", "-2,253,040"];
    const ozoneNoxTotals = ["17,646,690", "16,486,830", "-1,159,860"];
    const co2Totals = ["51,070,160", "48,181,910", "-2,888,260"];
    const pm25Totals = ["6,386,980", "5,987,000", "-399,980"];
    const vocsTotals = ["2,095,190", "1,930,050", "-165,140"];
    const nh3Totals = ["1,948,770", "1,817,730", "-131,030"];

    const so2Rates = ["0.167", "0.163"];
    const noxRates = ["0.435", "0.470"];
    const ozoneNoxRates = ["0.437", "0.579"];
    const co2Rates = ["0.624", "0.602"];
    const pm25Rates = ["0.078", "0.083"];
    const vocsRates = ["0.026", "0.034"];
    const nh3Rates = ["0.024", "0.027"];

    /* prettier-ignore */
    cy.findByText("Generation")
      .parent().parent().children().as("generation")
      .parent().next().next().children().as("so2Totals")
      .parent().next().children().as("noxTotals")
      .parent().next().children().as("ozoneNoxTotals")
      .parent().next().children().as("co2Totals")
      .parent().next().children().as("pm25Totals")
      .parent().next().children().as("vocsTotals")
      .parent().next().children().as("nh3Totals")
      .parent().next().next().children().as("so2Rates")
      .parent().next().children().as("noxRates")
      .parent().next().children().as("ozoneNoxRates")
      .parent().next().children().as("co2Rates")
      .parent().next().children().as("pm25Rates")
      .parent().next().children().as("vocsRates")
      .parent().next().children().as("nh3Rates");

    cy.get("@generation").eq(1).should("contain", generation[0]);
    cy.get("@generation").eq(2).should("contain", generation[1]);
    cy.get("@generation").eq(3).should("contain", generation[2]);

    cy.get("@so2Totals").eq(1).should("contain", so2Totals[0]);
    cy.get("@so2Totals").eq(2).should("contain", so2Totals[1]);
    cy.get("@so2Totals").eq(3).should("contain", so2Totals[2]);

    cy.get("@noxTotals").eq(1).should("contain", noxTotals[0]);
    cy.get("@noxTotals").eq(2).should("contain", noxTotals[1]);
    cy.get("@noxTotals").eq(3).should("contain", noxTotals[2]);

    cy.get("@ozoneNoxTotals").eq(1).should("contain", ozoneNoxTotals[0]);
    cy.get("@ozoneNoxTotals").eq(2).should("contain", ozoneNoxTotals[1]);
    cy.get("@ozoneNoxTotals").eq(3).should("contain", ozoneNoxTotals[2]);

    cy.get("@co2Totals").eq(1).should("contain", co2Totals[0]);
    cy.get("@co2Totals").eq(2).should("contain", co2Totals[1]);
    cy.get("@co2Totals").eq(3).should("contain", co2Totals[2]);

    cy.get("@pm25Totals").eq(1).should("contain", pm25Totals[0]);
    cy.get("@pm25Totals").eq(2).should("contain", pm25Totals[1]);
    cy.get("@pm25Totals").eq(3).should("contain", pm25Totals[2]);

    cy.get("@vocsTotals").eq(1).should("contain", vocsTotals[0]);
    cy.get("@vocsTotals").eq(2).should("contain", vocsTotals[1]);
    cy.get("@vocsTotals").eq(3).should("contain", vocsTotals[2]);

    cy.get("@nh3Totals").eq(1).should("contain", nh3Totals[0]);
    cy.get("@nh3Totals").eq(2).should("contain", nh3Totals[1]);
    cy.get("@nh3Totals").eq(3).should("contain", nh3Totals[2]);

    cy.get("@so2Rates").eq(1).should("contain", so2Rates[0]);
    cy.get("@so2Rates").eq(3).should("contain", so2Rates[1]);

    cy.get("@noxRates").eq(1).should("contain", noxRates[0]);
    cy.get("@noxRates").eq(3).should("contain", noxRates[1]);

    cy.get("@ozoneNoxRates").eq(1).should("contain", ozoneNoxRates[0]);
    cy.get("@ozoneNoxRates").eq(3).should("contain", ozoneNoxRates[1]);

    cy.get("@co2Rates").eq(1).should("contain", co2Rates[0]);
    cy.get("@co2Rates").eq(3).should("contain", co2Rates[1]);

    cy.get("@pm25Rates").eq(1).should("contain", pm25Rates[0]);
    cy.get("@pm25Rates").eq(3).should("contain", pm25Rates[1]);

    cy.get("@vocsRates").eq(1).should("contain", vocsRates[0]);
    cy.get("@vocsRates").eq(3).should("contain", vocsRates[1]);

    cy.get("@nh3Rates").eq(1).should("contain", nh3Rates[0]);
    cy.get("@nh3Rates").eq(3).should("contain", nh3Rates[1]);
  });

  it("Annual Emissions Changes By State table displays the correct results", () => {
    const azGen = ["-640,490", "-1,628,000", "-2,165,950", "-295,300", "-135,600", "-94,430"]; // prettier-ignore
    const azVehicles = ["0", "0", "0", "0", "0", "0"];
    const azChange = ["-640,490", "-1,628,000", "-2,165,950", "-295,300", "-135,600", "-94,430"]; // prettier-ignore

    const caGen = ["-600", "-7,830", "-59,880", "-5,750", "-970", "-3,570"]; // prettier-ignore
    const caVehicles = ["0", "0", "0", "0", "0", "0"];
    const caChange = ["-600", "-7,830", "-59,880", "-5,750", "-970", "-3,570"]; // prettier-ignore

    const nmGen = ["-140,110", "-404,990", "-500,330", "-86,160", "-17,760", "-23,200"]; // prettier-ignore
    const nmVehicles = ["0", "0", "0", "0", "0", "0"];
    const nmChange = ["-140,110", "-404,990", "-500,330", "-86,160", "-17,760", "-23,200"]; // prettier-ignore

    const txGen = ["-1,250", "-212,220", "-162,090", "-12,780", "-10,800", "-9,830"]; // prettier-ignore
    const txVehicles = ["0", "0", "0", "0", "0", "0"];
    const txChange = ["-1,250", "-212,220", "-162,090", "-12,780", "-10,800", "-9,830"]; // prettier-ignore
    cy.findByLabelText("All states").click({ force: true });

    /* prettier-ignore */
    cy.findAllByText("Arizona").filter("th")
      .parent().children().as("azGen")
      .parent().next().children().as("azVehicles")
      .parent().next().children().as("azChange")
      .parent().next().children().as("caGen")
      .parent().next().children().as("caVehicles")
      .parent().next().children().as("caChange")
      .parent().next().children().as("nmGen")
      .parent().next().children().as("nmVehicles")
      .parent().next().children().as("nmChange")
      .parent().next().children().as("txGen")
      .parent().next().children().as("txVehicles")
      .parent().next().children().as("txChange");

    // Arizona
    cy.get("@azGen").eq(2).should("contain", azGen[0]);
    cy.get("@azGen").eq(3).should("contain", azGen[1]);
    cy.get("@azGen").eq(4).should("contain", azGen[2]);
    cy.get("@azGen").eq(5).should("contain", azGen[3]);
    cy.get("@azGen").eq(6).should("contain", azGen[4]);
    cy.get("@azGen").eq(7).should("contain", azGen[5]);

    cy.get("@azVehicles").eq(1).should("contain", azVehicles[0]);
    cy.get("@azVehicles").eq(2).should("contain", azVehicles[1]);
    cy.get("@azVehicles").eq(3).should("contain", azVehicles[2]);
    cy.get("@azVehicles").eq(4).should("contain", azVehicles[3]);
    cy.get("@azVehicles").eq(5).should("contain", azVehicles[4]);
    cy.get("@azVehicles").eq(6).should("contain", azVehicles[5]);

    cy.get("@azChange").eq(1).should("contain", azChange[0]);
    cy.get("@azChange").eq(2).should("contain", azChange[1]);
    cy.get("@azChange").eq(3).should("contain", azChange[2]);
    cy.get("@azChange").eq(4).should("contain", azChange[3]);
    cy.get("@azChange").eq(5).should("contain", azChange[4]);
    cy.get("@azChange").eq(6).should("contain", azChange[5]);

    // California
    cy.get("@caGen").eq(2).should("contain", caGen[0]);
    cy.get("@caGen").eq(3).should("contain", caGen[1]);
    cy.get("@caGen").eq(4).should("contain", caGen[2]);
    cy.get("@caGen").eq(5).should("contain", caGen[3]);
    cy.get("@caGen").eq(6).should("contain", caGen[4]);
    cy.get("@caGen").eq(7).should("contain", caGen[5]);

    cy.get("@caVehicles").eq(1).should("contain", caVehicles[0]);
    cy.get("@caVehicles").eq(2).should("contain", caVehicles[1]);
    cy.get("@caVehicles").eq(3).should("contain", caVehicles[2]);
    cy.get("@caVehicles").eq(4).should("contain", caVehicles[3]);
    cy.get("@caVehicles").eq(5).should("contain", caVehicles[4]);
    cy.get("@caVehicles").eq(6).should("contain", caVehicles[5]);

    cy.get("@caChange").eq(1).should("contain", caChange[0]);
    cy.get("@caChange").eq(2).should("contain", caChange[1]);
    cy.get("@caChange").eq(3).should("contain", caChange[2]);
    cy.get("@caChange").eq(4).should("contain", caChange[3]);
    cy.get("@caChange").eq(5).should("contain", caChange[4]);
    cy.get("@caChange").eq(6).should("contain", caChange[5]);

    // New Mexico
    cy.get("@nmGen").eq(2).should("contain", nmGen[0]);
    cy.get("@nmGen").eq(3).should("contain", nmGen[1]);
    cy.get("@nmGen").eq(4).should("contain", nmGen[2]);
    cy.get("@nmGen").eq(5).should("contain", nmGen[3]);
    cy.get("@nmGen").eq(6).should("contain", nmGen[4]);
    cy.get("@nmGen").eq(7).should("contain", nmGen[5]);

    cy.get("@nmVehicles").eq(1).should("contain", nmVehicles[0]);
    cy.get("@nmVehicles").eq(2).should("contain", nmVehicles[1]);
    cy.get("@nmVehicles").eq(3).should("contain", nmVehicles[2]);
    cy.get("@nmVehicles").eq(4).should("contain", nmVehicles[3]);
    cy.get("@nmVehicles").eq(5).should("contain", nmVehicles[4]);
    cy.get("@nmVehicles").eq(6).should("contain", nmVehicles[5]);

    cy.get("@nmChange").eq(1).should("contain", nmChange[0]);
    cy.get("@nmChange").eq(2).should("contain", nmChange[1]);
    cy.get("@nmChange").eq(3).should("contain", nmChange[2]);
    cy.get("@nmChange").eq(4).should("contain", nmChange[3]);
    cy.get("@nmChange").eq(5).should("contain", nmChange[4]);
    cy.get("@nmChange").eq(6).should("contain", nmChange[5]);

    // Texas
    cy.get("@txGen").eq(2).should("contain", txGen[0]);
    cy.get("@txGen").eq(3).should("contain", txGen[1]);
    cy.get("@txGen").eq(4).should("contain", txGen[2]);
    cy.get("@txGen").eq(5).should("contain", txGen[3]);
    cy.get("@txGen").eq(6).should("contain", txGen[4]);
    cy.get("@txGen").eq(7).should("contain", txGen[5]);

    cy.get("@txVehicles").eq(1).should("contain", txVehicles[0]);
    cy.get("@txVehicles").eq(2).should("contain", txVehicles[1]);
    cy.get("@txVehicles").eq(3).should("contain", txVehicles[2]);
    cy.get("@txVehicles").eq(4).should("contain", txVehicles[3]);
    cy.get("@txVehicles").eq(5).should("contain", txVehicles[4]);
    cy.get("@txVehicles").eq(6).should("contain", txVehicles[5]);

    cy.get("@txChange").eq(1).should("contain", txChange[0]);
    cy.get("@txChange").eq(2).should("contain", txChange[1]);
    cy.get("@txChange").eq(3).should("contain", txChange[2]);
    cy.get("@txChange").eq(4).should("contain", txChange[3]);
    cy.get("@txChange").eq(5).should("contain", txChange[4]);
    cy.get("@txChange").eq(6).should("contain", txChange[5]);
  });
});
