<template>
  <view>
    <musicHead :icon="false" title="云音乐"></musicHead>
    <view class="container">
      <scroll-view class="scroll" scroll-y>
        <!--搜索-->
        <view class="index-search" @tap="handleToSearch">
          <text class="iconfont icon-search-line"></text>
          <input placeholder="搜索歌曲" type="text">
        </view>
        <!--榜单-->
        <view class="index-list">
          <view v-for="(item,index) in topList" :key="index" class="index-list-item"
                @tap="handleToList(item.listId)">
            <view class="index-list-item-img">
              <image :src="item.coverImgUrl"></image>
              <text>{{ item.updateFrequency }}</text>
            </view>
            <view class="index-list-item-text">
              <view v-for="(item,index) in item.tracks" :key="index">
                {{ index + 1 }}.{{ item.first }}-{{ item.second }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import musicHead from '@/components/musicHead/musicHead';
import { topList } from '@/common/api';

export default {
  components: {
    musicHead
  },
  props: ['title', 'icon'],
  data () {
    return {
      topList: []
    };
  },
  onLoad () {
    // 获取榜单
    topList().then((res) => {
      if (res.length) {
        this.topList = res;
      }
    });
  },
  methods: {
    // 跳转到榜单详情
    handleToList (listId) {
      uni.navigateTo({
        url: '/pages/list/list?listId=' + listId
      });
    },
    // 跳转到搜索页
    handleToSearch(){
      uni.navigateTo({
        url:'/pages/search/search'
      })
    }
  }
};
</script>

<style scoped>
//搜索
.index-search {
  display: flex;
  align-items: center;
  height: 70rpx;
  margin: 70rpx 30rpx 30rpx 30rpx;
  background-color: #f7f7f7;
  border-radius: 50rpx;
}

.index-search text {
  font-size: 26rpx;
  margin-right: 26rpx;
  margin-left: 28rpx;
}

.index-search input {
  font-size: 28rpx;
  flex: 1;
}

//榜单
.index-list {
  margin: 0 30rpx;
}

.index-list-item {
  display: flex;
  margin-bottom: 34rpx;
}

.index-list-item-img {
  position: relative;
  width: 212rpx;
  height: 212rpx;
  margin-right: 30rpx;
  border-radius: 30rpx;
  overflow: hidden;
}

.index-list-item-img image {
  width: 100%;
  height: 100%;
}

.index-list-item-img text {
  position: absolute;
  left: 12rpx;
  bottom: 16rpx;
  color: #fff;
  font-size: 20rpx;
}

.index-list-item-text {
  font-size: 24rpx;
  line-height: 66rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
