const path = require("path");
const { DllPlugin } = require("webpack");
const { contextPath } = require("./base");

module.exports = {
  mode: "development",
  devtool: "source-map",
  context: contextPath,
  entry: {
    vendor: ["lodash", "vue", "vuex", "vue-router"],
  },
  output: {
    filename: "vendor.bundle.js",
    path: path.resolve(contextPath, "./static/vendor"),
    library: "vendor_lib",
  },
  plugins: [
    new DllPlugin({
      name: "vendor_lib",
      path: path.resolve(contextPath, "./static/vendor/vendor-manifest.json"),
    }),
  ],
};
