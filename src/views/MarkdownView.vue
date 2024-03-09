<template>
    <div class="offset-md-1 col-10">
        <Markdown :id="r.params.id"/>
    </div>
</template>
<script setup lang="ts">
import Markdown from '@/components/Markdown.vue';
import { useRoute } from 'vue-router';
import {useGithubStore} from '@/stores/Github';
import { onMounted, onUpdated } from 'vue';
import mermaid from 'mermaid';


onMounted(()=>{
    mermaid.run();
})

onUpdated(() => {
    mermaid.run();
})

const github = useGithubStore()
const r = useRoute()

github.GetIssue(Number(r.params.id))

</script>