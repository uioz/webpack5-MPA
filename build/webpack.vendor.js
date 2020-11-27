const path = require("path");
const { DllPlugin } = require("webpack");
const {
  base: { contextPath },
} = require("./init");

module.exports = {
  mode: "development",
  devtool: "source-map",
  context: contextPath,
  entry: {
    vendor: ["lodash", "vue", "vuex", "vue-router", "element-ui", "axios"],
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
