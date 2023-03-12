import Layout from '@theme/layouts/Layout.vue'

const install = (Vue, { router }) => {
    const routes = [
        '/categories/:category',
        '/categories/:category/page/:pageNumber',
        '/categories/:category/:child',
        '/categories/:category/:child/page/:pageNumber',
        '/page/:pageNumber',
        '/*/page/:pageNumber',
    ]

    routes.map(item => {
        router.addRoute({
            path: item,
            component: Layout,
            props: true
        })
    })
}

export default {
    install
}