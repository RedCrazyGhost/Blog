<template>
    <nav id="TopNav" class="py-4 flex items-center justify-between"
        :class="theme.GetBackgroundColorStyle">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between">
                <router-link class="text-xl font-bold" to="/">
                    <h1>{{ app.GetAuthorName }}'s Blog</h1>
                </router-link>
                <button 
                    :class="[
                      'md:hidden flex items-center justify-center w-10 h-10 rounded border bg-transparent transition-colors',
                      theme.GetThemeColor === 'light' 
                        ? 'border-gray-300 hover:bg-gray-100' 
                        : 'border-gray-600 hover:bg-gray-800'
                    ]"
                    type="button" 
                    @click="toggleMenu"
                    aria-controls="navbarToggler" 
                    :aria-expanded="isMenuOpen"
                    aria-label="Toggle navigation">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div 
                    :class="['hidden md:flex md:items-center md:space-x-4', isMenuOpen ? 'md:flex' : '']"
                    id="navbarToggler">
                    <ul class="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
                        <li>
                            <router-link class="text-inherit hover:opacity-80 transition-opacity block py-2" to="/">首页</router-link>
                        </li>
                        <li>
                            <router-link class="text-inherit hover:opacity-80 transition-opacity block py-2" to="/image">摄影</router-link>
                        </li>
                        <li @click="theme.SwitchTheme" class="cursor-pointer">
                            <font-awesome-icon 
                                class="iconTheme" 
                                v-if="theme.GetThemeColor == 'light'" 
                                icon="far fa-sun"
                                :style="{ color: '#ffc107' }" 
                                size="2x" 
                                spin />
                            <font-awesome-icon 
                                class="iconTheme md:pl-2" 
                                v-else 
                                icon="fas fa-moon"
                                :style="{ color: '#0d6efd' }" 
                                size="2x" />
                        </li>
                        <li class="md:pl-2">
                            <a href="https://rsshub.app/github/issue/redcrazyghost/blog" class="text-inherit hover:opacity-80 transition-opacity">
                                <font-awesome-icon class="iconTheme" icon="fas fa-square-rss" style="color:rgb(234,119,55);"
                                    size="2x" />
                            </a>
                        </li>
                        <li class="md:pl-2">
                            <a href="mailto:zhan940842903@163.com" class="text-inherit hover:opacity-80 transition-opacity">
                                <font-awesome-icon class="iconTheme" icon="fas fa-at" size="2x" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="block sm:hidden mt-2">
                <top-nav-tips text="请使用平板或电脑浏览！" />
            </div>
            <div 
                :class="['md:hidden', isMenuOpen ? 'block' : 'hidden']"
                id="navbarTogglerMobile">
                <ul class="flex flex-col space-y-2 mt-4">
                    <li>
                        <router-link class="text-inherit hover:opacity-80 transition-opacity block py-2" to="/">首页</router-link>
                    </li>
                    <li>
                        <router-link class="text-inherit hover:opacity-80 transition-opacity block py-2" to="/image">摄影</router-link>
                    </li>
                    <li @click="theme.SwitchTheme" class="cursor-pointer">
                        <font-awesome-icon 
                            class="iconTheme" 
                            v-if="theme.GetThemeColor == 'light'" 
                            icon="far fa-sun"
                            :style="{ color: '#ffc107' }" 
                            size="2x" 
                            spin />
                        <font-awesome-icon 
                            class="iconTheme" 
                            v-else 
                            icon="fas fa-moon"
                            :style="{ color: '#0d6efd' }" 
                            size="2x" />
                    </li>
                    <li>
                        <a href="https://rsshub.app/github/issue/redcrazyghost/blog" class="text-inherit hover:opacity-80 transition-opacity">
                            <font-awesome-icon class="iconTheme" icon="fas fa-square-rss" style="color:rgb(234,119,55);"
                                size="2x" />
                        </a>
                    </li>
                    <li>
                        <a href="mailto:zhan940842903@163.com" class="text-inherit hover:opacity-80 transition-opacity">
                            <font-awesome-icon class="iconTheme" icon="fas fa-at" size="2x" />
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAppStore } from '@/stores/App'
import TopNavTips from '@/components/layout/TopNavTips.vue';
import { useThemeStore } from '@/stores/Theme'

const theme = useThemeStore()
const app = useAppStore()
const isMenuOpen = ref(false)

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
}

</script>

<style>
.iconTheme:hover {
    cursor: pointer;
}
</style>