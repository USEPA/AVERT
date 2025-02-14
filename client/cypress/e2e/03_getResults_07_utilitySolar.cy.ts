describe("Get Results – utilitySolar", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("Central");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Solar photovoltaic (PV)").as("toggleD");
    cy.get("@toggleD").click();

    cy.findByLabelText('Utility-scale solar PV total capacity:').as('utilitySolar'); // prettier-ignore
    cy.get("@utilitySolar").type("1000");

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

    cy.get("@geneartion").eq(1).should("contain", "148,434,150");
    cy.get("@geneartion").eq(2).should("contain", "146,180,740");
    cy.get("@geneartion").eq(3).should("contain", "-2,253,420");

    cy.get("@so2Totals").eq(1).should("contain", "243,978,960");
    cy.get("@so2Totals").eq(2).should("contain", "241,276,420");
    cy.get("@so2Totals").eq(3).should("contain", "-2,702,540");

    cy.get("@noxTotals").eq(1).should("contain", "180,393,010");
    cy.get("@noxTotals").eq(2).should("contain", "177,583,790");
    cy.get("@noxTotals").eq(3).should("contain", "-2,809,220");

    cy.get("@ozoneNoxTotals").eq(1).should("contain", "92,624,300");
    cy.get("@ozoneNoxTotals").eq(2).should("contain", "91,131,560");
    cy.get("@ozoneNoxTotals").eq(3).should("contain", "-1,492,740");

    cy.get("@co2Totals").eq(1).should("contain", "135,447,260");
    cy.get("@co2Totals").eq(2).should("contain", "133,566,050");
    cy.get("@co2Totals").eq(3).should("contain", "-1,881,210");

    cy.get("@pm25Totals").eq(1).should("contain", "11,015,570");
    cy.get("@pm25Totals").eq(2).should("contain", "10,853,540");
    cy.get("@pm25Totals").eq(3).should("contain", "-162,030");

    cy.get("@vocsTotals").eq(1).should("contain", "4,497,810");
    cy.get("@vocsTotals").eq(2).should("contain", "4,428,510");
    cy.get("@vocsTotals").eq(3).should("contain", "-69,300");

    cy.get("@nh3Totals").eq(1).should("contain", "3,885,850");
    cy.get("@nh3Totals").eq(2).should("contain", "3,817,910");
    cy.get("@nh3Totals").eq(3).should("contain", "-67,940");

    cy.get("@so2Rates").eq(1).should("contain", "1.644");
    cy.get("@so2Rates").eq(3).should("contain", "1.199");

    cy.get("@noxRates").eq(1).should("contain", "1.215");
    cy.get("@noxRates").eq(3).should("contain", "1.247");

    cy.get("@ozoneNoxRates").eq(1).should("contain", "1.207");
    cy.get("@ozoneNoxRates").eq(3).should("contain", "1.389");

    cy.get("@co2Rates").eq(1).should("contain", "0.913");
    cy.get("@co2Rates").eq(3).should("contain", "0.835");

    cy.get("@pm25Rates").eq(1).should("contain", "0.074");
    cy.get("@pm25Rates").eq(3).should("contain", "0.072");

    cy.get("@vocsRates").eq(1).should("contain", "0.030");
    cy.get("@vocsRates").eq(3).should("contain", "0.031");

    cy.get("@nh3Rates").eq(1).should("contain", "0.026");
    cy.get("@nh3Rates").eq(3).should("contain", "0.030");
  });

  it("Annual Emissions Changes By State table displays the correct results", () => {
    cy.findByLabelText("All states").click({ force: true });

    /* prettier-ignore */
    cy.findAllByText('Arkansas').filter('th')
      .parent().children().as('arGen')
      .parent().next().children().as('arVehicles')
      .parent().next().children().as('arChange')
      .parent().next().children().as('iaGen')
      .parent().next().children().as('iaVehicles')
      .parent().next().children().as('iaChange')
      .parent().next().children().as('ksGen')
      .parent().next().children().as('ksVehicles')
      .parent().next().children().as('ksChange')
      .parent().next().children().as('laGen')
      .parent().next().children().as('laVehicles')
      .parent().next().children().as('laChange')
      .parent().next().children().as('moGen')
      .parent().next().children().as('moVehicles')
      .parent().next().children().as('moChange')
      .parent().next().children().as('mtGen')
      .parent().next().children().as('mtVehicles')
      .parent().next().children().as('mtChange')
      .parent().next().children().as('neGen')
      .parent().next().children().as('neVehicles')
      .parent().next().children().as('neChange')
      .parent().next().children().as('nmGen')
      .parent().next().children().as('nmVehicles')
      .parent().next().children().as('nmChange')
      .parent().next().children().as('ndGen')
      .parent().next().children().as('ndVehicles')
      .parent().next().children().as('ndChange')
      .parent().next().children().as('okGen')
      .parent().next().children().as('okVehicles')
      .parent().next().children().as('okChange')
      .parent().next().children().as('sdGen')
      .parent().next().children().as('sdVehicles')
      .parent().next().children().as('sdChange')
      .parent().next().children().as('txGen')
      .parent().next().children().as('txVehicles')
      .parent().next().children().as('txChange');

    // Arkansas
    cy.get("@arGen").eq(2).should("contain", "-21,770");
    cy.get("@arGen").eq(3).should("contain", "-73,470");
    cy.get("@arGen").eq(4).should("contain", "-59,160");
    cy.get("@arGen").eq(5).should("contain", "-3,910");
    cy.get("@arGen").eq(6).should("contain", "-1,320");
    cy.get("@arGen").eq(7).should("contain", "-2,530");

    cy.get("@arVehicles").eq(1).should("contain", "0");
    cy.get("@arVehicles").eq(2).should("contain", "0");
    cy.get("@arVehicles").eq(3).should("contain", "0");
    cy.get("@arVehicles").eq(4).should("contain", "0");
    cy.get("@arVehicles").eq(5).should("contain", "0");
    cy.get("@arVehicles").eq(6).should("contain", "0");

    cy.get("@arChange").eq(1).should("contain", "-21,770");
    cy.get("@arChange").eq(2).should("contain", "-73,470");
    cy.get("@arChange").eq(3).should("contain", "-59,160");
    cy.get("@arChange").eq(4).should("contain", "-3,910");
    cy.get("@arChange").eq(5).should("contain", "-1,320");
    cy.get("@arChange").eq(6).should("contain", "-2,530");

    // Iowa
    cy.get("@iaGen").eq(2).should("contain", "0");
    cy.get("@iaGen").eq(3).should("contain", "-710");
    cy.get("@iaGen").eq(4).should("contain", "-640");
    cy.get("@iaGen").eq(5).should("contain", "-230");
    cy.get("@iaGen").eq(6).should("contain", "-40");
    cy.get("@iaGen").eq(7).should("contain", "-50");

    cy.get("@iaVehicles").eq(1).should("contain", "0");
    cy.get("@iaVehicles").eq(2).should("contain", "0");
    cy.get("@iaVehicles").eq(3).should("contain", "0");
    cy.get("@iaVehicles").eq(4).should("contain", "0");
    cy.get("@iaVehicles").eq(5).should("contain", "0");
    cy.get("@iaVehicles").eq(6).should("contain", "0");

    cy.get("@iaChange").eq(1).should("contain", "0");
    cy.get("@iaChange").eq(2).should("contain", "-710");
    cy.get("@iaChange").eq(3).should("contain", "-640");
    cy.get("@iaChange").eq(4).should("contain", "-230");
    cy.get("@iaChange").eq(5).should("contain", "-40");
    cy.get("@iaChange").eq(6).should("contain", "-50");

    // Kansas
    cy.get("@ksGen").eq(2).should("contain", "-129,810");
    cy.get("@ksGen").eq(3).should("contain", "-472,980");
    cy.get("@ksGen").eq(4).should("contain", "-383,290");
    cy.get("@ksGen").eq(5).should("contain", "-38,510");
    cy.get("@ksGen").eq(6).should("contain", "-13,920");
    cy.get("@ksGen").eq(7).should("contain", "-8,370");

    cy.get("@ksVehicles").eq(1).should("contain", "0");
    cy.get("@ksVehicles").eq(2).should("contain", "0");
    cy.get("@ksVehicles").eq(3).should("contain", "0");
    cy.get("@ksVehicles").eq(4).should("contain", "0");
    cy.get("@ksVehicles").eq(5).should("contain", "0");
    cy.get("@ksVehicles").eq(6).should("contain", "0");

    cy.get("@ksChange").eq(1).should("contain", "-129,810");
    cy.get("@ksChange").eq(2).should("contain", "-472,980");
    cy.get("@ksChange").eq(3).should("contain", "-383,290");
    cy.get("@ksChange").eq(4).should("contain", "-38,510");
    cy.get("@ksChange").eq(5).should("contain", "-13,920");
    cy.get("@ksChange").eq(6).should("contain", "-8,370");

    // Louisiana
    cy.get("@laGen").eq(2).should("contain", "-120");
    cy.get("@laGen").eq(3).should("contain", "-14,920");
    cy.get("@laGen").eq(4).should("contain", "-16,480");
    cy.get("@laGen").eq(5).should("contain", "-1,870");
    cy.get("@laGen").eq(6).should("contain", "-1,630");
    cy.get("@laGen").eq(7).should("contain", "-1,010");

    cy.get("@laVehicles").eq(1).should("contain", "0");
    cy.get("@laVehicles").eq(2).should("contain", "0");
    cy.get("@laVehicles").eq(3).should("contain", "0");
    cy.get("@laVehicles").eq(4).should("contain", "0");
    cy.get("@laVehicles").eq(5).should("contain", "0");
    cy.get("@laVehicles").eq(6).should("contain", "0");

    cy.get("@laChange").eq(1).should("contain", "-120");
    cy.get("@laChange").eq(2).should("contain", "-14,920");
    cy.get("@laChange").eq(3).should("contain", "-16,480");
    cy.get("@laChange").eq(4).should("contain", "-1,870");
    cy.get("@laChange").eq(5).should("contain", "-1,630");
    cy.get("@laChange").eq(6).should("contain", "-1,010");

    // Missouri
    cy.get("@moGen").eq(2).should("contain", "-153,530");
    cy.get("@moGen").eq(3).should("contain", "-229,530");
    cy.get("@moGen").eq(4).should("contain", "-233,830");
    cy.get("@moGen").eq(5).should("contain", "-17,920");
    cy.get("@moGen").eq(6).should("contain", "-4,620");
    cy.get("@moGen").eq(7).should("contain", "-8,290");

    cy.get("@moVehicles").eq(1).should("contain", "0");
    cy.get("@moVehicles").eq(2).should("contain", "0");
    cy.get("@moVehicles").eq(3).should("contain", "0");
    cy.get("@moVehicles").eq(4).should("contain", "0");
    cy.get("@moVehicles").eq(5).should("contain", "0");
    cy.get("@moVehicles").eq(6).should("contain", "0");

    cy.get("@moChange").eq(1).should("contain", "-153,530");
    cy.get("@moChange").eq(2).should("contain", "-229,530");
    cy.get("@moChange").eq(3).should("contain", "-233,830");
    cy.get("@moChange").eq(4).should("contain", "-17,920");
    cy.get("@moChange").eq(5).should("contain", "-4,620");
    cy.get("@moChange").eq(6).should("contain", "-8,290");

    // Montana
    cy.get("@mtGen").eq(2).should("contain", "0");
    cy.get("@mtGen").eq(3).should("contain", "-860");
    cy.get("@mtGen").eq(4).should("contain", "-600");
    cy.get("@mtGen").eq(5).should("contain", "-150");
    cy.get("@mtGen").eq(6).should("contain", "-30");
    cy.get("@mtGen").eq(7).should("contain", "-70");

    cy.get("@mtVehicles").eq(1).should("contain", "0");
    cy.get("@mtVehicles").eq(2).should("contain", "0");
    cy.get("@mtVehicles").eq(3).should("contain", "0");
    cy.get("@mtVehicles").eq(4).should("contain", "0");
    cy.get("@mtVehicles").eq(5).should("contain", "0");
    cy.get("@mtVehicles").eq(6).should("contain", "0");

    cy.get("@mtChange").eq(1).should("contain", "0");
    cy.get("@mtChange").eq(2).should("contain", "-860");
    cy.get("@mtChange").eq(3).should("contain", "-600");
    cy.get("@mtChange").eq(4).should("contain", "-150");
    cy.get("@mtChange").eq(5).should("contain", "-30");
    cy.get("@mtChange").eq(6).should("contain", "-70");

    // Nebraska
    cy.get("@neGen").eq(2).should("contain", "-942,560");
    cy.get("@neGen").eq(3).should("contain", "-487,750");
    cy.get("@neGen").eq(4).should("contain", "-267,370");
    cy.get("@neGen").eq(5).should("contain", "-13,570");
    cy.get("@neGen").eq(6).should("contain", "-9,040");
    cy.get("@neGen").eq(7).should("contain", "-11,990");

    cy.get("@neVehicles").eq(1).should("contain", "0");
    cy.get("@neVehicles").eq(2).should("contain", "0");
    cy.get("@neVehicles").eq(3).should("contain", "0");
    cy.get("@neVehicles").eq(4).should("contain", "0");
    cy.get("@neVehicles").eq(5).should("contain", "0");
    cy.get("@neVehicles").eq(6).should("contain", "0");

    cy.get("@neChange").eq(1).should("contain", "-942,560");
    cy.get("@neChange").eq(2).should("contain", "-487,750");
    cy.get("@neChange").eq(3).should("contain", "-267,370");
    cy.get("@neChange").eq(4).should("contain", "-13,570");
    cy.get("@neChange").eq(5).should("contain", "-9,040");
    cy.get("@neChange").eq(6).should("contain", "-11,990");

    // New Mexico
    cy.get("@nmGen").eq(2).should("contain", "-270");
    cy.get("@nmGen").eq(3).should("contain", "-22,760");
    cy.get("@nmGen").eq(4).should("contain", "-24,700");
    cy.get("@nmGen").eq(5).should("contain", "-2,170");
    cy.get("@nmGen").eq(6).should("contain", "-1,060");
    cy.get("@nmGen").eq(7).should("contain", "-1,570");

    cy.get("@nmVehicles").eq(1).should("contain", "0");
    cy.get("@nmVehicles").eq(2).should("contain", "0");
    cy.get("@nmVehicles").eq(3).should("contain", "0");
    cy.get("@nmVehicles").eq(4).should("contain", "0");
    cy.get("@nmVehicles").eq(5).should("contain", "0");
    cy.get("@nmVehicles").eq(6).should("contain", "0");

    cy.get("@nmChange").eq(1).should("contain", "-270");
    cy.get("@nmChange").eq(2).should("contain", "-22,760");
    cy.get("@nmChange").eq(3).should("contain", "-24,700");
    cy.get("@nmChange").eq(4).should("contain", "-2,170");
    cy.get("@nmChange").eq(5).should("contain", "-1,060");
    cy.get("@nmChange").eq(6).should("contain", "-1,570");

    // North Dakota
    cy.get("@ndGen").eq(2).should("contain", "-142,080");
    cy.get("@ndGen").eq(3).should("contain", "-126,510");
    cy.get("@ndGen").eq(4).should("contain", "-83,850");
    cy.get("@ndGen").eq(5).should("contain", "-10,580");
    cy.get("@ndGen").eq(6).should("contain", "-3,410");
    cy.get("@ndGen").eq(7).should("contain", "-2,710");

    cy.get("@ndVehicles").eq(1).should("contain", "0");
    cy.get("@ndVehicles").eq(2).should("contain", "0");
    cy.get("@ndVehicles").eq(3).should("contain", "0");
    cy.get("@ndVehicles").eq(4).should("contain", "0");
    cy.get("@ndVehicles").eq(5).should("contain", "0");
    cy.get("@ndVehicles").eq(6).should("contain", "0");

    cy.get("@ndChange").eq(1).should("contain", "-142,080");
    cy.get("@ndChange").eq(2).should("contain", "-126,510");
    cy.get("@ndChange").eq(3).should("contain", "-83,850");
    cy.get("@ndChange").eq(4).should("contain", "-10,580");
    cy.get("@ndChange").eq(5).should("contain", "-3,410");
    cy.get("@ndChange").eq(6).should("contain", "-2,710");

    // Oklahoma
    cy.get("@okGen").eq(2).should("contain", "-334,730");
    cy.get("@okGen").eq(3).should("contain", "-825,090");
    cy.get("@okGen").eq(4).should("contain", "-452,640");
    cy.get("@okGen").eq(5).should("contain", "-51,120");
    cy.get("@okGen").eq(6).should("contain", "-20,330");
    cy.get("@okGen").eq(7).should("contain", "-18,880");

    cy.get("@okVehicles").eq(1).should("contain", "0");
    cy.get("@okVehicles").eq(2).should("contain", "0");
    cy.get("@okVehicles").eq(3).should("contain", "0");
    cy.get("@okVehicles").eq(4).should("contain", "0");
    cy.get("@okVehicles").eq(5).should("contain", "0");
    cy.get("@okVehicles").eq(6).should("contain", "0");

    cy.get("@okChange").eq(1).should("contain", "-334,730");
    cy.get("@okChange").eq(2).should("contain", "-825,090");
    cy.get("@okChange").eq(3).should("contain", "-452,640");
    cy.get("@okChange").eq(4).should("contain", "-51,120");
    cy.get("@okChange").eq(5).should("contain", "-20,330");
    cy.get("@okChange").eq(6).should("contain", "-18,880");

    // South Dakota
    cy.get("@sdGen").eq(2).should("contain", "-90");
    cy.get("@sdGen").eq(3).should("contain", "-13,940");
    cy.get("@sdGen").eq(4).should("contain", "-12,840");
    cy.get("@sdGen").eq(5).should("contain", "-720");
    cy.get("@sdGen").eq(6).should("contain", "-500");
    cy.get("@sdGen").eq(7).should("contain", "-1,010");

    cy.get("@sdVehicles").eq(1).should("contain", "0");
    cy.get("@sdVehicles").eq(2).should("contain", "0");
    cy.get("@sdVehicles").eq(3).should("contain", "0");
    cy.get("@sdVehicles").eq(4).should("contain", "0");
    cy.get("@sdVehicles").eq(5).should("contain", "0");
    cy.get("@sdVehicles").eq(6).should("contain", "0");

    cy.get("@sdChange").eq(1).should("contain", "-90");
    cy.get("@sdChange").eq(2).should("contain", "-13,940");
    cy.get("@sdChange").eq(3).should("contain", "-12,840");
    cy.get("@sdChange").eq(4).should("contain", "-720");
    cy.get("@sdChange").eq(5).should("contain", "-500");
    cy.get("@sdChange").eq(6).should("contain", "-1,010");

    // Texas
    cy.get("@txGen").eq(2).should("contain", "-977,590");
    cy.get("@txGen").eq(3).should("contain", "-540,690");
    cy.get("@txGen").eq(4).should("contain", "-345,830");
    cy.get("@txGen").eq(5).should("contain", "-21,280");
    cy.get("@txGen").eq(6).should("contain", "-13,390");
    cy.get("@txGen").eq(7).should("contain", "-11,450");

    cy.get("@txVehicles").eq(1).should("contain", "0");
    cy.get("@txVehicles").eq(2).should("contain", "0");
    cy.get("@txVehicles").eq(3).should("contain", "0");
    cy.get("@txVehicles").eq(4).should("contain", "0");
    cy.get("@txVehicles").eq(5).should("contain", "0");
    cy.get("@txVehicles").eq(6).should("contain", "0");

    cy.get("@txChange").eq(1).should("contain", "-977,590");
    cy.get("@txChange").eq(2).should("contain", "-540,690");
    cy.get("@txChange").eq(3).should("contain", "-345,830");
    cy.get("@txChange").eq(4).should("contain", "-21,280");
    cy.get("@txChange").eq(5).should("contain", "-13,390");
    cy.get("@txChange").eq(6).should("contain", "-11,450");
  });
});
