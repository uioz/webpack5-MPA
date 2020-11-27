const Fiber = require("fibers");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const {
  base: { staticPublicPath, staticPath, publicPath },
} = require("./init");

exports.handleDevStyle = function handleDevStyle() {
  return {
    test: /\.((c|sc)ss)$/i,
    exclude: staticPath,
    use: [
      "vue-style-loader",
      {
        loader: "css-loader",
        options: {
          // don't handled url started with /static
          url(url) {
            if (`${url}/`.indexOf(`${staticPublicPath}/`) === 0) {
              return false;
            }
            return true;
          },
          importLoaders: 1,
          modules: false,
          // see https://github.com/vuejs/vue-loader/issues/1709#issuecomment-674390048
          esModule: false,
        },
      },
      {
        loader: "sass-loader",
        options: {
          sassOptions: {
            fiber: Fiber,
          },
        },
      },
    ],
  };
};

exports.handleProdStyle = function handleProdStyle() {
  return {
    rule: {
      test: /\.((c|sc)ss)$/i,
      exclude: staticPath,
      use: [
        {
          loader: miniCssExtractPlugin.loader,
          options: {
            publicPath,
            esModule: false,
          },
        },
        {
          loader: "css-loader",
          options: {
            // don't handled url started with /static
            url(url) {
              if (`${url}/`.indexOf(`${staticPublicPath}/`) === 0) {
                return false;
              }
              return true;
            },
            importLoaders: 2,
            modules: false,
            // see https://github.com/vuejs/vue-loader/issues/1709#issuecomment-674390048
            esModule: false,
          },
        },
        "postcss-loader",
        {
          loader: "sass-loader",
          options: {
            sassOptions: {
              fiber: Fiber,
            },
          },
        },
      ],
    },
    plugin: new miniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "chunk.[contenthash].css",
      ignoreOrder: true, // Disabled to remove warnings about conflicting order
    }),
  };
};
