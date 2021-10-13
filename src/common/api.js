import { baseUrl } from '@/common/config';

/**
 * 登录
 * @param data
 * @returns {Promise<unknown>}
 */
export function login (data) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}/login/cellphone`,
      data,
      method: 'GET',
      success: (res) => {
        // 登录请求，存储cookie
        if (data.isLogin) {
          uni.setStorage({
            key: 'cookies',
            data: res.cookies
          });
        }
        resolve(res.data);
      },
      fail: (err) => {
        console.log('请求失败', err);
        reject(err);
      },
      complete: () => {}
    });
  });
}

/**
 * 歌单列表摘要
 */
export function topList () {
  let listIds = ['19723756', '3779629', '2884035', '3778678'];
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${baseUrl}/toplist/detail`,
      method: 'get',
      data: {},
      success: res => {
        let result = res.data.list;
        result.length = 4;
        for (let i = 0; i < listIds.length; i++) {
          result[i].listId = listIds[i];
        }
        resolve(result);
      },
      fail: (err) => {console.log(err);},
      complete: () => {}
    });
  });
}

/**
 * 歌单列表详情
 * @param listId
 * @returns {RequestTask}
 */
export function list (listId) {
  return uni.request({
    url: `${baseUrl}/playlist/detail?id=${listId}`,
    method: 'GET'
  });
}

/**
 * 歌曲详情
 * @param songId
 * @returns {RequestTask}
 */
export function songDetail (songId) {
  return uni.request({
    url: `${baseUrl}/song/detail?ids=${songId}`,
    method: 'GET'
  });
}

/**
 * 相似歌曲
 * @param songId
 * @returns {RequestTask}
 */
export function songSiMi (songId) {
  return uni.request({
    url: `${baseUrl}/simi/song?id=${songId}`,
    method: 'GET'
  });
}

/**
 * 歌曲评论
 * @param songId
 * @returns {RequestTask}
 */
export function songComment (songId) {
  return uni.request({
    url: `${baseUrl}/comment/music?id=${songId}&limit=5`,
    method: 'GET'
  });
}

/**
 * 歌词
 * @param songId
 * @returns {RequestTask}
 */
export function songLyric (songId) {
  return uni.request({
    url: `${baseUrl}/lyric?id=${songId}`,
    method: 'GET'
  });
}

/**
 * 歌曲的url
 * @param songId
 * @returns {RequestTask}
 */
export function songUrl (songId) {
  return uni.request({
    url: `${baseUrl}/song/url?id=${songId}`,
    method: 'GET'
  });
}


