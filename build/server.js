process.env.NODE_ENV = process.argv[2];
const { join, resolve } = require("path");
const express = require("express");
const compilerMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const { createProxyMiddleware } = require("http-proxy-middleware");
const history = require("connect-history-api-fallback");
const createCompiler = require("./compiler");
const { modules, pages } = require("./modules");
const { initDev } = require("./init");
const { buildToolDebug } = require("./debug");

const {
  devPort,
  staticPath,
  staticPublicPath,
  devHost,
  publicPath,
  proxyTable,
  srcPath,
  projectEntry,
} = require("./base");
const app = express();
const modulesPrefix = modules.map(item => `/${item}`);
const pageUrl = pages.map(page => `/${page}`);

async function main() {
  await initDev();
  const compiler = await createCompiler();

  // 假设 API 请求地址和静态资源请求不重名
  // TODO: 如果 proxyTable 和 模块地址重名的话
  // 当获取模块地址的时候就变成了代理请求
  // 这个必须处理
  for (const [context, options] of Object.entries(proxyTable)) {
    app.use(createProxyMiddleware(context, options));
  }

  app.get("*", (request, response, next) => {
    buildToolDebug(`GET ${request.url}`);
    // 如果地址基于静态地址则跳过
    if ((request.url + "/").indexOf(staticPublicPath + "/") === 0) {
      buildToolDebug(`URL ${request.url} handled by static`);
      return next();
    }

    // 响应 pages
    if (pageUrl.includes(request.url)) {
      buildToolDebug(`URL ${request.url} handled by page`);
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.sendFile(join(srcPath, "./pages", request.url.substring()));
      return;
    }

    // 匹配基于模块地址
    for (const prefix of modulesPrefix) {
      // /hello + '/' === '/hello/' match /hello/ == true
      // /hello/world + '/' === /hello/world/ match /hello/ == true
      // /hello/world/ + '/' === /hello/world// match /hello/ == true
      // /helloword + '/' === '/helloword/ match /hello/ == false
      if ((request.url + "/").indexOf(prefix + "/") === 0) {
        request.url = `${prefix}.html`;
        buildToolDebug(`URL ${request.url} handled by module`);
        return next();
      }
    }

    return next();
  });

  if (projectEntry) {
    app.use(
      history(require(resolve(srcPath, "entrys", projectEntry, "fallback.js")))
    );
  }

  app.use(
    compilerMiddleware(compiler, {
      index: false,
      publicPath,
    })
  );

  app.use(
    webpackHotMiddleware(compiler, {
      log: false,
    })
  );

  // 假设 API 请求地址和静态资源请求不重名
  // publicPath || "*" ->
  // '' || "*" = '*'
  // undefined || "*" = '*'
  // app.use(publicPath || "*", express.static(staticPublicPath, staticPath));
  // TODO: 考虑设置 publicPath 的时候前端代理是否也要结合 publicPath
  // 另外像 /static 是否应该成为 /<publicPath>/static
  app.use(staticPublicPath, express.static(staticPath));

  app.listen(devPort, devHost, () => {
    buildToolDebug("---------------------------");
    buildToolDebug(`server running in ${devHost}:${devPort}`);
    buildToolDebug("---------------------------");
  });
}

main();
