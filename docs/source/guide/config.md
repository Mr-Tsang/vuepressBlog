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
