const Fiber = require("fibers");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const { staticPath, publicPath } = require("./base");

// TODO: 细微调整 thread-loader 找出最平衡的配置

exports.handleDevStyle = function handleDevStyle() {
  return {
    test: /\.((c|sc)ss)$/i,
    exclude: staticPath,
    use: [
      "vue-style-loader",
      {
        loader: "css-loader",
        options: {
          importLoaders: 1,
          modules: false,
          // see https://github.com/vuejs/vue-loader/issues/1709#issuecomment-674390048
          esModule: false,
        },
      },
      "thread-loader",
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
            importLoaders: 2,
            modules: false,
            // see https://github.com/vuejs/vue-loader/issues/1709#issuecomment-674390048
            esModule: false,
          },
        },
        "thread-loader",
        "postcss-loader",
        "thread-loader",
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
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  };
};
