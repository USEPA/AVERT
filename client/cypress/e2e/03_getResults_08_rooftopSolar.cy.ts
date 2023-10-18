describe('Get Results – rooftopSolar', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('Central');
    cy.findAllByText('Set Energy Impacts').filter('.avert-button').click();

    cy.findByText('Solar photovoltaic (PV)').as('toggleD');
    cy.get('@toggleD').click();

    cy.findByLabelText('Distributed (rooftop) solar PV total capacity:').as('rooftopSolar'); // prettier-ignore
    cy.get('@rooftopSolar').type('1000');

    cy.findByText('Calculate Energy Impacts').as('calculateBtn');
    cy.get('@calculateBtn').click();

    cy.findAllByText('Get Results').filter('.avert-button').as('resultsBtn');
    cy.get('@resultsBtn').click();

    cy.findByText('LOADING...', { timeout: 120000 }).should('not.exist');
  });

  it('Annual Emissions Changes (Power Sector Only) table displays the correct results', () => {
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

    cy.get('@geneartion').eq(1).should('contain', '148,434,150');
    cy.get('@geneartion').eq(2).should('contain', '146,530,580');
    cy.get('@geneartion').eq(3).should('contain', '-1,903,570');

    cy.get('@so2Totals').eq(1).should('contain', '243,978,960');
    cy.get('@so2Totals').eq(2).should('contain', '241,698,340');
    cy.get('@so2Totals').eq(3).should('contain', '-2,280,620');

    cy.get('@noxTotals').eq(1).should('contain', '180,393,010');
    cy.get('@noxTotals').eq(2).should('contain', '178,015,300');
    cy.get('@noxTotals').eq(3).should('contain', '-2,377,710');

    cy.get('@ozoneNoxTotals').eq(1).should('contain', '92,624,300');
    cy.get('@ozoneNoxTotals').eq(2).should('contain', '91,410,880');
    cy.get('@ozoneNoxTotals').eq(3).should('contain', '-1,213,420');

    cy.get('@co2Totals').eq(1).should('contain', '135,447,260');
    cy.get('@co2Totals').eq(2).should('contain', '133,857,850');
    cy.get('@co2Totals').eq(3).should('contain', '-1,589,410');

    cy.get('@pm25Totals').eq(1).should('contain', '11,015,570');
    cy.get('@pm25Totals').eq(2).should('contain', '10,878,650');
    cy.get('@pm25Totals').eq(3).should('contain', '-136,920');

    cy.get('@vocsTotals').eq(1).should('contain', '4,497,810');
    cy.get('@vocsTotals').eq(2).should('contain', '4,439,250');
    cy.get('@vocsTotals').eq(3).should('contain', '-58,560');

    cy.get('@nh3Totals').eq(1).should('contain', '3,885,850');
    cy.get('@nh3Totals').eq(2).should('contain', '3,828,330');
    cy.get('@nh3Totals').eq(3).should('contain', '-57,520');

    cy.get('@so2Rates').eq(1).should('contain', '1.644');
    cy.get('@so2Rates').eq(3).should('contain', '1.198');

    cy.get('@noxRates').eq(1).should('contain', '1.215');
    cy.get('@noxRates').eq(3).should('contain', '1.249');

    cy.get('@ozoneNoxRates').eq(1).should('contain', '1.207');
    cy.get('@ozoneNoxRates').eq(3).should('contain', '1.403');

    cy.get('@co2Rates').eq(1).should('contain', '0.913');
    cy.get('@co2Rates').eq(3).should('contain', '0.835');

    cy.get('@pm25Rates').eq(1).should('contain', '0.074');
    cy.get('@pm25Rates').eq(3).should('contain', '0.072');

    cy.get('@vocsRates').eq(1).should('contain', '0.030');
    cy.get('@vocsRates').eq(3).should('contain', '0.031');

    cy.get('@nh3Rates').eq(1).should('contain', '0.026');
    cy.get('@nh3Rates').eq(3).should('contain', '0.030');
  });

  it('Annual Emissions Changes By State table displays the correct results', () => {
    cy.findByLabelText('All states').click({ force: true });

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
    cy.get('@arGen').eq(2).should('contain', '-18,470');
    cy.get('@arGen').eq(3).should('contain', '-62,150');
    cy.get('@arGen').eq(4).should('contain', '-49,510');
    cy.get('@arGen').eq(5).should('contain', '-3,260');
    cy.get('@arGen').eq(6).should('contain', '-1,120');
    cy.get('@arGen').eq(7).should('contain', '-2,120');

    cy.get('@arVehicles').eq(1).should('contain', '0');
    cy.get('@arVehicles').eq(2).should('contain', '0');
    cy.get('@arVehicles').eq(3).should('contain', '0');
    cy.get('@arVehicles').eq(4).should('contain', '0');
    cy.get('@arVehicles').eq(5).should('contain', '0');
    cy.get('@arVehicles').eq(6).should('contain', '0');

    cy.get('@arChange').eq(1).should('contain', '-18,470');
    cy.get('@arChange').eq(2).should('contain', '-62,150');
    cy.get('@arChange').eq(3).should('contain', '-49,510');
    cy.get('@arChange').eq(4).should('contain', '-3,260');
    cy.get('@arChange').eq(5).should('contain', '-1,120');
    cy.get('@arChange').eq(6).should('contain', '-2,120');

    // Iowa
    cy.get('@iaGen').eq(2).should('contain', '0');
    cy.get('@iaGen').eq(3).should('contain', '-620');
    cy.get('@iaGen').eq(4).should('contain', '-550');
    cy.get('@iaGen').eq(5).should('contain', '-200');
    cy.get('@iaGen').eq(6).should('contain', '-40');
    cy.get('@iaGen').eq(7).should('contain', '-40');

    cy.get('@iaVehicles').eq(1).should('contain', '0');
    cy.get('@iaVehicles').eq(2).should('contain', '0');
    cy.get('@iaVehicles').eq(3).should('contain', '0');
    cy.get('@iaVehicles').eq(4).should('contain', '0');
    cy.get('@iaVehicles').eq(5).should('contain', '0');
    cy.get('@iaVehicles').eq(6).should('contain', '0');

    cy.get('@iaChange').eq(1).should('contain', '0');
    cy.get('@iaChange').eq(2).should('contain', '-620');
    cy.get('@iaChange').eq(3).should('contain', '-550');
    cy.get('@iaChange').eq(4).should('contain', '-200');
    cy.get('@iaChange').eq(5).should('contain', '-40');
    cy.get('@iaChange').eq(6).should('contain', '-40');

    // Kansas
    cy.get('@ksGen').eq(2).should('contain', '-111,510');
    cy.get('@ksGen').eq(3).should('contain', '-404,460');
    cy.get('@ksGen').eq(4).should('contain', '-324,970');
    cy.get('@ksGen').eq(5).should('contain', '-32,680');
    cy.get('@ksGen').eq(6).should('contain', '-11,810');
    cy.get('@ksGen').eq(7).should('contain', '-7,140');

    cy.get('@ksVehicles').eq(1).should('contain', '0');
    cy.get('@ksVehicles').eq(2).should('contain', '0');
    cy.get('@ksVehicles').eq(3).should('contain', '0');
    cy.get('@ksVehicles').eq(4).should('contain', '0');
    cy.get('@ksVehicles').eq(5).should('contain', '0');
    cy.get('@ksVehicles').eq(6).should('contain', '0');

    cy.get('@ksChange').eq(1).should('contain', '-111,510');
    cy.get('@ksChange').eq(2).should('contain', '-404,460');
    cy.get('@ksChange').eq(3).should('contain', '-324,970');
    cy.get('@ksChange').eq(4).should('contain', '-32,680');
    cy.get('@ksChange').eq(5).should('contain', '-11,810');
    cy.get('@ksChange').eq(6).should('contain', '-7,140');

    // Louisiana
    cy.get('@laGen').eq(2).should('contain', '-100');
    cy.get('@laGen').eq(3).should('contain', '-12,550');
    cy.get('@laGen').eq(4).should('contain', '-14,030');
    cy.get('@laGen').eq(5).should('contain', '-1,590');
    cy.get('@laGen').eq(6).should('contain', '-1,370');
    cy.get('@laGen').eq(7).should('contain', '-860');

    cy.get('@laVehicles').eq(1).should('contain', '0');
    cy.get('@laVehicles').eq(2).should('contain', '0');
    cy.get('@laVehicles').eq(3).should('contain', '0');
    cy.get('@laVehicles').eq(4).should('contain', '0');
    cy.get('@laVehicles').eq(5).should('contain', '0');
    cy.get('@laVehicles').eq(6).should('contain', '0');

    cy.get('@laChange').eq(1).should('contain', '-100');
    cy.get('@laChange').eq(2).should('contain', '-12,550');
    cy.get('@laChange').eq(3).should('contain', '-14,030');
    cy.get('@laChange').eq(4).should('contain', '-1,590');
    cy.get('@laChange').eq(5).should('contain', '-1,370');
    cy.get('@laChange').eq(6).should('contain', '-860');

    // Missouri
    cy.get('@moGen').eq(2).should('contain', '-129,830');
    cy.get('@moGen').eq(3).should('contain', '-194,420');
    cy.get('@moGen').eq(4).should('contain', '-197,620');
    cy.get('@moGen').eq(5).should('contain', '-15,150');
    cy.get('@moGen').eq(6).should('contain', '-3,900');
    cy.get('@moGen').eq(7).should('contain', '-7,000');

    cy.get('@moVehicles').eq(1).should('contain', '0');
    cy.get('@moVehicles').eq(2).should('contain', '0');
    cy.get('@moVehicles').eq(3).should('contain', '0');
    cy.get('@moVehicles').eq(4).should('contain', '0');
    cy.get('@moVehicles').eq(5).should('contain', '0');
    cy.get('@moVehicles').eq(6).should('contain', '0');

    cy.get('@moChange').eq(1).should('contain', '-129,830');
    cy.get('@moChange').eq(2).should('contain', '-194,420');
    cy.get('@moChange').eq(3).should('contain', '-197,620');
    cy.get('@moChange').eq(4).should('contain', '-15,150');
    cy.get('@moChange').eq(5).should('contain', '-3,900');
    cy.get('@moChange').eq(6).should('contain', '-7,000');

    // Montana
    cy.get('@mtGen').eq(2).should('contain', '0');
    cy.get('@mtGen').eq(3).should('contain', '-750');
    cy.get('@mtGen').eq(4).should('contain', '-530');
    cy.get('@mtGen').eq(5).should('contain', '-130');
    cy.get('@mtGen').eq(6).should('contain', '-30');
    cy.get('@mtGen').eq(7).should('contain', '-60');

    cy.get('@mtVehicles').eq(1).should('contain', '0');
    cy.get('@mtVehicles').eq(2).should('contain', '0');
    cy.get('@mtVehicles').eq(3).should('contain', '0');
    cy.get('@mtVehicles').eq(4).should('contain', '0');
    cy.get('@mtVehicles').eq(5).should('contain', '0');
    cy.get('@mtVehicles').eq(6).should('contain', '0');

    cy.get('@mtChange').eq(1).should('contain', '0');
    cy.get('@mtChange').eq(2).should('contain', '-750');
    cy.get('@mtChange').eq(3).should('contain', '-530');
    cy.get('@mtChange').eq(4).should('contain', '-130');
    cy.get('@mtChange').eq(5).should('contain', '-30');
    cy.get('@mtChange').eq(6).should('contain', '-60');

    // Nebraska
    cy.get('@neGen').eq(2).should('contain', '-794,540');
    cy.get('@neGen').eq(3).should('contain', '-411,540');
    cy.get('@neGen').eq(4).should('contain', '-225,550');
    cy.get('@neGen').eq(5).should('contain', '-11,450');
    cy.get('@neGen').eq(6).should('contain', '-7,620');
    cy.get('@neGen').eq(7).should('contain', '-10,170');

    cy.get('@neVehicles').eq(1).should('contain', '0');
    cy.get('@neVehicles').eq(2).should('contain', '0');
    cy.get('@neVehicles').eq(3).should('contain', '0');
    cy.get('@neVehicles').eq(4).should('contain', '0');
    cy.get('@neVehicles').eq(5).should('contain', '0');
    cy.get('@neVehicles').eq(6).should('contain', '0');

    cy.get('@neChange').eq(1).should('contain', '-794,540');
    cy.get('@neChange').eq(2).should('contain', '-411,540');
    cy.get('@neChange').eq(3).should('contain', '-225,550');
    cy.get('@neChange').eq(4).should('contain', '-11,450');
    cy.get('@neChange').eq(5).should('contain', '-7,620');
    cy.get('@neChange').eq(6).should('contain', '-10,170');

    // New Mexico
    cy.get('@nmGen').eq(2).should('contain', '-230');
    cy.get('@nmGen').eq(3).should('contain', '-19,630');
    cy.get('@nmGen').eq(4).should('contain', '-20,990');
    cy.get('@nmGen').eq(5).should('contain', '-1,850');
    cy.get('@nmGen').eq(6).should('contain', '-900');
    cy.get('@nmGen').eq(7).should('contain', '-1,350');

    cy.get('@nmVehicles').eq(1).should('contain', '0');
    cy.get('@nmVehicles').eq(2).should('contain', '0');
    cy.get('@nmVehicles').eq(3).should('contain', '0');
    cy.get('@nmVehicles').eq(4).should('contain', '0');
    cy.get('@nmVehicles').eq(5).should('contain', '0');
    cy.get('@nmVehicles').eq(6).should('contain', '0');

    cy.get('@nmChange').eq(1).should('contain', '-230');
    cy.get('@nmChange').eq(2).should('contain', '-19,630');
    cy.get('@nmChange').eq(3).should('contain', '-20,990');
    cy.get('@nmChange').eq(4).should('contain', '-1,850');
    cy.get('@nmChange').eq(5).should('contain', '-900');
    cy.get('@nmChange').eq(6).should('contain', '-1,350');

    // North Dakota
    cy.get('@ndGen').eq(2).should('contain', '-119,730');
    cy.get('@ndGen').eq(3).should('contain', '-105,480');
    cy.get('@ndGen').eq(4).should('contain', '-70,320');
    cy.get('@ndGen').eq(5).should('contain', '-8,850');
    cy.get('@ndGen').eq(6).should('contain', '-2,860');
    cy.get('@ndGen').eq(7).should('contain', '-2,280');

    cy.get('@ndVehicles').eq(1).should('contain', '0');
    cy.get('@ndVehicles').eq(2).should('contain', '0');
    cy.get('@ndVehicles').eq(3).should('contain', '0');
    cy.get('@ndVehicles').eq(4).should('contain', '0');
    cy.get('@ndVehicles').eq(5).should('contain', '0');
    cy.get('@ndVehicles').eq(6).should('contain', '0');

    cy.get('@ndChange').eq(1).should('contain', '-119,730');
    cy.get('@ndChange').eq(2).should('contain', '-105,480');
    cy.get('@ndChange').eq(3).should('contain', '-70,320');
    cy.get('@ndChange').eq(4).should('contain', '-8,850');
    cy.get('@ndChange').eq(5).should('contain', '-2,860');
    cy.get('@ndChange').eq(6).should('contain', '-2,280');

    // Oklahoma
    cy.get('@okGen').eq(2).should('contain', '-285,210');
    cy.get('@okGen').eq(3).should('contain', '-697,720');
    cy.get('@okGen').eq(4).should('contain', '-382,230');
    cy.get('@okGen').eq(5).should('contain', '-43,110');
    cy.get('@okGen').eq(6).should('contain', '-17,140');
    cy.get('@okGen').eq(7).should('contain', '-15,930');

    cy.get('@okVehicles').eq(1).should('contain', '0');
    cy.get('@okVehicles').eq(2).should('contain', '0');
    cy.get('@okVehicles').eq(3).should('contain', '0');
    cy.get('@okVehicles').eq(4).should('contain', '0');
    cy.get('@okVehicles').eq(5).should('contain', '0');
    cy.get('@okVehicles').eq(6).should('contain', '0');

    cy.get('@okChange').eq(1).should('contain', '-285,210');
    cy.get('@okChange').eq(2).should('contain', '-697,720');
    cy.get('@okChange').eq(3).should('contain', '-382,230');
    cy.get('@okChange').eq(4).should('contain', '-43,110');
    cy.get('@okChange').eq(5).should('contain', '-17,140');
    cy.get('@okChange').eq(6).should('contain', '-15,930');

    // South Dakota
    cy.get('@sdGen').eq(2).should('contain', '-70');
    cy.get('@sdGen').eq(3).should('contain', '-11,900');
    cy.get('@sdGen').eq(4).should('contain', '-10,880');
    cy.get('@sdGen').eq(5).should('contain', '-610');
    cy.get('@sdGen').eq(6).should('contain', '-430');
    cy.get('@sdGen').eq(7).should('contain', '-860');

    cy.get('@sdVehicles').eq(1).should('contain', '0');
    cy.get('@sdVehicles').eq(2).should('contain', '0');
    cy.get('@sdVehicles').eq(3).should('contain', '0');
    cy.get('@sdVehicles').eq(4).should('contain', '0');
    cy.get('@sdVehicles').eq(5).should('contain', '0');
    cy.get('@sdVehicles').eq(6).should('contain', '0');

    cy.get('@sdChange').eq(1).should('contain', '-70');
    cy.get('@sdChange').eq(2).should('contain', '-11,900');
    cy.get('@sdChange').eq(3).should('contain', '-10,880');
    cy.get('@sdChange').eq(4).should('contain', '-610');
    cy.get('@sdChange').eq(5).should('contain', '-430');
    cy.get('@sdChange').eq(6).should('contain', '-860');

    // Texas
    cy.get('@txGen').eq(2).should('contain', '-820,930');
    cy.get('@txGen').eq(3).should('contain', '-456,490');
    cy.get('@txGen').eq(4).should('contain', '-292,230');
    cy.get('@txGen').eq(5).should('contain', '-18,030');
    cy.get('@txGen').eq(6).should('contain', '-11,340');
    cy.get('@txGen').eq(7).should('contain', '-9,700');

    cy.get('@txVehicles').eq(1).should('contain', '0');
    cy.get('@txVehicles').eq(2).should('contain', '0');
    cy.get('@txVehicles').eq(3).should('contain', '0');
    cy.get('@txVehicles').eq(4).should('contain', '0');
    cy.get('@txVehicles').eq(5).should('contain', '0');
    cy.get('@txVehicles').eq(6).should('contain', '0');

    cy.get('@txChange').eq(1).should('contain', '-820,930');
    cy.get('@txChange').eq(2).should('contain', '-456,490');
    cy.get('@txChange').eq(3).should('contain', '-292,230');
    cy.get('@txChange').eq(4).should('contain', '-18,030');
    cy.get('@txChange').eq(5).should('contain', '-11,340');
    cy.get('@txChange').eq(6).should('contain', '-9,700');
  });
});
