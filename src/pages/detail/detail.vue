<template>
  <view>
    <view :style="{backgroundImage:'url('+songDetail.al.picUrl+')'}" class="fixbg"></view>
    <music-head :icon="true" :title="songDetail.name" color="#ccc"></music-head>
    <view v-show="!isLoading" class="container">
      <scroll-view class="scroll" scroll-y>
        <!--磁盘-->
        <view class="detail-play" @tap="handleToPlay">
          <image :class="{'detail-play-run':isPlayRotate}" :src="songDetail.al.picUrl"></image>
          <text :class="iconPlay" class="iconfont"></text>
          <view></view>
        </view>
        <!--歌词-->
        <view class="detail-lyric">
          <view :style="{transform:'translateY('+-(lyricIndex-1)*82+'rpx)'}" class="detail-lyric-wrap">
            <view
                v-for="(item,index) in songLyric"
                :key="index"
                :class="{active:lyricIndex===index}"
                class="detail-lyric-item"
            >
              {{ item.lyric }}
            </view>
          </view>
        </view>
        <!--相关推荐-->
        <view class="detail-like">
          <view class="detail-like-head">喜欢这首歌的人也听</view>
          <view
              v-for="(item,index) in songSiMi"
              :key="index"
              class="detail-like-item"
              @tap="handleToSiMi(item.id)"
          >
            <view class="detail-like-img">
              <image :src="item.album.picUrl"></image>
            </view>
            <view class="detail-like-song">
              <view>{{ item.name }}</view>
              <view>
                <image
                    v-if="item.privilege.flag > 60 && item.privilege.flag <70"
                    src="../../static/images/dujia.png"
                ></image>
                <image
                    v-if="item.privilege.maxbr==999000"
                    src="../../static/images/sq.png"
                ></image>
                {{ item.album.artists[0].name }}-{{ item.name }}
              </view>
            </view>
            <text class="iconfont icon-bofang2"></text>
          </view>
        </view>
        <!--评论-->
        <view class="detail-comment">
          <view class="detail-comment-head">精彩评论</view>
          <view v-for="(item,index) in songComment" :key="index" class="detail-comment-item">
            <view class="detail-comment-img">
              <image :src="item.user.avatarUrl"></image>
            </view>
            <view class="detail-comment-content">
              <view class="detail-comment-title">
                <view class="detail-comment-name">
                  <view>{{ item.user.nickname }}</view>
                  <view>{{ item.time | formatTime }}</view>
                </view>
                <view class="detail-comment-like">
                  {{ item.likedCount | formatCount }}
                  <text class="iconfont icon-dianzan"></text>
                </view>
              </view>
              <view class="detail-comment-text">{{ item.content }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { songComment, songDetail, songLyric, songSiMi, songUrl } from '@/common/api';
import MusicHead from '@/components/musicHead/musicHead';

export default {
  components: {
    MusicHead
  },
  data () {
    return {
      songDetail: {
        al: {
          picUrl: ''
        }
      },
      songSiMi: [],
      songComment: [],
      songLyric: [],
      lyricIndex: 0, //控制歌词激活
      iconPlay: 'icon-zanting_huaban', // 控制播放暂停
      isPlayRotate: true, // 磁盘是否旋转
      isLoading: true
    };
  },
  methods: {
    getMusic (songId) {
      this.$store.commit('NEXT_ID', songId);
      uni.showLoading({
        title: '正在加载...'
      });
      this.isLoading = true;
      Promise.all([
				songDetail(songId),
				songSiMi(songId),
				songComment(songId),
				songLyric(songId),
				songUrl(songId)
				]).then((res) => {
        if (res[0][1].data.code === 200) {
          this.songDetail = res[0][1].data.songs[0];
        }
        if (res[1][1].data.code === 200) {
          this.songSiMi = res[1][1].data.songs;
        }
        if (res[2][1].data.code === 200) {
          this.songComment = res[2][1].data.hotComments;
        }
        if (res[3][1].data.code === 200) {
          let lyric = res[3][1].data.lrc.lyric;
          let re = /\[([^\]]+)\]([^[]+)/g;
          let result = [];
          lyric.replace(re, ($0, $1, $2) => {
            result.push({ 'time': this.formatTimeToSec($1), 'lyric': $2 });
          });
          this.songLyric = result;
        }
        if (res[4][1].data.code === 200) {
          // #ifdef MP-WEIXIN
          this.bgAudioManager = uni.getBackgroundAudioManager();
          this.bgAudioManager.title = this.songDetail.name;
          // #endif
          // #ifdef H5
          if (!this.bgAudioManager) {
            this.bgAudioManager = uni.createInnerAudioContext();
          }
          this.iconPlay = 'icon-bofang1';
          this.isPlayRotate = false;
          // #endif
          this.bgAudioManager.src = res[4][1].data.data[0].url || '';
          this.listenLyricIndex();
          this.bgAudioManager.onPlay(() => {
            this.iconPlay = 'icon-zanting_huaban';
            this.isPlayRotate = true;
            this.listenLyricIndex();
          });
          this.bgAudioManager.onPause(() => {
            this.iconPlay = 'icon-bofang1';
            this.isPlayRotate = false;
            this.cancelLyricIndex();
          });
          this.bgAudioManager.onEnded(() => {
            this.getMusic(this.$store.state.nextId);
          });
        }
      });
      this.isLoading = false;
      uni.hideLoading();
    },
    // 转化成秒的方法
    formatTimeToSec (time) {
      // 分钟和秒分隔开后存放到数组中
      let arr = time.split(':');
      return (parseFloat(arr[0]) * 60 + parseFloat(arr[1])).toFixed(2);
    },
    // 控制播放暂停
    handleToPlay () {
      if (this.bgAudioManager.paused) {
        this.bgAudioManager.play();
      } else {
        this.bgAudioManager.pause();
      }
    },
    // 歌词滚动
    listenLyricIndex () {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        for (let i = 0; i < this.songLyric.length; i++) {
          if (this.bgAudioManager.currentTime > this.songLyric[this.songLyric.length - 1].time) {
            this.lyricIndex = this.songLyric.length - 1;
            break;
          }
          if (this.bgAudioManager.currentTime > this.songLyric[i].time && this.bgAudioManager.currentTime < this.songLyric[i + 1].time) {
            this.lyricIndex = i;
          }
        }
      }, 500);
    },
    // 清除歌词滚动定时器
    cancelLyricIndex () {
      clearInterval(this.timer);
    },
    // 播放推荐歌曲
    handleToSiMi (songId) {
      this.getMusic(songId);
    }
  },
  onLoad (options) {
    this.getMusic(options.songId);
  },
  onUnload () {
    this.cancelLyricIndex();
    // #ifdef H5
    this.bgAudioManager.destroy();
    // #endif
  },
  onHide () {
    this.cancelLyricIndex();
    // #ifdef H5
    this.bgAudioManager.destroy();
    // #endif
  }
};
</script>

