describe("Get Results – onshoreWind", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("Northwest");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Wind").as("toggleC");
    cy.get("@toggleC").click();

    cy.findByLabelText("Onshore wind total capacity:").as("onshoreWind");
    cy.get("@onshoreWind").type("1000");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Power Sector Only) table displays the correct results", () => {
    const generation = ["118,305,310", "115,890,350", "-2,414,950"];
    const so2Totals = ["55,686,310", "54,508,350", "-1,177,960"];
    const noxTotals = ["87,067,120", "85,168,820", "-1,898,300"];
    const ozoneNoxTotals = ["36,150,990", "35,474,880", "-676,110"];
    const co2Totals = ["82,252,920", "80,559,830", "-1,693,090"];
    const pm25Totals = ["9,570,510", "9,374,340", "-196,180"];
    const vocsTotals = ["2,338,580", "2,285,460", "-53,130"];
    const nh3Totals = ["2,357,230", "2,312,750", "-44,480"];

    const so2Rates = ["0.471", "0.488"];
    const noxRates = ["0.736", "0.786"];
    const ozoneNoxRates = ["0.748", "0.779"];
    const co2Rates = ["0.695", "0.701"];
    const pm25Rates = ["0.081", "0.081"];
    const vocsRates = ["0.020", "0.022"];
    const nh3Rates = ["0.020", "0.018"];

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
    const caGen = ["0", "0", "0", "0", "0", "0"]; // prettier-ignore
    const caVehicles = ["0", "0", "0", "0", "0", "0"];
    const caChange = ["0", "0", "0", "0", "0", "0"]; // prettier-ignore

    const idGen = ["-620", "-40,710", "-81,830", "-9,740", "-4,860", "-9,240"]; // prettier-ignore
    const idVehicles = ["0", "0", "0", "0", "0", "0"];
    const idChange = ["-620", "-40,710", "-81,830", "-9,740", "-4,860", "-9,240"]; // prettier-ignore

    const mtGen = ["-168,320", "-274,690", "-177,540", "-37,270", "-5,770", "-1,120"]; // prettier-ignore
    const mtVehicles = ["0", "0", "0", "0", "0", "0"];
    const mtChange = ["-168,320", "-274,690", "-177,540", "-37,270", "-5,770", "-1,120"]; // prettier-ignore

    const nvGen = ["-65,040", "-112,640", "-281,720", "-47,610", "-9,110", "-12,840"]; // prettier-ignore
    const nvVehicles = ["0", "0", "0", "0", "0", "0"];
    const nvChange = ["-65,040", "-112,640", "-281,720", "-47,610", "-9,110", "-12,840"]; // prettier-ignore

    const orGen = ["-760", "-16,160", "-100,010", "-8,820", "-1,790", "-6,160"]; // prettier-ignore
    const orVehicles = ["0", "0", "0", "0", "0", "0"];
    const orChange = ["-760", "-16,160", "-100,010", "-8,820", "-1,790", "-6,160"]; // prettier-ignore

    const utGen = ["-203,120", "-655,700", "-346,010", "-33,870", "-9,670", "-8,490"]; // prettier-ignore
    const utVehicles = ["0", "0", "0", "0", "0", "0"];
    const utChange = ["-203,120", "-655,700", "-346,010", "-33,870", "-9,670", "-8,490"]; // prettier-ignore

    const waGen = ["-269,790", "-301,070", "-318,420", "-30,930", "-7,690", "-5,840"]; // prettier-ignore
    const waVehicles = ["0", "0", "0", "0", "0", "0"];
    const waChange = ["-269,790", "-301,070", "-318,420", "-30,930", "-7,690", "-5,840"]; // prettier-ignore

    const wyGen = ["-470,300", "-497,330", "-387,560", "-27,940", "-14,230", "-790"]; // prettier-ignore
    const wyVehicles = ["0", "0", "0", "0", "0", "0"];
    const wyChange = ["-470,300", "-497,330", "-387,560", "-27,940", "-14,230", "-790"]; // prettier-ignore

    cy.findByLabelText("All states").click({ force: true });

    /* prettier-ignore */
    cy.findAllByText("California").filter("th")
      .parent().children().as("caGen")
      .parent().next().children().as("caVehicles")
      .parent().next().children().as("caChange")
      .parent().next().children().as("idGen")
      .parent().next().children().as("idVehicles")
      .parent().next().children().as("idChange")
      .parent().next().children().as("mtGen")
      .parent().next().children().as("mtVehicles")
      .parent().next().children().as("mtChange")
      .parent().next().children().as("nvGen")
      .parent().next().children().as("nvVehicles")
      .parent().next().children().as("nvChange")
      .parent().next().children().as("orGen")
      .parent().next().children().as("orVehicles")
      .parent().next().children().as("orChange")
      .parent().next().children().as("utGen")
      .parent().next().children().as("utVehicles")
      .parent().next().children().as("utChange")
      .parent().next().children().as("waGen")
      .parent().next().children().as("waVehicles")
      .parent().next().children().as("waChange")
      .parent().next().children().as("wyGen")
      .parent().next().children().as("wyVehicles")
      .parent().next().children().as("wyChange");

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

    // Idaho
    cy.get("@idGen").eq(2).should("contain", idGen[0]);
    cy.get("@idGen").eq(3).should("contain", idGen[1]);
    cy.get("@idGen").eq(4).should("contain", idGen[2]);
    cy.get("@idGen").eq(5).should("contain", idGen[3]);
    cy.get("@idGen").eq(6).should("contain", idGen[4]);
    cy.get("@idGen").eq(7).should("contain", idGen[5]);

    cy.get("@idVehicles").eq(1).should("contain", idVehicles[0]);
    cy.get("@idVehicles").eq(2).should("contain", idVehicles[1]);
    cy.get("@idVehicles").eq(3).should("contain", idVehicles[2]);
    cy.get("@idVehicles").eq(4).should("contain", idVehicles[3]);
    cy.get("@idVehicles").eq(5).should("contain", idVehicles[4]);
    cy.get("@idVehicles").eq(6).should("contain", idVehicles[5]);

    cy.get("@idChange").eq(1).should("contain", idChange[0]);
    cy.get("@idChange").eq(2).should("contain", idChange[1]);
    cy.get("@idChange").eq(3).should("contain", idChange[2]);
    cy.get("@idChange").eq(4).should("contain", idChange[3]);
    cy.get("@idChange").eq(5).should("contain", idChange[4]);
    cy.get("@idChange").eq(6).should("contain", idChange[5]);

    // Montana
    cy.get("@mtGen").eq(2).should("contain", mtGen[0]);
    cy.get("@mtGen").eq(3).should("contain", mtGen[1]);
    cy.get("@mtGen").eq(4).should("contain", mtGen[2]);
    cy.get("@mtGen").eq(5).should("contain", mtGen[3]);
    cy.get("@mtGen").eq(6).should("contain", mtGen[4]);
    cy.get("@mtGen").eq(7).should("contain", mtGen[5]);

    cy.get("@mtVehicles").eq(1).should("contain", mtVehicles[0]);
    cy.get("@mtVehicles").eq(2).should("contain", mtVehicles[1]);
    cy.get("@mtVehicles").eq(3).should("contain", mtVehicles[2]);
    cy.get("@mtVehicles").eq(4).should("contain", mtVehicles[3]);
    cy.get("@mtVehicles").eq(5).should("contain", mtVehicles[4]);
    cy.get("@mtVehicles").eq(6).should("contain", mtVehicles[5]);

    cy.get("@mtChange").eq(1).should("contain", mtChange[0]);
    cy.get("@mtChange").eq(2).should("contain", mtChange[1]);
    cy.get("@mtChange").eq(3).should("contain", mtChange[2]);
    cy.get("@mtChange").eq(4).should("contain", mtChange[3]);
    cy.get("@mtChange").eq(5).should("contain", mtChange[4]);
    cy.get("@mtChange").eq(6).should("contain", mtChange[5]);

    // Nevada
    cy.get("@nvGen").eq(2).should("contain", nvGen[0]);
    cy.get("@nvGen").eq(3).should("contain", nvGen[1]);
    cy.get("@nvGen").eq(4).should("contain", nvGen[2]);
    cy.get("@nvGen").eq(5).should("contain", nvGen[3]);
    cy.get("@nvGen").eq(6).should("contain", nvGen[4]);
    cy.get("@nvGen").eq(7).should("contain", nvGen[5]);

    cy.get("@nvVehicles").eq(1).should("contain", nvVehicles[0]);
    cy.get("@nvVehicles").eq(2).should("contain", nvVehicles[1]);
    cy.get("@nvVehicles").eq(3).should("contain", nvVehicles[2]);
    cy.get("@nvVehicles").eq(4).should("contain", nvVehicles[3]);
    cy.get("@nvVehicles").eq(5).should("contain", nvVehicles[4]);
    cy.get("@nvVehicles").eq(6).should("contain", nvVehicles[5]);

    cy.get("@nvChange").eq(1).should("contain", nvChange[0]);
    cy.get("@nvChange").eq(2).should("contain", nvChange[1]);
    cy.get("@nvChange").eq(3).should("contain", nvChange[2]);
    cy.get("@nvChange").eq(4).should("contain", nvChange[3]);
    cy.get("@nvChange").eq(5).should("contain", nvChange[4]);
    cy.get("@nvChange").eq(6).should("contain", nvChange[5]);

    // Oregon
    cy.get("@orGen").eq(2).should("contain", orGen[0]);
    cy.get("@orGen").eq(3).should("contain", orGen[1]);
    cy.get("@orGen").eq(4).should("contain", orGen[2]);
    cy.get("@orGen").eq(5).should("contain", orGen[3]);
    cy.get("@orGen").eq(6).should("contain", orGen[4]);
    cy.get("@orGen").eq(7).should("contain", orGen[5]);

    cy.get("@orVehicles").eq(1).should("contain", orVehicles[0]);
    cy.get("@orVehicles").eq(2).should("contain", orVehicles[1]);
    cy.get("@orVehicles").eq(3).should("contain", orVehicles[2]);
    cy.get("@orVehicles").eq(4).should("contain", orVehicles[3]);
    cy.get("@orVehicles").eq(5).should("contain", orVehicles[4]);
    cy.get("@orVehicles").eq(6).should("contain", orVehicles[5]);

    cy.get("@orChange").eq(1).should("contain", orChange[0]);
    cy.get("@orChange").eq(2).should("contain", orChange[1]);
    cy.get("@orChange").eq(3).should("contain", orChange[2]);
    cy.get("@orChange").eq(4).should("contain", orChange[3]);
    cy.get("@orChange").eq(5).should("contain", orChange[4]);
    cy.get("@orChange").eq(6).should("contain", orChange[5]);

    // Utah
    cy.get("@utGen").eq(2).should("contain", utGen[0]);
    cy.get("@utGen").eq(3).should("contain", utGen[1]);
    cy.get("@utGen").eq(4).should("contain", utGen[2]);
    cy.get("@utGen").eq(5).should("contain", utGen[3]);
    cy.get("@utGen").eq(6).should("contain", utGen[4]);
    cy.get("@utGen").eq(7).should("contain", utGen[5]);

    cy.get("@utVehicles").eq(1).should("contain", utVehicles[0]);
    cy.get("@utVehicles").eq(2).should("contain", utVehicles[1]);
    cy.get("@utVehicles").eq(3).should("contain", utVehicles[2]);
    cy.get("@utVehicles").eq(4).should("contain", utVehicles[3]);
    cy.get("@utVehicles").eq(5).should("contain", utVehicles[4]);
    cy.get("@utVehicles").eq(6).should("contain", utVehicles[5]);

    cy.get("@utChange").eq(1).should("contain", utChange[0]);
    cy.get("@utChange").eq(2).should("contain", utChange[1]);
    cy.get("@utChange").eq(3).should("contain", utChange[2]);
    cy.get("@utChange").eq(4).should("contain", utChange[3]);
    cy.get("@utChange").eq(5).should("contain", utChange[4]);
    cy.get("@utChange").eq(6).should("contain", utChange[5]);

    // Washington
    cy.get("@waGen").eq(2).should("contain", waGen[0]);
    cy.get("@waGen").eq(3).should("contain", waGen[1]);
    cy.get("@waGen").eq(4).should("contain", waGen[2]);
    cy.get("@waGen").eq(5).should("contain", waGen[3]);
    cy.get("@waGen").eq(6).should("contain", waGen[4]);
    cy.get("@waGen").eq(7).should("contain", waGen[5]);

    cy.get("@waVehicles").eq(1).should("contain", waVehicles[0]);
    cy.get("@waVehicles").eq(2).should("contain", waVehicles[1]);
    cy.get("@waVehicles").eq(3).should("contain", waVehicles[2]);
    cy.get("@waVehicles").eq(4).should("contain", waVehicles[3]);
    cy.get("@waVehicles").eq(5).should("contain", waVehicles[4]);
    cy.get("@waVehicles").eq(6).should("contain", waVehicles[5]);

    cy.get("@waChange").eq(1).should("contain", waChange[0]);
    cy.get("@waChange").eq(2).should("contain", waChange[1]);
    cy.get("@waChange").eq(3).should("contain", waChange[2]);
    cy.get("@waChange").eq(4).should("contain", waChange[3]);
    cy.get("@waChange").eq(5).should("contain", waChange[4]);
    cy.get("@waChange").eq(6).should("contain", waChange[5]);

    // Wyoming
    cy.get("@wyGen").eq(2).should("contain", wyGen[0]);
    cy.get("@wyGen").eq(3).should("contain", wyGen[1]);
    cy.get("@wyGen").eq(4).should("contain", wyGen[2]);
    cy.get("@wyGen").eq(5).should("contain", wyGen[3]);
    cy.get("@wyGen").eq(6).should("contain", wyGen[4]);
    cy.get("@wyGen").eq(7).should("contain", wyGen[5]);

    cy.get("@wyVehicles").eq(1).should("contain", wyVehicles[0]);
    cy.get("@wyVehicles").eq(2).should("contain", wyVehicles[1]);
    cy.get("@wyVehicles").eq(3).should("contain", wyVehicles[2]);
    cy.get("@wyVehicles").eq(4).should("contain", wyVehicles[3]);
    cy.get("@wyVehicles").eq(5).should("contain", wyVehicles[4]);
    cy.get("@wyVehicles").eq(6).should("contain", wyVehicles[5]);

    cy.get("@wyChange").eq(1).should("contain", wyChange[0]);
    cy.get("@wyChange").eq(2).should("contain", wyChange[1]);
    cy.get("@wyChange").eq(3).should("contain", wyChange[2]);
    cy.get("@wyChange").eq(4).should("contain", wyChange[3]);
    cy.get("@wyChange").eq(5).should("contain", wyChange[4]);
    cy.get("@wyChange").eq(6).should("contain", wyChange[5]);
  });
});
