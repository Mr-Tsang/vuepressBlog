<template>
    <div class="home-page" ref="main">
        <div class="blog-home-background" :style="{ 'background-image': `url('${$themeConfig.background}')` }"></div>
        <div class="blog-home">
            <div class="home-content">
                <div class="blog-description">
                    <h1>{{ $page.frontmatter.heroText }}</h1>
                    <p>“忘记”是人类学习最大的敌人之一，而“积累”，恰恰是解决掉这一敌人最好的方法。</p>
                </div>
            </div>
            <drop-down></drop-down>
            <div class="cloud">
                <svg class="waves" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
                            fill="white"></path>
                    </defs>
                    <g class="parallax">
                        <use xlink:href="#gentle-wave" x="48" y="0" opacity="0.7">
                            <path id="gentle-wave"
                                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" fill="white">
                            </path>
                        </use>
                        <use xlink:href="#gentle-wave" x="48" y="3" opacity="0.5">
                            <path id="gentle-wave"
                                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" fill="white">
                            </path>
                        </use>
                        <use xlink:href="#gentle-wave" x="48" y="5" opacity="0.3">
                            <path id="gentle-wave"
                                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" fill="white">
                            </path>
                        </use>
                        <use xlink:href="#gentle-wave" x="48" y="7">
                            <path id="gentle-wave"
                                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" fill="white">
                            </path>
                        </use>
                    </g>
                </svg>
            </div>
        </div>
        <div class="blog-articles">
            <blog-articles :pageNumber="pageNumber" :filted="$sortedPages" path="page"></blog-articles>
        </div>
        
        <blog-footer></blog-footer>
    </div>
</template>
  
<script>
import BlogArticles from "@theme/components/BlogArticles";
import DropDown from "@theme/components/DropDown";

export default {
    name: 'Home',

    components: { BlogArticles, DropDown },

    props: ["pageNumber"],
    data() {
        return {
            main: null,
            scrollOffset: 0,
            mouseEvent: "",
            inSlides: true,
            interval: null,
            slidesLock: false,
            blogHome:null,
            navbar:null,
            homeWrap:null,
        };
    },
    computed: {
        data() {
            return this.$page.frontmatter
        },
    },
    methods: {
        bindEvent() {
            this.main = this.$refs.main;
            this.mouseEvent =
                document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll";
            if (this.mouseEvent == "mousewheel") {
                this.main.addEventListener(
                    "mousewheel",
                    (e) => {
                        let y = -0.83 * e.wheelDelta;
                        this.onMouseWheel(e, y);
                    },
                    false
                );
            } else if (this.mouseEvent == "DOMMouseScroll") {
                this.main.addEventListener(
                    "DOMMouseScroll",
                    (e) => {
                        this.onMouseWheel(e, e.detail);
                    },
                    false
                );
                this.main.addEventListener(
                    "MozMousePixelScroll",
                    (e) => {
                        this.onMouseWheel(e, e.detail);
                    },
                    false
                );
            } else {
                this.main.addEventListener(
                    this.mouseEvent,
                    (e) => {
                        let y = e.deltaY;
                        if (e.deltaMode == 1) {
                            y = e.deltaY * 32;
                        }
                        this.onMouseWheel(e, y);
                    },
                    false
                );
            }
        },
        onMouseWheel(e, deltaY) {
            let event = e || window.event;
            let offset = this.main.getBoundingClientRect().top;

            if (!this.ifInSlide(deltaY, offset)) return;

            this.scrollOffset =
                document.documentElement.scrollTop || document.body.scrollTop;

            // if (event.preventDefault) {
            //   event.preventDefault();
            //   event.stopPropagation();
            // } else if (document.all) {
            //   event.cancelBubble = true;
            //   event.returnValue = false;
            // } else {
            //   event.stopPropagation();
            // }

            if (
                (window.location.pathname != "/" || this.slidesLock) &&
                window.location.pathname.split("/")[1] != "page"
            )
                return;

            // this.slidesLock = true;

            this.doScroll(deltaY);
        },
        doScroll(deltaY) {
            let header = document.querySelector(".navbar");
            let home = document.querySelector(".blog-home");
            if (deltaY > 0) {
                // window.scrollTo(0, home.scrollHeight);
                header.classList.remove("hide");
            } else {
                // window.scrollTo(0, 0);
                header.classList.add("hide");
            }
            // this.interval = setTimeout(() => {
            //   this.slidesLock = false;
            // }, 500);
        },
        ifInSlide(deltaY, offset) {
            let home = document.querySelector(".blog-home");
            return deltaY > 0
                ? -offset < home.offsetHeight - 1
                : -offset <= home.scrollHeight + 80;
        },
        mobileScroll() {
            if (window.location.pathname != "/") {
                return;
            }
            let container = document.querySelector('.home-page')
            let header = document.querySelector(".navbar");
            let home = document.querySelector(".blog-home");
            let scrolled = container.scrollTop

            if (scrolled <= home.scrollHeight - 120) {
                header.classList.add("hide");
            } else {
                header.classList.remove("hide");
            }
            return false;
        },
        hideHeader() {
            if (this.$route.path === '/') {
                const header = document.querySelector(".navbar");
                header.classList.add("hide");
            }
        },
        onScroll(){
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop - 3 >= this.blogHome.offsetHeight - this.navbar.offsetHeight){
                this.homeWrap.classList.remove("home-nav");
            } else {
                this.homeWrap.classList.add("home-nav");
            }
        },
    },
    mounted() {
        let top = document.querySelector(".global-ui");
        top.addEventListener("click", this.hideHeader);

        this.blogHome = document.querySelector(".blog-home-background");
        this.navbar = document.querySelector(".navbar");
        this.homeWrap = document.querySelector(".home-wrap");

        this.$nextTick(() => {
            let main = this.$refs.main;
            main.addEventListener("touchmove", this.mobileScroll, false);
            main.addEventListener("mousewheel", this.onScroll, false);
            this.bindEvent();
        });
    },
}
</script>
  
