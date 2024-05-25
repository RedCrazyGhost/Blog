<template>
  <div>
    <Loading v-if="!isOk" />
    <div
      v-show="isOk"
      id="carouselExampleCaptions"
      class="carousel slide carousel-fade col-10 offset-1"
    >
      <div class="carousel-indicators">
        <button
          v-for="(item, index) in Images"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          :key="index"
          :class="index == 0 ? 'active' : ''"
          :data-bs-slide-to="index"
          :aria-label="'Slide ' + index"
          :aria-current="index == 0 ? 'true' : 'false'"
        ></button>
      </div>
      <div class="carousel-inner">
        <div
          :class="'carousel-item ' + (index == 0 ? 'active' : '')"
          v-for="(item, index) in Images"
          :key="'image-' + index"
        >
          <img
            @load="ImgNum += 1"
            :src="CDN.getURL(item.path)"
            class="d-block w-100"
            :alt="item.alt"
          />
          <div class="carousel-caption d-none d-md-block">
            <h5>{{ item.title }}</h5>
            <p>{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Loading from "@/components/Loading.vue";
import { useCDNStore } from "@/stores/CDN";
import { ref, computed } from "vue";

const ImgNum = ref(0);
const CDN = useCDNStore();

const Images = ref([
  {
    path: "/IMG/1.png",
    alt: "江之岛拍摄的富士山",
    title: "山-岛",
    desc: "江之岛拍摄的富士山",
  },
  {
    path: "/IMG/2.png",
    alt: "夜晚的七里滨",
    title: "夜之滨",
    desc: "夜晚的七里滨",
  },
  {
    path: "/IMG/3.png",
    alt: "清水寺",
    title: "清水寺",
    desc: "",
  },
  {
    path: "/IMG/4.png",
    alt: "京都",
    title: "京都-鸭川",
    desc: "",
  },
  {
    path: "/IMG/5.png",
    alt: "奈良公园",
    title: "奈良公园",
    desc: "",
  },
  {
    path: "/IMG/6.png",
    alt: "函馆山",
    title: "函馆山夜",
    desc: "",
  },
  {
    path: "/IMG/7.png",
    alt: "五棱郭",
    title: "五棱郭",
    desc: "",
  },
  {
    path: "/IMG/8.png",
    alt: "五棱郭-樱花群",
    title: "樱花群",
    desc: "五棱郭",
  },
]);

const isOk = computed(() => {
  return ImgNum.value == Images.value.length;
});
</script>
