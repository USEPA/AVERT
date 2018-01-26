import EereProfile from '../../../app/avert/entities/EereProfile';

describe('EERE Profile', () => {

  describe('Getters and setters', () => {
    let profile = new EereProfile();

    it('should accept top hours', () => {
      profile.topHours = 5;

      expect(profile.topHours).toBe(5);
    });

    it('should accept reduction', () => {
      profile.reduction = 5;

      expect(profile.reduction).toBe(5);
    });

    it('should accept annualGwh', () => {
      profile.annualGwh = 5;

      expect(profile.annualGwh).toBe(5);
    });

    it('should accept constantMw', () => {
      profile.constantMw = 5;

      expect(profile.constantMw).toBe(5);
    });

    it('should accept windCapacity', () => {
      profile.windCapacity = 5;

      expect(profile.windCapacity).toBe(5);
    });

    it('should accept utilitySolar', () => {
      profile.utilitySolar = 5;

      expect(profile.utilitySolar).toBe(5);
    });

    it('should accept rooftopSolar', () => {
      profile.rooftopSolar = 5;

      expect(profile.rooftopSolar).toBe(5);
    });
  });

  describe('Limits', () => {
    let profile = new EereProfile();

    profile.limits = {
      constantReductions: 5,
      renewables: 10,
    };

    it('should extract reduction limits into an annual value', () => {
      expect(profile.limits.annualGwh).toBe(5);
    });

    it('should extract reduction limits into a constant value', () => {
      expect(profile.limits.constantMwh).toBe(parseInt(5 * 1000 / 8760, 10));
    });

    it('should extract the renewable limit', () => {
      expect(profile.limits.renewables).toBe(10);
    });

    it('should always have a soft limit of 15', () => {
      expect(profile.limits.softPercent).toBe(15);
    });
  });

  describe('Errors', () => {
    let profile = new EereProfile();

    profile.limits = {
      constantReductions: 5,
      renewables: 10,
    };

    it('should have no errors by default', () => {
      expect(profile.errors.length).toBe(0);
    });

    it('should be valid if it there are no errors', () => {
      expect(profile.isValid).toBe(true);
    });

    it('should not be valid if an error is added', () => {
      profile.addError('foo');

      expect(profile.isValid).toBe(false);
    });

    it('should be valid if an error is removed', () => {
      profile.removeError('foo');

      expect(profile.isValid).toBe(true);
    });

    it('should be invalid if top hours is over 100%', () => {
      profile.topHours = 500;

      expect(profile.isValid).toBe(false);

      profile.topHours = 0;
    });

    it('should be invalid if top hours is a negative percentage', () => {
      profile.topHours = -5;

      expect(profile.isValid).toBe(false);

      profile.topHours = 0;
    });

    it('should be invalid if the reduction percentage is more than the soft limit', () => {
      profile.reduction = 16;

      expect(profile.isValid).toBe(false);

      profile.reduction = 0;
    });

    it('should be invalid if the reduction percentage is negative', () => {
      profile.reduction = -100;

      expect(profile.isValid).toBe(false);

      profile.reduction = 0;
    });

    it('should be invalid if annualGwh is over the annual limit', () => {
      profile.annualGwh = 100;

      expect(profile.isValid).toBe(false);

      profile.annualGwh = 0;
    });

    it('should be invalid if constantMw is over the constant limit', () => {
      profile.constantMw = 100;

      expect(profile.isValid).toBe(false);

      profile.constantMw = 0;
    });

    it('should be invalid if wind capacity is over the renewable limit', () => {
      profile.windCapacity = 100;

      expect(profile.isValid).toBe(false);

      profile.windCapacity = 0;
    });

    it('should be invalid if utility solar is over the renewable limit', () => {
      profile.utilitySolar = 100;

      expect(profile.isValid).toBe(false);

      profile.utilitySolar = 0;
    });

    it('should be invalid if rooftop solar is over the renewable limit', () => {
      profile.rooftopSolar = 100;

      expect(profile.isValid).toBe(false);

      profile.rooftopSolar = 0;
    });
  });

  describe('Reset', () => {

    let profile = new EereProfile();

    beforeEach(() => {
      profile.topHours = 5;
    });

    afterEach(() => {
      profile.reset();
      profile.limits = {
        annualGwh: false,
        constantMwh: false,
        renewables: false,
        softPercent: 15,
      }
    });

    it('should set all EERE profile to the original during construction', () => {
      profile.reset();
      expect(profile.topHours).toBe(0);
      expect(profile.topHours).not.toBe(5);
    });

    it('should not touch the region specify validation limits', () => {
      profile.limits = {
        constantReductions: 5,
        renewables: 10,
      };

      profile.reset();
      expect(profile.limits.annualGwh).toBe(5);
    });
  })
});
