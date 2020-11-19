const webpack = require("webpack");

module.exports = async function createCompiler() {
  const config = await require("./webpack.config")(process.env);

  // {
  //   index:['./index/modules/index.js']
  // }
  // =>
  // {
  //   index:['webpack-hot-middleware/client','./index/modules/index.js']
  // }
  for (const item of Object.values(config.entry)) {
    item.unshift("webpack-hot-middleware/client");
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  return webpack(config);
};
