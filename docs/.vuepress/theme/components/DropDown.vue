<template>
      <div class="drop-container">
            <div class="down" @click="dropDown">
                  <i class="fa fa-angle-down" aria-hidden="true"></i>
            </div>
      </div>
</template>

<script>
export default {
      name: 'DropDown',
      methods: {
            dropDown() {
                  let header = document.querySelector('.navbar')
                  const main = document.querySelector('.blog-home-background')
                  const homeWrap = document.querySelector(".home-wrap");
                  header.classList.remove('hide');
                  homeWrap.classList.remove('home-nav');    
                  window.scrollTo(0, main.clientHeight - header.clientHeight)
            }
      }
}
</script>

<style lang="scss" scoped>
@import '../styles/values.scss';

.drop-container {
      width: 100%;
      height: 80px;
      position: absolute;
      bottom: 80px;
      display: flex;
      justify-content: center;
      align-items: center;
}

.down {
      font-size: 45px;
      animation: anima 1.5s cubic-bezier(0.6, 0.04, 0.52, 1.01) infinite;
      cursor: pointer;

      i {
            color: $primary-background;
      }
}

@keyframes anima {
      0% {
            transform: translateY(0px);
      }

      60% {
            transform: translateY(30px);
      }

      100% {
            transform: translateY(0px);
      }
}
</style>