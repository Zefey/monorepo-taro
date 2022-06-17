## 问题1. Taro路由支持npm路径

Taro路由是封装原生小程序的  原生小程序本身只支持绝对路径跳转 

## 问题2. 尝试 monorepo + lerna 

参考链接:  [多项目逻辑复用与monorepo](https://www.shymean.com/article/%E5%A4%9A%E9%A1%B9%E7%9B%AE%E9%80%BB%E8%BE%91%E5%A4%8D%E7%94%A8%E4%B8%8Emonorepo)

使用 monorepo + lerna 可实现通用组件、模块共享.  web项目实践可用.

**Taro 使用 monorepo + lerna 实践**

组件、模块可实现共享

尝试页面共享失败, Taro页面 转换 小程序页 是在编译时期进行的

![Taro编译流程](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1d55859ed6634d4ca09f385a14719000~tplv-k3u1fbpfcp-zoom-in-crop-mark:1304:0:0:0.awebp)


## 问题3. 客制化的思考

通用组件、通用模块 + 客制化Taro项目 = 不同小程序





**关于分包**

```
{
  "pages": [
    "pages/index",
    "pages/logs"
  ],
  "subpackages": [
    {
      "root": "moduleA",
      "pages": [
        "pages/rabbit",
        "pages/squirrel"
      ]
    }, {
      "root": "moduleB",
      "pages": [
        "pages/pear",
        "pages/pineapple"
      ],
      "independent": true
    }
  ]
}
```

根据 `项目src/app.config.ts` 导入 `packages/pages` 目录下共用的页面 写到 `项目/src/pages`.