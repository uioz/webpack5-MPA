const { base } = require("./init");
const fs = require("fs");
const path = require("path");
const { buildToolDebug } = require("./debug");

const modulesPath = path.resolve(base.contextPath, "./src/modules");
const entrysPath = path.resolve(base.contextPath, "./src/entrys");
const pagesPath = path.resolve(base.contextPath, "./src/pages");
const modules = fs.readdirSync(modulesPath);
const entrys = fs.readdirSync(entrysPath);
const pages = fs.readdirSync(pagesPath);

if (base.projectEntry) {
  if (entrys.indexOf(base.projectEntry) == -1) {
    throw new Error(
      `The entrys dir doesn't have a module named ${projectEntry}`
    );
  }
} else {
  buildToolDebug(
    "the projectEntry which in base.js needs a value for config of entry in webpack.config.js!"
  );
}

function excludes(target, exclude) {
  if (exclude === "all") {
    return [];
  }

  if (exclude === "none") {
    return target;
  }

  return target.filter(item => !exclude.includes(item));
}

function filter(target, option) {
  if (option.include === "all") {
    return target;
  }

  if (option.include == "none") {
    return excludes(target, option.exclude);
  }

  return Array.from(
    new Set(
      target
        .filter(item => option.include.includes(item))
        .concat(excludes(target, option.exclude))
    )
  );
}

module.exports = {
  entrys,
  modules: filter(modules, base.modules),
  pages: filter(pages, base.pages),
};
