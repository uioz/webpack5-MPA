/**
 * webpack 5 内置了多种优化所以省略了许多原来常见的配置, 这部分并不是遗漏.
 */
let {
  base: { contextPath, projectEntry, publicPath, staticPath },
} = require("./init");
const { modules, pages } = require("./modules");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ThreadLoader = require("thread-loader");
const { initProd } = require("./init");
const { DllReferencePlugin, DefinePlugin } = require("webpack");
const { handleDevStyle, handleProdStyle } = require("./style");
const { buildToolDebug } = require("./debug");

const DEV_FLAG = "development";
const PROD_FLAG = "production";

const baseConfig = {
  entry: {},
  mode: undefined,
  devtool: undefined,
  context: contextPath,
  stats: "minimal",
  cache: {
    type: "filesystem",
    cacheDirectory: path.resolve(contextPath, "./.cache"),
  },
  output: {
    publicPath,
    filename: "[name].[contenthash].js",
    chunkFilename: "chunk.[name].[contenthash].js",
    path: path.resolve(contextPath, "./dist"),
  },
  resolve: {
    alias: {
      "@": path.resolve(contextPath, "./src"),
    },
    cacheWithContext: true,
    unsafeCache: true,
    symlinks: false,
    extensions: [".js", "json", ".vue"],
  },
  module: {
    rules: [
      {
        test: /\.vue$/i,
        include: [path.resolve(contextPath, "./src"), /vue-echarts/],
        use: ["thread-loader", "vue-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        exclude: staticPath,
        type: "asset",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        exclude: staticPath,
        type: "asset",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: "single",
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    new VueLoaderPlugin({
      prettify: false,
    }),
  ],
};

module.exports = async env => {
  process.env.NODE_ENV = baseConfig.mode = env.NODE_ENV;

  if (env.NODE_ENV === PROD_FLAG) {
    await initProd(pages);
    const { rule, plugin } = handleProdStyle();
    baseConfig.module.rules.unshift(rule);
    baseConfig.plugins.unshift(plugin);
    baseConfig.module.rules.unshift({
      test: /\.js$/,
      use: [
        "thread-loader",
        {
          loader: "babel-loader",
          options: {
            cacheDirectory: path.resolve(contextPath, ".cache"),
          },
        },
      ],

      include: path.resolve(contextPath, "src"),
      // see https://vue-loader.vuejs.org/guide/pre-processors.html#excluding-node-modules
      // see https://github.com/babel/babel-loader#some-files-in-my-node_modules-are-not-transpiled-for-ie-11
      exclude: file => /node_modules/.test(file) && !/\.vue\.js/.test(file),
    });
    ThreadLoader.warmup({}, ["babel-loader", "vue-loader"]);
  }

  if (env.NODE_ENV === DEV_FLAG) {
    // 优化配置
    baseConfig.output.filename = "[name].js";
    baseConfig.output.chunkFilename = "chunk.[name].js";
    baseConfig.devtool = "eval-cheap-module-source-map";
    baseConfig.optimization.splitChunks = false;
    baseConfig.optimization.removeEmptyChunks = false;
    baseConfig.optimization.removeAvailableModules = false;
    baseConfig.optimization.runtimeChunk = true;
    baseConfig.output.pathinfo = false;
    // 样式
    baseConfig.module.rules.unshift(handleDevStyle());
    baseConfig.plugins.push(
      new DllReferencePlugin({
        context: contextPath,
        manifest: path.resolve(
          contextPath,
          "./static/vendor/vendor-manifest.json"
        ),
      })
    );
    ThreadLoader.warmup({}, ["vue-loader"]);
  }

  function addPage(moduleName, index) {
    baseConfig.entry[index ? "index" : moduleName] = [
      `./src/${index ? "entrys" : "modules"}/${moduleName}/index.js`,
    ];
    baseConfig.plugins.unshift(
      new HtmlWebpackPlugin({
        filename: `${index ? "index" : moduleName}.html`,
        chunks: [index ? "index" : moduleName],
        publicPath,
        headScripts:
          env.NODE_ENV === DEV_FLAG
            ? `<script src="/static/vendor/vendor.bundle.js"></script>`
            : undefined,
        template: `./src/${
          index ? "entrys" : "modules"
        }/${moduleName}/index.html`,
      })
    );
  }

  for (const moduleName of modules) {
    if (moduleName === "index") {
      throw new Error("The name 'index' cannot be a modules name!");
    }
    addPage(moduleName);
  }

  // 优先使用外部指定的 entry
  projectEntry = env.entry || projectEntry;

  if (projectEntry) {
    addPage(projectEntry, true);
    baseConfig.plugins.push(
      new DefinePlugin({
        "process.env.entry": JSON.stringify(projectEntry),
      })
    );
  }

  buildToolDebug(
    "moudles and entry name: ",
    ...modules,
    projectEntry && `${projectEntry} as index`
  );

  return baseConfig;
};
