module.exports = function* (next) {
  yield next;

  this.set('X-Frame-Options', 'ALLOW-FROM https://epa.gov/');
}
