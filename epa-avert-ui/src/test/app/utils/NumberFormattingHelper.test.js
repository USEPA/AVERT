import NumberFormattingHelper from '../../../app/utils/NumberFormattingHelper';

describe('NumberFormattingHelper', () => {

  describe('isInt', () => {
    it('should return true if a number is an integer', () => {
      const isInt = NumberFormattingHelper.isInt(5);
      expect(isInt).toBe(true);
    });

    it('should return false if a number is a decimal', () => {
      const isInt = NumberFormattingHelper.isInt(5.1);
      expect(isInt).toBe(false);
    });

    it('should return true if a number has a decimal point, but converges to an integer', () => {
      const isInt = NumberFormattingHelper.isInt(5.000);
      expect(isInt).toBe(true);
    });

    it('should return false if given a string', () => {
      const isInt = NumberFormattingHelper.isInt('A');
      expect(isInt).toBe(false);
    });

    it('should return true if a string is a number (e.g., allow truthy)', () => {
      const isInt = NumberFormattingHelper.isInt('5');
      expect(isInt).toBe(true);
    });

    it('should return false if a string is a decimal (e.g., allow truthy, but still check)', () => {
      const isInt = NumberFormattingHelper.isInt('5.1');
      expect(isInt).toBe(false);
    });
  });

  describe('twoDecimals', () => {
    it('should fix a decimal to two digits', () => {
      const value = NumberFormattingHelper.twoDecimals(5.123456789);
      expect(value).toBe('5.12');
    });

    it('should return an integer if it does not have any decimals', () => {
      const value = NumberFormattingHelper.twoDecimals(5);
      expect(value).toBe('5');
    });

    it('should be able to always show zeros if the alwaysShow option is true', () => {
      const  value = NumberFormattingHelper.twoDecimals(5, { alwaysShow: true });
      expect(value).toBe('5.00')
    });

    it('should use the default behaviour if alwaysShow option is false', () => {
      const  value = NumberFormattingHelper.twoDecimals(5, { alwaysShow: false });
      expect(value).toBe('5')
    });

    it('should replace zero values with -- if hideZero is --', () => {
      const  value = NumberFormattingHelper.twoDecimals(0, { hideZero: '--' });
      expect(value).toBe('--')
    });

    it('should do nothing if hideZero is -- and the given value is not zero', () => {
      const  value = NumberFormattingHelper.twoDecimals(5, { hideZero: '--' });
      expect(value).toBe('5')
    });
  });
});