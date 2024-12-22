<script setup lang="ts">
import { mpUpdateCheck } from '@/utils';

onLaunch(() => {
  console.log('App Launch');
  // #ifdef MP-WEIXIN
  mpUpdateCheck();
  // #endif
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
@import 'nutui-uniapp/styles/index.scss';
@import '@/static/styles/fonts.scss';
@import '@/static/styles/common.scss';
</style>