<style lang="scss" scoped>
@import "../styles/values.scss";

.blog-home-background {
    content: "";
    width: 100%;
    height: 100vh;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center top;
    filter: brightness(80%);
    position: absolute;
    top: 0;
    left: 0;
}

.blog-home {
    @extend .flex;
    width: 100%;
    height: $container-height;
    position: relative;
}

.home-content {
    @extend .flex-column;
}

.blog-description {
    @extend .flex-column;
    margin-top: 150px;

    h1 {
        font-size: 46px;
        color: rgb(148, 188, 218);
    }

    p {
        color: rgb(209, 209, 209);
        text-align: center;
        line-height: 26px;
    }
}

.blog-articles {
    margin-top: 5rem;
}

@media screen and (max-width: 768px) {
    .home-page {
        width: 100vw;
        height: $container-height;
        // overflow: scroll;
        scroll-snap-type: y mandatory;
        scroll-padding: 60px;

        &::-webkit-scrollbar {
            width: 0;
            height: 0;
        }
    }

    .blog-home,
    .blog-articles {
        scroll-snap-align: start;
    }

    .blog-description {
        margin-top: 80px !important;

        p {
            width: 80%;
        }
    }
}

@media screen and (max-width: 320px) {
    .blog-description h1 {
        font-size: 40px;
    }
}

.cloud {
    display: flex;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: $cloud-z-index;
    box-sizing: border-box;
    mix-blend-mode: overlay;

    .waves {
        display: flex;
        position: relative;
        width: 100%;
        height: 100px;

        @media (max-width: 768px) {
            height: 40px;
        }
    }

    .parallax {
        >use {
            animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
        }

        >use:nth-child(1) {
            animation-delay: -2s;
            animation-duration: 7s;
        }

        >use:nth-child(2) {
            animation-delay: -3s;
            animation-duration: 10s;
        }

        >use:nth-child(3) {
            animation-delay: -4s;
            animation-duration: 13s;
        }

        >use:nth-child(4) {
            animation-delay: -5s;
            animation-duration: 20s;
        }
    }
}

@keyframes move-forever {
    0% {
        transform: translate3d(-90px, 0, 0);
    }

    100% {
        transform: translate3d(85px, 0, 0);
    }
}
</style>
  