const Koa = require('koa');
const path = require('path');
const static = require('koa-static');

const app = new Koa();

app.use(static(
  path.resolve('public'), { //静态文件所在目录
    maxage: 30*24*60*60*1000, //指定静态资源在浏览器中的缓存时间
  }
));

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response
app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);