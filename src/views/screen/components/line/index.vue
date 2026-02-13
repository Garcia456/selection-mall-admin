<template>
  <div class="line-box">
    <div class="top">
      <p class="title">未来30天游客量趋势图</p>
      <p class="bg"></p>
    </div>
    <div class="line" ref="chartsRef"></div>
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
      boundaryGap: false,
      splitLine: {
        show: false
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        color: '#8fb1d9',
      },
      axisTick: {
        show: false,
      },
      data: [
        '05/01',
        '05/03',
        '05/05',
        '05/07',
        '05/09',
        '05/11',
        '05/13',
        '05/15',
        '05/17',
        '05/19',
        '05/21',
        '05/23',
        '05/25',
        '05/27',
        '05/29',
      ],
    },
    yAxis: {
      name: '(访问量) ',
      nameTextStyle: {
        align: 'right',
        color: '#8fb1d9'
      },
      splitLine: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          width: 0.5, // 细化线宽
          color: 'rgba(255, 255, 255, 0.2)' // 使用半透明白色，更贴合背景
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      },
      axisLabel: {
        color: '#8fb1d9',
      },
      max: 21000,
      splitNumber: 7,
    },
    grid: {
      left: 60,
      right: 30,
      top: 60,
      bottom: 30
    },
    series: [
      {
        type: 'line',
        data: [9000, 1500, 17000, 200, 4000, 5000, 19000, 20000, 11000, 8000, 4000, 12000, 2000, 15000, 4000, 17000, 7000, 14000, 5000, 16000, 11000, 10500],
        smooth: true,
        showSymbol: false, // 取消折线上的点
        lineStyle: {
          color: '#ffcc00', // 线条颜色设为金黄色
          width: 1
        },
        areaStyle: {
          // 2. 实现向下完全透明的渐变色
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(255, 204, 0, 0.6)' // 顶部：金黄色，带一定透明度
            },
            {
              offset: 1,
              color: 'rgba(255, 204, 0, 0)' // 底部：越接近X轴越完全透明
            }
          ])
        }
      }
    ]
  })
})
</script>
<style scoped lang="scss">
.line-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png);
  background-size: 100% 100%;

  .top {
    display: flex;
    flex-direction: column;

    .title {
      margin-top: 15px;
      color: white;
      font-size: 20px;
    }

    .bg {
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      width: 68px;
      height: 7px;
      position: relative;
      top: 30%;
    }
  }

  .line {
    height: 270px;
  }
}
</style>