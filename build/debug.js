const debug = require("debug");

const PROD_DEBUG = "PROD-debug";
const DEV_DEBUG = "DEV-debug";
const BUILDTOOL_DEBUG = "BuildTool-debug";

const prodDebug = debug(PROD_DEBUG);
const devDebug = debug(DEV_DEBUG);
const buildToolDebug = debug(BUILDTOOL_DEBUG);

prodDebug.enabled = true;
devDebug.enabled = true;
buildToolDebug.enabled = true;

module.exports = {
  prodDebug,
  devDebug,
  buildToolDebug,
};
