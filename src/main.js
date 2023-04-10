import { createApp } from "vue";
import "./assets/scss/index.scss";
import App from "./App.vue";
import store from "./store";
const app = createApp(App);

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  theme: { defaultTheme: "dark" },
  components,
  directives,

  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});
app.use(vuetify);
app.use(store);
app.mount("#app");
