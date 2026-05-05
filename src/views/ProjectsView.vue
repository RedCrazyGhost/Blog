<template>
  <div class="container mx-auto px-4 py-8 max-w-3xl">
    <section class="projects-intro mb-8">
      <h2 class="text-lg font-semibold mb-2">个人项目</h2>
      <p class="text-sm opacity-75 leading-relaxed">
        以下是我在业余时间维护的公开在线小工具，每个项目都有独立的访问入口，欢迎试用。
      </p>
    </section>

    <section class="projects-list">
      <ProjectCard
        v-for="item in projects"
        :key="item.id"
        :project="item"
        class="mb-6"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import ProjectCard from "@/components/projects/ProjectCard.vue";
import { projects } from "@/data/projects";
</script>
