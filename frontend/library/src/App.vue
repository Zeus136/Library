<template>
  <div class="app-container">
    <header class="header">
      <Header />
    </header>
    <div class="container">
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";

export default {
  name: "App",
  components: {
    Header,
  },
};
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 100%;
}

.container {
  max-width: 800px;
  margin: 20px auto;
}

@media (max-width: 1200px) {
  .container {
    max-width: 900px;
  }
}

@media (max-width: 992px) {
  .container {
    max-width: 750px;
  }
}

@media (max-width: 768px) {
  .container {
    max-width: 500px;
  }
}

@media (max-width: 576px) {
  .container {
    max-width: 100%;
    padding: 10px;
  }
}
</style>
