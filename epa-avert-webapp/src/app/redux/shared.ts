export type DataByMonth = {
  [MonthNumber in 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12]: number;
};

export type MonthlyChanges = {
  emissions: {
    region: DataByMonth;
    state: {
      [stateId: string]: DataByMonth;
    };
    county: {
      [stateId: string]: {
        [countyName: string]: DataByMonth;
      };
    };
  };
  percentages: {
    region: DataByMonth;
    state: {
      [stateId: string]: DataByMonth;
    };
    county: {
      [stateId: string]: {
        [countyName: string]: DataByMonth;
      };
    };
  };
};
