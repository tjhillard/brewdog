<template>
  <div class="navbar-wrapper">
    <v-layout row>
      <v-flex xs10>
        <v-toolbar flat color="white">
          <router-link tag="v-toolbar-title" to="/" class="link">Brewdog</router-link>
          <v-spacer></v-spacer>
          <v-toolbar-items class="hidden-sm-and-down">
            <v-btn class="nav-link" to="/featured" flat>Featured</v-btn>
            <v-btn class="nav-link" to="/gallery" flat>Beer Gallery</v-btn>
            <v-btn class="nav-link" to="/ingredients" flat>Ingredients</v-btn>
            <v-btn class="nav-link" to="/about" flat>About</v-btn>
          </v-toolbar-items>
        </v-toolbar>
      </v-flex>
      <v-flex xs2 class="nav-search-wrapper">
        <v-text-field
            label="Solo"
            placeholder="search"
            prepend-icon="search"
            solo
            flat
            color="dark"
            class="nav-search"
            v-model="searchQuery"
          ></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      searchQuery: '',
    };
  },
  watch: {
    searchQuery(newVal) {
      if (this.$route !== '/gallery') {
        this.$router.push({ path: 'gallery' });
      }
      this.$root.$emit('searchQueryUpdated', newVal);
    },
  },
};
</script>

<style scoped lang="scss">
.navbar-wrapper {
  border-bottom: 1px solid lightgrey;
}
.nav-link {
  text-transform: none !important;
}
.link {
  cursor: pointer;
}
.nav-search {
  height: 50px;
  padding-top: 7px;
  padding-left: 10px;
}
.nav-search-wrapper {
  border-left: 1px solid lightgrey;
}
</style>
