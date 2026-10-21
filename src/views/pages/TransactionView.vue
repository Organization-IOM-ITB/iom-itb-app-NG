<template>
  <div class="bg-colorSecond pb-[32px] px-[18px] md:px-[70px]">
    <form @submit.prevent="submitSearch" class="max-w-md mx-auto mb-[8px]">
      <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
      <div class="relative">
        <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search Transaction With Code"
          v-model="search"
          required
        />
        <button
          type="submit"
          class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Search
        </button>
      </div>
    </form>

    <!-- Transaction Card -->
    <div v-if="currentTransaction && currentTransaction.code" class="transaction-card bg-white p-4 rounded-lg shadow-md">
      <div class="flex justify-between items-center">
        <!-- Product Image -->
        <div class="w-1/4">
          <img :src="currentTransaction?.merchandises?.image" alt="Product Image" class="rounded-lg object-cover" />
        </div>

        <!-- Transaction Details -->
        <div class="w-3/4 pl-4">
          <h2 class="text-lg font-bold">{{ currentTransaction?.merchandises?.name }}<span v-if="itemCount > 1" class="text-gray-500 font-normal"> +{{ itemCount - 1 }} produk lain</span></h2>
          <p class="text-gray-600">Kode: {{ currentTransaction?.code }}</p>
          <p class="text-gray-600">Username: {{ currentTransaction?.username }}</p>
          <p class="text-gray-600">Email: {{ currentTransaction?.email }}</p>
          <p class="text-gray-600">No Telp: {{ currentTransaction?.noTelp }}</p>
          <ul v-if="itemCount" class="text-gray-600">
            <li v-for="(item, index) in currentTransaction.items" :key="index">
              {{ item.merchandiseName }}<span v-if="(item.selectedOptions || []).length"> ({{ item.selectedOptions.map((o) => `${o.name} ${o.value}`).join(", ") }})</span>
              — {{ item.qty }} x {{ formatPrice(item.unitPrice) }}
            </li>
          </ul>
          <template v-else>
            <p v-if="(currentTransaction?.selectedOptions || []).length" class="text-gray-600">
              Pilihan: {{ currentTransaction.selectedOptions.map((o) => `${o.name} ${o.value}`).join(", ") }}
            </p>
            <p class="text-gray-600">Jumlah: {{ currentTransaction?.qty }}</p>
            <p class="text-gray-600">Harga: {{ formatPrice(currentTransaction?.merchandises?.price) }}</p>
          </template>
          <p v-if="currentTransaction?.shippingCost != null" class="text-gray-600">Ongkir: {{ formatPrice(currentTransaction.shippingCost) }}</p>
          <p class="text-gray-600">Total: {{ formatPrice(currentTransaction?.grossAmount ?? currentTransaction?.merchandises?.price * currentTransaction?.qty) }}</p>

          <!-- Transaction Status -->
          <div class="mt-4">
            <span
              class="text-sm font-semibold capitalize"
              :class="{
                'text-yellow-500': currentTransaction?.status === 'waiting',
                'text-blue-500': currentTransaction?.status === 'on progress',
                'text-green-500': currentTransaction?.status === 'on delivery',
                'text-gray-500': currentTransaction?.status === 'arrived',
                'text-green-600': currentTransaction?.status === 'done',
                'text-red-600': currentTransaction?.status === 'canceled',
                'text-red-500': currentTransaction?.status === 'denied'
              }"
            >
              Status: {{ currentTransaction?.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- No Transaction Found -->
    <div v-else-if="this.$route.query.q" class="mt-6 text-gray-500 text-center">
      <p>Transaction not found. Please try again.</p>
    </div>
  </div>
</template>

<script>
import { GET_TRANSACTION_DETAIL } from "@/store/transactions.module";

export default {
  data() {
    return {
      search: this.$route.query.q
    };
  },
  computed: {
    currentTransaction() {
      return this.$store.getters.currentTransaction?.data || {}; // Ensure correct data usage
    },
    itemCount() {
      const items = this.currentTransaction?.items;
      return Array.isArray(items) ? items.length : 0;
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      try {
        if (this.$route.query.q) {
          await this.$store.dispatch(GET_TRANSACTION_DETAIL, {
            code: this.$route.query.q,
          });
        }
      } catch (err) {
        console.error(err);
      }
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
    async submitSearch() {
      try {
        window.location.href = `/transaksi?q=${this.search}`;
      } catch (error) {
        console.error("Transaction failed:", error);
      }
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
</style>
