describe("Get Results – rooftopSolar", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("Central");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Solar photovoltaic (PV)").as("toggleD");
    cy.get("@toggleD").click();

    cy.findByLabelText("Distributed (rooftop) solar PV total capacity:").as("rooftopSolar"); // prettier-ignore
    cy.get("@rooftopSolar").type("1000");

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.get("@calculateBtn").click();

    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");
    cy.get("@resultsBtn").click();

    cy.findByText("LOADING...", { timeout: 120000 }).should("not.exist");
  });

  it("Annual Emissions Changes (Power Sector Only) table displays the correct results", () => {
    const generation = ["143,498,520", "141,589,820", "-1,908,700"];
    const so2Totals = ["198,075,040", "196,041,790", "-2,033,250"];
    const noxTotals = ["158,602,970", "156,250,510", "-2,352,460"];
    const ozoneNoxTotals = ["80,073,160", "78,879,220", "-1,193,940"];
    const co2Totals = ["119,047,210", "117,509,100", "-1,538,110"];
    const pm25Totals = ["9,357,500", "9,243,570", "-113,930"];
    const vocsTotals = ["4,726,610", "4,654,310", "-72,300"];
    const nh3Totals = ["4,344,240", "4,283,220", "-61,020"];

    const so2Rates = ["1.380", "1.065"];
    const noxRates = ["1.105", "1.232"];
    const ozoneNoxRates = ["1.089", "1.384"];
    const co2Rates = ["0.830", "0.806"];
    const pm25Rates = ["0.065", "0.060"];
    const vocsRates = ["0.033", "0.038"];
    const nh3Rates = ["0.030", "0.032"];

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
    const arGen = ["-22,610", "-52,250", "-58,740", "-1,990", "-2,600", "-3,170"]; // prettier-ignore
    const arVehicles = ["0", "0", "0", "0", "0", "0"];
    const arChange = ["-22,610", "-52,250", "-58,740", "-1,990", "-2,600", "-3,170"]; // prettier-ignore

    const iaGen = ["0", "-830", "-570", "-180", "-80", "-50"]; // prettier-ignore
    const iaVehicles = ["0", "0", "0", "0", "0", "0"];
    const iaChange = ["0", "-830", "-570", "-180", "-80", "-50"]; // prettier-ignore

    const ksGen = ["-94,630", "-392,720", "-311,390", "-26,770", "-13,370", "-10,200"]; // prettier-ignore
    const ksVehicles = ["0", "0", "0", "0", "0", "0"];
    const ksChange = ["-94,630", "-392,720", "-311,390", "-26,770", "-13,370", "-10,200"]; // prettier-ignore

    const laGen = ["-100", "-17,140", "-13,630", "-1,500", "-520", "-860"]; // prettier-ignore
    const laVehicles = ["0", "0", "0", "0", "0", "0"];
    const laChange = ["-100", "-17,140", "-13,630", "-1,500", "-520", "-860"]; // prettier-ignore

    const moGen = ["-119,760", "-288,010", "-240,290", "-15,730", "-9,380", "-9,700"]; // prettier-ignore
    const moVehicles = ["0", "0", "0", "0", "0", "0"];
    const moChange = ["-119,760", "-288,010", "-240,290", "-15,730", "-9,380", "-9,700"]; // prettier-ignore

    const mtGen = ["0", "-2,550", "-1,810", "-470", "-150", "-250"]; // prettier-ignore
    const mtVehicles = ["0", "0", "0", "0", "0", "0"];
    const mtChange = ["0", "-2,550", "-1,810", "-470", "-150", "-250"]; // prettier-ignore

    const neGen = ["-765,540", "-409,040", "-186,200", "-8,720", "-8,810", "-7,860"]; // prettier-ignore
    const neVehicles = ["0", "0", "0", "0", "0", "0"];
    const neChange = ["-765,540", "-409,040", "-186,200", "-8,720", "-8,810", "-7,860"]; // prettier-ignore

    const nmGen = ["-130", "-23,040", "-12,370", "-1,200", "-760", "-1,270"]; // prettier-ignore
    const nmVehicles = ["0", "0", "0", "0", "0", "0"];
    const nmChange = ["-130", "-23,040", "-12,370", "-1,200", "-760", "-1,270"]; // prettier-ignore

    const ndGen = ["-79,530", "-93,120", "-65,130", "-8,570", "-960", "-2,080"]; // prettier-ignore
    const ndVehicles = ["0", "0", "0", "0", "0", "0"];
    const ndChange = ["-79,530", "-93,120", "-65,130", "-8,570", "-960", "-2,080"]; // prettier-ignore

    const okGen = ["-221,810", "-671,070", "-379,870", "-30,250", "-22,280", "-13,970"]; // prettier-ignore
    const okVehicles = ["0", "0", "0", "0", "0", "0"];
    const okChange = ["-221,810", "-671,070", "-379,870", "-30,250", "-22,280", "-13,970"]; // prettier-ignore

    const sdGen = ["-80", "-12,010", "-12,060", "-620", "-380", "-940"]; // prettier-ignore
    const sdVehicles = ["0", "0", "0", "0", "0", "0"];
    const sdChange = ["-80", "-12,010", "-12,060", "-620", "-380", "-940"]; // prettier-ignore

    const txGen = ["-729,050", "-390,670", "-256,040", "-17,920", "-13,020", "-10,670"]; // prettier-ignore
    const txVehicles = ["0", "0", "0", "0", "0", "0"];
    const txChange = ["-729,050", "-390,670", "-256,040", "-17,920", "-13,020", "-10,670"]; // prettier-ignore

    cy.findByLabelText("All states").click({ force: true });

    /* prettier-ignore */
    cy.findAllByText("Arkansas").filter("th")
      .parent().children().as("arGen")
      .parent().next().children().as("arVehicles")
      .parent().next().children().as("arChange")
      .parent().next().children().as("iaGen")
      .parent().next().children().as("iaVehicles")
      .parent().next().children().as("iaChange")
      .parent().next().children().as("ksGen")
      .parent().next().children().as("ksVehicles")
      .parent().next().children().as("ksChange")
      .parent().next().children().as("laGen")
      .parent().next().children().as("laVehicles")
      .parent().next().children().as("laChange")
      .parent().next().children().as("moGen")
      .parent().next().children().as("moVehicles")
      .parent().next().children().as("moChange")
      .parent().next().children().as("mtGen")
      .parent().next().children().as("mtVehicles")
      .parent().next().children().as("mtChange")
      .parent().next().children().as("neGen")
      .parent().next().children().as("neVehicles")
      .parent().next().children().as("neChange")
      .parent().next().children().as("nmGen")
      .parent().next().children().as("nmVehicles")
      .parent().next().children().as("nmChange")
      .parent().next().children().as("ndGen")
      .parent().next().children().as("ndVehicles")
      .parent().next().children().as("ndChange")
      .parent().next().children().as("okGen")
      .parent().next().children().as("okVehicles")
      .parent().next().children().as("okChange")
      .parent().next().children().as("sdGen")
      .parent().next().children().as("sdVehicles")
      .parent().next().children().as("sdChange")
      .parent().next().children().as("txGen")
      .parent().next().children().as("txVehicles")
      .parent().next().children().as("txChange");

    // Arkansas
    cy.get("@arGen").eq(2).should("contain", arGen[0]);
    cy.get("@arGen").eq(3).should("contain", arGen[1]);
    cy.get("@arGen").eq(4).should("contain", arGen[2]);
    cy.get("@arGen").eq(5).should("contain", arGen[3]);
    cy.get("@arGen").eq(6).should("contain", arGen[4]);
    cy.get("@arGen").eq(7).should("contain", arGen[5]);

    cy.get("@arVehicles").eq(1).should("contain", arVehicles[0]);
    cy.get("@arVehicles").eq(2).should("contain", arVehicles[1]);
    cy.get("@arVehicles").eq(3).should("contain", arVehicles[2]);
    cy.get("@arVehicles").eq(4).should("contain", arVehicles[3]);
    cy.get("@arVehicles").eq(5).should("contain", arVehicles[4]);
    cy.get("@arVehicles").eq(6).should("contain", arVehicles[5]);

    cy.get("@arChange").eq(1).should("contain", arChange[0]);
    cy.get("@arChange").eq(2).should("contain", arChange[1]);
    cy.get("@arChange").eq(3).should("contain", arChange[2]);
    cy.get("@arChange").eq(4).should("contain", arChange[3]);
    cy.get("@arChange").eq(5).should("contain", arChange[4]);
    cy.get("@arChange").eq(6).should("contain", arChange[5]);

    // Iowa
    cy.get("@iaGen").eq(2).should("contain", iaGen[0]);
    cy.get("@iaGen").eq(3).should("contain", iaGen[1]);
    cy.get("@iaGen").eq(4).should("contain", iaGen[2]);
    cy.get("@iaGen").eq(5).should("contain", iaGen[3]);
    cy.get("@iaGen").eq(6).should("contain", iaGen[4]);
    cy.get("@iaGen").eq(7).should("contain", iaGen[5]);

    cy.get("@iaVehicles").eq(1).should("contain", iaVehicles[0]);
    cy.get("@iaVehicles").eq(2).should("contain", iaVehicles[1]);
    cy.get("@iaVehicles").eq(3).should("contain", iaVehicles[2]);
    cy.get("@iaVehicles").eq(4).should("contain", iaVehicles[3]);
    cy.get("@iaVehicles").eq(5).should("contain", iaVehicles[4]);
    cy.get("@iaVehicles").eq(6).should("contain", iaVehicles[5]);

    cy.get("@iaChange").eq(1).should("contain", iaChange[0]);
    cy.get("@iaChange").eq(2).should("contain", iaChange[1]);
    cy.get("@iaChange").eq(3).should("contain", iaChange[2]);
    cy.get("@iaChange").eq(4).should("contain", iaChange[3]);
    cy.get("@iaChange").eq(5).should("contain", iaChange[4]);
    cy.get("@iaChange").eq(6).should("contain", iaChange[5]);

    // Kansas
    cy.get("@ksGen").eq(2).should("contain", ksGen[0]);
    cy.get("@ksGen").eq(3).should("contain", ksGen[1]);
    cy.get("@ksGen").eq(4).should("contain", ksGen[2]);
    cy.get("@ksGen").eq(5).should("contain", ksGen[3]);
    cy.get("@ksGen").eq(6).should("contain", ksGen[4]);
    cy.get("@ksGen").eq(7).should("contain", ksGen[5]);

    cy.get("@ksVehicles").eq(1).should("contain", ksVehicles[0]);
    cy.get("@ksVehicles").eq(2).should("contain", ksVehicles[1]);
    cy.get("@ksVehicles").eq(3).should("contain", ksVehicles[2]);
    cy.get("@ksVehicles").eq(4).should("contain", ksVehicles[3]);
    cy.get("@ksVehicles").eq(5).should("contain", ksVehicles[4]);
    cy.get("@ksVehicles").eq(6).should("contain", ksVehicles[5]);

    cy.get("@ksChange").eq(1).should("contain", ksChange[0]);
    cy.get("@ksChange").eq(2).should("contain", ksChange[1]);
    cy.get("@ksChange").eq(3).should("contain", ksChange[2]);
    cy.get("@ksChange").eq(4).should("contain", ksChange[3]);
    cy.get("@ksChange").eq(5).should("contain", ksChange[4]);
    cy.get("@ksChange").eq(6).should("contain", ksChange[5]);

    // Louisiana
    cy.get("@laGen").eq(2).should("contain", laGen[0]);
    cy.get("@laGen").eq(3).should("contain", laGen[1]);
    cy.get("@laGen").eq(4).should("contain", laGen[2]);
    cy.get("@laGen").eq(5).should("contain", laGen[3]);
    cy.get("@laGen").eq(6).should("contain", laGen[4]);
    cy.get("@laGen").eq(7).should("contain", laGen[5]);

    cy.get("@laVehicles").eq(1).should("contain", laVehicles[0]);
    cy.get("@laVehicles").eq(2).should("contain", laVehicles[1]);
    cy.get("@laVehicles").eq(3).should("contain", laVehicles[2]);
    cy.get("@laVehicles").eq(4).should("contain", laVehicles[3]);
    cy.get("@laVehicles").eq(5).should("contain", laVehicles[4]);
    cy.get("@laVehicles").eq(6).should("contain", laVehicles[5]);

    cy.get("@laChange").eq(1).should("contain", laChange[0]);
    cy.get("@laChange").eq(2).should("contain", laChange[1]);
    cy.get("@laChange").eq(3).should("contain", laChange[2]);
    cy.get("@laChange").eq(4).should("contain", laChange[3]);
    cy.get("@laChange").eq(5).should("contain", laChange[4]);
    cy.get("@laChange").eq(6).should("contain", laChange[5]);

    // Missouri
    cy.get("@moGen").eq(2).should("contain", moGen[0]);
    cy.get("@moGen").eq(3).should("contain", moGen[1]);
    cy.get("@moGen").eq(4).should("contain", moGen[2]);
    cy.get("@moGen").eq(5).should("contain", moGen[3]);
    cy.get("@moGen").eq(6).should("contain", moGen[4]);
    cy.get("@moGen").eq(7).should("contain", moGen[5]);

    cy.get("@moVehicles").eq(1).should("contain", moVehicles[0]);
    cy.get("@moVehicles").eq(2).should("contain", moVehicles[1]);
    cy.get("@moVehicles").eq(3).should("contain", moVehicles[2]);
    cy.get("@moVehicles").eq(4).should("contain", moVehicles[3]);
    cy.get("@moVehicles").eq(5).should("contain", moVehicles[4]);
    cy.get("@moVehicles").eq(6).should("contain", moVehicles[5]);

    cy.get("@moChange").eq(1).should("contain", moChange[0]);
    cy.get("@moChange").eq(2).should("contain", moChange[1]);
    cy.get("@moChange").eq(3).should("contain", moChange[2]);
    cy.get("@moChange").eq(4).should("contain", moChange[3]);
    cy.get("@moChange").eq(5).should("contain", moChange[4]);
    cy.get("@moChange").eq(6).should("contain", moChange[5]);

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

    // Nebraska
    cy.get("@neGen").eq(2).should("contain", neGen[0]);
    cy.get("@neGen").eq(3).should("contain", neGen[1]);
    cy.get("@neGen").eq(4).should("contain", neGen[2]);
    cy.get("@neGen").eq(5).should("contain", neGen[3]);
    cy.get("@neGen").eq(6).should("contain", neGen[4]);
    cy.get("@neGen").eq(7).should("contain", neGen[5]);

    cy.get("@neVehicles").eq(1).should("contain", neVehicles[0]);
    cy.get("@neVehicles").eq(2).should("contain", neVehicles[1]);
    cy.get("@neVehicles").eq(3).should("contain", neVehicles[2]);
    cy.get("@neVehicles").eq(4).should("contain", neVehicles[3]);
    cy.get("@neVehicles").eq(5).should("contain", neVehicles[4]);
    cy.get("@neVehicles").eq(6).should("contain", neVehicles[5]);

    cy.get("@neChange").eq(1).should("contain", neChange[0]);
    cy.get("@neChange").eq(2).should("contain", neChange[1]);
    cy.get("@neChange").eq(3).should("contain", neChange[2]);
    cy.get("@neChange").eq(4).should("contain", neChange[3]);
    cy.get("@neChange").eq(5).should("contain", neChange[4]);
    cy.get("@neChange").eq(6).should("contain", neChange[5]);

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

    // North Dakota
    cy.get("@ndGen").eq(2).should("contain", ndGen[0]);
    cy.get("@ndGen").eq(3).should("contain", ndGen[1]);
    cy.get("@ndGen").eq(4).should("contain", ndGen[2]);
    cy.get("@ndGen").eq(5).should("contain", ndGen[3]);
    cy.get("@ndGen").eq(6).should("contain", ndGen[4]);
    cy.get("@ndGen").eq(7).should("contain", ndGen[5]);

    cy.get("@ndVehicles").eq(1).should("contain", ndVehicles[0]);
    cy.get("@ndVehicles").eq(2).should("contain", ndVehicles[1]);
    cy.get("@ndVehicles").eq(3).should("contain", ndVehicles[2]);
    cy.get("@ndVehicles").eq(4).should("contain", ndVehicles[3]);
    cy.get("@ndVehicles").eq(5).should("contain", ndVehicles[4]);
    cy.get("@ndVehicles").eq(6).should("contain", ndVehicles[5]);

    cy.get("@ndChange").eq(1).should("contain", ndChange[0]);
    cy.get("@ndChange").eq(2).should("contain", ndChange[1]);
    cy.get("@ndChange").eq(3).should("contain", ndChange[2]);
    cy.get("@ndChange").eq(4).should("contain", ndChange[3]);
    cy.get("@ndChange").eq(5).should("contain", ndChange[4]);
    cy.get("@ndChange").eq(6).should("contain", ndChange[5]);

    // Oklahoma
    cy.get("@okGen").eq(2).should("contain", okGen[0]);
    cy.get("@okGen").eq(3).should("contain", okGen[1]);
    cy.get("@okGen").eq(4).should("contain", okGen[2]);
    cy.get("@okGen").eq(5).should("contain", okGen[3]);
    cy.get("@okGen").eq(6).should("contain", okGen[4]);
    cy.get("@okGen").eq(7).should("contain", okGen[5]);

    cy.get("@okVehicles").eq(1).should("contain", okVehicles[0]);
    cy.get("@okVehicles").eq(2).should("contain", okVehicles[1]);
    cy.get("@okVehicles").eq(3).should("contain", okVehicles[2]);
    cy.get("@okVehicles").eq(4).should("contain", okVehicles[3]);
    cy.get("@okVehicles").eq(5).should("contain", okVehicles[4]);
    cy.get("@okVehicles").eq(6).should("contain", okVehicles[5]);

    cy.get("@okChange").eq(1).should("contain", okChange[0]);
    cy.get("@okChange").eq(2).should("contain", okChange[1]);
    cy.get("@okChange").eq(3).should("contain", okChange[2]);
    cy.get("@okChange").eq(4).should("contain", okChange[3]);
    cy.get("@okChange").eq(5).should("contain", okChange[4]);
    cy.get("@okChange").eq(6).should("contain", okChange[5]);

    // South Dakota
    cy.get("@sdGen").eq(2).should("contain", sdGen[0]);
    cy.get("@sdGen").eq(3).should("contain", sdGen[1]);
    cy.get("@sdGen").eq(4).should("contain", sdGen[2]);
    cy.get("@sdGen").eq(5).should("contain", sdGen[3]);
    cy.get("@sdGen").eq(6).should("contain", sdGen[4]);
    cy.get("@sdGen").eq(7).should("contain", sdGen[5]);

    cy.get("@sdVehicles").eq(1).should("contain", sdVehicles[0]);
    cy.get("@sdVehicles").eq(2).should("contain", sdVehicles[1]);
    cy.get("@sdVehicles").eq(3).should("contain", sdVehicles[2]);
    cy.get("@sdVehicles").eq(4).should("contain", sdVehicles[3]);
    cy.get("@sdVehicles").eq(5).should("contain", sdVehicles[4]);
    cy.get("@sdVehicles").eq(6).should("contain", sdVehicles[5]);

    cy.get("@sdChange").eq(1).should("contain", sdChange[0]);
    cy.get("@sdChange").eq(2).should("contain", sdChange[1]);
    cy.get("@sdChange").eq(3).should("contain", sdChange[2]);
    cy.get("@sdChange").eq(4).should("contain", sdChange[3]);
    cy.get("@sdChange").eq(5).should("contain", sdChange[4]);
    cy.get("@sdChange").eq(6).should("contain", sdChange[5]);

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
