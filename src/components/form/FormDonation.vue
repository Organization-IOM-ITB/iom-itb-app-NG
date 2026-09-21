<template>
  <div>
    <div class="fixed w-full h-full bg-black top-0 bottom-0 left-0 right-0 z-[98] opacity-[0.6]" @click="closeModal"></div>
    <div class="fixed top-0 bottom-0 left-0 right-0 flex items-center z-[99]" @click="closeModal">
      <div class="bg-white h-[700px] w-full md:w-[80%] shadow-sm p-4 md:p-6 rounded-md mx-auto overflow-scroll my-2" @click.stop>
        <div class="flex justify-between items-center sticky">
          <h1 class="text-[24px] md:text-[42px] font-[700] text-center md:text-left">Donasi</h1>
          <img :src="require('@/assets/icon/icon-close.svg')" class="w-[24px] cursor-pointer" @click.native="closeModal"/>
        </div>
        <form @submit.prevent="handleSubmit" class="mt-6">
          <h1 class="text-[16px] md:text-[30px] font-[700] text-center md:text-left">Data Diri</h1>
          <div class="flex flex-col md:flex-row md:justify-between gap-4">
            <InputText keyValue="name" label="Nama" class="w-full md:w-1/2" :required="true" @update="updateValue" />
            <InputText keyValue="email" label="Email" class="w-full md:w-1/2" :required="true" @update="updateValue" />
          </div>
          <div class="flex flex-col md:flex-row md:justify-between gap-4 mt-4">
            <div class="w-full md:w-1/2">
              <label class="block text-sm font-medium mb-1">No Whatsapp <span class="text-red-500">*</span></label>
              <div class="flex gap-2">
                <select v-model="dialCode" class="border rounded-md px-2 py-2 bg-white text-sm w-[110px]">
                  <option v-for="c in dialCodes" :key="c.code" :value="c.code">{{ c.flag }} {{ c.code }}</option>
                </select>
                <input
                  type="tel"
                  inputmode="numeric"
                  v-model="localPhone"
                  @input="onPhoneInput"
                  placeholder="81234567890"
                  class="flex-1 border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <p class="text-xs text-gray-500 mt-1">Tanpa angka 0 di depan. Contoh: 81234567890</p>
            </div>
            <div class="hidden md:block md:w-1/2"></div>
          </div>

          <div class="flex flex-col gap-2 mt-6">
            <h1 class="text-[16px] md:text-[30px] font-[700] text-center md:text-left">Informasi Donasi</h1>
            <p>Bapak - Ibu Orang Tua Mahasiswa ITB ysh.,</p>
            <p>Kami mengucapkan terima kasih atas partisipasi Bapak/Ibu selaku Orang Tua Mahasiswa ITB yang telah turut berkontribusi untuk membantu Mahasiswa ITB melalui IOM ITB. Kontribusi Bapak-Ibu sebagai anggota IOM kami kelompokkan menjadi :<br/>
              1. Iuran Sukarela (yang nominal maksimal sebesar Rp. 1.000.000,-)<br/>
              2. ⁠Sumbangan/Donasi
            </p>
            <p>Iuran Sukarela dari Bapak/Ibu tersebut akan kami salurkan selama 4 tahun dalam bentuk bantuan UKT, Tugas Akhir dan Biaya Hidup bagi mahasiswa yang membutuhkan. Hal ini dimaksudkan untuk keberlangsungan program bantuan kepada Mahasiswa.</p>
            <p>Adapun Sumbangan/Donasi dari Bapak/Ibu disamping disalurkan untuk bantuan UKT, Tugas Akhir dan Biaya Hidup, juga dipergunakan untuk bantuan tak terduga bagi Mahasiswa, seperti biaya kesehatan, biaya penunjang pendidikan, dana talangan darurat dll.</p>
            <p>Sebagai mitra ITB, IOM ITB senantiasa berkoordinasi dengan Direktorat kemahasiswaan ITB dalam penyaluran bantuan. Oleh karenanya kontribusi Bapak/Ibu dalam membantu mahasiswa melalui IOM ITB akan sangat membantu para mahasiswa untuk mengatasi kendala biaya selama masa studinya. Semoga partisipasi Bapak/Ibu menjadi amal jariyah &amp; perwujudan rasa syukur kepada Tuhan atas segala nikmat telah kita terima.</p>
            <p>Hormat Kami,<br/>
              an. Pengurus IOM ITB 2024 2027<br/>
              Hendro Setyanto<br/>
              Ketua Umum</p>
          </div>

          <div class="flex flex-col md:flex-row md:justify-between gap-4 mt-6">
            <InputSelection
              keyValue="donationType"
              label="Jenis Donasi"
              class="w-full md:w-1/2"
              :required="true"
              :options="donationTypeOptions"
              :value="donationTypeLabel"
              @update="onDonationTypeChange"
            />
            <InputSelection
              keyValue="facultyLabel"
              label="Fakultas"
              class="w-full md:w-1/2"
              :required="true"
              :options="facultyOptions"
              :value="facultyLabel"
              @update="onFacultyChange"
            />
          </div>

          <div class="flex flex-col md:flex-row md:justify-between gap-4 mt-4">
            <InputText
              keyValue="amount"
              label="Nominal (Rp)"
              :value="data.amount"
              :class="showMethodSelector ? 'w-full md:w-1/2' : 'w-full'"
              :required="true"
              @update="updateValue"
            />
            <InputSelection
              v-if="showMethodSelector"
              keyValue="paymentMethod"
              label="Metode Pembayaran"
              class="w-full md:w-1/2"
              :required="true"
              :options="paymentMethodOptions"
              :value="data.paymentMethod"
              @update="updateValue"
            />
          </div>

          <div v-if="selectedFaculty" class="mt-3 rounded-md border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <p class="font-[700]">Rincian Nominal Donasi</p>
            <p class="mt-1">Nominal dasar harus kelipatan <strong>Rp1.000</strong>, sehingga 3 digit terakhir selalu <strong>000</strong>.</p>
            <p class="mt-2">Nominal dasar: <strong>{{ formattedBaseAmount }}</strong></p>
            <p>Kode unik fakultas {{ selectedFaculty.name }}: <strong class="font-mono">{{ donationAmountSummary.uniqueCode || '---' }}</strong></p>
            <p class="mt-1">Total pembayaran: <strong>{{ formattedGrossAmount }}</strong></p>
          </div>

          <div v-if="data.paymentMethod === 'Manual (Transfer Bank)'" class="flex flex-col gap-2 mt-6 bg-gray-50 border border-gray-200 p-4 rounded">
            <h2 class="text-[16px] md:text-[24px] font-[700]">Petunjuk Transfer Manual</h2>
            <p>Silakan transfer <strong>tepat sesuai total pembayaran</strong>, yaitu nominal dasar dengan 3 digit terakhir <strong>000</strong> ditambah <strong>kode unik fakultas</strong> Anda.</p>
            <p v-if="selectedFaculty">
              Fakultas <strong>{{ selectedFaculty.name }}</strong> — kode unik: <strong class="font-mono">{{ selectedFaculty.kodeUnik }}</strong>
            </p>
            <p v-else class="text-sm text-gray-600">Pilih fakultas terlebih dahulu untuk melihat kode unik Anda.</p>
            <p v-if="selectedFaculty && donationAmountSummary.isValidBaseAmount">Total transfer: <strong>{{ formattedGrossAmount }}</strong></p>
            <p>Rekening: <strong>130.001-900-0366</strong> Bank Mandiri Kantor Kas Bandung ITB an. IOM ITB</p>
            <p>Kontak WA: <strong>081573598031</strong> (Ibu Ani Suliawaty)</p>
            <div class="flex flex-col md:flex-row md:justify-between gap-4 mt-2">
              <div class="w-full md:w-1/2">
                <h3 class="text-[14px] md:text-[20px] font-[700]">Mandiri QRIS</h3>
                <img :src="require('@/assets/image/mandiri-qris.png')"/>
              </div>
              <div class="w-full md:w-1/2">
                <h3 class="text-[14px] md:text-[20px] font-[700]">BSI QRIS</h3>
                <img :src="require('@/assets/image/bsi-qris-full.png')"/>
              </div>
            </div>
            <div class="flex flex-col gap-4 mt-4">
              <InputFile keyValue="proof" label="Upload Bukti Bayar" subLabel="" format="all" class="w-full" :required="true" @update="updateValue" />
            </div>
          </div>

          <div v-else-if="data.paymentMethod === 'Online (Midtrans)'" class="flex flex-col gap-2 mt-6 bg-blue-50 border border-blue-200 p-4 rounded">
            <h2 class="text-[16px] md:text-[24px] font-[700]">Pembayaran Online via Midtrans</h2>
            <p>Setelah menekan <strong>Kirim</strong>, jendela pembayaran Midtrans akan terbuka. Anda dapat membayar dengan kartu kredit, transfer bank, e-wallet, QRIS, dan metode lainnya.</p>
            <p>Tagihan dibuat <strong>tepat sesuai total pembayaran</strong>, yaitu nominal dasar dengan 3 digit terakhir <strong>000</strong> ditambah <strong>kode unik fakultas</strong> Anda.</p>
            <p v-if="selectedFaculty">
              Fakultas <strong>{{ selectedFaculty.name }}</strong> — kode unik: <strong class="font-mono">{{ selectedFaculty.kodeUnik }}</strong>
            </p>
            <p v-else class="text-sm text-gray-600">Pilih fakultas terlebih dahulu untuk melihat kode unik Anda.</p>
            <p v-if="selectedFaculty && donationAmountSummary.isValidBaseAmount">Total pembayaran: <strong>{{ formattedGrossAmount }}</strong></p>
            <p class="text-sm text-gray-600">Anda tidak perlu mengunggah bukti bayar — pembayaran terkonfirmasi otomatis.</p>
          </div>

          <div class="flex flex-col md:flex-row md:justify-between gap-4 mt-4">
            <InputCheckboxOptions keyValue="notification" label="Menerima notifikasi melalui?" class="w-full md:w-1/2" :required="true" :options="['Whatsapp', 'Email']" @update="updateValue" />
          </div>

          <div class="flex flex-col md:flex-row md:justify-between gap-4 mt-4">
            <InputCheckbox keyValue="nameIsHidden" label="Sembunyikan Nama (Anonim)" class="w-full md:w-1/2" @update="updateValue" />
            <InputCheckbox keyValue="isHambaAllah" label="Hamba Allah" class="w-full md:w-1/2" @update="updateValue" />
          </div>

          <div class="flex flex-col-reverse md:flex-row justify-end gap-4 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none w-full md:w-auto">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading" class="px-4 py-2 text-sm text-white bg-main rounded-md focus:outline-none w-full md:w-auto">
              {{ isLoading ? 'Loading...' : 'Kirim' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from "@/components/input/InputText.vue";
import InputSelection from "@/components/input/InputSelection.vue";
import InputCheckbox from "@/components/input/InputCheckbox.vue";
import InputCheckboxOptions from "@/components/input/InputCheckboxOptions.vue";
import InputFile from "@/components/input/InputFile.vue";
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import { POST_DONATION, POST_DONATION_SNAP } from "@/store/donations.module";
import { GET_FACULTIES } from "@/store/faculties.module";
import { savePendingPayment, removePendingPayment } from "@/utils/pendingPayments";
import { prettifyDonationType, describeNotificationChannels } from "@/utils/donationLabels";
import { syncPaymentStatus, isTerminalPaymentStatus } from "@/utils/midtransPayment";
import { isNotStartedPaymentSession } from "@/utils/paymentSessionState";
import { parseDonationAmount, getDonationAmountSummary, formatIDR } from "@/utils/donationAmount";

const successLogo = require('@/assets/image/IOM-ITB-PrimaryLogo-blue.png');

const DONATION_TYPES = [
  { value: 'iuran_sukarela', label: 'Iuran Sukarela' },
  { value: 'kontribusi_anggota', label: 'Kontribusi Anggota' },
  { value: 'kontribusi_donatur', label: 'Kontribusi Donatur' },
  { value: 'pembelian_merchandise', label: 'Pembelian Merchandise' },
  { value: 'kontribusi_sukarela', label: 'Kontribusi Sukarela' },
];

export default {
  components: {
    InputText,
    InputCheckbox,
    InputCheckboxOptions,
    InputFile,
    InputSelection,
  },
  props: {
    id: {
      type: String,
      required: false
    },
    mode: {
      type: String,
      default: "both",
      validator: (v) => ["manual", "midtrans", "both"].includes(v),
    },
  },
  data() {
    return {
      isLoading: false,
      data: {
        name: "",
        email: "",
        noWhatsapp: "",
        amount: "",
        donationType: "",
        facultyId: null,
        paymentMethod: this.mode === "midtrans" ? "Online (Midtrans)" : "Manual (Transfer Bank)",
        proof: null,
        notification: {},
        nameIsHidden: false,
        isHambaAllah: false,
      },
      dialCode: "+62",
      localPhone: "",
      dialCodes: [
        { code: "+62", flag: "🇮🇩" },
        { code: "+60", flag: "🇲🇾" },
        { code: "+65", flag: "🇸🇬" },
        { code: "+66", flag: "🇹🇭" },
        { code: "+63", flag: "🇵🇭" },
        { code: "+61", flag: "🇦🇺" },
        { code: "+81", flag: "🇯🇵" },
        { code: "+82", flag: "🇰🇷" },
        { code: "+86", flag: "🇨🇳" },
        { code: "+1", flag: "🇺🇸" },
        { code: "+44", flag: "🇬🇧" },
      ],
      donationTypeLabel: "",
      facultyLabel: "",
    };
  },
  setup() {
    const store = useStore();
    return { store };
  },
  computed: {
    facultiesList() {
      return this.store.getters.faculties || [];
    },
    donationTypeOptions() {
      return DONATION_TYPES.map(t => t.label);
    },
    facultyOptions() {
      return this.facultiesList
        .filter(f => f.isActive)
        .map(f => `${f.name} (${f.kodeUnik})`);
    },
    paymentMethodOptions() {
      if (this.mode === "manual") return ["Manual (Transfer Bank)"];
      if (this.mode === "midtrans") return ["Online (Midtrans)"];
      return ["Manual (Transfer Bank)", "Online (Midtrans)"];
    },
    showMethodSelector() {
      return this.mode === "both";
    },
    selectedFaculty() {
      return this.facultiesList.find(f => f.id === this.data.facultyId) || null;
    },
    donationAmountSummary() {
      return getDonationAmountSummary({
        amount: this.data.amount,
        faculty: this.selectedFaculty,
      });
    },
    formattedBaseAmount() {
      return formatIDR(this.donationAmountSummary.baseAmount);
    },
    formattedGrossAmount() {
      return formatIDR(this.donationAmountSummary.grossAmount);
    },
  },
  async mounted() {
    document.body.classList.add('no-scroll');
    try {
      await this.store.dispatch(GET_FACULTIES);
    } catch (err) {
      console.error("Failed to load faculties", err);
    }
  },
  watch: {
    dialCode(newCode) {
      this.data.noWhatsapp = this.localPhone ? `${newCode}${this.localPhone}` : '';
    },
  },
  methods: {
    closeModal() {
      this.isLoading = false;
      document.body.classList.remove('no-scroll');
      this.$emit('close');
    },
    updateValue({ key, value }) {
      if (key === 'amount') {
        this.data[key] = parseDonationAmount(value);
        return;
      }
      this.data[key] = value;
    },
    onPhoneInput(e) {
      const digits = String(e.target.value || '').replace(/\D/g, '').replace(/^0+/, '');
      this.localPhone = digits;
      this.data.noWhatsapp = digits ? `${this.dialCode}${digits}` : '';
    },
    onDonationTypeChange({ value }) {
      this.donationTypeLabel = value;
      const match = DONATION_TYPES.find(t => t.label === value);
      this.data.donationType = match ? match.value : "";
    },
    onFacultyChange({ value }) {
      this.facultyLabel = value;
      const match = this.facultiesList.find(f => `${f.name} (${f.kodeUnik})` === value);
      this.data.facultyId = match ? match.id : null;
    },
    fullPhone() {
      const digits = String(this.localPhone || '').replace(/\D/g, '');
      return digits ? `${this.dialCode}${digits}` : '';
    },
    buildPayload() {
      return {
        name: this.data.name,
        email: this.data.email,
        noWhatsapp: this.fullPhone(),
        amount: this.donationAmountSummary.baseAmount,
        donationType: this.data.donationType,
        facultyId: this.data.facultyId,
        notification: this.data.notification,
        nameIsHidden: this.data.nameIsHidden,
        isHambaAllah: this.data.isHambaAllah,
      };
    },
    validate() {
      if (!this.data.donationType) {
        Swal.fire({ icon: 'warning', title: 'Lengkapi Form', text: 'Pilih jenis donasi.' });
        return false;
      }
      if (!this.data.facultyId) {
        Swal.fire({ icon: 'warning', title: 'Lengkapi Form', text: 'Pilih fakultas.' });
        return false;
      }
      if (!this.data.amount || Number(this.data.amount) <= 0) {
        Swal.fire({ icon: 'warning', title: 'Lengkapi Form', text: 'Masukkan nominal donasi.' });
        return false;
      }
      if (!this.donationAmountSummary.isValidBaseAmount) {
        Swal.fire({
          icon: 'warning',
          title: 'Nominal Tidak Valid',
          text: 'Nominal dasar donasi harus kelipatan Rp1.000, sehingga 3 digit terakhir bernilai 000.',
        });
        return false;
      }

      const local = (this.localPhone || '').trim();
      if (!local) {
        Swal.fire({ icon: 'warning', title: 'Lengkapi Form', text: 'Nomor WhatsApp wajib diisi.' });
        return false;
      }
      if (!/^\d+$/.test(local)) {
        Swal.fire({ icon: 'warning', title: 'Nomor Tidak Valid', text: 'Nomor WhatsApp hanya boleh berisi angka.' });
        return false;
      }
      if (this.dialCode === '+62' && !/^8/.test(local)) {
        Swal.fire({ icon: 'warning', title: 'Nomor Tidak Valid', text: 'Nomor WhatsApp Indonesia harus diawali angka 8 (contoh: 81234567890). Tanpa 0 di depan.' });
        return false;
      }
      if (local.length < 8 || local.length > 13) {
        Swal.fire({ icon: 'warning', title: 'Nomor Tidak Valid', text: 'Panjang nomor WhatsApp harus 8–13 digit (contoh: 81234567890).' });
        return false;
      }

      if (this.data.paymentMethod === 'Online (Midtrans)') {
        const email = (this.data.email || '').trim();
        if (!email) {
          Swal.fire({ icon: 'warning', title: 'Lengkapi Form', text: 'Email wajib diisi untuk pembayaran Midtrans (invoice akan dikirim ke email ini).' });
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          Swal.fire({ icon: 'warning', title: 'Email Tidak Valid', text: 'Masukkan alamat email yang valid (contoh: nama@email.com).' });
          return false;
        }
      }
      return true;
    },
    async handleSubmit() {
      if (!this.validate()) return;
      this.isLoading = true;
      try {
        if (this.data.paymentMethod === 'Online (Midtrans)') {
          await this.payWithMidtrans();
        } else {
          await this.submitManual();
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: 'Data gagal dikirim.',
          icon: 'error',
          confirmButtonColor: '#7066e0',
          confirmButtonText: 'Coba lagi'
        });
      } finally {
        this.isLoading = false;
      }
    },
    async submitManual() {
      const payload = { ...this.buildPayload(), proof: this.data.proof };
      const response = await this.store.dispatch(POST_DONATION, { data: payload });
      document.body.classList.remove('no-scroll');
      const donationLabel = prettifyDonationType(this.data.donationType);
      const channels = describeNotificationChannels(this.data.notification);
      const donation = response?.data || response || {};
      const grossAmount = Number(donation.grossAmount || this.donationAmountSummary.grossAmount);
      await Swal.fire({
        title: 'Donasi Terkirim!',
        html: `
          <p>Terima kasih atas <strong>${donationLabel}</strong> Anda.</p>
          <p style="margin-top:8px;">Total donasi yang kami catat: <strong>${formatIDR(grossAmount)}</strong>.</p>
          <p style="margin-top:8px;">Bukti pembayaran akan kami verifikasi oleh tim IOM ITB.</p>
          <p style="margin-top:8px;color:#6b7280;font-size:13px;">Konfirmasi akan dikirim ke ${channels}.</p>
        `,
        icon: 'success',
        imageUrl: successLogo,
        imageWidth: 120,
        imageAlt: 'IOM ITB',
        confirmButtonColor: '#7066e0',
        confirmButtonText: 'OK'
      });
      window.location.reload();
    },
    async payWithMidtrans() {
      if (typeof window === 'undefined' || !window.snap) {
        Swal.fire({
          icon: 'error',
          title: 'Midtrans belum siap',
          text: 'Snap.js belum termuat. Silakan refresh halaman dan coba lagi.'
        });
        return;
      }
      const result = await this.store.dispatch(POST_DONATION_SNAP, { data: this.buildPayload() });
      const payload = (result && result.data) || result || {};
      const token = payload.token;
      const orderId = payload.orderId;
      const publicToken = payload.publicToken || payload.orderStatusToken || payload.trackingToken;
      const grossAmount = Number(payload.grossAmount || this.donationAmountSummary.grossAmount || 0);
      if (!token) throw new Error("Snap token tidak tersedia");

      const donationLabel = prettifyDonationType(this.data.donationType);
      if (orderId) {
        savePendingPayment({
          orderId,
          token,
          type: 'donation',
          amount: grossAmount,
          label: `Donasi — ${donationLabel}`,
          publicToken,
        });
        window.dispatchEvent(new Event('iom:pending-updated'));
      }

      const channels = describeNotificationChannels(this.data.notification);
      const amountFormatted = grossAmount.toLocaleString('id-ID');

      await new Promise((resolve) => {
        window.snap.pay(token, {
          onSuccess: () => {
            if (orderId) removePendingPayment(orderId);
            window.dispatchEvent(new Event('iom:pending-updated'));
            syncPaymentStatus(orderId, { attempts: 1, removeWhenTerminal: false }).catch(() => {});
            Swal.fire({
              icon: 'success',
              title: 'Pembayaran Berhasil',
              html: `
                <p>Terima kasih atas <strong>${donationLabel}</strong> Anda sebesar <strong>Rp ${amountFormatted}</strong>.</p>
                <p style="margin-top:8px;color:#6b7280;font-size:13px;">Konfirmasi pembayaran akan dikirim ke ${channels}.</p>
              `,
              imageUrl: successLogo,
              imageWidth: 120,
              imageAlt: 'IOM ITB',
              confirmButtonColor: '#7066e0',
            }).then(() => { window.location.reload(); });
            resolve();
          },
          onPending: () => {
            Swal.fire({ icon: 'info', title: 'Menunggu pembayaran', text: 'Transaksi Anda sedang diproses. Anda bisa melanjutkan pembayaran kapan saja melalui banner di pojok kanan bawah.' });
            resolve();
          },
          onError: async () => {
            const result = await syncPaymentStatus(orderId).catch(() => null);
            const isNotStarted = isNotStartedPaymentSession(result?.paymentSessionState);
            const isCanceled = isTerminalPaymentStatus(result?.paymentStatus);
            Swal.fire(
              isNotStarted
                ? { icon: 'info', title: 'Pembayaran belum dimulai', text: 'Anda belum memilih metode pembayaran. Anda bisa melanjutkannya lagi dari banner di pojok kanan bawah.' }
                : isCanceled
                ? { icon: 'info', title: 'Pembayaran dibatalkan', text: 'Transaksi Anda telah dibatalkan.' }
                : { icon: 'error', title: 'Pembayaran gagal', text: 'Silakan coba lagi melalui banner di pojok kanan bawah.' }
            );
            resolve();
          },
          onClose: async () => {
            const result = await syncPaymentStatus(orderId).catch(() => null);
            const isNotStarted = isNotStartedPaymentSession(result?.paymentSessionState);
            const isCanceled = isTerminalPaymentStatus(result?.paymentStatus);
            Swal.fire(
              isNotStarted
                ? { icon: 'info', title: 'Pembayaran belum dimulai', text: 'Anda belum memilih metode pembayaran. Klik "Lanjutkan" pada banner di pojok kanan bawah jika ingin melanjutkan.' }
                : isCanceled
                ? { icon: 'info', title: 'Pembayaran dibatalkan', text: 'Transaksi Anda telah dibatalkan.' }
                : { icon: 'info', title: 'Pembayaran ditunda', text: 'Jangan khawatir, pesanan Anda tersimpan. Klik "Lanjutkan" pada banner di pojok kanan bawah untuk melanjutkan.' }
            );
            resolve();
          },
        });
      });
    },
  },
  watch: {
    data: {
      deep: true,
      handler(newData) {
        this.$emit('update', newData);
      }
    }
  },
};
</script>

<style>
.no-scroll {
  overflow: hidden;
}
</style>
