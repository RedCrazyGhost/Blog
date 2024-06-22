<template>
    <nav id="TopNav" class="by-4 navbar navbar-expand-md" :class=[theme.GetNavbarStyle,theme.GetBackgroundColorStyle]>
        <div class="container">
            <router-link class="navbar-brand" to="/">
                <h1>{{ app.GetAuthorName }}'s Blog</h1>
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
            <div class="d-sm-none">
                <top-nav-tips text="请使用平板或电脑浏览！"/>
            </div>
            <div class="collapse navbar-collapse" id="navbarToggler">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">首页</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/image">摄影</router-link>
                    </li>
                    <li class="nav-item"  @click="theme.SwitchTheme">
                        <font-awesome-icon class="iconTheme" v-if="theme.GetThemeColor == 'light'" icon="far fa-sun" style="color:var(--bs-warning)" size="2x" spin/>
                        <font-awesome-icon class="iconTheme pLeft" v-else icon="fas fa-moon" style="color:var(--bs-primary);" size="2x"/>
                    </li>
                    <li class="nav-item pLeft">
                        <a href="https://rsshub.app/github/issue/redcrazyghost/blog">
                        <font-awesome-icon class="iconTheme"  icon="fas fa-square-rss" style="color:rgb(234,119,55);" size="2x"/>
                        </a>
                    </li>
                    <li class="nav-item pLeft">
                        <a href="mailto:zhan940842903@163.com">
                        <font-awesome-icon class="iconTheme"  icon="fas fa-at" size="2x"/>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { RouterLink} from 'vue-router'
import { useAppStore } from '@/stores/App'
import TopNavTips from '@/components/TopNavTips.vue';
import { useThemeStore } from '@/stores/Theme'

const theme = useThemeStore()
const app = useAppStore()

</script>

<style>
.iconTheme:hover{
    cursor: pointer;
}

@media (min-width: 768px)
{
    .pLeft {
        padding-left: 8px;
    }
}
</style>