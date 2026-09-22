<template>
    <div class="max-w-[1080px] mx-auto pt-[10px] pb-[32px] px-[18px] md:px-[70px] font-bold text-ink">
      <div class="bg-white shadow-md rounded-lg p-6">
        <h2 class="text-4xl mb-4">Daftar Anggota Baru</h2>
        <iframe data-tally-src="https://tally.so/embed/wzeRrM?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" width="100%" height="1720" frameborder="0" marginheight="0" marginwidth="0" title="PENDATAAN ANGGOTA"></iframe>
      </div>
    </div>
  </template>
  
  <script>
import { useMeta } from "vue-meta";

export default {
  setup() {
    useMeta({ title: "Register"});
  },
    mounted() {
      this.loadTallyEmbeds();
    },
    methods: {
      loadTallyEmbeds() {
        var d = document;
        var w = "https://tally.so/widgets/embed.js";
        var v = () => {
          if (typeof Tally !== "undefined") {
            Tally.loadEmbeds();
          } else {
            d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((e) => {
              e.src = e.dataset.tallySrc;
            });
          }
        };
        if (typeof Tally !== "undefined") {
          v();
        } else if (d.querySelector('script[src="' + w + '"]') == null) {
          var s = d.createElement("script");
          s.src = w;
          s.onload = v;
          s.onerror = v;
          d.body.appendChild(s);
        }
      },
    },
  };
  </script>
  