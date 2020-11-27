const fsExtra = require("fs-extra");
const { resolve } = require("path");
const {
  base: { distPath, staticPath, contextPath },
} = require("./init");
const { buildToolDebug } = require("./debug");

async function main() {
  await fsExtra.remove(distPath);
  buildToolDebug("distribution folder has removed");

  await fsExtra.remove(resolve(contextPath, "./.cache"));
  buildToolDebug(".cache folder has removed");

  await fsExtra.remove(resolve(staticPath, "./vendor"));
  buildToolDebug("/static/vendor folder has removed");
}

main();
