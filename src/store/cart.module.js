// Keranjang merchandise. Disimpan di localStorage (tanpa login); harga,
// stok, dan opsi disegarkan dari server di halaman keranjang dan dihitung
// ulang oleh server saat pesanan dibuat.
export const ADD_TO_CART = "addToCart";
export const SET_CART_QTY = "setCartQty";
export const REMOVE_FROM_CART = "removeFromCart";
export const CLEAR_CART = "clearCart";
export const REPLACE_CART = "replaceCart";

const STORAGE_KEY = "iom_cart";
export const MAX_CART_ITEMS = 20;

export const readCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((i) => i && i.merchandiseId && i.qty > 0) : [];
  } catch {
    return [];
  }
};

const writeCart = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* abaikan: penyimpanan penuh/diblokir, keranjang tetap jalan di sesi ini */
  }
};

// Produk + kombinasi opsi yang sama = satu baris.
export const cartKey = (merchandiseId, selectedOptions = {}) => {
  const opts = Object.keys(selectedOptions).sort().map((k) => [k, selectedOptions[k]]);
  return JSON.stringify([Number(merchandiseId), opts]);
};

const state = {
  items: readCart(),
};

const getters = {
  cartItems: (state) => state.items,
  cartCount: (state) => state.items.reduce((sum, i) => sum + i.qty, 0),
};

const mutations = {
  // item: { merchandiseId, name, image, unitPrice, weight (gram/pcs), stock, qty, selectedOptions }
  [ADD_TO_CART](state, item) {
    const key = cartKey(item.merchandiseId, item.selectedOptions);
    const existing = state.items.find((i) => i.key === key);
    if (existing) {
      existing.qty += item.qty;
    } else {
      state.items.push({ ...item, key, selectedOptions: item.selectedOptions || {} });
    }
    writeCart(state.items);
  },
  [SET_CART_QTY](state, { key, qty }) {
    const item = state.items.find((i) => i.key === key);
    if (item) item.qty = qty;
    writeCart(state.items);
  },
  [REMOVE_FROM_CART](state, key) {
    state.items = state.items.filter((i) => i.key !== key);
    writeCart(state.items);
  },
  [REPLACE_CART](state, items) {
    state.items = items;
    writeCart(state.items);
  },
  [CLEAR_CART](state) {
    state.items = [];
    writeCart(state.items);
  },
};

export default {
  state,
  getters,
  mutations,
};
