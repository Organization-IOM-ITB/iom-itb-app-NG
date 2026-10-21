import { createStore } from "vuex";
import auth from "./auth.module";
import activities from "./activities.module";
import merchandises from "./merchandises.module";
import donations from "./donations.module";
import helpSubmissions from "./helpSubmissions.module";
import transactions from "./transactions.module";
import members from "./members.module";
import faculties from "./faculties.module";
import kemitraan from "./kemitraan.module";
import kegiatanKemitraan from "./kegiatanKemitraan.module";
import cart, { REPLACE_CART, readCart } from "./cart.module";

const store = createStore({
  state() {
    return {
      // state properties
    };
  },
  mutations: {
    // mutations
  },
  actions: {
    // actions
  },
  modules: {
    auth,
    activities,
    merchandises,
    donations,
    helpSubmissions,
    transactions,
    members,
    faculties,
    kemitraan,
    kegiatanKemitraan,
    cart,
  },
});

// Keranjang diubah di tab lain → samakan tab ini.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "iom_cart") store.commit(REPLACE_CART, readCart());
  });
}

export default store;
