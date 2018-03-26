<template>
  <div class="recent">
    <RingList :msg="{pid: '-1',vip: '1'}"></RingList>
  </div>
</template>  

<script>
  import RingList from '../components/RingList'
  export default {
    name: 'new',
    components: { RingList }
  };
</script>

<style lang="scss" scoped>

</style>