describe("Set Energy Impacts", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.findAllByText("Select Region")
      .filter("option")
      .parent()
      .select("Carolinas");
    cy.findAllByText("Set Energy Impacts").filter(".avert-button").click();

    cy.findByText("Reductions spread evenly throughout the year").as("toggleA");
    cy.get("@toggleA").click();
    cy.findByLabelText("Reduce total annual generation by:").as("annualGwhReduction"); // prettier-ignore
    cy.findByLabelText("Reduce hourly generation by:").as("hourlyMwReduction");
    cy.get("@toggleA").click();

    cy.findByText("Percentage reductions in some or all hours").as("toggleB");
    cy.get("@toggleB").click();
    cy.findByLabelText("Broad-based program:", { exact: false }).as("broadProgramReduction"); // prettier-ignore
    cy.findByLabelText("Targeted program:", { exact: false }).as("targetedProgramReduction"); // prettier-ignore
    cy.findByText("% of hours").prev().as("topHours");
    cy.get("@toggleB").click();

    cy.findByText("Wind").as("toggleC");
    cy.get("@toggleC").click();
    cy.findByLabelText("Onshore wind total capacity:").as("onshoreWind");
    cy.findByLabelText("Offshore wind total capacity:").as("offshoreWind");
    cy.get("@toggleC").click();

    cy.findByText("Solar photovoltaic (PV)").as("toggleD");
    cy.get("@toggleD").click();
    cy.findByLabelText("Utility-scale solar PV total capacity:").as("utilitySolar"); // prettier-ignore
    cy.findByLabelText("Distributed (rooftop) solar PV total capacity:").as("rooftopSolar"); // prettier-ignore
    cy.get("@toggleD").click();

    cy.findByText("Calculate Energy Impacts").as("calculateBtn");
    cy.findAllByText("Get Results").filter(".avert-button").as("resultsBtn");

    cy.findByText("Electric vehicles").as("toggleE");
    cy.get("@toggleE").click();
    cy.findByLabelText("Light-duty battery EVs:").as("batteryEVs");
    cy.findByLabelText("Light-duty plug-in hybrid EVs:").as("hybridEVs");
    cy.findByLabelText("Transit buses:").as("transitBuses");
    cy.findByLabelText("School buses:").as("schoolBuses");
    cy.findByLabelText("Short-haul trucks:").as("shortHaulTrucks");
    cy.findByLabelText("Combination long-haul trucks:").as("comboLongHaulTrucks"); // prettier-ignore
    cy.findByLabelText("Refuse trucks:").as("refuseTrucks");
    cy.findByLabelText("Location of EV deployment:").as("evDeploymentLocation");
    cy.findByLabelText("EV model year:").as("evModelYear");
    cy.findByLabelText("ICE vehicles being replaced:").as("iceReplacementVehicle"); // prettier-ignore
    cy.get("@toggleE").click();

    cy.findByText("PV-plus-storage").as("toggleF");
    cy.get("@toggleF").click();
    cy.findByLabelText("Utility-scale storage capacity:").as("utilityStorage");
    cy.findByLabelText("Distributed storage capacity:").as("rooftopStorage");
    cy.findByLabelText("Maximum allowable discharge cycles per year:").as("maxAnnualDischargeCycles"); // prettier-ignore
    cy.get("@toggleF").click();
  });

  it("Entering a value for onshore wind capacity displays the electric power load profile chart and enables the “Get Results” button", () => {
    cy.get("@toggleC").click();
    cy.get("@onshoreWind").type("1000");
    cy.get("@resultsBtn").should("have.class", "avert-button-disabled");
    cy.get("@calculateBtn").click();
    cy.findByText("Electric power load profile based on values entered:");
    cy.get("@resultsBtn").should("not.have.class", "avert-button-disabled");
  });

  it("Entering a value over the 15% threshold for annual generation and onshore wind capacity displays the warning message below the chart", () => {
    cy.get("@toggleA").click();
    cy.get("@annualGwhReduction").type("5000");
    cy.get("@toggleC").click();
    cy.get("@onshoreWind").type("1000");
    cy.get("@calculateBtn").click();
    cy.findAllByText("WARNING").filter(":visible");
    cy.findByText("24.8");
    cy.findByText("April 7 at 1:00 PM");
  });

  it("Entering a value over the 30% threshold for annual generation and onshore wind capacity displays the error message below the chart", () => {
    cy.get("@toggleA").click();
    cy.get("@annualGwhReduction").type("10000");
    cy.get("@toggleC").click();
    cy.get("@onshoreWind").type("1000");
    cy.get("@calculateBtn").click();
    cy.findAllByText("ERROR").filter(":visible");
    cy.findByText("38.83");
    cy.findByText("April 7 at 1:00 PM");
  });

  it("Entering a negative value for annual generation displays the error message below the input", () => {
    cy.get("@toggleA").click();
    cy.get("@annualGwhReduction").type("-1");
    cy.findByText("Please enter a positive number.");
    cy.get("@calculateBtn").should("have.class", "avert-button-disabled");
    cy.get("@resultsBtn").should("have.class", "avert-button-disabled");
  });
});
