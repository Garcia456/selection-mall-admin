<template>
  <div class="title-box">
    <span class="title">景 区 实 时 客 流 量</span>
  </div>
  <div class="map-box" ref="chartsRef"></div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts'
import ChinaJSON from './json/china.json'

echarts.registerMap('China', ChinaJSON as any)
const chartsRef = ref()
onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  mycharts.setOption({
    geo: {
      map: 'China',
      roam: true,
      aspectScale: 1.1,
      label: {
        show: true,
        color: '#fff',
      },
      itemStyle: {
        // 1. 设置区域的渐变底色
        areaColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#102d6b' // 顶部：较浅的深蓝色
          }, {
            offset: 1, color: '#07153a' // 底部：更深邃的藏青色
          }],
          global: false
        },
        // 2. 描边颜色：建议使用带有透明度的淡蓝色，制造“发光”的质感
        borderColor: 'rgba(80, 150, 250, 0.8)',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, 0.5)', // 增加阴影让地图更有立体感
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 5
      },
      // 3. 鼠标悬浮时的样式
      emphasis: {
        itemStyle: {
          areaColor: '#1a4099', // 悬浮时稍亮一点，增加交互感
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          color: '#fff'
        }
      }
    },

    series: [
      {
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [104.065735, 30.659462]  // 终点
            ],
            lineStyle: {
              color: '#fff',
              width: 1,
              curveness: -0.3
            }
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [113.280637, 23.125178]  // 终点
            ],
            lineStyle: {
              color: '#fff',
              width: 1,
              curveness: -0.3
            }
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [121.472644, 31.231706]  // 终点
            ],
            lineStyle: {
              color: '#fff',
              width: 1,
              curveness: -0.3
            }
          },
          {
            coords: [
              [104.065735, 30.659462], // 起点
              [85.294711, 41.371801]  // 终点
            ],
            lineStyle: {
              color: '#fff',
              width: 1,
              curveness: -0.3
            }
          },
          {
            coords: [
              [85.294711, 41.371801], // 起点
              [104.065735, 30.659462]  // 终点
            ],
            lineStyle: {
              color: '#fff',
              width: 0.5,
              curveness: -0.3
            }
          },
          {
            coords: [
              [104.065735, 30.659462], // 起点
              [116.405285, 39.904989] // 终点
            ],
            lineStyle: {
              color: '#fff',
              width: 0.5,
              curveness: -0.3
            }
          },
        ],
        //开启动画特效
        effect: {
          show: true,
          symbol: 'arrow',
          symbolSize: 10,
          color: 'white',
        },
      }
    ]
  })
})

</script>
<style scoped lang="scss">
.title-box {
  background: url(../../images/map-title-bg.png) no-repeat;
  background-size: 100% 100%;
  width: 260px;
  height: 35px;
  position: relative;
  left: -80px;
  top: 100px;
  line-height: 35px;

  .title {
    color: #fff;
    position: relative;
    left: 35px;
  }
}

.map-box {
  width: 100%;
  height: 100%;
}
</style>