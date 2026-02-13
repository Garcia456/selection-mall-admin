<template>
  <div class="counter-box">
    <div class="top">
      <p class="title">预约渠道数据统计</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue';
const chartsRef = ref()
onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  mycharts.setOption({
    color: ['#409eff', '#e6a23c', '#a181fc', '#f56c6c'], // 对应图中四种颜色
    legend: {
      icon: 'circle',
      orient: 'vertical',
      left: '2%',
      top: 'center',
      itemGap: 20,
      textStyle: { color: '#fff', fontSize: 14 },
      formatter: (name: string) => {
        // 模拟图中：名称 --- 百分比 的格式
        const data = [
          { name: '智慧文旅平台', value: '40%' },
          { name: '携程', value: '10%' },
          { name: '飞猪', value: '20%' },
          { name: '其他渠道', value: '30%' }
        ];
        const target = data.find(item => item.name === name);
        return `${name} --- ${target!.value}`;
      }
    },
    series: [
      // 1. 核心数据环
      {
        type: 'pie',
        radius: ['35%', '55%'],
        center: ['70%', '50%'],
        label: { show: false },
        padAngle: 6,
        data: [
          { value: 40, name: '智慧文旅平台' },
          { value: 10, name: '携程' },
          { value: 20, name: '飞猪' },
          { value: 30, name: '其他渠道' }
        ],
        itemStyle: {
          borderRadius: 0,
          borderColor: '#050d24',
          borderWidth: 2
        }
      },
      // 2. 内层装饰点状环
      {
        type: 'pie',
        radius: ['27%', '28%'],
        center: ['70%', '50%'],
        silent: true, // 不响应鼠标事件
        label: { show: false },
        itemStyle: {
          color: 'transparent',
          borderColor: 'rgba(64, 158, 255, 0.5)',
          borderType: 'dashed',
          borderWidth: 1
        },
        data: [{ value: 1 }]
      },
      // 3. 最外层装饰轨道
      {
        type: 'gauge',
        radius: '65%',
        center: ['70%', '50%'],
        startAngle: 210,
        endAngle: -149.9,
        axisLine: {
          lineStyle: {
            width: 2,
            color: [
              [1 / 6, 'rgba(64, 158, 255, 0.8)'],
              [2 / 6, 'rgba(0,0,0,0)'],
              [3 / 6, 'rgba(64, 158, 255, 0.8)'],
              [4 / 6, 'rgba(0,0,0,0)'],
              [5 / 6, 'rgba(64, 158, 255, 0.8)'],
              [1, 'rgba(0,0,0,0)']
            ]
          }
        },
        pointer: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: { show: false }
      } 
    ],
    // 4. 中心图标
    graphic: {
      elements: [{
        type: 'image',
        style: {
          image: 'data:image/svg+xml;utf8,<svg t="1770208776535" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5976" width="200" height="200"><path d="M375.072 115.36l13.856 28.832a32 32 0 0 1-15.04 42.688l-14.432 6.912a352.064 352.064 0 0 0-199.84 329.92c6.784 194.272 169.792 346.272 364.064 339.52a352.064 352.064 0 0 0 315.2-222.4l5.856-14.848A32 32 0 0 1 886.272 608l29.76 11.776a32 32 0 0 1 17.984 41.536l-5.888 14.88a448.032 448.032 0 0 1-401.088 282.976c-247.264 8.64-454.72-184.832-463.36-432.096A448.032 448.032 0 0 1 317.984 107.2l14.4-6.912a32 32 0 0 1 42.688 15.04z m113.152-50.112c12.832-1.152 25.76 0 38.752 0C762.496 65.28 960 279.424 960 497.952v20.448a32 32 0 0 1-32 32H473.6a32 32 0 0 1-32-32V97.824a32 32 0 0 1 30.816-32zM537.6 166.4v288h320l-0.48-3.36c-26.24-155.616-157.344-275.584-318.08-284.576L537.6 166.4z" fill="%23ffffff"></path></svg>',
          height: 60
        },
        left: '62.4%', // 根据center微调位置
        top: '40.3%'
      }]
    }
  })
})
</script>
<style scoped lang="scss">
.counter-box {
  background: url(../../images/dataScreen-main-rb.png) no-repeat;
  background-size: 100% 100%;
  width: 392px;
  height: 246px;

  .top {
    display: flex;
    flex-direction: column;

    .title {
      margin-top: 15px;
      color: white;
      font-size: 18px;
    }

    .bg {
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      width: 68px;
      height: 7px;
      position: relative;
      top: 20%;
    }
  }

  .charts {
    width: 100%;
    height: 100%;
  }
}
</style>