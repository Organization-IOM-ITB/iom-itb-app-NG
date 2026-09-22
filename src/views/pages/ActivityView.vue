<template>
  <Loading :active="isLoading" />
  <div v-if="!isLoading">

    <!-- 404 -->
    <NotFound v-if="notFound" message="Kegiatan yang kamu cari tidak ditemukan." />

    <template v-else>

      <!-- ===== DETAIL ACTIVITY ===== -->
      <div v-if="thisPathHaveSlug" class="bg-white px-[18px] md:px-[70px] pt-8 pb-[32px]">

        <!-- Header: Thumbnail + Judul/Meta -->
        <div class="flex flex-col md:flex-row gap-8 md:gap-12 mb-10 md:mb-14">
          <!-- Thumbnail -->
          <div class="w-full md:w-[45%] shrink-0 bg-gray-100 aspect-[16/9] md:aspect-auto md:h-[340px] overflow-hidden rounded-xl">
            <img
              v-if="activity?.image"
              :src="activity.image"
              :alt="activity.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
              <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>

          <!-- Judul + Tag + Tanggal + Tombol Kembali -->
          <div class="flex-1 flex flex-col justify-center gap-6">
            <!-- Judul, tags, tanggal -->
            <div>
              <h1 class="font-[800] text-[28px] md:text-[38px] leading-tight mb-4 text-main activity-card-copy">
                {{ activity?.title }}
              </h1>
              <div v-if="activity?.tags?.length > 0" class="flex flex-wrap gap-2 mb-4">
                <span
                  v-for="tag in activity.tags"
                  :key="tag.id"
                  @click.prevent="goToTagSearch(tag.name)"
                  class="px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-75 transition-opacity"
                  style="background-color: #003793; color: white;"
                >
                  {{ tag.name }}
                </span>
              </div>
              <p class="text-sm text-gray-400">
                Dipublish pada {{ formatDate(activity?.date) }}
              </p>
            </div>

            <!-- Tombol kembali -->
            <div>
              <a
                href="/kegiatan"
                class="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-medium rounded-full border-2 transition-opacity hover:opacity-70"
                style="border-color: #003793; color: #003793;"
              >
                <img :src="require('@/assets/icon/arrow-left.svg')" class="w-[16px]" style="filter: invert(19%) sepia(98%) saturate(1200%) hue-rotate(210deg) brightness(60%)"/>
                Kembali
              </a>
            </div>
          </div>
        </div>

        <!-- Sidebar kiri + Konten -->
        <div class="flex flex-col md:flex-row gap-8 md:gap-10 items-start mb-10">

          <!-- Sidebar -->
          <div class="w-full md:w-80 shrink-0 border border-gray-200 rounded-2xl px-6 py-6 shadow-sm md:sticky md:top-[20px]">
            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Ditulis oleh</p>
            <ul class="mb-5 space-y-1">
              <template v-if="activity?.contributors?.length > 0">
                <li v-for="(c, i) in activity.contributors" :key="i" class="text-sm text-gray-600 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"/>
                  <a :href="contributorUrl(c)" class="hover:text-main hover:underline">
                    {{ c }}
                  </a>
                </li>
              </template>
              <li v-else class="text-sm text-gray-600 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0"/>
                IOM ITB
              </li>
            </ul>

            <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Dipublikasikan</p>
            <p class="text-sm text-gray-600 mb-5">{{ formatDate(activity?.date) }}</p>

            <div v-if="activity?.tags?.length > 0">
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Kategori</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in activity.tags"
                  :key="tag.id"
                  class="px-2.5 py-1 text-xs font-semibold rounded-full"
                  style="background-color: #003793; color: white;"
                >
                  {{ tag.name }}
                </span>
              </div>
            </div>
          </div>

          <!-- Konten -->
          <div class="flex-1 min-w-0 w-full">
            <div
              v-if="activity?.description"
              class="activity-content mx-auto mb-8"
              v-html="activity.description"
            />

            <div class="article-actions mx-auto">
              <a
                href="/kegiatan"
                class="inline-flex items-center gap-2 px-4 py-2 text-[16px] font-medium text-white bg-main rounded-full hover:opacity-80 transition-opacity"
              >
                <img :src="require('@/assets/icon/arrow-left.svg')" class="w-[18px]"/>
                Kembali
              </a>
            </div>
          </div>
        </div>

        <!-- Kegiatan Lainnya -->
        <div class="mt-16 border-t border-gray-100 pt-10">
          <h2 class="text-main font-[800] text-[24px] md:text-[32px] leading-tight mb-8">Kegiatan Lainnya</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
              v-for="item in otherActivities"
              :key="item.id"
              class="group flex flex-col"
            >
              <!-- Thumbnail -->
              <a :href="getUrl(item.url)" class="w-full aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-3">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </a>
              <!-- Tags -->
              <div class="flex flex-wrap gap-1.5 mb-2">
                <template v-if="item.tags?.length > 0">
                  <span
                    v-for="tag in item.tags"
                    :key="tag.id"
                    @click.prevent="goToTagSearch(tag.name)"
                    class="px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-75 transition-opacity"
                    style="background-color: #003793; color: white;"
                  >
                    {{ tag.name }}
                  </span>
                </template>
                <span v-else class="px-3 py-1 text-xs font-semibold rounded-full" style="background-color: #e5e7eb; color: #6b7280;">
                  Tidak ada kategori
                </span>
              </div>
              <!-- Judul -->
              <a :href="getUrl(item.url)" class="group-hover:opacity-70 transition-opacity">
                <h3 class="font-[700] text-[18px] text-gray-900 leading-snug mb-2 activity-card-copy">
                  {{ truncate(item.title, 70) }}
                </h3>
              </a>
              <!-- Preview -->
              <p class="text-[14px] text-gray-400 leading-relaxed mb-2 line-clamp-2 activity-card-copy">
                {{ truncate(stripHtml(item.description), 100) }}
              </p>
              <!-- Meta -->
              <div class="flex flex-wrap items-center gap-x-1.5 text-xs text-gray-400 mt-auto">
                <span>{{ formatDate(item.date) }}</span>
                <span>·</span>
                <template v-if="item.contributors?.length > 0">
                  <a v-for="(c, i) in item.contributors" :key="i" :href="contributorUrl(c)" class="hover:text-main hover:underline">
                    {{ c }}<span v-if="i < item.contributors.length - 1">,</span>
                  </a>
                </template>
                <span v-else>IOM-ITB</span>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- ===== LIST ACTIVITY ===== -->
      <div v-else class="bg-white px-[18px] md:px-[70px] pt-8 pb-[32px]">

        <template v-if="isContributorPage">
          <div class="mb-10 max-w-3xl">
            <a
              href="/kegiatan"
              class="mb-5 inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-[14px] font-medium transition-opacity hover:opacity-70"
              style="border-color: #003793; color: #003793;"
            >
              <img :src="require('@/assets/icon/arrow-left.svg')" class="w-[16px]" style="filter: invert(19%) sepia(98%) saturate(1200%) hue-rotate(210deg) brightness(60%)"/>
              Semua Kegiatan
            </a>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Kontributor</p>
            <h1 class="mt-2 text-main font-[800] text-[32px] md:text-[46px] leading-tight">
              Tulisan oleh {{ contributorName }}
            </h1>
            <p class="mt-3 text-[15px] leading-relaxed text-gray-500">
              Kumpulan kegiatan dan tulisan yang dipublikasikan dengan kontribusi {{ contributorName }}.
            </p>
          </div>
        </template>

        <!-- Kegiatan Terbaru -->
        <h2 v-if="!isContributorPage" class="text-main font-[800] text-[32px] md:text-[50px] leading-tight mb-10 md:mb-14">
          Kegiatan Terbaru
        </h2>

        <div v-if="!isContributorPage && activities.length > 0" class="flex flex-col md:flex-row gap-8 md:gap-12 mb-16">
          <!-- Thumbnail kiri -->
          <img
            :src="activities[0]?.image"
            :alt="activities[0]?.title"
            class="w-full md:w-1/2 aspect-[16/9] object-cover rounded-xl"
          />
          <!-- Konten kanan -->
          <div class="flex-1 flex flex-col justify-center">
            <!-- Judul -->
            <h4 class="text-[24px] md:text-[32px] text-main font-[800] leading-tight mb-3 activity-card-copy">
              {{ activities[0]?.title }}
            </h4>

            <!-- Tags chips -->
            <div v-if="activities[0]?.tags?.length > 0" class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tag in activities[0].tags"
                :key="tag.id"
                @click="goToTagSearch(tag.name)"
                class="px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-75 transition-opacity"
                style="background-color: #003793; color: white;"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- Tanggal · Kontributor -->
            <div class="flex flex-wrap items-center gap-x-2 text-sm text-gray-400 mb-4">
              <span>{{ formatDate(activities[0]?.date) }}</span>
              <template v-if="activities[0]?.contributors?.length > 0">
                <span>·</span>
                <a
                  v-for="(c, i) in activities[0].contributors"
                  :key="i"
                  :href="contributorUrl(c)"
                  class="hover:text-main hover:underline"
                >
                  {{ c }}<span v-if="i < activities[0].contributors.length - 1">,</span>
                </a>
              </template>
            </div>

            <p class="font-[500] text-[14px] md:text-[16px] text-gray-500 mb-6 line-clamp-4 activity-card-copy">
              {{ truncate(stripHtml(activities[0]?.description), 300) }}
            </p>
            <a
              :href="getUrl(activities[0]?.url)"
            >
            <div>
              <span
                class="inline-flex items-center gap-2 px-4 py-2 text-[14px] font-medium rounded-full border-2 transition-opacity hover:opacity-70"
                style="border-color: #003793; color: #003793;"
              >
              Baca Selengkapnya

                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                </svg>
              </span>
            </div>
            </a>
          </div>
        </div>

        <div id="semua-kegiatan" class="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 class="text-main font-[800] text-[32px] md:text-[40px] leading-tight">
            {{ isContributorPage ? 'Daftar Tulisan' : 'Semua Kegiatan' }}
          </h2>

          <form v-if="!isContributorPage" class="relative w-full md:max-w-[520px]" @submit.prevent="debouncedSearch">
            <label for="activity-search" class="sr-only">Cari kegiatan</label>
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-main" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              id="activity-search"
              v-model="search"
              @input="debouncedSearch"
              type="search"
              placeholder="Cari judul, konten, tag, atau kontributor..."
              class="h-[52px] w-full rounded-xl border-2 border-line-brand bg-surface-subtle py-3.5 pl-12 pr-12 text-[15px] text-gray-800 shadow-sm transition focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
            />
            <button
              v-if="search"
              type="button"
              aria-label="Hapus pencarian"
              class="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              @click="clearSearch"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </form>
        </div>

        <!-- Grid cards -->
        <div v-if="filteredActivities.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article
              v-for="item in filteredActivities"
              :key="item.id"
              class="group flex flex-col"
            >
              <!-- Thumbnail -->
              <a :href="getUrl(item.url)" class="w-full aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden mb-3">
                <img
                  v-if="item.image"
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </a>
            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 mb-2">
              <template v-if="item.tags?.length > 0">
                <span
                  v-for="tag in item.tags"
                  :key="tag.id"
                  @click.prevent="goToTagSearch(tag.name)"
                  class="px-3 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-75 transition-opacity"
                  style="background-color: #003793; color: white;"
                >
                  {{ tag.name }}
                </span>
              </template>
              <span v-else class="px-3 py-1 text-xs font-semibold rounded-full" style="background-color: #e5e7eb; color: #6b7280;">
                Tidak ada kategori
              </span>
              </div>
              <!-- Judul -->
              <a :href="getUrl(item.url)" class="group-hover:opacity-70 transition-opacity">
                <h3 class="font-[700] text-[22px] text-gray-900 leading-snug mb-2 activity-card-copy">
                  {{ truncate(item.title, 70) }}
                </h3>
              </a>
            <!-- Preview -->
            <p class="text-[16px] text-gray-400 leading-relaxed mb-2 line-clamp-2 activity-card-copy">
              {{ truncate(stripHtml(item.description), 100) }}
            </p>
            <!-- Meta -->
            <div class="flex flex-wrap items-center gap-x-1.5 text-xs text-gray-400 mt-auto">
              <span>{{ formatDate(item.date) }}</span>
              <span>·</span>
              <template v-if="item.contributors?.length > 0">
                <a v-for="(c, i) in item.contributors" :key="i" :href="contributorUrl(c)" class="hover:text-main hover:underline">
                  {{ c }}<span v-if="i < item.contributors.length - 1">,</span>
                </a>
              </template>
              <span v-else>IOM-ITB</span>
            </div>
          </article>
        </div>
        <div v-else class="text-center py-16 text-gray-400 text-sm">
          {{ isContributorPage ? `Belum ada tulisan dari ${contributorName}.` : 'Tidak ada kegiatan yang ditemukan.' }}
        </div>
      </div>

    </template>
  </div>
