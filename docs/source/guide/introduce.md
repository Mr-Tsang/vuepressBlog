---
title: 介绍
postTime: 2021-11-13
categories: 
- Vuepress
tags:
- CSS
- 读书笔记
---



::: slot abstract

前几天逛学校图书馆的时候，偶然发现了这本《CSS选择器世界》，这 **“CSS世界三部曲”** 之前也从B站上关注的程序员 up 主那听说过，也算是有些兴趣，没想到让我在这一大片老旧书籍的图书馆里撞见了这本书。不过可惜的是找了好久也没找到《CSS世界》和《CSS新世界》，最后就只借了这一本书，回去花了一个星期左右的时间看完了。

刚开始还没看的时候，在想 CSS 选择器能有什么好讲的啊，能写这么厚一本书？看完之后可谓收获良多，甚至有一些内容刷新了我对 CSS 选择器的认识。因此我决定在这里整理一下对这本书的读书笔记，不过只记录我个人觉得比较关键的一些点，太过基础的或者我个人认为没有太大必要记录的就略过了

> 刚看完这本书的时候正好赶上了双十一特惠，这本书勾起了我对其他同系列书籍的兴趣，直接下单《CSS世界》和《CSS新世界》，花了我九十多块钱，希望它的内容不要让我失望~~

:::

# 介绍
VuePress 由两部分组成：第一部分是一个**极简静态网站生成器** (opens new window)，它包含由 Vue 驱动的**主题系统**和**插件 API**，另一个部分是为书写技术文档而优化的**默认主题**，它的诞生初衷是为了支持 Vue 及其子项目的文档需求。

每一个由 VuePress 生成的页面都带有预渲染好的 HTML，也因此具有非常好的加载性能和搜索引擎优化（SEO）。同时，一旦页面被加载，Vue 将接管这些静态内容，并将其转换成一个完整的单页应用（SPA），其他的页面则会只在用户浏览到的时候才按需加载。


## 它是如何工作的？
事实上，一个 VuePress 网站是一个由 **Vue** 、**Vue Router** 和 **webpack** 驱动的单页应用。

在构建时，它会为应用创建一个服务端渲染（SSR）的版本，然后通过虚拟访问每一条路径来渲染对应的HTML。

## 目录结构

VuePress 遵循 **“约定优于配置”** 的原则，推荐的目录结构如下：

![目录](/images/catalogo.png)

::: warning 注意
请留意目录名的大写。
:::

- `docs/.vuepress`: 用于存放全局的配置、组件、静态资源等。
- `docs/.vuepress/components`: 该目录中的 Vue 组件将会被自动注册为全局组件。
- `docs/.vuepress/theme`: 用于存放本地主题。
- `docs/.vuepress/styles`: 用于存放样式相关的文件。
- `docs/.vuepress/styles/index.styl`: 将会被自动应用的全局样式文件，会生成在最终的 CSS 文件结尾，具有比默认样式更高的优先级。
- `docs/.vuepress/styles/palette.styl`: 用于重写默认颜色常量，或者设置新的 stylus 颜色常量。
- `docs/.vuepress/public`: 静态资源目录。
- `docs/.vuepress/templates`: 存储 HTML 模板文件。
- `docs/.vuepress/templates/dev.html`: 用于开发环境的 HTML 模板文件。
- `docs/.vuepress/templates/ssr.html`: 构建时基于 Vue SSR 的 HTML 模板文件。
- `docs/.vuepress/config.js`: 配置文件的入口文件，也可以是 `YML` 或 `toml`。
- `docs/.vuepress/enhanceApp.js`: 客户端应用的增强。

## 默认的页面路由

此处我们把 `docs` 目录作为 `targetDir` ，下面所有的“文件的相对路径”都是相对于 `docs` 目录的。在项目根目录下的 `package.json` 中添加 `scripts` ：

```json
{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  }
}
```

对于上述的目录结构，默认页面路由地址如下：

|   文件的相对路径    |  页面路由地址   |
|--------------------|----------------|
| `/README.md`       | `/`            |
| `/guide/README.md` | `/guide/`      |
| `/config.md`       | `/config.html` |

