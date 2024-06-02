<template>
   <span class="badge tag tag-life"  v-if="props.Tag.name === '生活'">
    <font-awesome-icon class="iconTheme" :icon="props.Tag.description"/>
    {{props.Tag.name}}
    </span>
    <span v-else class="badge tag" v-bind:style="{backgroundColor:'#'+props.Tag.color+' !important'}">
    <font-awesome-icon class="iconTheme" :icon="props.Tag.description"/>
    {{props.Tag.name}}
    </span>
</template>
<script setup lang="ts">
const props = defineProps(["Tag"])

// todo props.Tag.description 支持更多自定义配置
// 拆分成数组判断本文前缀，逐一添加选项
// ["fa-tag", "fa-tags", "css-life", "css-fly"]

</script>
<style>
.tag{
    margin-right: 6px;
}
.tag-life{
    background: linear-gradient( 217deg, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0) 70.71% ), linear-gradient(127deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0) 70.71%), linear-gradient(336deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0) 70.71%);
}
</style>