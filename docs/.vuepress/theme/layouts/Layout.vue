<template>
    <div class="theme-container" :class="pageClasses" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <!-- 头部导航栏 -->
        <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />

        <!-- mobile-侧边栏遮罩层，点击，侧边栏隐藏 -->
        <div class="sidebar-mask" @click="toggleSidebar(false)" />
        <!-- 侧边栏 -->
        <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
            <template #top>
                <slot name="sidebar-top" />
            </template>
            <template #bottom>
                <slot name="sidebar-bottom" />
            </template>
        </Sidebar>

        <!-- 首页 -->
        <Home v-if="$page.frontmatter.home" />

        <!-- 特殊页 -->
        <template v-else-if="specialPage()">
            <blog-category v-if="$route.params.category" :category="$route.params.category" :child="$route.params.child"
                :pageNumber="$route.params.pageNumber || 1"></blog-category>
            <blog-articles v-else :pageNumber="$route.params.pageNumber || 1" :filted="$listPages"
                :path="`${this.$route.path.split('/')[1]}${this.$route.path.split('/')[1] !== 'page' ? '/' + this.$route.path.split('/')[2] : ''}`"></blog-articles>
        </template>

        <!-- 文章页 -->
        <Page v-else :sidebar-items="sidebarItems">
            <template #top>
                <slot name="page-top" />
            </template>
            <template #bottom>
                <slot name="page-bottom" />
            </template>
        </Page>
    </div>
</template>

<script>
// 自定义主题
import Home from "@theme/components/Home.vue";
import Navbar from "@theme/components/Navbar.vue";
import Page from "@theme/components/Page.vue";
import Sidebar from "@theme/components/Sidebar.vue";
import BlogArticles from "@theme/components/BlogArticles.vue";
import BlogCategory from "@theme/components/Category";
import { resolveSidebarItems } from "../util";

export default {
    name: "Layout",

    components: {
        Home,
        Page,
        Sidebar,
        Navbar,
        BlogArticles,
        BlogCategory,
    },

    data() {
        return {
            isSidebarOpen: false
        };
    },

    computed: {
        shouldShowNavbar() {
            const { themeConfig } = this.$site;
            const { frontmatter } = this.$page;
            if (frontmatter.navbar === false || themeConfig.navbar === false) {
                return false;
            }
            return (
                this.$title ||
                themeConfig.logo ||
                themeConfig.repo ||
                themeConfig.nav ||
                this.$themeLocaleConfig.nav
            );
        },

        shouldShowSidebar() {
            const { frontmatter } = this.$page;
            return (
                !frontmatter.home &&
                frontmatter.sidebar !== false &&
                this.sidebarItems.length
            );
        },

        sidebarItems() {
            return resolveSidebarItems(
                this.$page,
                this.$page.regularPath,
                this.$site,
                this.$localePath
            );
        },

        pageClasses() {
            const userPageClass = this.$page.frontmatter.pageClass;
            return [
                {
                    "no-navbar": !this.shouldShowNavbar,
                    "sidebar-open": this.isSidebarOpen,
                    "no-sidebar": !this.shouldShowSidebar
                },
                userPageClass
            ];
        }
    },

    mounted() {
        this.$router.afterEach(() => {
            this.isSidebarOpen = false;
        });
        console.log(this.$page.frontmatter);
    },

    methods: {
        specialPage() {
            return Object.getOwnPropertyNames(this.$page.frontmatter).length === 0;
        },

        toggleSidebar(to) {
            this.isSidebarOpen =
                typeof to === "boolean" ? to : !this.isSidebarOpen;
            this.$emit("toggle-sidebar", this.isSidebarOpen);
        },

        // side swipe
        onTouchStart(e) {
            this.touchStart = {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY
            };
        },

        onTouchEnd(e) {
            const dx = e.changedTouches[0].clientX - this.touchStart.x;
            const dy = e.changedTouches[0].clientY - this.touchStart.y;
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
                if (dx > 0 && this.touchStart.x <= 80) {
                    this.toggleSidebar(true);
                } else {
                    this.toggleSidebar(false);
                }
            }
        }
    }
};
</script>
