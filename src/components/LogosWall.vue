<template>
  <div
    class="div-wall container d-flex align-items-center justify-content-center"
  >
  <ul class="group-lang">
        <li class="wall-item c">
          <img src="/logos/C.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item css">
          <img src="/logos/CSS.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item golang">
          <img src="/logos/Golang.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item html">
          <img src="/logos/HTML.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item java">
          <img src="/logos/Java.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item python">
          <img src="/logos/Python.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item typescript">
          <img src="/logos/TypeScript.png" class="item-size" loading="lazy" />
        </li>
      </ul>
      <ul class="group-network-code">
        <li class="wall-item code-403">
          <img src="/logos/403.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item code-404">
          <img src="/logos/404.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item code-418">
          <img src="/logos/418.png" class="item-size" loading="lazy" />
        </li>
        <li class="wall-item code-503">
          <img src="/logos/503.png" class="item-size" loading="lazy" />
        </li>
      </ul>
    <!-- <ul class="wall p-0">
      

      <li class="wall-item">
        <img src="/logos/Clion.png" class="item-size" loading="lazy" />
      </li>
      <li class="wall-item">
        <img src="/logos/Cloudflare.png" class="item-size" loading="lazy" />
      </li>
      <li class="wall-item">
        <img src="/logos/GitLab.png" class="item-size" loading="lazy" />
      </li>
      <li class="wall-item">
        <img src="/logos/Github.png" class="item-size" loading="lazy" />
      </li>

      <li class="wall-item">
        <img src="/logos/Node.js.png" class="item-size" loading="lazy" />
      </li>

      <li class="wall-item">
        <img src="/logos/React.png" class="item-size" loading="lazy" />
      </li>

      <li class="wall-item">
        <img src="/logos/Tailwindcss6.png" class="item-size" loading="lazy" />
      </li>

      <li class="wall-item">
        <img src="/logos/Ubuntu.png" class="item-size" loading="lazy" />
      </li>
      <li class="wall-item">
        <img src="/logos/VisualStudio.png" class="item-size" loading="lazy" />
      </li>
      <li class="wall-item">
        <img
          src="/logos/VisualStudioCode.png"
          class="item-size"
          loading="lazy"
        />
      </li>
      <li class="wall-item">
        <img src="/logos/Vite.png" class="item-size" loading="lazy" />
      </li>
      <li class="wall-item">
        <img src="/logos/Vue.png" class="item-size" loading="lazy" />
      </li>
    </ul> -->
  </div>
</template>
<script setup lang="ts"></script>
<style>
.div-wall {
  height: 1px;
  width: 1px;
  position: relative;
  top: calc(4.875rem - 50vh);
  bottom: calc(4.875rem - 50vh);
  z-index: 0;
  max-height: 100vh;
}
.wall-item {
  list-style: none;
  position: absolute;
  border-radius: 50%;
}
.item-size {
  width: 12rem;
  height: auto;
}
/*
  基准:
      top: -3.375rem;
      left: -6rem;
  */
.group-network-code {
  position: relative;
  top: calc(-3.375rem + 8rem);
  left: calc(-6rem - 15rem);
}
.group-network-code .code-404{
  top: 2.5rem;
  left: 7rem;
}
.group-network-code .code-403{
  top: -2rem;
  left: -3rem;
}
.group-network-code .code-418{
  top: 3rem;
  left: -3rem;
}
.group-network-code .code-503{
  top: -3rem;
  left: 6rem;
}

.group-lang {
  position: relative;
  top: calc(-3.375rem - 10.5rem);
  left: calc(-6rem - .5rem);
}
.group-lang .golang{
  top: 0rem;
  left: -10rem;
  transform: rotate(10deg);
}
.group-lang .python{
  top: 9rem;
  left: -7rem;
  transform: rotate(346deg);
}
.group-lang .c{
  top: 5rem;
  left: -10rem;
}
.group-lang .html{
  top: -3.5rem;
  left: 2rem;
  transform: rotate(7deg);
}
.group-lang .typescript{
  top: 0rem;
  left: 12rem;
}
.group-lang .css{
  top: 5rem;
  left: 12rem;
  transform: rotate(346deg);
}
.group-lang .java{
  top: 1.5rem;
  left: 1rem;
  transform: rotate(356deg);
}
</style>
