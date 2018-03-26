<template>
  <div class="hottest">
    <RingList :msg="{pid: '-2',vip: '1'}"></RingList>
  </div>
</template>  

<script>
  import RingList from '../components/RingList'
  export default {
    name: 'hottest',
    components: { RingList },
  };
</script>

<style lang="scss" scoped>

</style>