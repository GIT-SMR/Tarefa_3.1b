<template>
  <main ref="prototype" class="animalec-prototype" :data-entity="entity"></main>
</template>

<script>
import "../../public/prototipos/admin-prototipo.js";
import "../../public/prototipos/prototipo.css";

export default {
  name: "AdminPrototype",
  props: {
    entity: { type: String, required: true }
  },
  mounted() {
    this.renderEntity();
  },
  watch: {
    entity() {
      this.renderEntity();
    }
  },
  beforeDestroy() {
    if (this.unmountEntity) this.unmountEntity();
  },
  methods: {
    renderEntity() {
      if (this.unmountEntity) this.unmountEntity();
      this.unmountEntity = window.AnimalecPrototype.mountEntity(
        this.$refs.prototype,
        this.entity,
        {
          menuUrl: this.$router.resolve({ name: "admin" }).href,
          goToMenu: () => this.$router.push({ name: "admin" })
        }
      );
    }
  }
};
</script>
