<template>
  <div
    class="demo-block"
    :class="[blockClass, { 'hover': hovering }]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
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
    <div
      class="demo-block-control"
      :class="{ 'is-fixed': fixedControl }"
      :style="{ 'width': fixedControl ? `${codeContentWidth}px` : 'unset' }"
      ref="control"
      @click="isExpanded = !isExpanded"
    >
      <transition name="arrow-slide">
        <i :class="[iconClass, { 'hovering': hovering }, 'icon']"></i>
      </transition>
      <transition name="text-slide">
        <span v-show="hovering">{{ controlText }}</span>
      </transition>
      <span
        v-show="!copied"
        :class="['copy-action', { 'copying ': copied }]"
        @click.stop="copyCode"
      >{{ copiedText }}</span>
      <transition name="bounce">
        <span v-show="copied" class="copy-action copy-action-success">{{ copiedText }}</span>
      </transition>
    </div>
  </div>
</template>
<script>
import defaultLang from "../public/default_lang.json";
export default {
  data() {
    return {
      hovering: false,
      copied: false,
      isExpanded: false,
      fixedControl: false,
      codeContentWidth: 0,
      scrollParent: null
    };
  },
  props: {
    options: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    compoLang() {
      return this.options.locales || defaultLang;
    },
    langConfig() {
      // 中文 or 英文
      return this.compoLang.filter(config => config.lang === this.$lang)[0][
        "demo-block"
      ];
    },
    blockClass() {
      // class设置
      return `demo-${this.$lang} demo-${this.$router.currentRoute.path
        .split("/")
        .pop()}`;
    },
    iconClass() {
      // 显示代码/隐藏代码图标
      return this.isExpanded ? "caret-top" : "caret-bottom";
    },
    controlText() {
      // 显示代码/隐藏代码提示信息
      return this.isExpanded
        ? this.langConfig["hide-text"]
        : this.langConfig["show-text"];
    },
    copiedText() {
      // 复制/复制成功提示信息
      return this.copied
        ? this.langConfig["copy-success"]
        : this.langConfig["copy-text"];
    },
    codeArea() {
      //折叠代码范围
      return this.$el.getElementsByClassName("meta")[0];
    },
    codeAreaHeight() {
      //折叠代码的高度
      if (this.$el.getElementsByClassName("description").length > 0) {
        return (
          this.$el.getElementsByClassName("description")[0].clientHeight +
          this.$el.getElementsByClassName("code-content")[0].clientHeight +
          20
        );
      }
      return this.$el.getElementsByClassName("code-content")[0].clientHeight;
    }
  },
  methods: {
    copyCode() {
      if (this.copied) {
        return;
      }
      // contenteditable 属性指定元素内容是否可编辑
      const pre = this.$el.querySelectorAll("pre")[0];
      pre.setAttribute("contenteditable", "true");
      pre.focus();
      /*
        当一个HTML文档切换到设计模式时，document暴露 execCommand 方法，
        该方法允许运行命令来操纵可编辑内容区域的元素。
      */
      document.execCommand("selectAll", false, null);
      this.copied = document.execCommand("copy");
      pre.removeAttribute("contenteditable");
      setTimeout(() => {
        this.copied = false;
      }, 1500);
    },
    scrollHandler() {
      // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置
      const { top, bottom, left } = this.$refs.meta.getBoundingClientRect();
      this.fixedControl =
        bottom > document.documentElement.clientHeight &&
        top + 44 <= document.documentElement.clientHeight;
      this.$refs.control.style.left = this.fixedControl ? `${left}px` : "0";
    },
    removeScrollHandler() {
      this.scrollParent &&
        this.scrollParent.removeEventListener("scroll", this.scrollHandler);
    }
  },
  watch: {
    isExpanded(val) {
      this.codeArea.style.height = val ? `${this.codeAreaHeight + 1}px` : "0";
      if (!val) {
        this.fixedControl = false;
        this.$refs.control.style.left = "0";
        this.removeScrollHandler();
        return;
      }
      setTimeout(() => {
        this.scrollParent = document;
        this.scrollParent &&
          this.scrollParent.addEventListener("scroll", this.scrollHandler);
        this.scrollHandler();
      }, 200);
    }
  },
  mounted() {
    this.$nextTick(() => {
      let codeContent = this.$el.getElementsByClassName("code-content")[0];
      this.codeContentWidth = this.$el.offsetWidth;
      if (this.$el.getElementsByClassName("description").length === 0) {
        codeContent.style.width = "100%";
        codeContent.borderRight = "none";
      }
    });
  },
  beforeDestroy() {
    this.removeScrollHandler();
  }
};
</script>
<style scope>
.demo-block {
  border: solid 1px #ebebeb;
  border-radius: 3px;
  transition: 0.2s;
  margin-top: 15px;
  margin-bottom: 15px;
}
.demo-block.hover {
  box-shadow: 0 0 8px 0 rgba(232, 237, 250, 0.6),
    0 2px 4px 0 rgba(232, 237, 250, 0.5);
}
.demo-block code {
  font-family: Menlo, Monaco, Consolas, Courier, monospace;
}
.demo-block .demo-button {
  float: right;
}
.demo-block .demo-content {
  padding: 24px;
}
.demo-block .meta {
  background-color: #fafafa;
  border-top: 1px solid #eaeefb;
  overflow: hidden;
  height: 0;
  transition: height 0.2s;
}
.demo-block .description {
  padding: 20px;
  box-sizing: border-box;
  border: solid 1px #ebebeb;
  border-radius: 3px;
  font-size: 14px;
  line-height: 22px;
  color: #666;
  word-break: break-word;
  margin: 10px;
  background-color: #fff;
}
.demo-block .demo-block-control {
  border-top: solid 1px #eaeefb;
  height: 44px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  text-align: center;
  margin-top: -1px;
  color: #d3dce6;
  cursor: pointer;
  position: relative;
}
.demo-block .demo-block-control.is-fixed {
  position: fixed;
  bottom: 0;
  width: 660px;
  z-index: 999;
}
.demo-block .demo-block-control .icon {
  font-family: element-icons !important;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}
