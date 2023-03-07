# 主题
想要书写一个主题，首先在你文档根目录创建一个 `.vuepress/theme` 目录，接着创建一个 `Layout.vue` 文件：

```js
docs
└─ .vuepress
   └─ theme
       └─ Layout.vue
```

到这里，就像开发一个普通的 Vue 应用一样。如何组织你的主题，这完全取决于你。
## 自定义主题
### 目录结构
随着需求的变化，只有一个布局组件 Layout.vue 可能还不够，你可能想要定义更多的布局组件用于不同的页面，甚至应用一些插件。

一个约定的主题的目录结构如下：
![theme](/images/theme.png)
- `theme/global-components`: 该目录下的组件都会被自动注册为全局组件。
- `theme/components`: Vue 组件。
- `theme/layouts`: 布局组件，其中  `Layout.vue` 是必需的。
- `theme/styles`: 全局的样式和调色板。
- `theme/templates`: 修改默认的模板文件。
- `theme/index.js`: 主题文件的入口文件。
- `theme/enhanceApp.js`: 主题水平的客户端增强文件。

## 主题的继承
两个基本概念：
- **原子主题**：即父主题，类似默认主题这种完全从头实现的主题。
- **派生主题**：即子主题，基于父主题创建的主题；
### 使用
```js
// .vuepress/theme/index.js
module.exports = {
  extend: '@vuepress/theme-default'
}
```
### 继承策略
父主题的所有能力都会"传递"给子主题，对于文件级别的约定，子主题可以通过**在同样的位置创建同名文件来覆盖它**；对于某些主题配置选项，如 globalLayout，子主题也可以通过同名配置来覆盖它。

文件级别的约定如下：
- **全局组件**，即放置在 `theme/global-components` 中的 Vue 组件。
- **组件**，即放置在 `theme/components` 中的 Vue 组件。
- **全局的样式和调色板**，即放置在 `theme/styles` 中的 `index.styl` 和 `palette.styl`。
- **HTML 模板**，即放置在 `theme/templates` 中的 `dev.html` 和 `ssr.html`。
- **主题水平的客户端增强文件**，即 `theme/enhanceApp.js`
