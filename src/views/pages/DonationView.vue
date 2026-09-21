<template>
  <FormDonation v-if="isDonationOpen" mode="midtrans" @close="closeDonationPopup" />

  <div
    v-if="isChooserOpen"
    class="fixed inset-0 bg-black/60 z-[98] flex items-center justify-center p-4"
    @click.self="closeChooser"
  >
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-[20px] md:text-[24px] font-[700] text-main">Pilih Metode Pembayaran</h3>
        <button @click="closeChooser" class="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
      </div>
      <p class="text-[14px] text-gray-600 mb-5">
        Silakan pilih metode pembayaran donasi Anda.
      </p>
      <div class="flex flex-col gap-3">
        <button
          @click="chooseManual"
          class="w-full border border-main text-main font-[700] rounded-xl px-4 py-4 text-left hover:bg-blue-50 transition"
        >
          <div class="text-[16px] md:text-[18px]">Pembayaran Manual</div>
          <div class="text-[13px] text-gray-600 font-[400] mt-1">
            Transfer bank manual + unggah bukti. Form oleh Tally.
          </div>
        </button>
        <button
          disabled
          class="w-full bg-gray-200 text-gray-500 font-[700] rounded-xl px-4 py-4 text-left cursor-not-allowed"
        >
          <div class="text-[16px] md:text-[18px]">Pembayaran Otomatis — Sementara Tidak Tersedia</div>
          <div class="text-[13px] text-gray-500 font-[400] mt-1">
            Bayar langsung via kartu/VA/e-wallet/QRIS (Midtrans).
          </div>
        </button>
      </div>
    </div>
  </div>

  <div class="bg-colorSecond pt-[10px] pb-[32px] px-[18px] md:px-[70px]">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="w-full md:w-1/2">
        <p class="font-[500] text-[16px] md:text-[18px] text-main whitespace-pre-line">
          Kami lakukan ini untuk mahasiswa
        </p>
        <h4 class="text-[24px] md:text-[50px] capitalize text-main font-[700] mb-[4px]">Mari Berdonasi Bersama
          IOM-ITB
        </h4>
        <p class="font-[500] text-[14px] md:text-[16px] text-main whitespace-pre-line mb-[24px]">
          IOM-ITB membantu para mahasiswa ITB yang membutuhkan bantuan, baik dalam hal finansial (UKT, Biaya Hidup, dll) ataupun non-finansial (pendampingan).
        </p>
        <div class="flex flex-wrap gap-3">
            <button
              @click="openChooser"
              class="inline-flex items-center px-5 py-3 text-[16px] md:text-[18px] font-medium text-center text-white bg-main rounded-full hover:opacity-[0.9] focus:ring-4 focus:outline-none focus:ring-blue-300 transition"
            >
              Donasi Sekarang
            </button>

            <button
              @click="scrollToGuide"
              class="inline-flex items-center px-5 py-3 text-[16px] md:text-[18px] font-medium text-center text-main border border-main rounded-full hover:bg-blue-50 transition"
            >
              Lihat Tata Cara
            </button>
          </div>
      </div>
      <img :src="require('@/assets/image/donation-header.png')" alt="Donation" class="w-full md:w-1/2 p-4 md:p-20 hidden md:block">
    </div>
  </div>

  <div class="bg-white py-[16px] md:py-[24px] px-[18px] md:px-[70px]">
    <div class="flex flex-col lg:flex-row justify-center items-center  px-[18px] md:px-[70px]">
      <div class="flex items-center gap-4 w-full lg:w-1/2 mb-4 lg:mb-0 lg:justify-end lg:mr-8">
        <img :src="require('@/assets/icon/icon-sukarelawan.png')" alt="sukarelawan" class="w-[100px]">
        <div>
          <h4 class="text-[24px] md:text-[26px] capitalize text-main font-[700] mb-[4px]">Mari Berdonasi Bersama IOM-ITB</h4>
          <p class="font-[400] text-[16px] md:text-[18px] text-main whitespace-pre-line">
            Kami lakukan ini untuk mahasiswa
          </p>
        </div>
      </div>
      <div class="flex items-center gap-4 w-full lg:w-1/2 mb-4 lg:mb-0">
        <img :src="require('@/assets/icon/icon-dana.png')" alt="dana" class="w-[100px]">
        <div>
          <h4 class="text-[24px] md:text-[26px] capitalize text-main font-[700] mb-[4px]">Galang Dana Cepat</h4>
          <p class="font-[400] text-[16px] md:text-[18px] text-main whitespace-pre-line">
            Kami membantu untuk mengembangkan secepatnya bantuan yang ada.
          </p>
        </div>
      </div>
     
    </div>
    <div class="flex justify-center items-center  px-[18px] md:px-[70px]">
    <div class="flex justify-center items-center gap-4 w-full lg:w-1/2">
        <img :src="require('@/assets/icon/icon-donasi.png')" alt="donasi" class="w-[100px]">
        <div>
          <h4 class="text-[24px] md:text-[26px] capitalize text-main font-[700] mb-[4px]">Mulai Donasi</h4>
          <p class="font-[400] text-[16px] md:text-[18px] text-main whitespace-pre-line">
            Mari bersama-sama untuk melakukan kebaikan demi kepentingan mahasiswa yang dibutuhkan.
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="border w-[90%] mx-auto opacity-50"></div>

  <div class="bg-white py-[24px] px-[18px] md:px-[70px]">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <img :src="require('@/assets/image/IOM-ITB-PrimaryLogo-blue.png')" alt="IOM-ITB" class="w-full md:w-1/2 object-cover p-4 md:p-20">
      <div class="w-full md:w-1/2 text-justify p-4 md:p-0">
        <h4 class="text-[24px] md:text-[50px] capitalize text-main font-[700]">Berdonasi Bersama IOM-ITB</h4>
        <p class="font-[500] text-[14px] md:text-[16px] text-main whitespace-pre-line">
          {{ "Setiap tahunnya, Institut Teknologi Bandung menerima ribuan mahasiswa dari berbagai provinsi di Indonesia. Mereka masuk ke ITB melalui tiga jalur penerimaan, di antaranya SNBP, SNBT, Seleksi Mandiri dan ITB International Undergraduate Program (IUP).\n\nKita memahami, para mahasiswa yang belajar di ITB memiliki latar belakang ekonomi yang berbeda dan  ITB tidak ingin membatasi kesempatan belajar bagi mahasiswanya karena masalah finansial. Untuk itu, berbagai fasilitas beasiswa disediakan oleh ITB untuk membantu mahasiswa yang kesulitan di bidang ekonomi, salah satunya adalah bantuan dan beasiwa IOM. Bantuan dan Beasiswa yang disalurkan IOM melalui ITB berasal dari Iuran dan kontribusi para Orang Tua Mahasiswa. IOM mengajak para Orang Tua Mahasiswa untuk turut berkontribusi dalam membantu Mahasiswa yang memerlukan dukungan baik secara finansial ataupun non finansial." }}
        </p>
        <br>
        <div class="w-fit text-center">
        <img :src="require('@/assets/image/ketua-umum-iom.png')" alt="Ketua Umum Iom" class="w-[500px]">
        <span class="text-gray-500">Ketua Umum - Hendro Setyanto, S.Si., M.Si.</span>
      </div>
      </div>
    </div>
  </div>
  <div
    id="payment-guide"
    class="bg-colorSecond py-[48px] md:py-[72px] px-[18px] md:px-[70px]"
  >
    <div class="max-w-[1280px] mx-auto">
      <div class="text-center mb-[32px] md:mb-[48px]">

        <h2 class="text-main text-[32px] md:text-[42px] font-[700] mb-3">
          Tata Cara Pembayaran Donasi
        </h2>

        <p
          class="text-main/80 text-[16px] md:text-[17px] max-w-[760px] mx-auto leading-relaxed"
        >
          Ikuti langkah berikut agar proses donasi berjalan mudah, jelas, dan
          dapat segera diverifikasi oleh tim IOM-ITB.
        </p>
      </div>

      <!-- Step cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          v-for="step in paymentSteps"
          :key="step.number"
          class="bg-white rounded-[28px] p-6 md:p-8 shadow-soft border border-[#E7ECF8] h-full"
        >
          <div class="flex items-center justify-between mb-5">
            <div
              class="w-[56px] h-[56px] rounded-full bg-main text-white flex items-center justify-center text-[22px] font-[700]"
            >
              {{ step.number }}
            </div>
          </div>

          <h3 class="text-main text-[22px] md:text-[24px] font-[700] mb-3">
            {{ step.title }}
          </h3>

          <p class="text-main/85 text-[15px] md:text-[16px] leading-relaxed font-[400]">
            {{ step.description }}
          </p>
        </div>
      </div>

      <!-- Detail cards -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left -->
        <div
          class="bg-white rounded-[28px] p-6 md:p-8 shadow-soft border border-[#E7ECF8]"
        >
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-[48px] h-[48px] rounded-full bg-main text-white flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12h6m-6 4h6M8 4h8a2 2 0 012 2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
                />
              </svg>
            </div>
            <h3 class="text-main text-[24px] md:text-[26px] font-[800]">
              Rincian Proses Donasi
            </h3>
          </div>

          <div class="space-y-4">
            <div
              v-for="(item, index) in paymentDetails"
              :key="index"
              class="flex items-start gap-3"
            >
              <div
                class="w-6 h-6 min-w-[24px] rounded-full bg-[#E8EEFF] text-main flex items-center justify-center mt-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2.2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <div>
                <p class="text-main text-[18px] md:text-[19px] font-[800]">
                  {{ item.title }}
                </p>
                <p class="text-main/80 text-[15px] md:text-[16px] leading-relaxed">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 bg-[#F6F8FF] border border-[#DCE5FF] rounded-[22px] p-4">
            <p class="text-main text-[14px] md:text-[15px] leading-relaxed">
              <span class="font-[700]">Catatan:</span> Pastikan data yang diisi
              sesuai, bukti pembayaran terlihat jelas, dan pilih metode
              pengiriman tanda terima melalui WhatsApp atau email.
            </p>
          </div>
        </div>

        <!-- Right -->
        <div
          class="bg-white rounded-[28px] p-6 md:p-8 shadow-soft border border-[#E7ECF8]"
        >
          <div class="flex items-center gap-3 mb-5">
            <div
              class="w-[48px] h-[48px] rounded-full bg-main text-white flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17 9V7a5 5 0 00-10 0v2m-2 0h14a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9a1 1 0 011-1z"
                />
              </svg>
            </div>
            <h3 class="text-main text-[24px] md:text-[26px] font-[700]">
              Metode & Informasi Pembayaran
            </h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div
              v-for="(method, index) in paymentMethods"
              :key="index"
              class="border border-[#E4E9F5] rounded-[22px] p-4 bg-[#FAFBFF]"
            >
              <p class="text-main text-[18px] font-[700] mb-1">
                {{ method.title }}
              </p>
              <p class="text-main/80 text-[15px] leading-relaxed">
                {{ method.description }}
              </p>
            </div>
          </div>

          <div class="bg-main rounded-[28px] p-6 text-white mb-5">
            <h4 class="text-[20px] md:text-[22px] font-[700] mb-3">
              Setelah membaca tata cara pembayaran
            </h4>
            <p class="text-[15px] md:text-[16px] leading-relaxed opacity-95 mb-5">
              Silakan lanjutkan donasi melalui form yang telah disediakan.
              Informasi yang Anda masukkan akan membantu proses verifikasi dan
              pengiriman tanda terima.
            </p>
            <button
              @click="openChooser"
              class="bg-white text-main font-[700] px-5 py-3 rounded-full hover:opacity-[0.92] transition"
            >
              Buka Form Donasi
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="(note, index) in additionalNotes"
              :key="index"
              class="flex items-start gap-3"
            >
              <div class="w-2.5 h-2.5 rounded-full bg-main mt-2"></div>
              <p class="text-main/85 text-[15px] md:text-[16px] leading-relaxed">
                {{ note }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- CTA Bottom -->
  <div class="bg-white py-[32px] md:py-[48px] px-[18px] md:px-[70px]">
    <div
      class="max-w-[1100px] mx-auto bg-main rounded-[32px] px-6 md:px-10 py-8 md:py-10 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-5"
    >
      <div>
        <h3 class="text-[24px] md:text-[32px] font-[700] mb-2">
          Siap menyalurkan donasi Anda?
        </h3>
        <p class="text-[14px] md:text-[16px] leading-relaxed opacity-95 max-w-[700px]">
          Kontribusi Anda akan sangat berarti dalam mendukung mahasiswa ITB
          yang membutuhkan bantuan finansial maupun pendampingan.
        </p>
      </div>

      <button
        @click="openChooser"
        class="bg-white text-main font-[700] px-6 py-3 rounded-full whitespace-nowrap hover:opacity-[0.92] transition"
      >
        Donasi Sekarang
      </button>
    </div>
  </div>
</template>

<script>
import HeaderItem from "@/components/header/HeaderItem.vue";
import FormDonation from "@/components/form/FormDonation.vue";

export default {
  name: "DonationView",
  components: {
    HeaderItem,
    FormDonation,
  },
  data() {
    return {
      isDonationOpen: false,
      isChooserOpen: false,
      paymentSteps: [
        {
          number: "1",
          title: "Isi Data Donatur",
          description:
            "Lengkapi nama, email, dan nomor WhatsApp agar tim IOM-ITB dapat melakukan pencatatan serta mengirimkan konfirmasi donasi.",
        },
        {
          number: "2",
          title: "Lakukan Pembayaran",
          description:
            "Pilih metode pembayaran yang tersedia pada form. Ikuti instruksi pembayaran hingga transaksi selesai dilakukan.",
        },
        {
          number: "3",
          title: "Konfirmasi Donasi",
          description:
            "Khusus transfer manual, unggah bukti pembayaran dengan jelas; pembayaran otomatis tidak memerlukannya. Tanda terima akan dikirim melalui WhatsApp atau email.",
        },
      ],

      paymentDetails: [
        {
          title: "Lengkapi data diri",
          description:
            "Masukkan nama, email, dan nomor HP/WA yang aktif agar proses administrasi berjalan lancar.",
        },
        {
          title: "Pilih jenis kontribusi",
          description:
            "Pilih kategori donasi atau kontribusi sesuai kebutuhan yang tersedia pada form.",
        },
        {
          title: "Lakukan pembayaran sesuai instruksi",
          description:
            "Setelah mengisi form, lakukan pembayaran melalui metode yang ditampilkan pada halaman donasi.",
        },
        {
          title: "Unggah bukti pembayaran",
          description:
            "Pastikan file bukti pembayaran jelas, terbaca, dan sesuai nominal transaksi yang dilakukan.",
        },
        {
          title: "Pilih pengiriman tanda terima",
          description:
            "Tanda terima dapat dikirimkan melalui WhatsApp atau email sesuai pilihan Anda pada form.",
        },
      ],

      paymentMethods: [
        {
          title: "Online (Midtrans)",
          description:
            "Bayar langsung via kartu kredit, transfer bank, e-wallet, atau QRIS melalui jendela pembayaran Midtrans.",
        },
        {
          title: "Manual (Transfer Bank)",
          description:
            "Transfer ke rekening IOM-ITB, tambahkan 3 digit kode unik fakultas Anda di akhir nominal, lalu unggah bukti bayar.",
        },
        {
          title: "Kode Unik Fakultas",
          description:
            "Kode unik mengikuti kode 3 digit fakultas donor (dipilih di form) — bukan lagi kode per jenis donasi — dan ditambahkan ke nominal pada kedua metode pembayaran.",
        },
        {
          title: "Konfirmasi via WhatsApp/Email",
          description:
            "Tanda terima donasi akan dikirim melalui WhatsApp atau email sesuai pilihan Anda.",
        },
      ],

      additionalNotes: [
        "Kode unik = 3 digit kode fakultas Anda; kode akan muncul di form setelah memilih fakultas.",
        "Kode unik fakultas ditambahkan ke nominal donasi pada kedua metode pembayaran, termasuk Midtrans.",
        "Pembayaran online via Midtrans tidak memerlukan upload bukti bayar karena terkonfirmasi otomatis.",
        "Gunakan nomor WhatsApp dan email aktif agar informasi konfirmasi dapat diterima dengan baik.",
      ],
    };
  },

  methods: {
    scrollToGuide() {
      const section = document.getElementById("payment-guide");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    openChooser() {
      this.isChooserOpen = true;
    },

    closeChooser() {
      this.isChooserOpen = false;
    },

    chooseManual() {
      this.isChooserOpen = false;
      const formId = "mZJe8e";
      const options = {
        layout: "modal",
        width: 700,
        autoClose: 5000,
        hiddenFields: { ref: "donation-page" },
      };
      if (typeof Tally !== "undefined") {
        Tally.openPopup(formId, options);
      } else {
        console.error("Tally belum tersedia.");
      }
    },

    // Belum terpakai selama tombol Pembayaran Otomatis dinonaktifkan.
    // Dipertahankan agar mengaktifkannya kembali cukup mengembalikan tombolnya.
    chooseMidtrans() {
      this.isChooserOpen = false;
      this.isDonationOpen = true;
    },

    closeDonationPopup() {
      this.isDonationOpen = false;
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
.shadow-soft {
  box-shadow: 0 14px 40px rgba(28, 63, 170, 0.08);
}
</style>
