<template>

    <nav id="BottomNav" style="margin-top: 1.5rem;" class="by-4 navbar"
        :class="[theme.GetNavbarStyle, theme.GetBackgroundColorStyle]">
        <div class="container">
            <span class="navbar-text">2022-2026 © {{ app.GetAuthorName }}</span>
            <a class="nav-link navbar-text" href="https://github.com/RedCrazyGhost/Blog">GitHub Pages</a>
            <a class="nav-link navbar-text" href="http://beian.miit.gov.cn/">{{ app.GetArchivalInformation }}</a>
            <span class="navbar-text">Web Site Version:{{ app.GetVersion }}</span>
        </div>
    </nav>

</template>
<script setup lang="ts">
import { useThemeStore } from '@/stores/Theme'
import { useAppStore } from '@/stores/App'
const theme = useThemeStore()
const app = useAppStore()

</script>
