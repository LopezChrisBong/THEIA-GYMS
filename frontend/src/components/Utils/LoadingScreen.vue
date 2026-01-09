<template>
  <v-row justify="center">
    <v-overlay
      :z-index="zIndex"
      :opacity="opacity"
      :value="overlay"
      color="#239FAB"
    >
      <v-progress-circular
        :size="200"
        :width="7"
        color="white"
        indeterminate
      ></v-progress-circular>
      <!-- <v-img class="center blink" src="/img/koopsys.png" height="150" width="150"></v-img> -->
    </v-overlay>
  </v-row>
</template>

<script>
export default {
  data: () => ({
    overlay: true,
    opacity: 1,
    zIndex: 0,
  }),
};
</script>

<style scoped>
.close {
  position: absolute;
  left: 600px;
  top: -150px;
}
.center {
  position: absolute;
  top: 20px;
  left: 23px;
}
@-webkit-keyframes blinker {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.blink {
  text-decoration: blink;
  -webkit-animation-name: blinker;
  -webkit-animation-duration: 0.6s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-timing-function: ease-in-out;
  -webkit-animation-direction: alternate;
}
</style>
