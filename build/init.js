const path = require("path");
const fsExtra = require("fs-extra");
const merge = require("lodash.merge");
const webpack = require("webpack");

let base = require("./base");
try {
  base = merge(base, require(path.join(__dirname, "..", "local.base.js")));
} catch {}

const { staticPath, distPath, srcPath } = base;

exports.base = base;

const vendorConfig = require("./webpack.vendor");
const { devDebug, prodDebug } = require("./debug");
const DEV_FLAG = "development";
const PROD_FLAG = "production";

function runBuildVendor() {
  return new Promise((resolve, reject) => {
    webpack(vendorConfig, (err, stats) => {
      if (err) {
        return reject(err);
      }
      resolve(
        stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true, // Shows colors in the console
        })
      );
    });
  });
}

exports.initDev = async function initDev() {
  devDebug(`running in ${DEV_FLAG} mode`);
  const exists = await fsExtra.pathExists(path.resolve(staticPath, "./vendor"));

  if (!exists) {
    devDebug("vendor's file aren't detected");
    devDebug("auto generated");
    devDebug(await runBuildVendor());
  }
};

exports.initProd = async function initProd(pages) {
  prodDebug(`running in ${PROD_FLAG} mode`);

  prodDebug("empty distribution folder - start");
  await fsExtra.emptyDir(distPath);
  prodDebug("empty distribution folder - done");

  const tasks = [
    new Promise((resolve, reject) => {
      prodDebug("copying static folder to distribution folder - start");
      fsExtra
        .copy(staticPath, path.resolve(distPath, "./static"), {
          filter(src) {
            /**
             * fsExtra 是递归执行, 如果 /static/vendor 返回 false 则 /static/vendor/xxx 将不会进行查询
             * src.lastIndexOf("vendor") + 6 的目的是求出以 vendor 结尾的目录然后屏蔽它
             */
            return src.lastIndexOf("vendor") + 6 != src.length;
          },
        })
        .then(() => {
          prodDebug("copying static folder to distribution folder - done");
          resolve();
        })
        .catch(reject);
    }),
  ];

  for (const page of pages) {
    tasks.push(
      new Promise((resolve, reject) => {
        prodDebug(`copy pages ${page} to distribution folder - start`);
        fsExtra
          .copy(
            path.resolve(srcPath, "./pages", page),
            path.resolve(distPath, page)
          )
          .then(() => {
            prodDebug(`copy pages ${page} to distribution folder - done`);
            resolve();
          })
          .catch(reject);
      })
    );
  }

  for (const task of tasks) {
    await task;
  }
};
