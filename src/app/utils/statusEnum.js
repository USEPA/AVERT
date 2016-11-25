const statusEnum = {
  "select_region": {
    lang: "Select Region",
    submitted: true,
  },
  "ready": {
    lang: "Calculate",
    submitted: false,
  },
  "started": {
    lang: "Calculating...",
    submitted: true,
  },
  "complete": {
    lang: "Recalculate",
    submitted: false,
  },
};

export default statusEnum;
