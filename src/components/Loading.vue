<template>
  <div>
    <div
      class="container d-flex align-items-center justify-content-center"
      style="min-height: calc(100vh - 9.75rem)"
    >
      <font-awesome-icon :icon="['fas', 'rotate']" size="8x" spin />
    </div>
    <LogosWall />
  </div>
</template>
<script setup lang="ts">
import LogosWall from "@/components/LogosWall.vue";
</script>
