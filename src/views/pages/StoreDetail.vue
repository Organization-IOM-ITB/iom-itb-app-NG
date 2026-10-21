<template>
  <div class="bg-colorSecond pt-[10px] pb-[32px] px-[18px] md:px-[70px]">
    <MerchPoNotice class="max-w-3xl mx-auto" />

    <!-- Merchandise Details -->
    <div class="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow p-6">
      <div class="flex flex-col md:flex-row">
        <div class="flex-shrink-0">
          <img
            v-if="currentMerchandise?.image"
            :src="currentMerchandise.image"
            :alt="currentMerchandise.name"
            class="rounded-lg w-full md:w-[300px] h-auto"
          />
          <img
            v-else
            :src="require('@/assets/image/default.png')"
            alt="No Image"
            class="rounded-lg w-full md:w-[300px] h-auto"
          />
        </div>
        <div class="flex-1 mt-4 md:mt-0 md:ml-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ currentMerchandise.name }}</h1>
          <p class="text-gray-700 mb-4">{{ currentMerchandise.description }}</p>
          <p class="text-2xl font-bold text-main mb-1">{{ formatPrice(unitPrice) }}</p>
          <p v-if="optionExtraPrice" class="text-xs text-gray-500 mb-3">
            Harga dasar {{ formatPrice(currentMerchandise.price) }} + {{ formatPrice(optionExtraPrice) }} dari pilihan Anda
          </p>
          <p class="text-gray-500 mb-6" :class="{ 'mt-3': !optionExtraPrice }">
            Stok: {{ currentMerchandise.stock }}
            <span v-if="inCartQty" class="text-gray-400">({{ inCartQty }} sudah di keranjang)</span>
          </p>

          <!-- Opsi produk (Warna, Lengan, Size, ...) -->
          <div v-for="group in optionGroups" :key="group.name" class="mb-4">
            <label :for="`opt-${group.name}`" class="block text-sm font-medium text-gray-700">
              {{ group.name }} <span class="text-red-500">*</span>
            </label>
            <select
              :id="`opt-${group.name}`"
              v-model="selectedOptions[group.name]"
              class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
              :class="errors.options && !selectedOptions[group.name] ? 'border-red-500' : 'border-gray-300'"
            >
              <option value="" disabled>Pilih {{ group.name }}</option>
              <option v-for="value in group.values" :key="value.label" :value="value.label">
                {{ value.label }}{{ value.extraPrice ? ` (+${formatPrice(value.extraPrice)})` : "" }}
              </option>
            </select>
          </div>
          <p v-if="errors.options" class="-mt-2 mb-4 text-sm text-red-500">{{ errors.options }}</p>

          <!-- Quantity Input -->
          <div class="mb-4">
            <label for="quantity" class="block text-sm font-medium text-gray-700">
              Jumlah Produk <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              v-model="quantity"
              min="1"
              step="1"
              inputmode="numeric"
              :max="currentMerchandise.stock"
              @keydown="blockInvalidQuantityInput"
              @input="sanitizeQuantity"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
              :class="errors.quantity ? 'border-red-500' : 'border-gray-300'"
            />
            <p v-if="errors.quantity" class="mt-1 text-sm text-red-500">{{ errors.quantity }}</p>
          </div>

          <p class="mb-4 text-sm text-gray-600">Subtotal: <strong>{{ formatPrice(subtotal) }}</strong> <span class="text-gray-400">(belum termasuk ongkir)</span></p>

          <div class="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              @click="addToCart(false)"
              class="inline-flex justify-center items-center px-5 py-2 text-main border border-main rounded-lg hover:bg-blue-50 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Tambah ke Keranjang
            </button>
            <button
              type="button"
              @click="addToCart(true)"
              class="inline-flex justify-center items-center px-5 py-2 text-white bg-main rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Beli Sekarang
            </button>
          </div>
          <p class="mt-3 text-xs text-gray-500">
            Bisa memesan beberapa produk sekaligus: tambahkan ke keranjang, lalu checkout sekali dengan satu ongkir.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_MERCHANDISE_DETAIL } from "@/store/merchandises.module";
import { ADD_TO_CART, MAX_CART_ITEMS, cartKey } from "@/store/cart.module";
import Swal from 'sweetalert2';
import MerchPoNotice from "@/components/MerchPoNotice.vue";

