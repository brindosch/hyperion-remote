<template>
  <q-page>
    <div
      class="fixed-center text-center"
      style="backdrop-filter: blur(10px);"
    >
      <p>
        <img src="hyperion-logo-white.png">
      </p>
      <p class="text-white">Nope, this page doesn't exist</p>
      <q-btn
        color="secondary"
        style="width:200px;"
        @click="$router.push('/')"
      >Move on</q-btn>
    </div>
  </q-page>
</template>
