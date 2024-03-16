<template>
   <div>  
    <Loading v-if="!isOk"/>
    <div v-show="isOk" id="carouselExampleCaptions" class="carousel slide carousel-fade col-10 offset-1">
        <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
        <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
        </div>
        <div class="carousel-inner">
            <div class="carousel-item active">
                <img @load="ImgNum+=1" :src="CDN.getURL('/IMG/1.png')" class="d-block w-100" alt="江之岛拍摄的富士山" >
                <div class="carousel-caption d-none d-md-block">
                <h5>山-岛</h5>
                <p>江之岛拍摄的富士山</p>
                </div>
            </div>
            <div class="carousel-item">
                <img @load="ImgNum+=1" :src="CDN.getURL('/IMG/2.png')" class="d-block w-100" alt="夜晚的七里滨" >
                <div class="carousel-caption d-none d-md-block">
                <h5>夜之滨</h5>
                <p>夜晚的七里滨</p>
                </div>
            </div>
            <div class="carousel-item">
                <img @load="ImgNum+=1" :src="CDN.getURL('/IMG/3.png')" class="d-block w-100" alt="清水寺" >
                <div class="carousel-caption d-none d-md-block">
                <h5>清水寺</h5>
                <p></p>
                </div>
            </div>
            <div class="carousel-item">
                <img @load="ImgNum+=1" :src="CDN.getURL('/IMG/4.png')" class="d-block w-100" alt="京都" >
                <div class="carousel-caption d-none d-md-block">
                <h5>京都-鸭川</h5>
                <p></p>
                </div>
            </div>
            <div class="carousel-item">
                <img @load="ImgNum+=1" :src="CDN.getURL('/IMG/5.png')" class="d-block w-100" alt="奈良公园" >
                <div class="carousel-caption d-none d-md-block">
                <h5>奈良公园</h5>
                <p></p>
            </div>
            </div>
        </div>
    </div>
</div>
</template>
<script setup lang="ts">
import Loading from '@/components/Loading.vue';
import { useCDNStore } from '@/stores/CDN'
import { ref, computed } from "vue";

const ImgNum = ref(0)
const CDN = useCDNStore()

const isOk = computed(() => {
    return ImgNum.value == 5
})

</script>