/*
    enhanceApp.js: 应用级别的配置, 使用这个钩子来安装一些附加的 Vue 插件、
                   注册全局组件，或者增加额外的路由钩子
*/
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
export default ({
    Vue, // VuePress 正在使用的 Vue 构造函数
    options, // 附加到根实例的一些选项
    router, // 当前应用的路由实例
    siteData // 站点元数据
}) => {
    Vue.use(Antd);
    Vue.use(ElementUI)
}