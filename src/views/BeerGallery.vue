<template>
  <div class="gallery-wrapper">
    <v-layout fill-height>
      <v-flex md10 sm12>
        <v-flex xs12 class="gallery-body">
          <!-- Error if API error -->
          <v-alert
            :value="true"
            type="error"
            v-if="error"
          >
            There was an error fetching the beers. {{ error.message }}.
          </v-alert>
          <!-- sort options on mobile -->
          <v-container class="hidden-lg-and-up">
            <v-layout md12 fluid>
              <v-flex xs1 style="margin-top: 10px;">
                <v-icon @click="reverseSort">autorenew</v-icon>
              </v-flex>
              <v-flex>
                <div style="width: 95%;">
                  <v-select
                    :items="sortByMethods"
                    :label="sortBy"
                    v-model="sortBy"
                    flat
                    solo
                  ></v-select>
                </div>
              </v-flex>
            </v-layout>
            <v-layout>
              <div style="width: 95%;">
                <div v-if="isShowingOnlySavedBeers">
                  <v-btn block color="primary" @click="showAllBeers()">
                    Show All Beers
                  </v-btn>
                </div>
                <div v-else>
                  <v-btn block color="success" @click="showOnlySavedBeers()">
                    Show Only Saved ({{ savedBeers.length }})
                  </v-btn>
                </div>
              </div>
            </v-layout>
          </v-container>
          <!-- Beer grid list -->
          <v-container fluid grid-list-xs>
            <v-layout wrap justify-center>
                <v-card v-for="beer in beers"
                  :key="beer.id"
                  flat
                  height="250px" width="370px"
                  class="beer-item"
                >
                  <v-layout row>
                    <v-flex md10>
                      <h3 class="text-sm-left" style="float: left;">{{ beer.name }}</h3>
                    </v-flex>
                    <v-flex xs2>
                      <div v-if="savedBeers.includes(beer.id)">
                        <v-icon color="success">check_circle</v-icon>
                      </div>
                      <div v-else>
                        <v-icon color="black" @click="saveBeer(beer.id)">add_circle</v-icon>
                      </div>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <p class="text-sm-left" style="margin-left: 15px;">{{ beer.tagline }}</p>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs2>
                      <img :src="beer.image_url"
                        height="100px"
                        style="float: left; padding-left: 5px;"
                      >
                    </v-flex>
                    <v-flex style="margin-left: 30px; margin-right: 30px;">
                      <!-- abv -->
                      <v-layout row>
                        <v-flex>
                          <p class="text-sm-left"><strong>ABV:</strong> {{ beer.abv || 'n/a' }}</p>
                          <v-progress-linear
                            background-color="grey"
                            color="orange"
                            :value="beer.abv * 4"
                          ></v-progress-linear>
                        </v-flex>
                      </v-layout>
                      <!-- ibu -->
                      <v-layout row>
                        <v-flex>
                          <p class="text-sm-left"><strong>IBU:</strong> {{ beer.ibu || 'n/a' }}</p>
                          <v-progress-linear
                            background-color="grey"
                            color="green"
                            :value="beer.ibu / 2"
                          ></v-progress-linear>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-card>
            </v-layout>
          </v-container>
        </v-flex>
      </v-flex>
      <!-- sidebar -->
      <!-- only shows md and down -->
      <v-flex xs2 class="gallery-sidebar-wrapper hidden-md-and-down">
        <div class="sidebar-filters-content">
          <h3 class="text-sm-left">
      Sort by
      <v-icon style="float: right; margin-right: 10px;"
        @click="reverseSort"
      >
        autorenew
      </v-icon>
    </h3>
    <v-select
      :items="sortByMethods"
      :label="sortBy"
      v-model="sortBy"
      solo
      flat
    ></v-select>
    <div v-if="isShowingOnlySavedBeers">
      <v-btn color="primary" center class="view-saved-button" @click="showAllBeers()">
        Show All Beers
      </v-btn>
    </div>
    <div v-else>
      <v-btn color="success" center class="view-saved-button" @click="showOnlySavedBeers()">
        Show Only Saved ({{ savedBeers.length }})
      </v-btn>
    </div>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import * as _ from 'lodash';

