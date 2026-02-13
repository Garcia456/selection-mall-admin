<template>
  <div class="sex-box">
    <div class="top">
      <p class="title">男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <span>男士</span>
        <img src="../../images/man.png">
      </div>
      <div class="woman">
        <span>女士</span>
        <img src="../../images/woman.png">
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <div ref="chartsRef" class="charts"></div>
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
      min: 0,
      max: 100,
      show: false
    },
    yAxis: {
      show: false,
      type: 'category'
    },
    series: [
      {
        type: 'bar',
        data: [58],
        barWidth: 15,
        z: 100,
        itemStyle: {
          color: '#3876fe',
          borderRadius: 20
        }
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 15,
        barGap: '-100%',
        itemStyle: {
          color: '#f74b7c',
          borderRadius: 20
        }
      }
    ],
    grid: {
      left: 40,
      top: 0,
      right: 40,
      bottom: 0,
    },
  })
})
</script>
<style scoped lang="scss">
.sex-box {
  width: 391px;
  height: 262px;
  background: url(../../images/dataScreen-main-lc.png) no-repeat;
  background-size: 100% 100%;
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

  .sex {
    display: flex;
    justify-content: center;
    margin-top: 40px;

    .man {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: url(../../images/man-bg.png) no-repeat;
      width: 111px;
      height: 115px;
      margin: 10px 20px;
    }

    .woman {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: url(../../images/woman-bg.png) no-repeat;
      width: 111px;
      height: 115px;
      margin: 10px 20px;
    }

    span {
      color: white;
      font-size: 13px;
      position: relative;
      top: -18px;
    }

    img {
      width: 61px;
      height: 61px;
    }
  }

  .rate {
    display: flex;
    justify-content: space-around;

    p {
      color: white;
      font-size: 13px;
    }
  }

  .charts {
    width: 100%;
    height: 50px;
    position: relative;
    top: -3%;
  }
}
</style>