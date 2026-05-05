<template>
  <article class="project-card" :class="cardClass">
    <header class="project-card__banner" :class="bannerClass">
      <template v-if="project.theme === 'txt'">
        <div class="txt-banner">
          <div class="txt-banner__steps" aria-hidden="true">
            <span class="txt-step">Step 1</span>
            <span class="txt-step">Step 2</span>
            <span class="txt-step">Step 3</span>
          </div>
          <div class="txt-banner__brace" aria-hidden="true">
            <span class="brace brace--left">{</span>
            <span class="brace-key">"<TxtWordmark banner />"</span>
            <span class="brace brace--right">}</span>
          </div>
        </div>
      </template>

      <template v-else-if="project.theme === 'sc2'">
        <div class="sc2-banner">
          <div class="sc2-banner__grid" aria-hidden="true"></div>
          <div class="sc2-banner__glow" aria-hidden="true"></div>
          <div class="sc2-banner__title">
            <font-awesome-icon
              :icon="project.icon"
              class="sc2-banner__icon"
              size="2x"
            />
            <div class="sc2-banner__text">
              <span class="sc2-banner__name">SC2 TOOLS</span>
              <span class="sc2-banner__sub">EXPERIENCE · CALCULATOR</span>
            </div>
          </div>
        </div>
      </template>
    </header>

    <div class="project-card__body">
      <div class="project-card__head">
        <font-awesome-icon
          :icon="project.icon"
          class="project-card__icon"
          :class="iconClass"
        />
        <div class="project-card__title-wrap">
          <h3 class="project-card__title">
            <TxtWordmark v-if="project.theme === 'txt'" />
            <template v-else>{{ project.name }}</template>
          </h3>
          <p v-if="project.tagline" class="project-card__tagline">
            {{ project.tagline }}
          </p>
        </div>
      </div>

      <p class="project-card__desc">{{ project.description }}</p>

      <template v-if="project.highlights?.length">
        <span class="project-card__label">核心功能</span>
        <ul class="project-card__list">
          <li v-for="(h, i) in project.highlights" :key="i">{{ h }}</li>
        </ul>
      </template>

      <div
        v-if="hasTags || hasUrl"
        class="project-card__footer"
      >
        <div v-if="hasTags" class="project-card__tags">
          <span
            v-for="(t, i) in project.tags"
            :key="i"
            class="project-card__tag"
            :class="tagClass"
          >
            {{ t }}
          </span>
        </div>
        <a
          v-if="hasUrl"
          :href="resolvedUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="project-card__cta"
          :class="[ctaClass, { 'project-card__cta--with-tags': hasTags }]"
        >
          <span>访问站点</span>
          <font-awesome-icon icon="fas fa-arrow-up-right-from-square" />
        </a>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TxtWordmark from "@/components/projects/TxtWordmark.vue";
import { useThemeStore } from "@/stores/Theme";
import type { ProjectItem } from "@/types/project";

const props = defineProps<{ project: ProjectItem }>();

const theme = useThemeStore();
const isDark = computed(() => theme.GetThemeColor === "dark");

const resolvedUrl = computed(() => props.project.url?.trim() ?? "");

const hasUrl = computed(() => Boolean(resolvedUrl.value));

const hasTags = computed(
  () => Array.isArray(props.project.tags) && props.project.tags.length > 0,
);

const cardClass = computed(() => [
  `project-card--${props.project.theme}`,
  isDark.value ? "project-card--dark" : "project-card--light",
]);

const bannerClass = computed(() => `project-card__banner--${props.project.theme}`);

const iconClass = computed(() =>
  props.project.theme === "txt"
    ? "project-card__icon--txt"
    : "project-card__icon--sc2",
);

const tagClass = computed(() =>
  props.project.theme === "txt"
    ? "project-card__tag--txt"
    : "project-card__tag--sc2",
);

const ctaClass = computed(() =>
  props.project.theme === "txt"
    ? "project-card__cta--txt"
    : "project-card__cta--sc2",
);
</script>

<style scoped>
.project-card {
  border-radius: 0.875rem;
  border: 2px solid;
  overflow: hidden;
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
  display: flex;
  flex-direction: column;
}

.project-card--light {
  background: #fff;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.project-card--light:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.project-card--dark {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.project-card--dark:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
  transform: translateY(-2px);
}

