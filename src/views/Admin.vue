<template>
  <section class="page-section">
    <b-container fluid>
      <HeaderPage title="Gestão do Animalec" />

      <b-row>
        <b-col cols="12" md="10" lg="8" xl="6" class="mx-auto">
          <b-card-group deck>
            <AdminOptionBox
              routeName="listUsers"
              marker="U"
              title="Utilizadores"
            />
            <AdminOptionBox
              routeName="listAnimals"
              marker="A"
              title="Animais"
            />
          </b-card-group>
          <b-card-group deck class="mt-3">
            <AdminOptionBox
              routeName="listQuizzes"
              marker="Q"
              title="Quizzes"
            />
            <AdminOptionBox
              routeName="listQuestions"
              marker="?"
              title="Questões"
            />
          </b-card-group>
          <b-card-group deck class="mt-3">
            <AdminOptionBox
              routeName="listSponsors"
              marker="P"
              title="Patrocinadores"
            />
            <AdminOptionBox
              routeName="listExperts"
              marker="E"
              title="Especialistas científicos"
            />
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
import HeaderPage from "@/components/HeaderPage.vue";
import AdminOptionBox from "@/components/AdminOptionBox.vue";

export default {
  components: {
    HeaderPage,
    AdminOptionBox
  }
};
</script>
