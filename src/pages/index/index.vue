<template>
  <view>
    <musicHead :icon="false" title="云音乐"></musicHead>
    <view class="container">
      <scroll-view class="scroll" scroll-y>
        <!--搜索-->
        <view class="indexSearch">
          <text class="iconfont icon-search-line"></text>
          <input placeholder="搜索歌曲" type="text">
        </view>
        <!--榜单-->
        <view class="indexList">
          <view v-for="(item,index) in topList" :key="index" class="indexListItem" @tap="handleToList(item.listId)">
            <view class="indexListItemImg">
              <image :src="item.coverImgUrl"></image>
              <text>{{ item.updateFrequency }}</text>
            </view>
            <view class="indexListItemText">
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
    }
  }
};
</script>

<style scoped>
//搜索
.indexSearch {
  display: flex;
  align-items: center;
  height: 70 rpx;
  margin: 70 rpx 30 rpx 30 rpx 30 rpx;
  background-color: #f7f7f7;
  border-radius: 50 rpx;
}

.indexSearch text {
  font-size: 26 rpx;
  margin-right: 26 rpx;
  margin-left: 28 rpx;
}

.indexSearch input {
  font-size: 28 rpx;
  flex: 1;
}

//榜单
.indexList {
  margin: 0 30 rpx;
}

.indexListItem {
  display: flex;
  margin-bottom: 34 rpx;
}

.indexListItemImg {
  position: relative;
  width: 212 rpx;
  height: 212 rpx;
  margin-right: 30 rpx;
  border-radius: 30 rpx;
  overflow: hidden;
}

.indexListItemImg image {
  width: 100%;
  height: 100%;
}

.indexListItemImg text {
  position: absolute;
  left: 12 rpx;
  bottom: 16 rpx;
  color: #fff;
  font-size: 20 rpx;
}

.indexListItemText {
  font-size: 24 rpx;
  line-height: 66 rpx;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
