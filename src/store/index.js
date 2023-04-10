import { createStore } from 'vuex'

 import packages from './modules/packages.js';

const store = createStore({


  modules: {
    packages: packages
  }
})

export default store