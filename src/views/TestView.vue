<template>
    <a-image
      :width="200"
      :src="`https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?${random}`"
    >
      <template #placeholder>
        <a-image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?x-oss-process=image/blur,r_50,s_50/quality,q_1/resize,m_mfit,h_200,w_200"
          :width="200"
          :preview="false"
        />
      </template>
    </a-image>
</template>
<script setup lang="ts">
import Tag from "@/components/common/Tag.vue";
import { ref } from "vue";

const tag = ref({
    description: "tag-test",
    name: "tests"
});

</script>