describe('Get Results – reduction & topHours', () => {
  beforeEach(() => {
    cy.visit('/');

    cy.findAllByText('Select Region')
      .filter('option')
      .parent()
      .select('New England');
    cy.findAllByText('Set Energy Impacts').filter('.avert-button').click();

    cy.findByText('Percentage reductions in some or all hours').as('toggleB');
    cy.get('@toggleB').click();

    cy.findByLabelText('Targeted program:', { exact: false }).as('reduction');
    cy.get('@reduction').type('15');

    cy.findByText('% of hours').prev().as('topHours');
    cy.get('@topHours').type('50');

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

    cy.get('@geneartion').eq(1).should('contain', '49,806,940');
    cy.get('@geneartion').eq(2).should('contain', '44,666,120');
    cy.get('@geneartion').eq(3).should('contain', '-5,140,820');

    cy.get('@so2Totals').eq(1).should('contain', '4,272,680');
    cy.get('@so2Totals').eq(2).should('contain', '2,935,280');
    cy.get('@so2Totals').eq(3).should('contain', '-1,337,400');

    cy.get('@noxTotals').eq(1).should('contain', '8,742,410');
    cy.get('@noxTotals').eq(2).should('contain', '7,241,490');
    cy.get('@noxTotals').eq(3).should('contain', '-1,500,920');

    cy.get('@ozoneNoxTotals').eq(1).should('contain', '4,520,620');
    cy.get('@ozoneNoxTotals').eq(2).should('contain', '3,641,060');
    cy.get('@ozoneNoxTotals').eq(3).should('contain', '-879,560');

    cy.get('@co2Totals').eq(1).should('contain', '25,898,760');
    cy.get('@co2Totals').eq(2).should('contain', '23,146,460');
    cy.get('@co2Totals').eq(3).should('contain', '-2,752,300');

    cy.get('@pm25Totals').eq(1).should('contain', '1,748,910');
    cy.get('@pm25Totals').eq(2).should('contain', '1,525,350');
    cy.get('@pm25Totals').eq(3).should('contain', '-223,560');

    cy.get('@vocsTotals').eq(1).should('contain', '839,210');
    cy.get('@vocsTotals').eq(2).should('contain', '726,770');
    cy.get('@vocsTotals').eq(3).should('contain', '-112,440');

    cy.get('@nh3Totals').eq(1).should('contain', '1,511,02');
    cy.get('@nh3Totals').eq(2).should('contain', '1,349,84');
    cy.get('@nh3Totals').eq(3).should('contain', '-161,180');

    cy.get('@so2Rates').eq(1).should('contain', '0.086');
    cy.get('@so2Rates').eq(3).should('contain', '0.260');

    cy.get('@noxRates').eq(1).should('contain', '0.176');
    cy.get('@noxRates').eq(3).should('contain', '0.292');

    cy.get('@ozoneNoxRates').eq(1).should('contain', '0.185');
    cy.get('@ozoneNoxRates').eq(3).should('contain', '0.283');

    cy.get('@co2Rates').eq(1).should('contain', '0.520');
    cy.get('@co2Rates').eq(3).should('contain', '0.535');

    cy.get('@pm25Rates').eq(1).should('contain', '0.035');
    cy.get('@pm25Rates').eq(3).should('contain', '0.043');

    cy.get('@vocsRates').eq(1).should('contain', '0.017');
    cy.get('@vocsRates').eq(3).should('contain', '0.022');

    cy.get('@nh3Rates').eq(1).should('contain', '0.030');
    cy.get('@nh3Rates').eq(3).should('contain', '0.031');
  });

  it('Annual Emissions Changes By State table displays the correct results', () => {
    cy.findByLabelText('All states').click({ force: true });

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
    cy.get('@ctGen').eq(2).should('contain', '-301,610');
    cy.get('@ctGen').eq(3).should('contain', '-329,660');
    cy.get('@ctGen').eq(4).should('contain', '-506,950');
    cy.get('@ctGen').eq(5).should('contain', '-47,420');
    cy.get('@ctGen').eq(6).should('contain', '-18,190');
    cy.get('@ctGen').eq(7).should('contain', '-30,810');

    cy.get('@ctVehicles').eq(1).should('contain', '0');
    cy.get('@ctVehicles').eq(2).should('contain', '0');
    cy.get('@ctVehicles').eq(3).should('contain', '0');
    cy.get('@ctVehicles').eq(4).should('contain', '0');
    cy.get('@ctVehicles').eq(5).should('contain', '0');
    cy.get('@ctVehicles').eq(6).should('contain', '0');

    cy.get('@ctChange').eq(1).should('contain', '-301,610');
    cy.get('@ctChange').eq(2).should('contain', '-329,660');
    cy.get('@ctChange').eq(3).should('contain', '-506,950');
    cy.get('@ctChange').eq(4).should('contain', '-47,420');
    cy.get('@ctChange').eq(5).should('contain', '-18,190');
    cy.get('@ctChange').eq(6).should('contain', '-30,810');

    // Maine
    cy.get('@meGen').eq(2).should('contain', '-315,280');
    cy.get('@meGen').eq(3).should('contain', '-155,700');
    cy.get('@meGen').eq(4).should('contain', '-338,680');
    cy.get('@meGen').eq(5).should('contain', '-15,840');
    cy.get('@meGen').eq(6).should('contain', '-9,450');
    cy.get('@meGen').eq(7).should('contain', '-8,160');

    cy.get('@meVehicles').eq(1).should('contain', '0');
    cy.get('@meVehicles').eq(2).should('contain', '0');
    cy.get('@meVehicles').eq(3).should('contain', '0');
    cy.get('@meVehicles').eq(4).should('contain', '0');
    cy.get('@meVehicles').eq(5).should('contain', '0');
    cy.get('@meVehicles').eq(6).should('contain', '0');

    cy.get('@meChange').eq(1).should('contain', '-315,280');
    cy.get('@meChange').eq(2).should('contain', '-155,700');
    cy.get('@meChange').eq(3).should('contain', '-338,680');
    cy.get('@meChange').eq(4).should('contain', '-15,840');
    cy.get('@meChange').eq(5).should('contain', '-9,450');
    cy.get('@meChange').eq(6).should('contain', '-8,160');

    // Massachusetts
    cy.get('@maGen').eq(2).should('contain', '-417,510');
    cy.get('@maGen').eq(3).should('contain', '-497,300');
    cy.get('@maGen').eq(4).should('contain', '-1,156,600');
    cy.get('@maGen').eq(5).should('contain', '-78,660');
    cy.get('@maGen').eq(6).should('contain', '-47,040');
    cy.get('@maGen').eq(7).should('contain', '-65,460');

    cy.get('@maVehicles').eq(1).should('contain', '0');
    cy.get('@maVehicles').eq(2).should('contain', '0');
    cy.get('@maVehicles').eq(3).should('contain', '0');
    cy.get('@maVehicles').eq(4).should('contain', '0');
    cy.get('@maVehicles').eq(5).should('contain', '0');
    cy.get('@maVehicles').eq(6).should('contain', '0');

    cy.get('@maChange').eq(1).should('contain', '-417,510');
    cy.get('@maChange').eq(2).should('contain', '-497,300');
    cy.get('@maChange').eq(3).should('contain', '-1,156,600');
    cy.get('@maChange').eq(4).should('contain', '-78,660');
    cy.get('@maChange').eq(5).should('contain', '-47,040');
    cy.get('@maChange').eq(6).should('contain', '-65,460');

    // New Hampshire
    cy.get('@nhGen').eq(2).should('contain', '-296,410');
    cy.get('@nhGen').eq(3).should('contain', '-418,750');
    cy.get('@nhGen').eq(4).should('contain', '-413,220');
    cy.get('@nhGen').eq(5).should('contain', '-32,340');
    cy.get('@nhGen').eq(6).should('contain', '-8,710');
    cy.get('@nhGen').eq(7).should('contain', '-19,100');

    cy.get('@nhVehicles').eq(1).should('contain', '0');
    cy.get('@nhVehicles').eq(2).should('contain', '0');
    cy.get('@nhVehicles').eq(3).should('contain', '0');
    cy.get('@nhVehicles').eq(4).should('contain', '0');
    cy.get('@nhVehicles').eq(5).should('contain', '0');
    cy.get('@nhVehicles').eq(6).should('contain', '0');

    cy.get('@nhChange').eq(1).should('contain', '-296,410');
    cy.get('@nhChange').eq(2).should('contain', '-418,750');
    cy.get('@nhChange').eq(3).should('contain', '-413,220');
    cy.get('@nhChange').eq(4).should('contain', '-32,340');
    cy.get('@nhChange').eq(5).should('contain', '-8,710');
    cy.get('@nhChange').eq(6).should('contain', '-19,100');

    // Rhode Island
    cy.get('@riGen').eq(2).should('contain', '-6,430');
    cy.get('@riGen').eq(3).should('contain', '-81,480');
    cy.get('@riGen').eq(4).should('contain', '-308,790');
    cy.get('@riGen').eq(5).should('contain', '-49,200');
    cy.get('@riGen').eq(6).should('contain', '-26,600');
    cy.get('@riGen').eq(7).should('contain', '-35,730');

    cy.get('@riVehicles').eq(1).should('contain', '0');
    cy.get('@riVehicles').eq(2).should('contain', '0');
    cy.get('@riVehicles').eq(3).should('contain', '0');
    cy.get('@riVehicles').eq(4).should('contain', '0');
    cy.get('@riVehicles').eq(5).should('contain', '0');
    cy.get('@riVehicles').eq(6).should('contain', '0');

    cy.get('@riChange').eq(1).should('contain', '-6,430');
    cy.get('@riChange').eq(2).should('contain', '-81,480');
    cy.get('@riChange').eq(3).should('contain', '-308,790');
    cy.get('@riChange').eq(4).should('contain', '-49,200');
    cy.get('@riChange').eq(5).should('contain', '-26,600');
    cy.get('@riChange').eq(6).should('contain', '-35,730');

    // Vermont
    cy.get('@vtGen').eq(2).should('contain', '-170');
    cy.get('@vtGen').eq(3).should('contain', '-18,020');
    cy.get('@vtGen').eq(4).should('contain', '-28,060');
    cy.get('@vtGen').eq(5).should('contain', '-110');
    cy.get('@vtGen').eq(6).should('contain', '-2,450');
    cy.get('@vtGen').eq(7).should('contain', '-1,910');

    cy.get('@vtVehicles').eq(1).should('contain', '0');
    cy.get('@vtVehicles').eq(2).should('contain', '0');
    cy.get('@vtVehicles').eq(3).should('contain', '0');
    cy.get('@vtVehicles').eq(4).should('contain', '0');
    cy.get('@vtVehicles').eq(5).should('contain', '0');
    cy.get('@vtVehicles').eq(6).should('contain', '0');

    cy.get('@vtChange').eq(1).should('contain', '-170');
    cy.get('@vtChange').eq(2).should('contain', '-18,020');
    cy.get('@vtChange').eq(3).should('contain', '-28,060');
    cy.get('@vtChange').eq(4).should('contain', '-110');
    cy.get('@vtChange').eq(5).should('contain', '-2,450');
    cy.get('@vtChange').eq(6).should('contain', '-1,910');
  });
});