</template>

<script>
import { GET_DETAIL_ACTIVITY, GET_ACTIVITIES } from "@/store/activities.module";
import Loading from "@/components/loading/LoadingItem.vue";
import NotFound from "@/views/pages/Error/404.vue";
import { getUrl, truncate } from "@/utils";

export default {
  components: { Loading, NotFound },
  data() {
    const queryValue = (value) => Array.isArray(value) ? value[0] : value;
    return {
      isLoading: true,
      notFound: false,
      currentSlide: 0,
      searchTimer: null,
      search: queryValue(this.$route.query.q) || queryValue(this.$route.query.tag) || '',
    };
  },
  computed: {
    activities() {
      return this.$store.getters.activities || [];
    },
    activity() {
      return this.thisPathHaveSlug
        ? this.$store.getters.detailActivity
        : this.$store.getters.activities?.[0];
    },
    isContributorPage() {
      return this.$route.name === "Contributor Activity";
    },
    contributorName() {
      return this.$route.params.name ? String(this.$route.params.name) : "";
    },
    thisPathHaveSlug() {
      return this.$route.name === "Detail Activity";
    },
    allMedia() {
      if (!this.activity) return [];
      const media = this.activity.media || [];
      if (this.activity.image) {
        const alreadyInMedia = media.some(m => m.value === this.activity.image);
        if (!alreadyInMedia) {
          return [{ type: 'image', value: this.activity.image, caption: null }, ...media];
        }
      }
      return media;
    },
    filteredActivities() {
      const q = this.isContributorPage ? "" : this.search.trim().toLowerCase();
      const list = this.activities;
      if (!q) return list;
      return list.filter(a => {
        const inTitle = a.title?.toLowerCase().includes(q);
        const inDesc = this.stripHtml(a.description)?.toLowerCase().includes(q);
        const inTags = a.tags?.some(t => t.name?.toLowerCase().includes(q));
        const inContributors = a.contributors?.some(c => c?.toLowerCase().includes(q));
        return inTitle || inDesc || inTags || inContributors;
      });
    },
    otherActivities() {
      const slug = this.$route.params.slug;
      return this.activities
        .filter(a => a.url !== slug)
        .slice(0, 6);
    },
  },
  watch: {
    '$route.query': {
      handler() {
        if (this.isContributorPage) return;
        this.applySearchFromRoute();
      },
      deep: true,
    },
    '$route.params': {
      async handler() {
        this.isLoading = true;
        this.notFound = false;
        await this.getData();
        this.isLoading = false;
      },
      deep: true,
    },
  },
  async mounted() {
    await this.getData();
    this.isLoading = false;
    if (!this.isContributorPage && (this.$route.query.tag || this.$route.query.q)) {
      this.applySearchFromRoute(true);
    }
  },
  methods: {
    truncate,
    getUrl,
    queryValue(value) {
      return Array.isArray(value) ? value[0] : value;
    },
    routeSearchValue() {
      return this.queryValue(this.$route.query.q) || this.queryValue(this.$route.query.tag) || '';
    },
    applySearchFromRoute(shouldScroll = false) {
      const nextSearch = this.routeSearchValue();
      if (nextSearch !== this.search) this.search = nextSearch;
      if (shouldScroll && nextSearch) this.scrollToAllActivities();
    },
    scrollToAllActivities() {
      this.$nextTick(() => {
        const el = document.getElementById('semua-kegiatan');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    },
    replaceActivityQuery(query) {
      const nextQ = query.q || '';
      const nextTag = query.tag || '';
      const currentQ = this.queryValue(this.$route.query.q) || '';
      const currentTag = this.queryValue(this.$route.query.tag) || '';
      if (nextQ === currentQ && nextTag === currentTag) return;
      this.$router.replace({ path: '/kegiatan', query }).catch(() => {});
    },
    contributorUrl(name) {
      return `/kegiatan/kontributor/${encodeURIComponent(name)}`;
    },
    async getData() {
      try {
        if (this.isContributorPage) {
          await this.$store.dispatch(GET_ACTIVITIES, {
            contributor: this.contributorName,
            search: "",
            limit: 50,
            page: 1,
            all: true,
          });
          return;
        }

        if (this.thisPathHaveSlug) {
          await this.$store.dispatch(GET_DETAIL_ACTIVITY, { slug: this.$route.params.slug });
          if (!this.$store.getters.detailActivity) {
            this.notFound = true;
            return;
          }
        }
        await this.$store.dispatch(GET_ACTIVITIES, {
          search: "",
          limit: 50,
          page: 1,
          all: true,
        });
      } catch (err) {
        console.error(err);
        if (this.thisPathHaveSlug) this.notFound = true;
      }
    },
    debouncedSearch() {
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        const q = this.search.trim();
        this.replaceActivityQuery(q ? { q } : {});
      }, 300);
    },
    clearSearch() {
      this.search = '';
      clearTimeout(this.searchTimer);
      this.replaceActivityQuery({});
    },
    goToTagSearch(tagName) {
      this.search = tagName;
      this.replaceActivityQuery({ tag: tagName });
      this.scrollToAllActivities();
    },
    formatDate(dateString) {
      if (!dateString) return "";
      const value = String(dateString);
      const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
      const date = dateOnly ? new Date(`${value}T12:00:00+07:00`) : new Date(value);
      if (Number.isNaN(date.getTime())) return "";
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(date);
    },
    stripHtml(html) {
      if (!html) return "";
      return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    },
    prevSlide() {
      if (this.currentSlide > 0) this.currentSlide--;
    },
    nextSlide() {
      if (this.currentSlide < this.allMedia.length - 1) this.currentSlide++;
    },
    getYoutubeEmbed(url) {
      const match = url?.match(/(?:v=|youtu\.be\/)([^&\n?#]+)/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : '';
    },
  }
};
</script>

<style scoped>
.activity-content {
  max-width: 760px;
  width: 100%;
  color: #1f2937;
  font-size: 16px;
  line-height: 1.75;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.article-actions {
  max-width: 760px;
  width: 100%;
}
.activity-card-copy {
  overflow-wrap: anywhere;
  word-break: break-word;
}
@media (min-width: 768px) {
  .activity-content {
    font-size: 17px;
  }
}
.activity-content :deep(*) {
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.activity-content :deep(p) { margin-bottom: 1.1rem; }
.activity-content :deep(h1),
.activity-content :deep(h2),
.activity-content :deep(h3) {
  color: #003793;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 0.8rem;
  margin-top: 2rem;
}
.activity-content :deep(h1) { font-size: 2rem; }
.activity-content :deep(h2) { font-size: 1.6rem; }
.activity-content :deep(h3) { font-size: 1.3rem; }
.activity-content :deep(ul),
.activity-content :deep(ol) { padding-left: 1.5rem; margin-bottom: 1rem; }
.activity-content :deep(ul) { list-style-type: disc; }
.activity-content :deep(ol) { list-style-type: decimal; }
.activity-content :deep(li) { margin-bottom: 0.35rem; }
.activity-content :deep(blockquote) {
  border-left: 4px solid #003793;
  padding: 0.75rem 1rem;
  color: #374151;
  font-style: italic;
  margin: 1.5rem 0;
  background-color: #f8fafc;
  border-radius: 0 8px 8px 0;
}
.activity-content :deep(a) { color: #003793; font-weight: 600; text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
.activity-content :deep(a:hover) { opacity: 0.8; }
.activity-content :deep(strong) { font-weight: 700; }
.activity-content :deep(em) { font-style: italic; }
.activity-content :deep(img) {
  max-width: 100%;       
  height: auto;           
  border-radius: 8px;
  display: block;  
  margin: 1.5rem auto;
}
.activity-content :deep(img[style*="width"]) {
  height: auto !important;
}
.activity-content :deep(p img) {
  display: block;
}
.activity-content :deep(div[data-youtube-video]) {
  margin: 1.75rem auto;
  border-radius: 10px;
  overflow: hidden;
  max-width: 760px;
}
.activity-content :deep(div[data-youtube-video] iframe),
.activity-content :deep(iframe) {
  width: 100%;
  aspect-ratio: 16/9;
  height: auto;
  border: none;
  border-radius: 10px;
  display: block;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2; 
}
.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 4; 
}
</style>
