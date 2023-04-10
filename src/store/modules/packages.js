export default {
  namespaced: true,
  state() {
    return {
      packagesPerPage: 10,
      packagesArray: [],
      totalPackages: 0,
      isLoading: false,
    };
  },
  getters: {
    getPagesCount: (state) =>
      Math.floor(state.totalPackages / state.packagesPerPage),

    getPackagesArray: (state) => state.packagesArray,
    getLoadStatus: (state) => state.isLoading,
  },
  mutations: {
    SET_LOADING_STATUS: (state, payload) => (state.isLoading = payload),

    SET_TOTAL(state, payload) {
      state.totalPackages = payload;
    },
    SET_PACKAGES_ARRAY(state, payload) {
      state.packagesArray = payload?.map((item) => item?.package);
    },
  },
  actions: {
    clearPackagesArray({ commit }) {
      try {
        commit("SET_PACKAGES_ARRAY", []);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchPackagesBySearchParams(
      { commit, state },
      { searchText, currentPage }
    ) {
      try {
        commit("SET_LOADING_STATUS", true);
        const offsetPackagesByPage = currentPage * state.packagesPerPage;
        const response = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=${searchText}&from=${offsetPackagesByPage}&size=${state.packagesPerPage}`
        );

        const data = await response.json();
        commit("SET_LOADING_STATUS", false);

        commit("SET_PACKAGES_ARRAY", data?.objects);
        commit("SET_TOTAL", data.total);
      } catch (error) {
        console.error(error);
      }
    },
  },
};
