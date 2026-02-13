<template>
  <div class="container">
    <div class="screen" ref="screenRef">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map" />
          <Line class="line" />
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Counter class="counter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Top from './components/top/index.vue'
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Counter from './components/counter/index.vue'

// 不同浏览器尺寸解决方案
const screenRef = ref()

const getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}
onMounted(() => {
  screenRef.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})
window.onresize = () => screenRef.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  width: 100vw;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;

  .screen {
    width: 1920px;
    height: 1080px;
    transform-origin: left top;
    position: fixed;
    left: 50%;
    top: 50%;
    
    // 顶部
    .top {
      width: 100%;
      height: 40px;
    }

    // 底部
    .bottom {
      width: 100%;
      height: 1040px;
      display: flex;

      .left {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 30px;

        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }

      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        margin: 0 50px;
        .map {
          flex: 4;
        }

        .line {
          flex:1.5
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;

        .rank {
          flex: 1.2;
        }

        .year {
          flex: 1;
        }

        .counter {
          flex: 1;
        }
      }
    }
  }
}
</style>