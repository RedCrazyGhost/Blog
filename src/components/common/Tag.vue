<template>
  <span :class="'tag inline-block px-2 py-1 text-xs font-semibold rounded text-white ' + tagStyle" :style="{ backgroundColor: '#' + props.Tag.color }">
    <font-awesome-icon class="iconTheme" :icon="iconStyle" />
    {{ props.Tag.name }}
  </span>
</template>
<script setup lang="ts">
import { ref } from "vue";
const props = defineProps(["Tag"]);
const iconStyle = ref<string[]>([]);
const tagStyle = ref<string[]>([]);

props.Tag.description.split(" ").forEach((element: string) => {
  if (element.startsWith("fa-")) {
    iconStyle.value.push(element);
  }
  if (element.startsWith("tag-")) {
    tagStyle.value.push(element);
  }
});
</script>
<style>
.tag {
  margin-right: 6px;
}

/* .tag-rainbow {
  background: linear-gradient(
      217deg,
      rgba(255, 0, 0, 0.8),
      rgba(255, 0, 0, 0) 70.71%
    ),
    linear-gradient(127deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0) 70.71%),
    linear-gradient(336deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0) 70.71%) !important;
} */
.tag-gradual {
  background:
    linear-gradient(45deg, rgba(255, 156, 0, 0.9) 0%, rgba(255, 156, 0, 0) 50%),
    linear-gradient(135deg, rgba(0, 191, 255, 0.9) 50%, rgba(0, 191, 255, 0) 100%),
    linear-gradient(225deg, rgba(128, 0, 128, 0.9) 0%, rgba(128, 0, 128, 0) 50%),
    linear-gradient(315deg, rgba(255, 255, 0, 0.9) 50%, rgba(255, 255, 0, 0) 100%);
  background-size: 400% 400%;
  background-position: left top;
  animation: rainbowShift 5s ease-in-out infinite;
}

@keyframes rainbowShift {
  0% {
    background-position: left center;
  }

  50% {
    background-position: right center;
  }

  100% {
    background-position: left center;
  }
}
</style>
