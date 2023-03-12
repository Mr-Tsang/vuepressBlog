/*
    配置文件的入口文件，也可以是 YML 或 toml
*/

module.exports = {
    title: "跬步千里",
    description: "前端工程师的进阶之路",
    head: [ // 注入到当前页面的 HTML <head> 中的标签
        ['link', { rel: 'icon', href: '/images/icon.png' }],
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
        logo: '/images/logo.jpeg',
        author:"Mr.Tsang",
        background: "/images/bg.jpeg",
        nav: [ //导航栏配置
            { text: '首页', link: '/' },
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
                        '/source/guide/theme.html',
                        '/source/guide/preview.html',
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
        },
        footer: {
            // 页脚信息
            createYear: 2023, // 博客创建年份
            currentYear: new Date().getFullYear(), // 当前年份
            // beian: {
            //     link: 'https://beian.miit.gov.cn/#/Integrated/index',
            //     context: '闽ICP备2021005292号-1'
            // },
            // copyrightInfo: 'MIT Licensed | Copyright © 2020-present Vivek',
            // 服务提供商信息，支持html标签
            // TODO: 拼写错误
            // surpport: ` <span>本网站由</span>
            //             <a href="https://www.upyun.com/" target="_blank" rel="noopener noreferrer">
            //                 <img height="30px"
            //                     src="https://cdn.jsdelivr.net/gh/eddievandeer/eddievandeer.github.io/docs/.vuepress/public/assets/img/upyun-logo.png"
            //                     alt="">
            //             </a>
            //             <span>提供 <b>CDN</b> 加速</span>`,
        },
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
    },
    //github的配置
    // repo: 'Mr-Tsang',
    // repoLabel: 'Github',
    // docsDir: 'docs',
    // docsBranch: 'main',
    // editLinks: true,
    // editLinkText: 'Edit this page',
};