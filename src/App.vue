<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header class="flex items-center lg:pr-[calc(var(--section-gap)/2)] max-h-screen leading-normal">
    <img
      alt="Vue logo"
      src="@/assets/logo.svg"
      class="block lg:m-0 mx-auto lg:mr-8 mb-8"
      width="125"
      height="125"
    />

    <div class="flex flex-col">
      <HelloWorld msg="You did it!" />

      <nav class="mt-8 w-full text-xs text-center">
        <RouterLink
          to="/"
          class="inline-block hover:bg-transparent px-4 border-[var(--color-border)] first:border-0 border-l text-blue-500 router-link-exact-active:text-[var(--color-text)]"
        >
          Home
        </RouterLink>
        <RouterLink
          to="/about"
          class="inline-block hover:bg-transparent px-4 border-[var(--color-border)] border-l text-blue-500 router-link-exact-active:text-[var(--color-text)]"
        >
          About
        </RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
