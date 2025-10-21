describe("Get Results – broadProgramReduction", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("New England");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Percentage reductions in some or all hours").as("toggleB");
    cy.get("@toggleB").click();

    cy.findByLabelText("Broad-based program:", { exact: false }).as("broadProgramReduction"); // prettier-ignore
    cy.get("@broadProgramReduction").type("10");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Power Sector Only) table displays the correct results", () => {
    const generation = ["53,344,830", "47,608,860", "-5,735,980"];
    const so2Totals = ["1,247,830", "811,100", "-436,730"];
    const noxTotals = ["7,402,300", "6,193,610", "-1,208,690"];
    const ozoneNoxTotals = ["3,589,940", "2,866,260", "-723,680"];
    const co2Totals = ["26,784,710", "23,813,560", "-2,971,150"];
    const pm25Totals = ["1,529,870", "1,299,000", "-230,870"];
    const vocsTotals = ["486,290", "420,020", "-66,270"];
    const nh3Totals = ["1,034,460", "919,250", "-115,210"];

    const so2Rates = ["0.023", "0.076"];
    const noxRates = ["0.139", "0.211"];
    const ozoneNoxRates = ["0.146", "0.273"];
    const co2Rates = ["0.502", "0.518"];
    const pm25Rates = ["0.029", "0.040"];
    const vocsRates = ["0.009", "0.012"];
    const nh3Rates = ["0.019", "0.020"];

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
    const ctGen = ["-96,010", "-151,810", "-726,090", "-42,250", "-15,760", "-27,660"]; // prettier-ignore
    const ctVehicles = ["0", "0", "0", "0", "0", "0"];
    const ctChange = ["-96,010", "-151,810", "-726,090", "-42,250", "-15,760", "-27,660"]; // prettier-ignore

    const meGen = ["-105,640", "-65,940", "-307,930", "-13,190", "-4,390", "-6,370"]; // prettier-ignore
    const meVehicles = ["0", "0", "0", "0", "0", "0"];
    const meChange = ["-105,640", "-65,940", "-307,930", "-13,190", "-4,390", "-6,370"]; // prettier-ignore

    const maGen = ["-125,580", "-552,290", "-1,081,190", "-87,980", "-32,440", "-37,360"]; // prettier-ignore
    const maVehicles = ["0", "0", "0", "0", "0", "0"];
    const maChange = ["-125,580", "-552,290", "-1,081,190", "-87,980", "-32,440", "-37,360"]; // prettier-ignore

    const nhGen = ["-99,590", "-273,000", "-368,090", "-42,900", "-5,750", "-18,100"]; // prettier-ignore
    const nhVehicles = ["0", "0", "0", "0", "0", "0"];
    const nhChange = ["-99,590", "-273,000", "-368,090", "-42,900", "-5,750", "-18,100"]; // prettier-ignore

    const riGen = ["-9,970", "-160,240", "-484,770", "-43,250", "-7,860", "-25,250"]; // prettier-ignore
    const riVehicles = ["0", "0", "0", "0", "0", "0"];
    const riChange = ["-9,970", "-160,240", "-484,770", "-43,250", "-7,860", "-25,250"]; // prettier-ignore

    const vtGen = ["60", "-5,400", "-3,080", "-1,310", "-70", "-460"]; // prettier-ignore
    const vtVehicles = ["0", "0", "0", "0", "0", "0"];
    const vtChange = ["60", "-5,400", "-3,080", "-1,310", "-70", "-460"]; // prettier-ignore

    cy.findByLabelText("All states").click({ force: true });

    /* prettier-ignore */
    cy.findAllByText("Connecticut").filter("th")
      .parent().children().as("ctGen")
      .parent().next().children().as("ctVehicles")
      .parent().next().children().as("ctChange")
      .parent().next().children().as("meGen")
      .parent().next().children().as("meVehicles")
      .parent().next().children().as("meChange")
      .parent().next().children().as("maGen")
      .parent().next().children().as("maVehicles")
      .parent().next().children().as("maChange")
      .parent().next().children().as("nhGen")
      .parent().next().children().as("nhVehicles")
      .parent().next().children().as("nhChange")
      .parent().next().children().as("riGen")
      .parent().next().children().as("riVehicles")
      .parent().next().children().as("riChange")
      .parent().next().children().as("vtGen")
      .parent().next().children().as("vtVehicles")
      .parent().next().children().as("vtChange");

    // Connecticut
    cy.get("@ctGen").eq(2).should("contain", ctGen[0]);
    cy.get("@ctGen").eq(3).should("contain", ctGen[1]);
    cy.get("@ctGen").eq(4).should("contain", ctGen[2]);
    cy.get("@ctGen").eq(5).should("contain", ctGen[3]);
    cy.get("@ctGen").eq(6).should("contain", ctGen[4]);
    cy.get("@ctGen").eq(7).should("contain", ctGen[5]);

    cy.get("@ctVehicles").eq(1).should("contain", ctVehicles[0]);
    cy.get("@ctVehicles").eq(2).should("contain", ctVehicles[1]);
    cy.get("@ctVehicles").eq(3).should("contain", ctVehicles[2]);
    cy.get("@ctVehicles").eq(4).should("contain", ctVehicles[3]);
    cy.get("@ctVehicles").eq(5).should("contain", ctVehicles[4]);
    cy.get("@ctVehicles").eq(6).should("contain", ctVehicles[5]);

    cy.get("@ctChange").eq(1).should("contain", ctChange[0]);
    cy.get("@ctChange").eq(2).should("contain", ctChange[1]);
    cy.get("@ctChange").eq(3).should("contain", ctChange[2]);
    cy.get("@ctChange").eq(4).should("contain", ctChange[3]);
    cy.get("@ctChange").eq(5).should("contain", ctChange[4]);
    cy.get("@ctChange").eq(6).should("contain", ctChange[5]);

    // Maine
    cy.get("@meGen").eq(2).should("contain", meGen[0]);
    cy.get("@meGen").eq(3).should("contain", meGen[1]);
    cy.get("@meGen").eq(4).should("contain", meGen[2]);
    cy.get("@meGen").eq(5).should("contain", meGen[3]);
    cy.get("@meGen").eq(6).should("contain", meGen[4]);
    cy.get("@meGen").eq(7).should("contain", meGen[5]);

    cy.get("@meVehicles").eq(1).should("contain", meVehicles[0]);
    cy.get("@meVehicles").eq(2).should("contain", meVehicles[1]);
    cy.get("@meVehicles").eq(3).should("contain", meVehicles[2]);
    cy.get("@meVehicles").eq(4).should("contain", meVehicles[3]);
    cy.get("@meVehicles").eq(5).should("contain", meVehicles[4]);
    cy.get("@meVehicles").eq(6).should("contain", meVehicles[5]);

    cy.get("@meChange").eq(1).should("contain", meChange[0]);
    cy.get("@meChange").eq(2).should("contain", meChange[1]);
    cy.get("@meChange").eq(3).should("contain", meChange[2]);
    cy.get("@meChange").eq(4).should("contain", meChange[3]);
    cy.get("@meChange").eq(5).should("contain", meChange[4]);
    cy.get("@meChange").eq(6).should("contain", meChange[5]);

    // Massachusetts
    cy.get("@maGen").eq(2).should("contain", maGen[0]);
    cy.get("@maGen").eq(3).should("contain", maGen[1]);
    cy.get("@maGen").eq(4).should("contain", maGen[2]);
    cy.get("@maGen").eq(5).should("contain", maGen[3]);
    cy.get("@maGen").eq(6).should("contain", maGen[4]);
    cy.get("@maGen").eq(7).should("contain", maGen[5]);

    cy.get("@maVehicles").eq(1).should("contain", maVehicles[0]);
    cy.get("@maVehicles").eq(2).should("contain", maVehicles[1]);
    cy.get("@maVehicles").eq(3).should("contain", maVehicles[2]);
    cy.get("@maVehicles").eq(4).should("contain", maVehicles[3]);
    cy.get("@maVehicles").eq(5).should("contain", maVehicles[4]);
    cy.get("@maVehicles").eq(6).should("contain", maVehicles[5]);

    cy.get("@maChange").eq(1).should("contain", maChange[0]);
    cy.get("@maChange").eq(2).should("contain", maChange[1]);
    cy.get("@maChange").eq(3).should("contain", maChange[2]);
    cy.get("@maChange").eq(4).should("contain", maChange[3]);
    cy.get("@maChange").eq(5).should("contain", maChange[4]);
    cy.get("@maChange").eq(6).should("contain", maChange[5]);

    // New Hampshire
    cy.get("@nhGen").eq(2).should("contain", nhGen[0]);
    cy.get("@nhGen").eq(3).should("contain", nhGen[1]);
    cy.get("@nhGen").eq(4).should("contain", nhGen[2]);
    cy.get("@nhGen").eq(5).should("contain", nhGen[3]);
    cy.get("@nhGen").eq(6).should("contain", nhGen[4]);
    cy.get("@nhGen").eq(7).should("contain", nhGen[5]);

    cy.get("@nhVehicles").eq(1).should("contain", nhVehicles[0]);
    cy.get("@nhVehicles").eq(2).should("contain", nhVehicles[1]);
    cy.get("@nhVehicles").eq(3).should("contain", nhVehicles[2]);
    cy.get("@nhVehicles").eq(4).should("contain", nhVehicles[3]);
    cy.get("@nhVehicles").eq(5).should("contain", nhVehicles[4]);
    cy.get("@nhVehicles").eq(6).should("contain", nhVehicles[5]);

    cy.get("@nhChange").eq(1).should("contain", nhChange[0]);
    cy.get("@nhChange").eq(2).should("contain", nhChange[1]);
    cy.get("@nhChange").eq(3).should("contain", nhChange[2]);
    cy.get("@nhChange").eq(4).should("contain", nhChange[3]);
    cy.get("@nhChange").eq(5).should("contain", nhChange[4]);
    cy.get("@nhChange").eq(6).should("contain", nhChange[5]);

    // Rhode Island
    cy.get("@riGen").eq(2).should("contain", riGen[0]);
    cy.get("@riGen").eq(3).should("contain", riGen[1]);
    cy.get("@riGen").eq(4).should("contain", riGen[2]);
    cy.get("@riGen").eq(5).should("contain", riGen[3]);
    cy.get("@riGen").eq(6).should("contain", riGen[4]);
    cy.get("@riGen").eq(7).should("contain", riGen[5]);

    cy.get("@riVehicles").eq(1).should("contain", riVehicles[0]);
    cy.get("@riVehicles").eq(2).should("contain", riVehicles[1]);
    cy.get("@riVehicles").eq(3).should("contain", riVehicles[2]);
    cy.get("@riVehicles").eq(4).should("contain", riVehicles[3]);
    cy.get("@riVehicles").eq(5).should("contain", riVehicles[4]);
    cy.get("@riVehicles").eq(6).should("contain", riVehicles[5]);

    cy.get("@riChange").eq(1).should("contain", riChange[0]);
    cy.get("@riChange").eq(2).should("contain", riChange[1]);
    cy.get("@riChange").eq(3).should("contain", riChange[2]);
    cy.get("@riChange").eq(4).should("contain", riChange[3]);
    cy.get("@riChange").eq(5).should("contain", riChange[4]);
    cy.get("@riChange").eq(6).should("contain", riChange[5]);

    // Vermont
    cy.get("@vtGen").eq(2).should("contain", vtGen[0]);
    cy.get("@vtGen").eq(3).should("contain", vtGen[1]);
    cy.get("@vtGen").eq(4).should("contain", vtGen[2]);
    cy.get("@vtGen").eq(5).should("contain", vtGen[3]);
    cy.get("@vtGen").eq(6).should("contain", vtGen[4]);
    cy.get("@vtGen").eq(7).should("contain", vtGen[5]);

    cy.get("@vtVehicles").eq(1).should("contain", vtVehicles[0]);
    cy.get("@vtVehicles").eq(2).should("contain", vtVehicles[1]);
    cy.get("@vtVehicles").eq(3).should("contain", vtVehicles[2]);
    cy.get("@vtVehicles").eq(4).should("contain", vtVehicles[3]);
    cy.get("@vtVehicles").eq(5).should("contain", vtVehicles[4]);
    cy.get("@vtVehicles").eq(6).should("contain", vtVehicles[5]);

    cy.get("@vtChange").eq(1).should("contain", vtChange[0]);
    cy.get("@vtChange").eq(2).should("contain", vtChange[1]);
    cy.get("@vtChange").eq(3).should("contain", vtChange[2]);
    cy.get("@vtChange").eq(4).should("contain", vtChange[3]);
    cy.get("@vtChange").eq(5).should("contain", vtChange[4]);
    cy.get("@vtChange").eq(6).should("contain", vtChange[5]);
  });
});
