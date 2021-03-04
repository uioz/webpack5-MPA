const path = require("path");

/**
 * include 和 exclude 条件概念.
 * include 条件所包含的内容始终参与构建(模块不存在忽略)
 * exclude 条件所包含的内容会被排除, 优先级比 include 低(模块不存在的会被忽略)
 *
 * include 和 exclude 语法参考.
 * all 表示全部模块, 对于 include 则表示引入全部, 对于 exclude 则表示排除全部,同时使用时由于 include 优先级比 exclude 高所以相当于引入全部.
 * none 表示排除全部, 对于 include 则表示一个不引入, 对于 exclude 则表示一个不排除.
 * ['name',...] 则引入或者排除给定的模块名称.
 */

module.exports = {
  // entrys 目录下作为 index.html 的那个模块
  // projectEntry: "index",
  projectEntry: "index",
  // 用于运行时注入到 window 上的常量, 推荐使用标准的常量命名方式
  globalEnv: {
    // 此处所有的 key 将会匹配入口名称, 除了 default
    // 匹配入口的 key 所的 value 下的每一个 key 都会挂载到 window 上去作为全局常量
    // 这些变量的值会被 JSON.stringify 格式化处理, 这意味着你只能挂载常量
    index: {},
    // 默认向全局注入的常量
    default: {},
  },
  // modules 目录下要参与编译的模块
  modules: {
    include: "all",
    exclude: "none",
  },
  // pages 目录下要参与编译的 HTML 页面
  pages: {
    include: "all",
    exclude: "none",
  },
  //
  devHost: "localhost",
  devPort: 8080,
  proxyTable: {},
  //
  publicPath: "/",
  staticPublicPath: "/static",
  //
  contextPath: path.resolve(__dirname, "../"),
  srcPath: path.resolve(__dirname, "../src"),
  staticPath: path.resolve(__dirname, "../static"),
  distPath: path.resolve(__dirname, "../dist"),
};