<style scoped>
//磁盘
.detail-play {
  position: relative;
  width: 580rpx;
  height: 580rpx;
  margin: 214rpx auto 0 auto;
  background-image: url(~@/static/images/disc.png);
  background-size: cover;
}

.detail-play image {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 370rpx;
  height: 370rpx;
  border-radius: 50%;
  animation: 10s linear move infinite;
  animation-play-state: paused;
}

.detail-play .detail-play-run {
  animation-play-state: running;
}

@keyframes move {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.detail-play text {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100rpx;
  height: 100rpx;
  margin: auto;
  font-size: 100rpx;
  color: #fff;
}

.detail-play view {
  position: absolute;
  left: 100rpx;
  right: 0;
  top: -200rpx;
  margin: auto;
  width: 230rpx;
  height: 360rpx;
  background-image: url(~@/static/images/needle.png);
  background-size: cover;
}

//歌词
.detail-lyric {
  height: 246rpx;
  font-size: 32rpx;
  line-height: 82rpx;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #6f6e73;
}

.detail-lyric-wrap {
  transition: .5s;
}

.detail-lyric-item {
  height: 82rpx;
}

.detail-lyric-item.active {
  color: #fff;
  font-size: 40rpx;
}

//相关推荐
.detail-like {
  margin: 0 30rpx;
}

.detail-like-head {
  font-size: 36rpx;
  color: #fff;
  margin: 50rpx 0;
}

.detail-like-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.detail-like-item text {
  font-size: 50rpx;
  color: #c6c2bf;
}

.detail-like-img {
  width: 82rpx;
  height: 82rpx;
  margin-right: 20rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.detail-like-img image {
  width: 100%;
  height: 100%;
}

.detail-like-song {
  flex: 1;
  color: #c6c2bf;
}

.detail-like-song view:nth-child(1) {
  font-size: 28rpx;
  color: #fff;
  margin-bottom: 12rpx;
}

.detail-like-song view:nth-child(2) {
  font-size: 22rpx;
}

.detail-like-song image {
  width: 26rpx;
  height: 20rpx;
  margin-right: 10rpx;
}

//评论
.detail-comment {
  margin: 0 30rpx;
}

.detail-comment-head {
  font-size: 36rpx;
  color: #fff;
  margin: 50rpx 0;
}

.detail-comment-item {
  display: flex;
  margin-bottom: 28rpx;
}

.detail-comment-img {
  width: 64rpx;
  height: 64rpx;
  margin-right: 18rpx;
  border-radius: 50%;
  overflow: hidden;
}

.detail-comment-img image {
  width: 100%;
  height: 100%;
}

.detail-comment-content {
  flex: 1;
}

.detail-comment-title {
  display: flex;
  justify-content: space-between;
  color: #cbcacf;
}

.detail-comment-name view:nth-child(1) {
  font-size: 26rpx;
}

.detail-comment-name view:nth-child(2) {
  font-size: 20rpx;
}

.detail-comment-like {
  font-size: 28rpx;
}

.detail-comment-text {
  margin-top: 20rpx;
  font-size: 26rpx;
  line-height: 40rpx;
  color: #fff;
  border-bottom: 1px solid #eee;
  padding-bottom: 40rpx;
}
</style>
