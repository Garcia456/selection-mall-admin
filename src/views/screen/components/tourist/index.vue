<template>
  <div class="tourist-box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="count">可预约总量 <span>99999</span> 人</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="chartsRef"></div>
  </div>
  
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import 'echarts-liquidfill'

const people = ref('215908人')
const chartsRef = ref()

// 水球图
onMounted(() => {
  const chart = echarts.init(chartsRef.value)
  const option = {
    series: [{
        type: 'liquidFill',
        radius: '70%',
        center: ['50%', '50%'],
        // 水波数据：可以设置多层波浪，值在 0-1 之间
        data: [0.52, 0.48], 
        color: [
            {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                    { offset: 0, color: '#44e6c1' }, // 浅青色
                    { offset: 1, color: '#2b90d9' }  // 蓝色渐变
                ]
            }
        ],
        // 背景样式：即球体内未被水填满的部分
        backgroundStyle: {
            borderWidth: 1,
            color: 'rgba(255, 255, 255, 0.1)'
        },
        // 轮廓样式：即最外层的实线圈
        outline: {
            show: true,
            borderDistance: 8, // 轮廓与水球的距离
            itemStyle: {
                borderWidth: 1,
                borderColor: '#44e6c1',
            }
        },
        // 图形样式：控制波浪
        itemStyle: {
            opacity: 0.6,
            shadowBlur: 0
        },
        label: {
            formatter: '预约量',
            fontSize: 12,
            color: '#fff',
            insideColor: '#fff', // 波浪覆盖文字时的颜色
        },
        // 振幅与动画
        amplitude: 8, 
        waveAnimation: true
    }, {
        // 额外图层：实现最外圈的虚线效果
        type: 'pie',
        radius: ['82%', '83%'], // 比水球稍微大一点
        center: ['50%', '50%'],
        silent: true,
        labelLine: { show: false },
        data: [{
            value: 1,
            itemStyle: {
                color: 'transparent',
                borderWidth: 2,
                borderColor: '#44e6c1',
                borderType: 'dashed' // 开启虚线
            }
        }]
    }]
};
  chart.setOption(option)
})

</script>
<style scoped lang="scss">
.tourist-box {
  background: url('../../images/dataScreen-main-lt.png') no-repeat;
  background-size: 100% 100%;
  width: 391px;
  height: 321px;
  margin-top: 10px;

  .top {
    .title {
      color: white;
      margin-top: 6px;
      font-size: 18px;
    }

    .bg {
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      width: 68px;
      height: 7px;
      position: relative;
      top: 50%;
      left: -27%;
      margin-top: 15px;
    }

    .count {
      float: right;
      color: white;
      position: relative;
      top: 80%;
      left: 10%;

      span {
        color: yellowgreen;
        font-size: 18px;
      }
    }
  }

  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px;

    span {
      flex: 1;
      height: 50px;
      text-align: center;
      line-height: 50px;
      background: url('../../images/total.png') no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 24px;
    }
  }

  .charts {
    height: 190px;
    width: 100%;
    position: relative;
  }
}
</style>