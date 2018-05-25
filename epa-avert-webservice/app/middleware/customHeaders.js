module.exports = async function (ctx, next) {
  await next();

  ctx.set('X-Frame-Options', 'ALLOWALL');
}
