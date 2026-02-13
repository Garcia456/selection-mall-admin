<template>
  <div class="year-box">
    <div class="top">
      <p class="title">年度游客量对比</p>
      <p class="bg"></p>
    </div>
    <div class="charts" ref="chartsRef"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts'

const chartsRef = ref()
onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  mycharts.setOption({
    xAxis: {
      type: 'category',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      boundaryGap: false,
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      name: '(人数) ',
      nameTextStyle: {
        align: 'right',
        color: '#fff'
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        show: true,
      },
      axisLabel: {
        color: '#fff',
      },
    },
    grid: {
      left: 20,
      right: 20,
      top: 60,
      bottom: 70
    },
    series: [
      {
        name: '2023年',
        type: 'line',
        data: [550, 250, 100, 90, 80, 500, 50, 70, 60, 400, 150, 80],
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: 'red'
        },
        lineStyle: {
          color: 'red',
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'red'
            },
            {
              offset: 1,
              color: 'rgba(255, 204, 0, 0)'
            }
          ])
        }
      },
      {
        name: '2024年',
        type: 'line',
        data: [100, 500, 350, 150, 350, 100, 300, 200, 350, 470, 130, 30],
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: 'skyblue'
        },
        lineStyle: {
          color: 'skyblue',
          width: 1
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'skyblue'
            },
            {
              offset: 1,
              color: 'rgba(255, 204, 0, 0)'
            }
          ])
        }
      },
    ],
    legend: {
      show: true,
      top: '10%',
      right: '5%',
      textStyle: {
        color: '#fff',
      },
      icon: 'rect'
    }
  })
})
</script>
<style scoped lang="scss">
.year-box {
  background: url(../../images/dataScreen-main-rc.png);
  background-size: 100% 100%;
  width: 392px;
  height: 251px;
  margin: 20px 0;

  .top {
    display: flex;
    flex-direction: column;

    .title {
      margin-top: 8px;
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