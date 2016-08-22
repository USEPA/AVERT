var assert = require('assert');

// placeholder test
describe('Array', function() {
  context('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });

    it('should return the index when the value is present', function() {
      assert.equal(0, [1,2,3].indexOf(1));
      assert.equal(2, [1,2,3].indexOf(3));
    });
  });
});
