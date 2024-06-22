<template>
  <div
    :class="
      'shadow card card-' + theme.GetThemeColor + ' ' + theme.GetThemeStyle
    "
    style="margin-top: 1.5rem"
  >
    <div :class="'p-3 card-header header-' + theme.GetThemeColor">
      <router-link
        @click="scrollToTop"
        :class="'removeA ' + theme.GetThemeStyle"
        :to="{ path: 'markdown/' + props.Markdown.number }"
      >
        <h5 class="removeMarginBottom">{{ props.Markdown.title }}</h5>
      </router-link>
    </div>

    <div class="card-body">
      <router-link
        @click="scrollToTop"
        :class="'removeA ' + theme.GetThemeStyle"
        :to="{ path: 'markdown/' + props.Markdown.number }"
      >
        <div
          :id="'miniMD-' + props.Markdown.number"
          v-html="m.parseMarkdownHTML(MiniBody(props.Markdown.body))"
        ></div>

        <p class="card-text">
          <small class="text-muted">更多详细内容请单击查看！</small>
        </p>
        <p class="card-text">
          <small class="text-muted"
            ><font-awesome-icon
              class="iconTheme"
              icon="fa-regular fa-calendar-plus"
            />
            {{ ToChinaDate(props.Markdown.created_at) }}</small
          >
          <small class="text-muted"
            ><font-awesome-icon
              class="iconTheme"
              icon="fa-solid fa-hourglass-half"
            />
            {{ ToChinaDate(props.Markdown.updated_at) }}</small
          >
        </p>
      </router-link>
    </div>

    <div
      :class="'card-footer footer-' + theme.GetThemeColor"
      v-if="props.Markdown.labels.length !== 0"
    >
      <Tag v-for="tag in Markdown.labels" :key="tag.id" :Tag="tag" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from "@/stores/Theme";
import { useMarkdownStore } from "@/stores/Markdown";
import Tag from "@/components/Tag.vue";
import { defineProps } from "vue";

const theme = useThemeStore();
const m = useMarkdownStore();
const props = defineProps(["Markdown"]);

function MiniBody(str: string) {
  let endIndex = str.indexOf("\n", str.indexOf("#", 20) - 1);
  return str.substring(0, endIndex);
}

function ToChinaDate(datetime: string) {
  let d = new Date(datetime);

  return (
    d.getUTCFullYear() + "-" + (d.getUTCMonth() + 1) + "-" + d.getUTCDate()
  );
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
  });
}
</script>
<style scoped>
.removeMarginBottom {
  margin-bottom: 0rem;
}
.removeA {
  text-decoration: none;
}

.card-dark {
  border: 1px solid rgba(255, 255, 255, 0.125);
}
.header-dark {
  background-color: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.125);
}
.footer-dark {
  background-color: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.125);
}

.text-muted {
  --bs-text-opacity: 1;
  color: #6c757d !important;
}
.text-muted + .text-muted {
  margin-left: 1rem;
}
</style>
