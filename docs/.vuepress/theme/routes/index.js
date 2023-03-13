import Layout from '@theme/layouts/Layout.vue'

const install = (Vue, { router }) => {
    const routes = [
        {
            url:'/categories/:category/:pageNumber?',
            name:"category_home"
        },
        {
            url:'/page/:pageNumber',
            name:"home_page",
        },
    ]

    routes.map(item => {
        router.addRoute({
            path: item.url,
            component: Layout,
            name:item.name,
        })
    })
    router.addRoute({
        path: '/:catchAll(.*)',
        props: true,
        component: () => import('../layouts/404.vue')
    })
}

export default {
    install
}