/* ---- Banner 通用 ---- */
.project-card__banner {
  position: relative;
  height: 9rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ---- txt banner：浅色文档/JSON 风 ---- */
.project-card__banner--txt {
  background: linear-gradient(135deg, #f8fafc 0%, #e0ecff 100%);
  border-bottom: 1px solid rgba(13, 110, 253, 0.15);
}

.project-card--dark .project-card__banner--txt {
  background: linear-gradient(135deg, #1e2a3a 0%, #1a2540 100%);
  border-bottom: 1px solid rgba(93, 158, 255, 0.25);
}

.txt-banner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
}

.txt-banner__steps {
  display: flex;
  gap: 0.5rem;
  position: absolute;
  top: 0.75rem;
  left: 1rem;
}

.txt-step {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  border: 1px solid rgba(13, 110, 253, 0.25);
}

.project-card--dark .txt-step {
  background: rgba(93, 158, 255, 0.15);
  color: #5d9eff;
  border-color: rgba(93, 158, 255, 0.35);
}

.txt-banner__brace {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "SF Mono", "Menlo", "Consolas", monospace;
}

.brace {
  font-size: 3rem;
  font-weight: 300;
  color: #0d6efd;
  line-height: 1;
  opacity: 0.85;
}

.project-card--dark .brace {
  color: #5d9eff;
}

.brace-key {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0d6efd;
  letter-spacing: 0.02em;
}

.project-card--dark .brace-key {
  color: #5d9eff;
}

/* ---- sc2 banner：暗色金属/星际风 ---- */
.project-card__banner--sc2 {
  background:
    radial-gradient(
      ellipse at 80% 20%,
      rgba(255, 184, 0, 0.18) 0%,
      transparent 55%
    ),
    linear-gradient(135deg, #0a1628 0%, #15102a 50%, #1a0d2e 100%);
  border-bottom: 1px solid rgba(255, 184, 0, 0.35);
  height: 10rem;
}

.sc2-banner {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
}

.sc2-banner__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 184, 0, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 184, 0, 0.08) 1px, transparent 1px);
  background-size: 28px 28px;
  mask-image: linear-gradient(180deg, transparent 0%, #000 35%, #000 100%);
  -webkit-mask-image: linear-gradient(
    180deg,
    transparent 0%,
    #000 35%,
    #000 100%
  );
}

.sc2-banner__glow {
  position: absolute;
  top: -40%;
  right: -10%;
  width: 220px;
  height: 220px;
  background: radial-gradient(
    circle,
    rgba(255, 184, 0, 0.45) 0%,
    transparent 65%
  );
  filter: blur(8px);
  pointer-events: none;
}

.sc2-banner__title {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1;
}

.sc2-banner__icon {
  color: #ffb800;
  filter: drop-shadow(0 0 12px rgba(255, 184, 0, 0.6));
}

.sc2-banner__text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.sc2-banner__name {
  font-family: "Impact", "Oswald", "SF Compact Display", sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: #ffb800;
  letter-spacing: 0.12em;
  text-shadow: 0 0 16px rgba(255, 184, 0, 0.5);
}

.sc2-banner__sub {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 0.35rem;
  font-weight: 500;
}

/* ---- Body 通用 ---- */
.project-card__body {
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.project-card__head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.project-card__icon {
  font-size: 1.4rem;
  flex-shrink: 0;
}

.project-card__icon--txt {
  color: #0d6efd;
}

.project-card--dark .project-card__icon--txt {
  color: #5d9eff;
}

.project-card__icon--sc2 {
  color: #ffb800;
}

.project-card__title-wrap {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.project-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  margin: 0;
  line-height: 1.2;
}

.project-card__tagline {
  font-size: 0.85rem;
  margin: 0.2rem 0 0;
  opacity: 0.7;
  line-height: 1.4;
}

.project-card__desc {
  font-size: 0.9375rem;
  line-height: 1.65;
  margin: 0;
  opacity: 0.88;
}

.project-card--light .project-card__desc {
  color: #475569;
}

.project-card--dark .project-card__desc {
  color: #cbd5e1;
}

.project-card__label {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.project-card--light .project-card__label {
  color: #475569;
}

.project-card--dark .project-card__label {
  color: #94a3b8;
}

.project-card__list {
  margin: 0.25rem 0 0;
  padding-left: 1.25rem;
  font-size: 0.9375rem;
  line-height: 1.7;
}

.project-card--light .project-card__list {
  color: #475569;
}

.project-card--dark .project-card__list {
  color: #cbd5e1;
}

.project-card__list li {
  margin-top: 0.2rem;
}

/* ---- Tags + CTA 同一行 ---- */
.project-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.75rem;
  margin-top: 0.25rem;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  flex: 1 1 auto;
  min-width: 0;
}

.project-card__tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
}

.project-card__tag--txt {
  color: #0d6efd;
  border-color: rgba(13, 110, 253, 0.35);
  background: rgba(13, 110, 253, 0.06);
}

.project-card--dark .project-card__tag--txt {
  color: #5d9eff;
  border-color: rgba(93, 158, 255, 0.4);
  background: rgba(93, 158, 255, 0.1);
}

.project-card__tag--sc2 {
  color: #b8800a;
  border-color: rgba(184, 128, 10, 0.4);
  background: rgba(255, 184, 0, 0.08);
}

.project-card--dark .project-card__tag--sc2 {
  color: #ffb800;
  border-color: rgba(255, 184, 0, 0.45);
  background: rgba(255, 184, 0, 0.1);
}

/* ---- CTA ---- */
.project-card__cta {
  margin-top: 0;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
  text-decoration: none;
}

.project-card__cta--with-tags {
  margin-left: auto;
}

.project-card__cta--txt {
  background: #0d6efd;
  color: #fff;
  box-shadow: 0 2px 8px rgba(13, 110, 253, 0.25);
}

.project-card__cta--txt :deep(svg) {
  color: inherit;
}

.project-card__cta--txt:hover {
  background: #0b5ed7;
  box-shadow: 0 4px 14px rgba(13, 110, 253, 0.35);
  transform: translateY(-1px);
}

.project-card__cta--sc2 {
  background: linear-gradient(135deg, #ffb800 0%, #ff8a00 100%);
  color: #1a0d2e;
  box-shadow: 0 2px 12px rgba(255, 184, 0, 0.35);
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
}

.project-card__cta--sc2:hover {
  box-shadow: 0 4px 18px rgba(255, 184, 0, 0.55);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .project-card__banner {
    height: 7.5rem;
  }

  .project-card__banner--sc2 {
    height: 8.5rem;
  }

  .sc2-banner__name {
    font-size: 1.45rem;
  }

  .project-card__body {
    padding: 1rem 1.15rem 1.25rem;
  }
}
</style>
