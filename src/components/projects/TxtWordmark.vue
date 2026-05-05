<template>
  <span
    class="txt-wordmark"
    :class="{ 'txt-wordmark--banner': banner }"
    aria-label="txt"
  ><span class="txt-wordmark__edge">_</span><span class="txt-wordmark__t txt-wordmark__t--green">t</span><span class="txt-wordmark__mid">x</span><span class="txt-wordmark__t txt-wordmark__t--red">t</span><span class="txt-wordmark__edge">_</span></span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** banner 内略缩小，与等宽 JSON 协调 */
    banner?: boolean;
  }>(),
  { banner: false },
);
</script>

<style scoped>
.txt-wordmark {
  --bs-green: #198754;
  --bs-red: #dc3545;
  font-weight: inherit;
  letter-spacing: 0.02em;
  white-space: nowrap;
  display: inline-block;
}

.txt-wordmark--banner {
  font-size: 0.92em;
}

.txt-wordmark__edge {
  opacity: 0.85;
}

.txt-wordmark__t--green {
  color: var(--bs-green);
}

.txt-wordmark__t--red {
  color: var(--bs-red);
}
</style>
