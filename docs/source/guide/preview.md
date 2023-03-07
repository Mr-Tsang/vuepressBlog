# 组件预览
[Demo Container](https://calebman.github.io/vuepress-plugin-demo-container/zh/)

[自定义的预览组件效果](../advanced/1.md)

理想的写法：
```vue
::: demo 此处放置代码示例的描述信息，支持 `Markdown` 语法，**描述信息只支持单行**
```html
<template>
	<a-button type="primary">Primary</a-button>
	<a-button type="danger">Danger</a-button>
	<a-config-provider :auto-insert-space-in-button="false">
		<a-button type="primary">按钮</a-button>
	</a-config-provider>
</template>
` ` ` <-这里把`之间的空格删掉
:::
```

**markdown转html原理：** Markdown先经由md-loader处理，然后再交由vue-loader处理。经过这两个loader的处理，Markdown就与Vue组件一样了
![loader](/images/loader.png)


## 实现步骤
- 第一步构建一个`通用组件`用于接收代码块来展示demo并且统一样式（demoBlock.vue）
- 第二步设定一个`Markdown自定义容器`来编写demo代码(markdown-it-container)
- 第三步把自定义容器转化成之前构建的通用组件，这样就可以在md使用自定义容器来实现
- 第四步扩展markdown渲染方法使我们输入的代码块可以输出内容为符合Vue Template语法的代码块
- 第五步变成了vue代码后交由Vuepress的vue-loader处理编译为文档

## 目录结构
``` js
docs
├─ .vuepress
  ├─ components
  │  └─ demoBlock.vue
  ├─ config.js
  ├─ enhanceApp.js
  └─ md-loader
     ├─ common
     │  ├─ render.js
     │  ├─ util.js
     │  └─ containers.js
     └─ index.js
```

Vuepress可以自动识别components里面的组件并注册所以我们在里面建一个通用组件demoBlock用于展示demo

参考了Element的通用组件后观察到这个组件主要由三部分组成：组件示例、描述、组件代码块

## 通用组件简陋版
```vue
<template>
  <div class="demo-block">
    <div class="demo-content">
      <!-- 插入组件 -->
      <slot name="demo"></slot>
    </div>
    <div class="meta" ref="meta">
      <div class="description" v-if="$slots.description">
        <!-- 插入描述信息 -->
        <slot name="description"></slot>
      </div>
      <div class="code-content">
        <!-- 插入代码块 -->
        <slot name="source"></slot>
      </div>
    </div>
    <div class="demo-block-control">
      <!-- 控制代码显示/隐藏 -->
    </div>
  </div>
</template>
```

## 创建自定义容器
对于自定义组件，我们使用[markdown-it-container](https://www.npmjs.com/package/markdown-it-container)

结合：[Element的源码](https://github.com/ElemeFE/element/blob/dev/build/md-loader/containers.js)和
[Demo Container的源码](https://github.com/calebman/vuepress-plugin-demo-container/blob/master/src/common/containers.js)

Element在渲染的时候加入了一个`注释占位符`来接受我们的代码块，再通过编译的时候对这个`注释块`进行处理就可以分别转化到template script 与 style
```js
/* containers.js */
const mdContainer = require('markdown-it-container');
module.exports = md => {
    //将markdown-it-container插件加载到当前的解析器实例中
    md.use(mdContainer, 'demo', {
        validate(params) {
            //函数在开始标记后验证尾部，成功时返回true
            return params.trim().match(/^demo\s*(.*)$/);
        },
        render(tokens, idx) {
            //渲染器函数
            const m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
            if (tokens[idx].nesting === 1) {
                const description = m && m.length > 1 ? m[1] : '';
                const content = tokens[idx + 1].type === 'fence' ? tokens[idx + 1].content : '';
                return `<demo-block>
            <template slot="demo"><!--pre-render-demo:${content}:pre-render-demo--></template>
            ${description ? `<div slot="description">${md.render(description).html}</div>` : ''}
            <template slot="source">
          `;
            }
            return `</template></demo-block>`;
        }
    })
}
```
`markdown-it-container`支持两个参数，第一个是自定义容器的名字，第二个是一些选项
- name：自定义容器的名字
- options：
  - validate：可选，打开标记后验证尾部的功能，成功时应返回`true`
  - render：可选，用于打开/关闭标记的渲染器函数
    - tokens(Array)：token们的列表
    - idx(Number)：用来渲染的token的索引

在`container.js`截取类型为fence的代码块放到占位符中
通过`render.js`对占位符的内容进行处理

## 分别渲染
如何将自定义容器里的内容分别输出到`组件位置`和`代码块位置`，一个典型的组件包括三块：template script 与 style，那么接下来的重点就是如何拼凑出template与script的内容。

参考：[Demo Container - render.js的源码](https://github.com/calebman/vuepress-plugin-demo-container/blob/master/src/common/render.js) 和
[Demo Container - util.js的源码](https://github.com/calebman/vuepress-plugin-demo-container/blob/master/src/common/util.js)

```js
/* render.js*/
const {
    stripScript,
    stripStyle,
    stripTemplate,
    genInlineComponentText
} = require('./util.js');

module.exports = function (content) {
    if (!content) {
        return content
    }
    const startTag = '<!--pre-render-demo:';
    const startTagLen = startTag.length;
    const endTag = ':pre-render-demo-->';
    const endTagLen = endTag.length;

    let componenetsString = ''; // 组件引用代码
    let templateArr = []; // 模板输出内容
    let styleArr = []; // 样式输出内容
    let id = 0; // demo 的 id
    let start = 0; // 字符串开始位置
    let commentStart = content.indexOf(startTag);
    let commentEnd = content.indexOf(endTag, commentStart + startTagLen);
    while (commentStart !== -1 && commentEnd !== -1) {
        templateArr.push(content.slice(start, commentStart));
        const commentContent = content.slice(commentStart + startTagLen, commentEnd);
        const html = stripTemplate(commentContent);
        const script = stripScript(commentContent);
        const style = stripStyle(commentContent);
        const demoComponentContent = genInlineComponentText(html, script); // 示例组件代码内容
        const demoComponentName = `render-demo-${id}`; // 示例代码组件名称
        templateArr.push(`<template><${demoComponentName} /></template>`);
        styleArr.push(style);
        componenetsString += `${JSON.stringify(demoComponentName)}: ${demoComponentContent},`;
        // 重新计算下一次的位置
        id++;
        start = commentEnd + endTagLen;
        commentStart = content.indexOf(startTag, start);
        commentEnd = content.indexOf(endTag, commentStart + startTagLen);
    }
    // 仅允许在 demo 不存在时，才可以在 Markdown 中写 script 标签
    // todo: 优化这段逻辑
    let pageScript = '';
    if (componenetsString) {
        pageScript = `<script>
        export default {
          name: 'component-doc',
          components: {
            ${componenetsString}
          }
        }
      </script>`;
    } else if (content.indexOf('<script>') === 0) { // 硬编码，有待改善
        start = content.indexOf('</script>') + '</script>'.length;
        pageScript = content.slice(0, start);
    }
    // 合并 style 内容
    let styleString = '';
    if (styleArr && styleArr.length > 0) {
        styleString = `<style>${styleArr.join('')}</style>`
    } else {
        styleString = `<style></style>`
    }
    templateArr.push(content.slice(start));
    return {
        template: templateArr.join(''),
        script: pageScript,
        style: styleString
    }
};
```
```js
/* util.js */
const { compileTemplate } = require('@vue/component-compiler-utils');
const compiler = require('vue-template-compiler');

function stripScript(content) {
    const result = content.match(/<(script)>([\s\S]+)<\/\1>/);
    return result && result[2] ? result[2].trim() : '';
}

function stripStyle(content) {
    const result = content.match(/<(style)\s*>([\s\S]+)<\/\1>/);
    return result && result[2] ? result[2].trim() : '';
}

// 编写例子时不一定有 template。所以采取的方案是剔除其他的内容
function stripTemplate(content) {
    content = content.trim();
    if (!content) {
        return content;
    }
    return content.replace(/<(script|style)[\s\S]+<\/\1>/g, '').trim();
}

function pad(source) {
    return source
        .split(/\r?\n/)
        .map(line => `  ${line}`)
        .join('\n');
}

function genInlineComponentText(template, script) {
    const finalOptions = {
        source: `<div>${template}</div>`,
        filename: 'inline-component', // TODO：这里有待调整
        compiler
    };
    const compiled = compileTemplate(finalOptions);
    // tips
    if (compiled.tips && compiled.tips.length) {
        compiled.tips.forEach(tip => {
            console.warn(tip);
        });
    }
    // errors
    if (compiled.errors && compiled.errors.length) {
        console.error(
            `\n  Error compiling template:\n${pad(compiled.source)}\n` +
            compiled.errors.map(e => `  - ${e}`).join('\n') +
            '\n'
        );
    }
    let demoComponentContent = `
    ${compiled.code}
  `;
    // todo: 这里采用了硬编码有待改进
    script = script.trim();
    if (script) {
        script = script.replace(/export\s+default/, 'const democomponentExport =');
    } else {
        script = 'const democomponentExport = {}';
    }
    demoComponentContent = `(function() {
    ${demoComponentContent}
    ${script}
    return {
      render,
      staticRenderFns,
      ...democomponentExport
    }
  })()`;
    return demoComponentContent;
}

module.exports = {
    stripScript,
    stripStyle,
    stripTemplate,
    genInlineComponentText
};
```

## 组装
创建完自定义容器后，我们要组装到vuepress的配置中。
```js
/* config.js */
module.exports = {
  ...
  plugins:[
    [
      require('./md-loader')
    ]
  ]
  ...
}
```
Vuepress自带了`chainMarkdown`来修改内部的markdown配置。利用Vuepress的`extendMarkdown API` 继续拓展其内部的markdown对象，修改内部用于渲染markdown文件的`markdown-it`实例的配置。
```js
/* index.js */
const demoBlockContainers = require('./common/containers');
const renderDemoBlock = require('./common/render');
module.exports = () => {
    return {
        chainMarkdown(config) {
            //修改内部的 markdown 配置
            config // 增加额外的插件markdownContainers
                .plugin('markdownContainers')
                .use(demoBlockContainers)
                .end();
        },
        extendMarkdown: md => {
            //修改内部用于渲染 markdown 文件的 markdown-it实例的配置
            const id = setInterval(() => {
                const render = md.render;
                if (typeof render.call(md, '') === 'object') {
                    md.render = (...args) => {
                        let result = render.call(md, ...args);
                        //分别提取三大块进行拼接
                        const { template, script, style } = renderDemoBlock(result.html);
                        result.html = template;
                        result.dataBlockString = `${script}\n${style}\n${result.dataBlockString}`;
                        return result;
                    }
                    clearInterval(id);
                }
            }, 10);
        }
    }
}
```


总体参考：
[如何使用vuePress编写组间示例上](https://blog.csdn.net/vergil_/article/details/120737111)和
[如何使用vuePress编写组间示例下](https://blog.csdn.net/vergil_/article/details/120820087)