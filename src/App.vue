<script>
import '@/common/iconfont.css';

// export default {
//   onLaunch () {
//     console.log('App Launch');
//   },
//   onShow () {
//     console.log('App Show');
//   },
//   onHide () {
//     console.log('App Hide');
//   }
// };
</script>

<style>
/*每个页面公共css */
.container {
  width: 100%;
  height: calc(100vh - 70px);
  overflow: hidden;
}

.container .scroll {
  height: 100%;
}

.fixbg {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center 0;
  filter: blur(20px);
  transform: scale(1.2);
}
</style>
