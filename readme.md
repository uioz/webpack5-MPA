# 命令

启动开发服务器:

```
npm run dev
```

打包:

```
npm run build
```

打包且分析输出:

```
npm run build:analysis
```

构建 vendor(只用于开发模式):

```
npm run build:vendor
```

## 错误修复

通过:

```
npm run clean
```

可以清空编译时产生的缓存, 这样做会降低之后的首次编译速度.

# src 目录规则

- entrys 下的模块只会选择一个进行编译并作为首页模块进行输出, 适用于多个入口模块但是编译时只需要一个的情况.
- modules 下的模块均会参与编译
- pages 下存放的是静态 html 页面不参与编译最终会直接的移动到编译目录中

## entrys 模块

作为首页模块输出的 entrys 模块, 无论模块目录名称是什么最终的输出结果都是 `index.html`.

## entrys 模块规则

每一个模块目录内部必须有三个文件:

- index.js 作为 webpack 打包的入口
- index.html 作为注入 chunk 的模板
  - index.html head 标签尾需要添加 `<%= htmlWebpackPlugin.options.headScripts %>`
- fallback.js 本质是 connect-api-fallback 的选项配置, 在开发服务器运行时通过该配置, 决定哪些地址响应 `index.html`

仅有这三个文件是不能够满足项目的运行, 的一般来说还需要路由文件和 vue 文件, 建议的目录格式如下:

- fallback.js
- index.html
- index.js
- index.vue
- router.js

是否将文件放入到该模块目录的原则是: 只用于该模块的文件, 且需要在入口处引用都可以放到该目录下.

## modules 模块

modules 模块会使用模块目录的名称作为最终生成的 html 文件的名称.

而且模块的名称会作为路由匹配的地址, 如果存在 about 模块, 则 url 基于 /about/ 开头的地址都会返回 `about.html` 文件.

## modules 目录原则

和 entrys 模块规则类似, 由于模块名称决定了路由地址, 所以不需要添加 `fallback.js` 文件, 其余规则和 entrys 一致.

## views 目录规则

entrys 和 modules 下存放的都是用于 SPA 的入口模块, 对于页面组件(路由组件)需要放到 `views` 目录中, 虽然可以将这些组件放置到 entrys 和 modules 下.  
但是随着项目的开发这么做有两点不推荐:

- 目录层级会越来越多
- 页面组件(路由组件) 可能会在不同的模块间复用, 如果一个模块直接引用另外一个模块的组件则它们总会需要放置到一个公共的位置.

## components 目录规则

对于具有复用意义的非页面组件(路由组件)可以放置到该目录下.

## assets 目录规则

需要经过 webpack 处理的静态资源文件(即不是 js 文件)需要放到这个位置.

# static 目录规则

放置到该目录的文件不会经过 webpack 处理, 处于该目录中的文件只能通过绝对地址进行引用:

```
/static/helloworld/main.css
```

如果在使用 import 语句进行导入将无法通过编译.

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
- [ ] 将 pages 中的依赖模块也纳入到 webpack 中解析
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

intuitive

Hot Module Replacement

监听到编译, 确定是哪个模块->只编译该模块(debound)

import.meta.url
