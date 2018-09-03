<template>
  <div class="navbar-wrapper">
    <v-layout wrap>
      <v-flex md10>
        <v-toolbar flat color="white">
          <v-toolbar-side-icon class="hidden-md-and-up" @click="drawer = !drawer"></v-toolbar-side-icon>
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
       <v-navigation-drawer
          v-model="drawer"
          enable-resize-watcher
          light
          app
          >
          <v-list class="pa-1">
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  <h2>Brewdog</h2>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <router-link
              :to="item.href"
              tag="v-list-tile"
              v-for="item in navDrawerItems"
              :key="item.title"
            >
              <v-list-tile-action right>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </router-link>
          </v-list>
          <v-list class="pt-0" dense>
            <v-divider></v-divider>
          </v-list>
        </v-navigation-drawer>
      <v-flex md2 class="nav-search-wrapper">
        <v-text-field
            label="Solo"
            placeholder="search"
            prepend-icon="search"
            solo
            flat
            clearable
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
      drawer: false,
      navDrawerItems: [
        { title: 'Featured', icon: 'star', href: '/featured' },
        { title: 'Beer Galery', icon: 'grid_on', href: '/gallery' },
        { title: 'Ingredients', icon: 'local_dining', href: '/ingredients' },
        { title: 'About', icon: 'help', href: '/about' },
      ],
    };
  },
  mounted() {
    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onResize, { passive: true });
    }
  },
  methods: {
    onResize() {
      this.isMobile = window.innerWidth < 700;
    },
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
@media (min-width: 959px) {
  .nav-search {
    height: 50px;
    padding-top: 7px;
    padding-left: 10px;
  }
}

@media (max-width: 959px) {
  .v-text-field {
    max-height: 35px !important;
  }
}
.nav-search {
  margin-top: 7px;
  padding-left: 10px;
  height: 50px;
}
.nav-search-wrapper {
  @media (max-width: 960px) {
    height: 60px;
  }
  border-left: 1px solid lightgrey;
}
</style>
