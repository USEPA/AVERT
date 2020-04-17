async function basicAuth(ctx, next) {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.set('WWW-Authenticate', 'Basic');
      ctx.body = 'Authentication Required';
    } else {
      throw err;
    }
  }
}

async function customHeaders(ctx, next) {
  await next();
  ctx.set('X-Frame-Options', 'ALLOWALL');
}

async function pageNotFound(ctx, next) {
  await next();
  if (ctx.status !== 404) return;
  ctx.status = 404;
  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>Page Not Found</p>';
      break;
    case 'json':
      ctx.body = { message: 'Page Not Found' };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
}

module.exports = {
  basicAuth,
  customHeaders,
  pageNotFound,
};
