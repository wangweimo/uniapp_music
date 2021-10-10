<template>
  <view class="songDetailContainer">
    <view class="author">{{ song.al.name }}</view>
    <!--  底座-->
    <view class="circle"></view>
    <!--  摇杆-->
    <image class="needle " src="../../static/images/needle.png"></image>
    <!--  磁盘-->
    <view class="discContainer">
      <image class="disc" src="../../static/images/disc.png"></image>
      <image class="musicImg" src=""></image>
    </view>

    <!--  进度条-->
    <view class="progressControl">
      <text>{{ currentTime }}</text>
      <view class="bar">
        <!-- 实时进度条-->
        <view class="audioCurrentTimeBar" style="{width: currentWidth +'rpx'}">
          <view class="audioCircle"></view>
        </view>
      </view>
      <text>{{ durationTime }}</text>
    </view>
    <!--  控制播放区-->
    <view class="musicControl">
      <text class="iconfont icon-iconsMusicyemianbofangmoshiShuffle"></text>
      <text id="pre" class="iconfont icon-shangyishoushangyige" @tap="handleSwitch"></text>
      <text class="iconfont big" @tap="handleMusicPlay"></text>
      <text id="next" class="iconfont icon-49xiayishou" @tap="handleSwitch"></text>
      <text class="iconfont icon-iconsMusicyemianbofangmoshiPlayList"></text>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.songDetailContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}

/*底座*/
.circle {
  position: relative;
  width: 60 rpx;
  height: 60 rpx;
  margin: 10 rpx 0;
  border-radius: 50%;
  background-color: #fff;
  z-index: 100;
}

/*摇杆*/
.needle {
  position: relative;
  top: -40 rpx;
  left: 60 rpx;
  width: 192 rpx;
  height: 274 rpx;
  z-index: 50;
  transform-origin: 40 rpx 0;
  transform: rotate(-20deg);
  transition: transform 0.5s;
}

.needleRotate {
  transform: rotate(0deg);
}

/*磁盘*/
.discContainer {
  position: relative;
  top: -170 rpx;
  width: 598 rpx;
  height: 598 rpx;
}

.disc {
  width: 598 rpx;
  height: 598 rpx;
}

.musicImg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 370 rpx;
  height: 370 rpx;
  border-radius: 50%;
}

/*磁盘动画*/
.discAnimation {
  animation: disc 4s linear infinite;
  animation-delay: 1s;
}

/*播放控制区*/
.musicControl {
  display: flex;
  position: absolute;
  bottom: 40 rpx;
  left: 0;
  width: 100%;
  border-top: 1 rpx solid #fff;
}

.musicControl text {
  width: 20%;
  height: 120 rpx;
  line-height: 120 rpx;
  text-align: center;
  font-size: 50 rpx;
  color: #fff;
}

.musicControl text.big {
  font-size: 80 rpx;
}

/*进度条*/
.progressControl {
  position: absolute;
  bottom: 200 rpx;
  display: flex;
  width: 640 rpx;
  height: 80 rpx;
  line-height: 80 rpx;
}

.bar {
  position: relative;
  width: 450 rpx;
  height: 4 rpx;
  margin: auto;
  background-color: rgba(0, 0, 0, .5);
}

.audioCurrentTimeBar {
  position: absolute;
  top: 0;
  left: 0;
  height: 4 rpx;
  background-color: #f00;
  z-index: 1;
}

.audioCircle {
  position: absolute;
  top: -4 rpx;
  right: -12 rpx;
  width: 12 rpx;
  height: 12 rpx;
  border-radius: 50%;
  background-color: #fff;
}

@keyframes disc {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
