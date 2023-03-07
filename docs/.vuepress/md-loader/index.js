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