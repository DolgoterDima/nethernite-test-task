<template>
  <v-app class="page">
    <v-main class="page__main">
      <v-container>
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              :loading="getLoadStatus"
              label="Search packages"
              v-model="searchModel"
              @update:modelValue="searchPackage"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <template v-if="getPackagesArray.length">
              <v-table class="table">
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in getPackagesArray"
                    :key="item.name"
                    @click="openDialog(item)"
                    class="table__row"
                  >
                    <td>
                      <span :class="{ skeleton: getLoadStatus }">{{
                        item.name
                      }}</span>
                    </td>
                    <td>
                      <span :class="{ skeleton: getLoadStatus }">{{
                        item.description
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </v-table>

              <v-pagination
                @update:model-value="goToPage"
                v-model="activePage"
                :length="getPagesCount"
              ></v-pagination>
            </template>
            <template v-else>
              <span class="text-h5">No Packages</span>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-dialog
      v-model="isShowDialog"
      scrollable
      width="auto"
      class="page__dialog dialog"
    >
      <v-container class="bg-grey-darken-4">
        <v-row class="ma-0" justify="space-between" align="center">
          <v-col class="pl-0"
            ><span class="text-h5 pr-2">{{ dialogInfo.name }}</span>
            <span class="text-subtitle-2">{{ dialogInfo.version }}</span></v-col
          >

          <v-btn class="ma-2" color="red" @click="closeDialog">
            <v-icon icon="mdi-close"></v-icon>
          </v-btn>
        </v-row>
        <template v-if="dialogInfo.description">
          <v-divider :thickness="2" class="mt-3 mb-3"></v-divider>
          <p class="text-subtitle-1">
            {{ dialogInfo.description }}
          </p>
        </template>

        <template v-if="dialogInfo.links">
          <v-divider :thickness="2" class="mt-3 mb-3"></v-divider>
          <v-row class="dialog__row ma-0">
            <v-btn
              v-if="dialogInfo.links.bugs"
              prepend-icon="mdi-bug"
              :href="dialogInfo.links.bugs"
              variant="outlined"
              >Bugs
            </v-btn>
            <v-btn
              v-if="dialogInfo.links.homepage"
              prepend-icon="mdi-home"
              :href="dialogInfo.links.homepage"
              variant="outlined"
              >Homepage
            </v-btn>
            <v-btn
              v-if="dialogInfo.links.npm"
              prepend-icon="mdi-npm"
              :href="dialogInfo.links.npm"
              variant="outlined"
            >
              NPM
            </v-btn>
            <v-btn
              v-if="dialogInfo.links.repository"
              prepend-icon="mdi-github"
              :href="dialogInfo.links.repository"
              variant="outlined"
            >
              Repository
            </v-btn>
          </v-row>
        </template>

        <template v-if="dialogInfo.keywords">
          <v-divider :thickness="2" class="mt-3 mb-3"></v-divider>
          <v-chip-group>
            <v-chip
              v-for="tag in dialogInfo.keywords"
              :key="tag"
              class="0"
              color="primary"
              label
              text-color="white"
            >
              <v-icon start icon="mdi-label"></v-icon>
              {{ tag }}
            </v-chip>
          </v-chip-group>
        </template>

        <template v-if="dialogInfo.author">
          <v-divider :thickness="2" class="mt-3 mb-3"></v-divider>
          <v-row>
            <v-col>
              <span class="text-subtitle-1">{{ dialogInfo.author.name }}</span>
            </v-col>
            <v-col v-if="dialogInfo.publisher.name">
              <span class="text-subtitle-1">{{
                dialogInfo.publisher.name
              }}</span>
            </v-col>
            <v-col v-if="dialogInfo.publisher.email">
              <span class="text-subtitle-1">{{
                dialogInfo.publisher.email
              }}</span>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-dialog>
    <v-footer
      absolute
      inset
      class="page__footer bg-grey-darken-4 pb-10 pb-md-2"
    >
      <v-row>
        <v-col cols="12" md="3" class="d-flex justify-center align-center">
          <img
            width="80"
            alt="Dima Ddolgoter"
            src="https://avatars.githubusercontent.com/u/82824726"
          />
        </v-col>

        <v-col cols="12" md="3" class="d-flex justify-center align-center">
          <span class="text-h5">Dolgoter Dima</span>
        </v-col>
        <v-col cols="12" md="3" class="d-flex justify-center align-center">
          <span class="text-subtitle-2"
            ><v-icon icon="mdi-at"></v-icon> dolgoterdima@gmail.com
          </span>
        </v-col>
        <v-col cols="12" md="3" class="d-flex justify-center align-center">
          <v-btn
            prepend-icon="mdi-github"
            href="https://github.com/DolgoterDima"
            variant="outlined"
          >
            GitHub
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup>
const MIN_LETTERS_TO_START_SEARCH = 2;
const DELAY_BEFORE_START_SEARCH = 500;

import { debounce } from "lodash";
import { ref, computed } from "vue";
import { useStore } from "vuex";

const activePage = ref(1);
const searchModel = ref("");
let dialogInfo = ref();
const isShowDialog = ref(false);
const store = useStore();

const getPackagesArray = computed(() => store.getters["packages/getPackagesArray"]);
const getPagesCount = computed(() => store.getters["packages/getPagesCount"]);
const getLoadStatus = computed(() => store.getters["packages/getLoadStatus"]);

const openDialog = (packageInfo) => {
  isShowDialog.value = true;
  dialogInfo = packageInfo;
};

const goToPage = (page) => {
  fetchPackages(page);
};
const closeDialog = () => {
  isShowDialog.value = false;
};

const searchPackage = () => {
  if (searchModel.value.length <= MIN_LETTERS_TO_START_SEARCH) {
    clearTableData();
    return;
  }

  fetchPackages();
};

const clearTableData = () => {
  store.dispatch("packages/clearPackagesArray");
};

const fetchPackages = debounce((page = activePage.value) => {
  store.dispatch("packages/fetchPackagesBySearchParams", {
    searchText: searchModel.value,
    currentPage: page,
  });
}, DELAY_BEFORE_START_SEARCH);
</script>
