class NumberFormattingHelper {
  static twoDecimals(x, options) {
    x = Math.round(x * 100) / 100;

    if(options && options.hideZero && x === 0) return options.hideZero;

    if(options && options.alwaysShow) return parseFloat(x).toFixed(2);

    return NumberFormattingHelper.isInt(x) ? x.toString() : parseFloat(x).toFixed(2);
  }

  static isInt(x) {
    return x % 1 === 0;
  }
}

export default NumberFormattingHelper;
