
https://vue-loader.vuejs.org/options.html#prettify

https://github.com/jantimon/html-webpack-plugin



intuitive

Hot Module Replacement

监听到编译, 确定是哪个模块->只编译该模块(debound)

import.meta.url

# TODO LIST
- [x] 启动 Vue 
  - [x] 热重载
  - [x] vue vuex vue-loader
- [x] 多页面
  - [x] 支持主模块
- [x] browserlist 
  - [x] babel
    - [x] 开发时禁用
  - [x] postcss
  - [x] sass
  - [x] mini-css
- [x] copy statics
- [x] proxyTable
- [ ] 拆分优化
  - [ ] css 拆分
- [ ] 使用 debug
- [x] 入口支持 HTML
- [x] 入口支持过滤器
- [x] loader 限定工作范围
- [x] dllplugin
  - [x] 自动化 dllplugin
  - [x] 构建时自动移除 htmlwebpackplugin 所注入的内容
- [x] 移除 copyplugin 和 cleanplugin
- [x] cache
- [x] GZIP
- [x] thread-loader
- [x] 区分 entry 和 modules
- [ ] 使用 sideEffects 和 treeShake
- [ ] 使用 async 和 defer
- [ ] 使用 preload 和 prefetch
- [ ] 使用 serviceWork
- [ ] 基于 HTTP2
- [ ] 基于模块的重载
  - [ ] 编译缓存