<template>
    <div class="category-container">
        <div class="blog-category">
            <div class="category-tile">
                <h1><i class="fa fa-folder-o" aria-hidden="true"></i>{{ child ? child : category }}</h1>
            </div>
            <el-timeline v-for="(pageItem, pageIndex) in pages" :key="pageIndex">
                <el-timeline-item color="#FFA200">
                    <span class="year-label">{{ pageItem[0] }}年</span>
                </el-timeline-item>
                <el-timeline-item :timestamp="formatTime(valueItem.frontmatter.postTime)" placement="top"
                    v-for="(valueItem, valueIndex) in pageItem[1]" :key="valueIndex" :color="color[valueIndex]">
                    <el-card>
                        <a :href="valueItem.regularPath" @click.prevent="$router.push(valueItem.regularPath)">
                            <span>{{ valueItem.title }}</span>
                        </a>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>
        <div class="pagination-wrap">
            <el-pagination layout="prev, pager, next" :page-size="pageSize" :current-page="Number(pageNumber)"
                @current-change="handlePageChange" :total="total" background></el-pagination>
        </div>
    </div>
</template>

<script>
import BlogArticles from './BlogArticles.vue'

export default {
    components: {
        BlogArticles
    },
    props: [
        'category',
        'child',
        'pageNumber'
    ],
    data() {
        return {
            pages: new Map(),
            pageSize: 6,
            total: 0,
            color: [
                "#009BFF",
                "#5DB6C0",
                "#F0C431",
                "#8F6ACC",
                "#E763AE",
                "#E9BDF3",
            ]
        }
    },
    methods: {
        setPage(pageNumber) {
            let start = (pageNumber - 1) * this.pageSize
            let end = pageNumber * this.pageSize

            const filted = this.child ?
                this.$categories.get(this.category).children.get(this.child).pages :
                this.$categories.get(this.category).pages

            this.total = filted.length

            this.pages.clear()

            for (let i = start; i < end; i++) {
                if (filted[i] == undefined) break
                const postYear = filted[i].frontmatter.postTime.slice(0, 4)

                if (this.pages.has(postYear)) {
                    this.pages.get(postYear).push(filted[i])
                } else {
                    this.pages.set(postYear, [filted[i]])
                }
            }
        },
        handlePageChange(pageNumber) {
            this.setPage(pageNumber)
            this.$router.push({
                path: `/categories/${this.category}${this.child ? '/' + this.child : ''}/page/${pageNumber}`
            })
        },
        formatTime(time) {
            let date = new Date(time);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            return `${month}月${day}日`
        }
    },
    beforeMount() {
        this.setPage(this.pageNumber ? parseInt(this.pageNumber) : 1)
        document.title = this.child ? this.child : this.category
    },
    watch: {
        $route(to, from) {
            if (to.path !== from.path) {
                this.setPage(parseInt(this.pageNumber))
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../styles/values.scss';

.category-container {
    flex: 1;
    min-height: 100vh;
    @extend .flex-column;
    background-color: #fbfbfb;
    justify-content: space-between;
    padding-top: 5rem;

    .page-controller {
        background-color: #fbfbfb;
    }

    .blog-category {
        min-width: 30%;
        flex: 1;
        padding: 0 2rem;
        box-sizing: border-box;
        @extend .flex-column;
        justify-content: flex-start;

        .category-tile {
            width: fit-content;

            i {
                margin-right: .6rem;
            }
        }

        :deep(.el-card__body) {
            width: 30rem;
            padding: 10px 20px;
            line-height: 25px;
        }

        .year-label {
            font-size: 2.5rem;
        }
    }
}

@media screen and (max-width: 768px) {
    .blog-category {
        width: 100%;
    }

    :deep(.el-card__body) {
        width: 15rem !important;
    }
}
</style>