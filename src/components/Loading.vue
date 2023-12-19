<template>
    <div style="display:inline-flex; align-items:center; width:100%; justify-content:center;">
        <img class="blinking" v-bind:src="require('@/assets/brand/loading.gif')" style="width: 75px;" />
        <h1 class="blinking" color="primary" style="color:white">Loading</h1>
    </div>
</template>
<style>
.blinking {
  animation: blink 1s 5 alternate;
}
@keyframes blink {
  from {   opacity: 1; }
  to { opacity: 0.25; }
}
</style>