export default {
  components: {
    MerchPoNotice,
  },
  data() {
    return {
      quantity: 1,
      selectedOptions: {},
      errors: {
        quantity: "",
        options: "",
      },
    };
  },
  computed: {
    currentMerchandise() {
      return this.$store.getters.currentMerchandise?.data || {};
    },
    merchandiseId() {
      return this.$route.params.id;
    },
    optionGroups() {
      const options = this.currentMerchandise.options;
      return Array.isArray(options) ? options : [];
    },
    // Tambahan harga dari pilihan opsi (mis. XXL, lengan panjang). Server
    // menghitung ulang saat pesanan dibuat.
    optionExtraPrice() {
      return this.optionGroups.reduce((sum, group) => {
        const picked = group.values.find((v) => v.label === this.selectedOptions[group.name]);
        return sum + Number(picked?.extraPrice || 0);
      }, 0);
    },
    unitPrice() {
      return Number(this.currentMerchandise.price || 0) + this.optionExtraPrice;
    },
    subtotal() {
      return Number(this.quantity || 0) * this.unitPrice;
    },
    // Jumlah produk ini (semua kombinasi opsi) yang sudah ada di keranjang;
    // stok berlaku per produk.
    inCartQty() {
      const id = Number(this.currentMerchandise.id);
      return this.$store.getters.cartItems
        .filter((i) => Number(i.merchandiseId) === id)
        .reduce((sum, i) => sum + i.qty, 0);
    },
  },
  watch: {
    optionGroups: {
      immediate: true,
      handler(groups) {
        this.selectedOptions = Object.fromEntries(groups.map((g) => [g.name, ""]));
      },
    },
    selectedOptions: {
      deep: true,
      handler() {
        if (this.errors.options && this.optionGroups.every((g) => this.selectedOptions[g.name])) {
          this.errors.options = "";
        }
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        await this.$store.dispatch(GET_MERCHANDISE_DETAIL, {
          id: this.merchandiseId,
        });
      } catch (err) {
        console.error(err);
      }
    },
    formatPrice(price) {
      return parseFloat(price || 0).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
    async addToCart(checkoutNow) {
      if (!this.validateForm()) return;

      const selectedOptions = this.optionGroups.length ? { ...this.selectedOptions } : {};
      const cart = this.$store.getters.cartItems;
      const isNewLine = !cart.some((i) => i.key === cartKey(this.currentMerchandise.id, selectedOptions));
      if (isNewLine && cart.length >= MAX_CART_ITEMS) {
        await Swal.fire({
          icon: "warning",
          title: "Keranjang penuh",
          text: `Maksimal ${MAX_CART_ITEMS} produk per pesanan. Selesaikan pesanan ini dulu.`,
        });
        return;
      }

      this.$store.commit(ADD_TO_CART, {
        merchandiseId: this.currentMerchandise.id,
        name: this.currentMerchandise.name,
        image: this.currentMerchandise.image,
        unitPrice: this.unitPrice,
        stock: Number(this.currentMerchandise.stock || 0),
        qty: Number(this.quantity),
        selectedOptions,
      });

      if (checkoutNow) {
        this.$router.push("/keranjang");
        return;
      }

      const result = await Swal.fire({
        icon: "success",
        title: "Masuk keranjang",
        text: `${this.currentMerchandise.name} x ${this.quantity} ditambahkan ke keranjang.`,
        showCancelButton: true,
        confirmButtonText: "Lihat Keranjang",
        cancelButtonText: "Lanjut Belanja",
        confirmButtonColor: "#1c3faa",
      });
      this.quantity = 1;
      if (result.isConfirmed) this.$router.push("/keranjang");
      else if (result.dismiss === Swal.DismissReason.cancel) this.$router.push("/merchandise");
    },
    blockInvalidQuantityInput(e) {
      if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
        e.preventDefault();
      }
    },
    sanitizeQuantity() {
      const rawValue = String(this.quantity ?? "");
      const cleanedValue = rawValue.replace(/[^0-9]/g, "");

      if (cleanedValue === "") {
        this.quantity = "";
        return;
      }

      this.quantity = parseInt(cleanedValue, 10);
    },
    validateForm() {
      this.errors = { quantity: "", options: "" };
      let isValid = true;

      const qty = Number(this.quantity);
      const stock = Number(this.currentMerchandise.stock || 0);
      const available = stock - this.inCartQty;

      if (!this.quantity && this.quantity !== 0) {
        this.errors.quantity = "Jumlah produk wajib diisi.";
        isValid = false;
      } else if (!Number.isInteger(qty)) {
        this.errors.quantity = "Jumlah produk harus bilangan bulat.";
        isValid = false;
      } else if (qty < 1) {
        this.errors.quantity = "Jumlah produk minimal 1.";
        isValid = false;
      } else if (stock <= 0) {
        this.errors.quantity = "Stok habis.";
        isValid = false;
      } else if (qty > available) {
        this.errors.quantity = this.inCartQty
          ? `Melebihi stok: tersisa ${Math.max(available, 0)} lagi (${this.inCartQty} sudah di keranjang).`
          : `Jumlah produk tidak boleh melebihi stok (${stock}).`;
        isValid = false;
      }

      const missingOptions = this.optionGroups.filter((g) => !this.selectedOptions[g.name]).map((g) => g.name);
      if (missingOptions.length) {
        this.errors.options = `Pilih ${missingOptions.join(", ")} terlebih dahulu.`;
        isValid = false;
      }

      return isValid;
    },
  },
};
</script>


<style scoped>
.bg-colorSecond {
  background-color: #f3f4f6;
}
.bg-main {
  background-color: #1c3faa;
}
.text-main {
  color: #1c3faa;
}
.border-main {
  border-color: #1c3faa;
}
</style>