.demo-block .demo-block-control .caret-top::before {
  content: "";
  position: absolute;
  right: 50%;
  width: 0;
  height: 0;
  border-bottom: 6px solid #ccc;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
}
.demo-block .demo-block-control .caret-bottom::before {
  content: "";
  position: absolute;
  right: 50%;
  width: 0;
  height: 0;
  border-top: 6px solid #ccc;
  border-right: 6px solid transparent;
  border-left: 6px solid transparent;
}
.demo-block .demo-block-control i {
  font-size: 16px;
  line-height: 44px;
  transition: 0.3s;
}
.demo-block .demo-block-control i.hovering {
  transform: translateX(-40px);
}
.demo-block .demo-block-control > span {
  position: absolute;
  transform: translateX(-30px);
  font-size: 14px;
  line-height: 44px;
  transition: 0.3s;
  display: inline-block;
}
.demo-block .demo-block-control .copy-action {
  right: 0px;
  color: #409eff;
}
.demo-block .demo-block-control.copying {
  transform: translateX(-44px);
}
.demo-block .demo-block-control .copy-action-success {
  color: #f5222d;
}
.demo-block .demo-block-control:hover {
  color: #409eff;
  background-color: #f9fafc;
}
.demo-block .demo-block-control .text-slide-enter,
.demo-block .demo-block-control .text-slide-leave-active {
  opacity: 0;
  transform: translateX(10px);
}
.demo-block .demo-block-control .bounce-enter-active {
  animation: bounce-in 0.5s;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.demo-block .demo-block-control .control-button {
  line-height: 26px;
  position: absolute;
  top: 0;
  right: 0;
  font-size: 14px;
  padding-left: 5px;
  padding-right: 25px;
}

/* 代码样式 */
div[class*="language-"] {
  background-color: #fafafa;
}
.token.tag,
.token.attr-name,
.token.namespace,
.token.deleted,
.token.punctuation,
.token.keyword,
.token.selector,
.token.important,
.token.atrule,
.token.builtin {
  color: #3182bd;
}
.token.string,
.token.char,
.token.attr-value,
.token.regex,
.token.variable {
  color: #756bb1;
}
.theme-default-content pre code,
.theme-default-content pre[class*="language-"] code {
  color: #000;
  font-family: Menlo, Monaco, Consolas, Courier, monospace;
}
.token.function,
.token.operator,
.token.entity,
.token.url,
.token.language-javascript .token.punctuation,
.token.language-css .token.punctuation {
  color: #000;
}
.theme-default-content pre,
.theme-default-content pre[class*="language-"] {
  line-height: 1.8;
  font-size: 12px;
}
.token.boolean,
.token.number,
.token.language-css {
  color: #31a354;
}
.token.property,
.token.class-name,
.token.constant,
.token.symbol {
  color: #e6550d;
}
</style>