<template>
  <div class="rank-box">
    <div class="top">
      <p class="title">热门景区排行</p>
      <p class="bg"></p>
    </div>
    <div class="rank">
      <div class="title">
        <span class="s1">排名</span>
        <span class="s2">景区</span>
        <span class="s3">预约数量</span>
      </div>
      <div class="ranking-list">
        <div v-for="(item, index) in tableData" :key="index" class="ranking-item">
          <div :class="['rank-tag', `rank-${index + 1}`]">NO.{{ index + 1 }}</div>

          <div class="scenic-name">{{ item.name }}</div>

          <div class="progress-wrapper">
            <el-progress :percentage="item.percent" :stroke-width="14" :color="item.color" :show-text="true"
              text-inside />
          </div>

          <div class="value-text">{{ item.value }}w</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const tableData = [
  { name: '峨眉山', percent: 80, value: '8.00', color: '#409eff' },
  { name: '稻城亚丁', percent: 60, value: '6.00', color: '#f56c6c' },
  { name: '九寨沟', percent: 50, value: '5.00', color: '#53d4ff' },
  { name: '万里长城', percent: 40, value: '4.00', color: '#e6a23c' },
  { name: '北京故宫', percent: 30, value: '3.00', color: '#a181fc' },
]
</script>
<style scoped lang="scss">
.rank-box {
  background: url(../../images/dataScreen-main-rt.png) no-repeat;
  width: 390px;
  height: 319px;
  margin-top: 10px;

  .top {
    display: flex;
    flex-direction: column;

    .title {
      color: white;
      margin-top: 3px;
      font-size: 18px;
    }

    .bg {
      background: url(../../images/dataScreen-title.png) no-repeat;
      width: 68px;
      height: 7px;
      position: relative;
      top: 15%;
    }
  }

  .rank {
    background: url(../../images/rankingChart-bg.png) no-repeat;
    background-size: 100% 100%;
    width: 351px;
    height: 36px; // 注意：这个高度只是标题行的高度
    margin: 0 auto;
    position: relative;
    top: 5%;
    line-height: 36px;

    .title {
      display: flex; // 使用 flex 确保标题与内容列宽一致

      span {
        font-size: 15px;
        color: #ffcc00;
        font-weight: bold;
      }

      .s1 {
        width: 80px;
        text-align: center;
      }

      // 对应排名列
      .s2 {
        width: 70px;
        text-align: center;
      }

      // 对应景区列
      .s3 {
        flex: 1;
        text-align: center;
      }

      // 对应进度条列
    }

    // 1. 解决距离问题：给 list 加上 margin-top
    .ranking-list {
      margin-top: 10px; // 这里控制与标题行的距离
      padding: 0 10px;

      .ranking-item {
        display: flex; // 2. 解决对齐问题：每个条目都是一个 flex 容器
        align-items: center;
        margin-bottom: 5px; // 条目之间的行间距

        .rank-tag {
          width: 60px; // 固定宽度
          height: 24px;
          line-height: 24px;
          text-align: center;
          color: #fff;
          font-size: 12px;
          clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
        }

        .scenic-name {
          width: 80px;
          text-align: center;
          color: #fff;
          font-size: 14px;
          margin: 0 5px;
        }

        .progress-wrapper {
          width: 100px;
          padding: 2px;
          border: 1px solid rgba(64, 158, 255, 0.3);
          border-radius: 10px;
          margin: 0 10px;

          // 修正 Element Plus 内部高度导致的偏离
          line-height: 1;
          display: block;
        }

        .value-text {
          width: 50px; // 固定右侧数值宽度
          color: #8fb1d9;
          font-size: 13px;
        }
      }
    }

    :deep(.el-progress-bar__outer) {
      background-color: transparent !important;
    }

    :deep(.el-progress-bar__inner) {
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.2), transparent);
    }

    :deep(.el-progress-bar__innerText) {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      line-height: 1;
      margin: 0;
      font-size: 10px;
    }

    .rank-1 {
      background: #d06a5a;
    }

    .rank-2 {
      background: #c69f50;
    }

    .rank-3 {
      background: #5a7ed0;
    }

    // 建议补上 4,5 名的背景，否则会看不见
    .rank-4,
    .rank-5 {
      background: rgba(64, 158, 255, 0.2);
    }
  }
}
</style>