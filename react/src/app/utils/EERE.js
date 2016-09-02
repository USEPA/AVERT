class EERE {
	constructor(params) {
		this.top_hours = params.top_hours;
        this.reduction = params.reduction;
        this.annual_gwh = params.annual_gwh;
        this.constant_mw = params.constant_mw;
        this.wind_capacity = params.wind_capacity;
        this.utility_solar = params.utility_solar;
        this.rooftop_solar = params.rooftop_solar;
	}
}

export default EERE;