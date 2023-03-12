---
title: 配置
postTime: 2020-11-12
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
# 配置
首先在你的文档目录下创建一个 .vuepress 目录，所有 VuePress 相关的文件都将会被放在这里。

项目结构可能是这样：
```
.
├─ docs
│  ├─ README.md
│  └─ .vuepress
│     └─ config.js
└─ package.json
```
## 首页
![首页配置](/images/Home.png)

## config.js

**docs/.vuepress/config.js:** 配置文件的入口文件，也可以是 YML 或 toml

![config.js](/images/config-entry.png)

```js
module.exports = {
    title: "Web Blog",
    description: "前端工程师的进阶之路",
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', { rel: 'icon', href: '/images/photo.jpg' }],
        ['meta', { charset: "UTF-8" }],
        ['meta', { 'http-quiv': 'X-UA-Compatible', cotent: 'IE=edge' }],
        ['meta', { name: "viewport", content: "width=device-width, initial-scale=1.0" }]
    ],
    serviceWorker: true, // 是否开启 PWA
    base: '/', // 部署到github相关的配置
    markdown: {
        lineNumbers: false // 代码块是否显示行号
    },
    locales: {
        '/': {
            lang: 'zh-CN',//中文
        }
    },
    themeConfig: {
        nav: [ //导航栏配置
            { text: '指南', link: '/source/guide/introduce.html' },
            { text: '前端基础', link: '/source/base/1.html' },
            { text: '案例', link: '/source/advanced/1.html' },
            { text: '前端工程化', link: '/source/engineering/1.html' },
            {
                text: "文案",
                items: [//下拉列表
                    { text: '前端基础', link: '/source/base/1.html' },
                    { text: '案例', link: '/source/advanced/1.html' },
                    { text: '前端工程化', link: '/source/engineering/1.html' },
                ]
            },
            {
                text: "更多",
                items: [//分组的下拉列表
                    {
                        text: "文案",
                        items: [
                            { text: '前端基础', link: '/source/base/1.html' },
                            { text: '案例', link: '/source/advanced/1.html' },
                            { text: '前端工程化', link: '/source/engineering/1.html' }
                        ]
                    },
                    {
                        text: "链接",
                        items: [
                            { text: '百度', link: "https://www.baidu.com/" },
                            { text: '微博', link: "https://weibo.com/" }
                        ]
                    }
                ]
            },
            { text: 'Github', link: 'https://www.baidu.com/' }
        ],
        sidebar: { //侧边栏配置
            '/source/guide/': [
                {
                    title: "指南",
                    children: [
                        '/source/guide/introduce.html',
                        '/source/guide/config.html',
                    ]
                }
            ],
            '/source/base/': [
                {
                    title: "前端基础",
                    children: [
                        '/source/base/1.html',
                        '/source/base/2.html',
                        '/source/base/3.html'
                    ]
                }
            ],
            '/source/advanced/': [
                {
                    title: "案例",
                    children: [
                        '/source/advanced/1.html',
                        '/source/advanced/2.html',
                        '/source/advanced/3.html'
                    ]
                }
            ],
            '/source/engineering/': [
                {
                    title: "前端工程化",
                    children: [
                        '/source/engineering/1.html',
                        '/source/engineering/2.html',
                        '/source/engineering/3.html'
                    ]
                }
            ]
        }
    },
    // 使用依赖项中的插件
    plugins: [
        // 'vuepress-plugin-demo-container',
        [
            require('./md-loader')
        ]
    ],
    // alias设置别名：解决Cannot find module 'core-js/library/fn/xxx/xxx'问题
    alias: {
        'core-js/library/fn': 'core-js/features'
    }
};

```

## enhanceApp.js
**docs/.vuepress/enhanceApp.js:** 客户端应用的增强。应用级别的配置, 使用这个钩子来安装一些附加的 Vue 插件、注册全局组件，或者增加额外的路由钩子
![enhanceApp.js](/images/enhanceApp.png)