export default {
  name: 'BeerGallery',
  data() {
    return {
      isLoading: null,
      isShowingOnlySavedBeers: false,
      error: null,
      sortBy: 'Alphabetical',
      sortByMethods: ['Alphabetical', 'ABV', 'IBU'],
      sortOrderBy: 'asc',
      beers: [],
      beersCache: [],
      savedBeers: [],
      searchQuery: '',
    };
  },
  mounted() {
    this.fetchBeers();
    // Listen for search event from nav component
    this.$root.$on('searchQueryUpdated', (data) => {
      this.searchQuery = data;
    });
  },
  computed: {
    sortByPropertyName() {
      if (this.sortBy === 'ABV') {
        return 'abv';
      }
      if (this.sortBy === 'IBU') {
        return 'ibu';
      }
      return 'name';
    },
  },
  watch: {
    sortByPropertyName() {
      this.sortBeers();
    },
    searchQuery: _.debounce(function(newVal) { // eslint-disable-line
      if (newVal === '') {
        return this.showAllBeers();
      }
      this.beers = this.beersCache;
      this.showSearchResults(newVal);
    }, 500),
  },
  methods: {
    fetchBeers() {
      this.isLoading = true;
      this.$http.get('/beers').then((res) => {
        if (res.status === 200 && res.data) {
          this.beers = this.getSortedBeers(res.data);
          this.cacheBeersOnVueInstance(this.getSortedBeers(res.data));
          this.isLoading = false;
        }
      }).catch((err) => {
        this.error = err;
        this.isLoading = false;
      });
    },
    cacheBeersOnVueInstance(beers) {
      this.beersCache = beers;
    },
    getSortedBeers(beers) {
      return _.orderBy(beers, this.sortByPropertyName, [this.sortOrderBy]);
    },
    sortBeers() {
      this.beers = this.getSortedBeers(this.beers);
    },
    reverseSort() {
      if (this.sortOrderBy === 'asc') {
        this.sortOrderBy = 'desc';
      } else {
        this.sortOrderBy = 'asc';
      }
      this.sortBeers();
    },
    saveBeer(beer) {
      this.savedBeers.push(beer);
    },
    getSavedFilteredBeers(beers) {
      const savedBeersFullObjects = [];
      beers.forEach((beer) => {
        if (this.savedBeers.includes(beer.id)) {
          savedBeersFullObjects.push(beer);
        }
      });
      return savedBeersFullObjects;
    },
    showOnlySavedBeers() {
      const onlySavedBeers = this.getSavedFilteredBeers(this.beers);
      if (onlySavedBeers.length > 0) {
        this.beers = onlySavedBeers;
        this.isShowingOnlySavedBeers = true;
        return;
      }
      this.isShowingOnlySavedBeers = false;
      alert('You have no saved beers my dude');
    },
    showAllBeers() {
      this.isShowingOnlySavedBeers = false;
      this.beers = this.getSortedBeers(this.beersCache);
    },
    showSearchResults(query) {
      const beersMatchingSearchQuery = [];
      _.map(this.beers, (beer) => {
        if (query) {
          if (beer.name.toLowerCase().includes(query.toLowerCase())) {
            beersMatchingSearchQuery.push(beer);
          }
        }
      });
      if (query) {
        this.beers = beersMatchingSearchQuery;
      }
    },
  },
};
</script>

<style>
.gallery-wrapper {
  height: 100% !important;
}
.gallery-body {
  margin-top: 30px;
}
.gallery-sidebar-wrapper {
  border-left: 1px solid lightgrey;
}
.sidebar-filters-content {
  padding-top: 30px !important;
}
h3 {
  padding-left: 10px
}
.view-saved-button {
  width: 80%;
}
.beer-item {
  border-top: 1px solid black;
  padding-top: 8px;
  border-radius: 0;
}
@media (min-width: 600px) {
  .beer-item {
    margin-right: 20px;
  }
}
.beer-stat {
  font-weight: bold;
}
</style>

