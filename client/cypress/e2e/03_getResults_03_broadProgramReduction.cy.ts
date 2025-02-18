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
    const generation = ["49,108,280", "43,819,390", "-5,288,890"];
    const so2Totals = ["1,362,440", "994,550", "-367,890"];
    const noxTotals = ["7,209,170", "6,306,230", "-902,940"];
    const ozoneNoxTotals = ["3,606,780", "3,052,580", "-554,190"];
    const co2Totals = ["25,430,570", "22,794,620", "-2,635,960"];
    const pm25Totals = ["1,380,600", "1,199,600", "-180,990"];
    const vocsTotals = ["524,610", "459,730", "-64,880"];
    const nh3Totals = ["820,590", "729,780", "-90,810"];

    const so2Rates = ["0.028", "0.070"];
    const noxRates = ["0.147", "0.171"];
    const ozoneNoxRates = ["0.158", "0.225"];
    const co2Rates = ["0.518", "0.498"];
    const pm25Rates = ["0.028", "0.034"];
    const vocsRates = ["0.011", "0.012"];
    const nh3Rates = ["0.017", "0.017"];

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
    const ctGen = ["-75,350", "-177,200", "-715,250", "-33,660", "-10,380", "-29,500"]; // prettier-ignore
    const ctVehicles = ["0", "0", "0", "0", "0", "0"];
    const ctChange = ["-75,350", "-177,200", "-715,250", "-33,660", "-10,380", "-29,500"]; // prettier-ignore

    const meGen = ["-110,480", "-91,040", "-370,160", "-18,570", "-6,990", "-6,530"]; // prettier-ignore
    const meVehicles = ["0", "0", "0", "0", "0", "0"];
    const meChange = ["-110,480", "-91,040", "-370,160", "-18,570", "-6,990", "-6,530"]; // prettier-ignore

    const maGen = ["-80,720", "-325,090", "-760,480", "-62,700", "-25,570", "-28,340"]; // prettier-ignore
    const maVehicles = ["0", "0", "0", "0", "0", "0"];
    const maChange = ["-80,720", "-325,090", "-760,480", "-62,700", "-25,570", "-28,340"]; // prettier-ignore

    const nhGen = ["-93,130", "-183,430", "-341,920", "-25,760", "-7,410", "-14,130"]; // prettier-ignore
    const nhVehicles = ["0", "0", "0", "0", "0", "0"];
    const nhChange = ["-93,130", "-183,430", "-341,920", "-25,760", "-7,410", "-14,130"]; // prettier-ignore

    const riGen = ["-8,010", "-104,760", "-414,810", "-33,870", "-9,510", "-10,030"]; // prettier-ignore
    const riVehicles = ["0", "0", "0", "0", "0", "0"];
    const riChange = ["-8,010", "-104,760", "-414,810", "-33,870", "-9,510", "-10,030"]; // prettier-ignore

    const vtGen = ["-200", "-21,430", "-33,340", "-6,430", "-5,030", "-2,280"]; // prettier-ignore
    const vtVehicles = ["0", "0", "0", "0", "0", "0"];
    const vtChange = ["-200", "-21,430", "-33,340", "-6,430", "-5,030", "-2,280"]; // prettier-ignore

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
