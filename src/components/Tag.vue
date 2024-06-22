<template>
    <span :class="'tag badge '+tagStyle" :style="{backgroundColor: '#'+props.Tag.color}">
    <font-awesome-icon class="iconTheme" :icon="iconStyle"/>
    {{props.Tag.name}}
    </span>
</template>
<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps(["Tag"])
const iconStyle = ref<string[]>([])
const tagStyle = ref<string[]>([])

props.Tag.description.split(" ").forEach((element : string) => {
    if (element.startsWith("fa-")) {
        iconStyle.value.push(element)
    }
    if (element.startsWith("tag-")) {
        tagStyle.value.push(element)
    }
});


</script>
<style>
.tag{
    margin-right: 6px;
}
.tag-rainbow{
    background: linear-gradient( 217deg, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0) 70.71% ), linear-gradient(127deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0) 70.71%), linear-gradient(336deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0) 70.71%) !important;
}
</style>