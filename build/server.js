process.env.NODE_ENV = process.argv[2];
const { join, resolve } = require("path");
const express = require("express");
const fsExtra = require("fs-extra");
const compilerMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const { createProxyMiddleware } = require("http-proxy-middleware");
const history = require("connect-history-api-fallback");
const createCompiler = require("./compiler");
const { modules, pages } = require("./modules");
const { initDev } = require("./init");
const { serverDebug, devDebug } = require("./debug");

const {
  base: {
    devPort,
    staticPath,
    staticPublicPath,
    devHost,
    publicPath,
    proxyTable,
    srcPath,
    projectEntry,
    contextPath,
  },
  runtimeConfig,
} = require("./init");

const app = express();
const modulesPrefix = modules.map((item) => `/${item}`);
const pageUrl = pages.map((page) => `/${page}`);

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

  const rewrites = [];

  if (projectEntry) {
    try {
      rewrites.push(
        ...require(resolve(srcPath, "entrys", projectEntry, "fallback.js"))
          .rewrites
      );
    } catch (error) {}
  }

  for (const module of modules) {
    try {
      rewrites.push(
        ...require(resolve(srcPath, "modules", module, "fallback.js")).rewrites
      );
    } catch (error) {}
  }

  app.get("*", (request, response, next) => {
    // 如果地址基于静态地址则跳过
    if ((request.url + "/").indexOf(staticPublicPath + "/") === 0) {
      serverDebug(`URL ${request.url} handled by static`);
      // 处理 local.config.js
      if (runtimeConfig && request.url === `${staticPublicPath}/js/config.js`) {
        response.setHeader(
          "content-type",
          "application/javascript; charset=UTF-8"
        );
        fsExtra.readFile(
          join(contextPath, "local.config.js"),
          (error, data) => {
            if (error) {
              return serverDebug(error);
            }
            response.status(200).send(data);
          }
        );
        return;
      }
      return next();
    }

    // 响应 pages
    if (pageUrl.includes(request.path)) {
      serverDebug(`URL ${request.url} handled by page`);
      response.statusCode = 200;
      response.setHeader("Content-Type", "text/html");
      response.sendFile(join(srcPath, "./pages", request.path));
      return;
    }

    // 匹配基于模块地址
    for (const prefix of modulesPrefix) {
      // /hello + '/' === '/hello/' match /hello/ == true
      // /hello/world + '/' === /hello/world/ match /hello/ == true
      // /hello/world/ + '/' === /hello/world// match /hello/ == true
      // /helloword + '/' === '/helloword/ match /hello/ == false
      if ((request.path + "/").indexOf(prefix + "/") === 0) {
        request.url = `${prefix}.html`;
        serverDebug(`URL ${request.url} handled by module`);
        return next();
      }
    }

    return next();
  });

  // 匹配基于 fallback 的地址
  app.use(
    history({
      rewrites,
      logger: serverDebug,
    })
  );

  app.use(
    compilerMiddleware(compiler, {
      index: false,
      publicPath,
    })
  );

  app.use(
    webpackHotMiddleware(compiler, {
      log: serverDebug,
    })
  );

  // 假设 API 请求地址和静态资源请求不重名
  // TODO: 考虑设置 publicPath 的时候前端代理是否也要结合 publicPath
  // 另外像 /static 是否应该成为 /<publicPath>/static
  app.use(staticPublicPath, express.static(staticPath));

  app.listen(devPort, devHost, () => {
    devDebug("---------------------------");
    devDebug(`server running in ${devHost}:${devPort}`);
    devDebug("---------------------------");
  });
}

main();
