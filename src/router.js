import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import BeerGallery from './views/BeerGallery.vue';
import Featured from './views/Featured.vue';
import About from './views/About.vue';
import Ingredients from './views/Ingredients.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/featured',
      name: 'featured',
      component: Featured,
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: BeerGallery,
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/ingredients',
      name: 'ingredients',
      component: Ingredients,
    },
  ],
});
