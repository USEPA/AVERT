import EereProfile from 'app/engines/EereProfile';

describe('EERE Profile', () => {
  describe('Errors', () => {
    let profile = new EereProfile();
    profile.limits = {
      hours: 8784,
      annualGwh: 100,
      renewables: 100,
    };

    it('should have no errors by default', () => {
      expect(profile.errors.length).toBe(0);
    });

    it('should be valid if it there are no errors', () => {
      expect(profile.isValid).toBe(true);
    });

    it('should not be valid if an error is added', () => {
      profile._addError('foo');
      expect(profile.isValid).toBe(false);
    });

    it('should be valid if an error is removed', () => {
      profile._removeError('foo');
      expect(profile.isValid).toBe(true);
    });

    it('should be invalid if annualGwh is over the annual limit', () => {
      profile.annualGwh = 101;
      expect(profile.isValid).toBe(false);
      profile.annualGwh = 0;
    });

    it('should be invalid if constantMwh is over the constant limit', () => {
      profile.constantMwh = 12;
      expect(profile.isValid).toBe(false);
      profile.constantMwh = 0;
    });

    it('should be invalid if top hours is over 100%', () => {
      profile.topHours = 101;
      expect(profile.isValid).toBe(false);
      profile.topHours = 0;
    });

    it('should be invalid if top hours is a negative percentage', () => {
      profile.topHours = -1;
      expect(profile.isValid).toBe(false);
      profile.topHours = 0;
    });

    it('should be invalid if the reduction percentage is more than the soft limit', () => {
      profile.reduction = 16;
      expect(profile.isValid).toBe(false);
      profile.reduction = 0;
    });

    it('should be invalid if the reduction percentage is negative', () => {
      profile.reduction = -1;
      expect(profile.isValid).toBe(false);
      profile.reduction = 0;
    });

    it('should be invalid if wind capacity is over the renewable limit', () => {
      profile.windCapacity = 101;
      expect(profile.isValid).toBe(false);
      profile.windCapacity = 0;
    });

    it('should be invalid if utility solar is over the renewable limit', () => {
      profile.utilitySolar = 101;
      expect(profile.isValid).toBe(false);
      profile.utilitySolar = 0;
    });

    it('should be invalid if rooftop solar is over the renewable limit', () => {
      profile.rooftopSolar = 101;
      expect(profile.isValid).toBe(false);
      profile.rooftopSolar = 0;
    });
  });



  describe('Reset', () => {
    let profile = new EereProfile();

    beforeEach(() => {
      profile.topHours = 5;
    });

    it('should set all EERE profile to the original during construction', () => {
      profile.reset();
      expect(profile.topHours).toBe(0);
      expect(profile.topHours).not.toBe(5);
    });

    it('should not touch the region specifc validation limits', () => {
      profile.limits = {
        hours: 8784,
        annualGwh: 100,
        renewables: 100,
      };

      profile.reset();
      expect(profile.limits.annualGwh).toBe(100);
    });
  })
});
