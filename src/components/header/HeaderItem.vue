<template>
	<Carousel v-model="currentSlide">
	  <Slide v-for="(slide, index) in slides" :key="slide.key">
		<div v-if="slide.video" class="relative h-[30vh] sm:h-[90vh] w-full bg-cover bg-center bg-no-repeat bg-slate-100" :style="{ backgroundImage: `url(${slide.poster})` }">
		  <video
			ref="video"
			class="absolute inset-0 w-full h-full object-cover"
			:poster="slide.poster"
			:src="videoSrc || undefined"
			preload="none"
			muted
			playsinline
			@canplay="onVideoReady"
		  ></video>
		</div>
		<div
		  v-else
		  class="relative h-[30vh] sm:h-[90vh] w-full bg-cover bg-no-repeat bg-slate-100"
		  :style="loaded[index] ? { backgroundImage: `url(${isSmallScreen ? slide.small : slide.large})` } : null"
		></div>
	  </Slide>

	  <template #addons>
		<Navigation />
	  </template>
	</Carousel>
</template>

<script>
import { defineComponent } from 'vue'
import { Carousel, Navigation, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'

// Urutan muat (slide pertama tampil secepat mungkin):
// 1. Poster video (±50 KB) langsung tampil.
// 2. Video baru dimuat setelah halaman selesai dimuat (window load), versi
//    480p untuk layar kecil. Mode hemat data: hanya poster.
// 3. Gambar slide berikutnya dimuat setelah video siap diputar (atau 4 detik),
//    sisanya saat slide sebelumnya ditampilkan.
// Gambar: WebP 1920 px (desktop) / 960 px (layar kecil).
const SMALL_SCREEN_QUERY = '(max-width: 767px)';
const NEXT_IMAGE_FALLBACK_MS = 4000;

const imageSlide = (name) => ({
  key: name,
  large: require(`@/assets/image/slides/${name}.webp`),
  small: require(`@/assets/image/slides/${name}-960.webp`),
});

export default defineComponent({
  name: 'Basic',
  data() {
    const slides = [
      {
        key: 'slide1',
        video: true,
        poster: require('@/assets/image/slides/slide1-poster.webp'),
        large: require('@/assets/video/slide1.mp4'),
        small: require('@/assets/video/slide1-480.mp4'),
      },
      imageSlide('slide6'),
      imageSlide('slide2'),
      imageSlide('slide3'),
      imageSlide('slide4'),
      imageSlide('slide5'),
    ];
    return {
      slides,
      currentSlide: 0,
      loaded: slides.map(() => false),
      videoSrc: '',
      isSmallScreen: typeof window !== 'undefined' && window.matchMedia(SMALL_SCREEN_QUERY).matches,
    };
  },
  watch: {
    currentSlide(index) {
      this.loadAround(index);
      const video = this.$refs.video && this.$refs.video[0];
      if (!video) return;
      if (this.slides[index].video) video.play().catch(() => {});
      else video.pause();
    },
  },
  mounted() {
    this.loadAround(0, false);
    if (document.readyState === 'complete') this.startVideo();
    else window.addEventListener('load', this.startVideo, { once: true });
    this.nextImageTimer = setTimeout(() => this.loadAround(this.currentSlide), NEXT_IMAGE_FALLBACK_MS);
  },
  beforeUnmount() {
    window.removeEventListener('load', this.startVideo);
    clearTimeout(this.nextImageTimer);
  },
  methods: {
    // Tandai slide `index` (dan berikutnya bila withNext) untuk dimuat.
    loadAround(index, withNext = true) {
      const targets = withNext ? [index, index + 1] : [index];
      targets.forEach((i) => {
        if (i < this.slides.length && !this.loaded[i]) this.loaded[i] = true;
      });
    },
    startVideo() {
      const saveData = navigator.connection && navigator.connection.saveData;
      const slide = this.slides.find((s) => s.video);
      if (!slide || saveData) {
        this.loadAround(this.currentSlide);
        return;
      }
      this.videoSrc = this.isSmallScreen ? slide.small : slide.large;
      this.$nextTick(() => {
        const video = this.$refs.video && this.$refs.video[0];
        if (video && this.slides[this.currentSlide].video) video.play().catch(() => {});
      });
    },
    onVideoReady() {
      clearTimeout(this.nextImageTimer);
      this.loadAround(this.currentSlide);
    },
  },
  components: {
    Carousel,
    Slide,
    Navigation,
  },
})
</script>

<style>
  .carousel__item {
	min-height: 200px;
	width: 100%;
	font-size: 20px;
	border-radius: 8px;
	display: flex;
	justify-content: center;
	align-items: center;
  }

  .carousel__prev,
  .carousel__next {
	box-sizing: content-box;
  }

  video {
	border: none; /* Optional: Remove border if any */
  }
  </style>
