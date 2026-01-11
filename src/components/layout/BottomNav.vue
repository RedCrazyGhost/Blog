<template>
    <nav id="BottomNav" class="mt-6 py-4 flex items-center justify-center"
        :class="theme.GetBackgroundColorStyle">
        <div class="container mx-auto px-4">
            <div class="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
                <span>2022-{{ new Date().getFullYear() }} © {{ app.GetAuthorName }}</span>
                <a class="text-gray-600 hover:opacity-80 transition-opacity" href="https://github.com/RedCrazyGhost/Blog">GitHub Pages</a>
                <a class="text-gray-600 hover:opacity-80 transition-opacity" href="http://beian.miit.gov.cn/">{{ app.GetArchivalInformation }}</a>
                <span>Web Site Version:{{ app.GetVersion }}</span>
            </div>
        </div>
    </nav>
</template>
<script setup lang="ts">
import { useThemeStore } from '@/stores/Theme'
import { useAppStore } from '@/stores/App'
const theme = useThemeStore()
const app = useAppStore()

</script>
