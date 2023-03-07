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