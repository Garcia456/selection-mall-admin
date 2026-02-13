<template>
  <div class="age-box">
    <div class="top">
      <p class="title">年龄比例</p>
      <p class="bg"></p>
    </div>

    <div ref="chartsRef" class="charts"></div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

const chartsRef = ref()
onMounted(() => {
  const mycharts = echarts.init(chartsRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '25%',
      right: '8%',
      orient: 'vertical',
      textStyle: {
        color: '#fff',
        fontSize: 14,
      },
    },
    grid: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '80%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 5,
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{d}%',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 16, name: '10岁以下' },
          { value: 8, name: '10-18岁' },
          { value: 12, name: '18-30岁' },
          { value: 24, name: '30-40岁' },
          { value: 20, name: '40-60岁' },
          { value: 20, name: '60岁以上' }
        ]
      }
    ]
  };
  mycharts.setOption(option)
})

</script>
<style scoped lang="scss">
.age-box {
  width: 391px;
  height: 235px;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;

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
    height: 260px;
    margin-top: 20px;
  }
}
</style>