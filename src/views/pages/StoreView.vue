<template>
  <div class="bg-colorSecond pt-[10px] pb-[32px] px-[4px] sm:px-[18px] md:px-[70px]">
    <h2 class="text-main font-[800] text-[32px] md:text-[50px] leading-tight md:leading-[65.1px] py-[16px] text-center md:text-start">Merchandise</h2>

    <MerchPoNotice />

    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-400 fill-current">
            <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z"/>
          </svg>
        </span>
        <input v-model="search" @input="onSearchInput" placeholder="Cari merchandise..." class="block w-full py-2 pl-9 pr-4 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400" />
      </div>
      <div class="relative">
        <select v-model="selectedCategory" @change="getData" class="appearance-none w-full sm:w-48 py-2 pl-3 pr-8 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400">
          <option value="">Semua Kategori</option>
          <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <svg class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
        </svg>
      </div>
    </div>
    <div v-if="selectedCategory" class="mb-4 flex items-center gap-2">
      <span class="text-sm text-gray-500">Filter:</span>
      <span class="inline-flex items-center gap-1 px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
        {{ selectedCategory }}
        <button @click="clearCategory" class="ml-1 hover:text-blue-600 leading-none">&#x2715;</button>
      </span>
    </div>

  <div class="flex justify-center">
    <Loading :active="isLoading" class="mt-20" />
    <div v-if="!isLoading && filteredMerchandises.length === 0" class="text-center py-20 text-gray-500">
      <p class="text-lg font-semibold">Tidak ada merchandise ditemukan.</p>
      <p class="text-sm mt-1">Coba ubah filter atau kata kunci pencarian.</p>
    </div>
    <div v-if="!isLoading && filteredMerchandises.length > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-1 sm:gap-2 lg:gap-4">
      <div
        v-for="(merchandise, idx) in filteredMerchandises"
        :key="merchandise.id"
        class="max-w-sm bg-white border border-gray-200 rounded-lg shadow"
      >
        <div class="w-full h-[200px] overflow-hidden relative">
          <span v-if="merchandise.kategori" class="absolute top-2 left-2 z-10 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-600 text-white shadow">{{ merchandise.kategori }}</span>
          <img
            v-if="merchandise.image"
            :src="merchandise.image"
            :alt="merchandise.name"
            class="rounded-t-lg h-48 w-96 object-cover"
          />
          <img
            v-else
            :src="require('@/assets/image/default.png')"
            alt="No Image"
            class="rounded-t-lg"
          />
        </div>
        <div class="p-5 bg-white">
          <a href="#">
            <h5 class="mb-2 text-sm md:text-2xl font-bold tracking-tight text-gray-900">
              {{ merchandise.name }}
            </h5>
          </a>
          <p class="mb-3 text-sm  font-normal text-gray-700 dark:text-gray-400">
            {{ truncate(merchandise.description) }}
          </p>
          <p class="mb-3 font-bold text-main text-sm md:text-lg">
            {{ formatPrice(merchandise.price) }}
          </p>
          <p class="mb-3 font-normal text-gray-500 dark:text-gray-400 text-sm md:text-sm">
            Stok: {{ merchandise.stock }}
          </p>
          <div v-if="merchandise.stock > 0">
            <a
              :href="merchandise?.link || `/merchandise/${merchandise.id}`"
              target="_blank"
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              Beli
              <svg
                class="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </a>
          </div>
          <div v-else>
            <button
              disabled
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-gray-400 rounded-lg cursor-not-allowed"
            >
              Sold Out
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import HeaderItem from "@/components/header/HeaderItem.vue";
import { GET_MERCHANDISES } from "@/store/merchandises.module";
import { truncate } from "@/utils/index"
import Loading from "vue-loading-overlay";
import MerchPoNotice from "@/components/MerchPoNotice.vue";

export default {
  components: {
    HeaderItem,
    Loading,
    MerchPoNotice
  },
  data() {
    return {
      data: [],
      isLoading: true,
      search: "",
      selectedCategory: "",
      searchTimer: null,
    };
  },
  computed: {
    merchandises() {
      return this.$store.getters.merchandises;
    },
    availableCategories() {
      const cats = (this.merchandises?.data || []).map((m) => m.kategori).filter((c) => c && c.trim() !== "");
      return [...new Set(cats)].sort();
    },
    filteredMerchandises() {
      let items = this.merchandises?.data || [];
      if (this.selectedCategory) items = items.filter((m) => m.kategori === this.selectedCategory);
      if (this.search.trim()) {
        const q = this.search.trim().toLowerCase();
        items = items.filter((m) => m.name?.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q));
      }
      return items;
    },
  },
  async mounted() {
   await this.getData();
    this.isLoading = false;
  },
  methods: {
    truncate,
    async getData() {
      try {
        await this.$store.dispatch(GET_MERCHANDISES, {
          data: { limit: 100 },
        });
      } catch (err) {
        console.error(err);
      }
    },
    onSearchInput() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => this.getData(), 350);
    },
    clearCategory() {
      this.selectedCategory = "";
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
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
