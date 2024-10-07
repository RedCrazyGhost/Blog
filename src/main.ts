import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import "@/assets/css/github.css"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Octokit, App as Oapp} from "octokit";

import { Image } from 'ant-design-vue';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas,far,fab)


import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Image)

app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
