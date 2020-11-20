const debug = require("debug");

const PROD_DEBUG = "PROD-debug";
const DEV_DEBUG = "DEV-debug";
const BUILDTOOL_DEBUG = "BuildTool-debug";
const SERVER_DEBUG = "SERVER_DEBUG";

const prodDebug = debug(PROD_DEBUG);
const devDebug = debug(DEV_DEBUG);
const buildToolDebug = debug(BUILDTOOL_DEBUG);
const serverDebug = debug(SERVER_DEBUG);

prodDebug.enabled = true;
devDebug.enabled = true;
buildToolDebug.enabled = true;
serverDebug.enabled = process.argv[3] === "verbose";

module.exports = {
  prodDebug,
  devDebug,
  buildToolDebug,
  serverDebug,
};
