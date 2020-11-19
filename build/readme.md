# 命名冲突规则

1. 静态资源前缀地址不能和模块名称重名, 如果静态前缀是 /static 则不能有 static 模块
2. 代理地址前缀不能和模块名称重名, 如果代理前缀是 /client 则不能有 client 模块
3. 页面名称不能和模块名称重名, 如果有 helloworld.html 则不能有 helloworld 模块
