class NumberFormattingHelper {
  static twoDecimals(x) {
    x = Math.round(x * 100) / 100;
    return NumberFormattingHelper.isInt(x) ? x : parseFloat(x).toFixed(2);
  }

  static isInt(x) {
    return x % 1 === 0;
  }
}

export default NumberFormattingHelper;
