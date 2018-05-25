import EereProfile from 'app/engines/EereProfile';

describe('EERE Profile', () => {
  describe('Errors', () => {
    let eereProfile = new EereProfile();
    eereProfile.limits = {
      hours: 8784,
      annualGwh: 100,
      renewables: 100,
    };

    it('should have no errors by default', () => {
      expect(eereProfile.errors.length).toBe(0);
    });

    it('should be valid if it there are no errors', () => {
      expect(eereProfile.isValid).toBe(true);
    });

    it('should not be valid if an error is added', () => {
      eereProfile._addError('foo');
      expect(eereProfile.isValid).toBe(false);
    });

    it('should be valid if an error is removed', () => {
      eereProfile._removeError('foo');
      expect(eereProfile.isValid).toBe(true);
    });

    it('should be invalid if annualGwh is over the annual limit', () => {
      eereProfile.annualGwh = 101;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.annualGwh = 0;
    });

    it('should be invalid if constantMwh is over the constant limit', () => {
      eereProfile.constantMwh = 12;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.constantMwh = 0;
    });

    it('should be invalid if top hours is over 100%', () => {
      eereProfile.topHours = 101;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.topHours = 0;
    });

    it('should be invalid if top hours is a negative percentage', () => {
      eereProfile.topHours = -1;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.topHours = 0;
    });

    it('should be invalid if the reduction percentage is more than the soft limit', () => {
      eereProfile.reduction = 16;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.reduction = 0;
    });

    it('should be invalid if the reduction percentage is negative', () => {
      eereProfile.reduction = -1;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.reduction = 0;
    });

    it('should be invalid if wind capacity is over the renewable limit', () => {
      eereProfile.windCapacity = 101;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.windCapacity = 0;
    });

    it('should be invalid if utility solar is over the renewable limit', () => {
      eereProfile.utilitySolar = 101;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.utilitySolar = 0;
    });

    it('should be invalid if rooftop solar is over the renewable limit', () => {
      eereProfile.rooftopSolar = 101;
      expect(eereProfile.isValid).toBe(false);
      eereProfile.rooftopSolar = 0;
    });
  });

  describe('Reset', () => {
    let eereProfile = new EereProfile();

    beforeEach(() => {
      eereProfile.topHours = 5;
    });

    it('should set all EERE eereProfile to the original during construction', () => {
      eereProfile.reset();
      expect(eereProfile.topHours).toBe(0);
      expect(eereProfile.topHours).not.toBe(5);
    });

    it('should not touch the region specifc validation limits', () => {
      eereProfile.limits = {
        hours: 8784,
        annualGwh: 100,
        renewables: 100,
      };

      eereProfile.reset();
      expect(eereProfile.limits.annualGwh).toBe(100);
    });
  });
});
