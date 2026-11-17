<template>
  <b-card bg-variant="secondary" text-variant="white" class="text-center">
    <router-link class="admin-option" :to="{ name: routeName }">
      <span class="admin-marker" aria-hidden="true">{{ marker }}</span>
      <span>{{ title }}</span>
    </router-link>
  </b-card>
</template>

<script>
export default {
  name: "AdminOptionBox",
  props: ["routeName", "marker", "title"]
};
</script>

<style scoped>
.admin-option {
  display: flex;
  min-height: 5.5rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  color: white;
  font-weight: 700;
}
.admin-marker {
  display: grid;
  width: 2.65rem;
  height: 2.65rem;
  place-items: center;
  border-radius: 0.35rem;
  background: #44586a;
  font-size: 1.35rem;
}
.admin-option:focus-visible {
  outline: 3px solid white;
  outline-offset: 6px;
}
</style>
