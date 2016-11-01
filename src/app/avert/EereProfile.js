class EereProfile {
	constructor() {
        this.topHours = 0;
        this.reduction = 0;
        this.annualGwh = 0;
        this.constantMw = 0;
        this.windCapacity = 0;
        this.utilitySolar = 0;
        this.rooftopSolar = 0;
	}

    setTopHours(topHours) {
        this.topHours = topHours;

        return this;
    }

    getTopHours() {
        return this.topHours;
    }

    setReduction(reduction) {
        this.reduction = reduction;

        return this;
    }

    getReduction() {
        return this.reduction;
    }

    setAnnualGwh(annualGwh) {
        this.annualGwh = annualGwh;

        return this;
    }

    getAnnualGwh() {
        return this.annualGwh;
    }

    setConstantMw(constantMw) {
        this.constantMw = constantMw;

        return this;
    }

    getConstantMw() {
        return this.constantMw;
    }

    setWindCapacity(windCapacity) {
        this.windCapacity = windCapacity;

        return this;
    }

    getWindCapacity() {
        return this.windCapacity;
    }

    setUtilitySolar(utilitySolar) {
        this.utilitySolar = utilitySolar;

        return this;
    }

    getUtilitySolar() {
        return this.utilitySolar;
    }

    setRooftopSolar(rooftopSolar) {
        this.rooftopSolar = rooftopSolar;

        return this;
    }

    getRooftopSolar() {
        return this.rooftopSolar;
    }
}

export default EereProfile;