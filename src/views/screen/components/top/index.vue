<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="router.push('/home')">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据展示平台</div>
      <div class="warn">
        <span class="message">平台高峰预警信息(2条)</span>
      </div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间：{{ time }}</span>
    </div>s
  </div>
</template>
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import moment from 'moment';
import router from '../../../../router';
const time = ref<string>()
const timer = ref<number>()

onMounted(() => {
  timer.value = setInterval(() => {
  time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
}, 1000)
})
onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>
<style scope lang="scss">
.top {
  display: flex;
  width: 100%;
  height: 40px;

  .left {
    flex: 1.5;
    background: url(../../images/dataScreen-header-left-bg.png);
    background-size: cover;

    .lbtn {
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: cover;
      width: 150px;
      height: 100%;
      text-align: center;
      line-height: 40px;
      float: right;
      color: #29fcff;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .center {
    flex: 2;
    
    .title {
      width: 100%;
      height: 70px;
      background: url('../../images/dataScreen-header-center-bg.png') no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 70px;
      color: #29fcff;
      font-size: 30px;
    }

    .warn {
      background: url(../../images/dataScreen-header-warn-bg.png);
      background-size: 100% 100%;
      width: 622px;
      height: 44px;
      text-align: center;
      line-height: 44px;
      position: relative;
      left: 10%;
      .message {
        color: #fff;

      }
    }
  }

  .right {
    flex: 1.5;
    background: url(../../images/dataScreen-header-right-bg.png);
    background-size: cover;

    .rbtn {
      background: url(../../images/dataScreen-header-btn-bg-r.png);
      background-size: cover;
      float: left;
      width: 150px;
      height: 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
      cursor: pointer;
    }
    .time {
      float: right;
      width: 340px;
      height: 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }
  }
}
</style>