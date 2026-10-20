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
          <p class="text-gray-500 mb-6" :class="{ 'mt-3': !optionExtraPrice }">Stok: {{ currentMerchandise.stock }}</p>

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
        </div>
      </div>
    </div>

    <!-- User Information Form -->
    <div class="mt-6 bg-white border border-gray-200 rounded-lg shadow p-6 max-w-3xl mx-auto">
      <h2 class="text-xl font-bold mb-4">Informasi Pembeli</h2>

      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">
          Nama <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          v-model.trim="userInfo.name"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
          :class="errors.name ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
      </div>

      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email <span class="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          v-model.trim="userInfo.email"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
          :class="errors.email ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
      </div>

      <div class="mb-4">
        <label for="noTelp" class="block text-sm font-medium text-gray-700">
          No. Telepon <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="noTelp"
          v-model="userInfo.noTelp"
          inputmode="numeric"
          @input="sanitizePhone"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
          :class="errors.noTelp ? 'border-red-500' : 'border-gray-300'"
        />
        <p v-if="errors.noTelp" class="mt-1 text-sm text-red-500">{{ errors.noTelp }}</p>
      </div>

      <div class="mb-4">
        <label for="address" class="block text-sm font-medium text-gray-700">
          Alamat Lengkap <span class="text-red-500">*</span>
        </label>
        <textarea
          id="address"
          v-model.trim="userInfo.address"
          rows="3"
          placeholder="Jalan, nomor, kecamatan, kota/kabupaten, provinsi, kode pos"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
          :class="errors.address ? 'border-red-500' : 'border-gray-300'"
        ></textarea>
        <p class="mt-1 text-xs text-gray-500">Ongkir dihitung dari kota/kabupaten pada alamat ini.</p>
        <p v-if="errors.address" class="mt-1 text-sm text-red-500">{{ errors.address }}</p>

        <div v-if="userInfo.address" class="mt-2 text-sm">
          <p v-if="shippingLoading" class="text-gray-500">Menghitung ongkir…</p>
          <p v-else-if="shippingQuote" class="rounded border border-green-200 bg-green-50 px-3 py-2 text-gray-700">
            Ongkir ke <strong>{{ shippingQuote.matchedPlace }}</strong>:
            <strong>{{ formatPrice(shippingQuote.cost) }}</strong>
            <span class="text-gray-500">
              (tarif {{ shippingQuote.zoneLabel }}{{ shippingQuote.byNearest ? ", wilayah tarif terdekat" : "" }})
            </span>
          </p>
          <p v-else-if="shippingChecked" class="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
            Kota/kabupaten belum dikenali. Lengkapi alamat sampai nama kota/kabupaten dan provinsi agar ongkir bisa dihitung.
          </p>
        </div>

        <details v-if="shippingRates.length" class="mt-2 text-sm text-gray-600">
          <summary class="cursor-pointer select-none text-main">Lihat tarif ongkir</summary>
          <ul class="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
            <li v-for="rate in shippingRates" :key="rate.zone" class="flex justify-between gap-4">
              <span>{{ rate.label }}</span>
              <span class="font-medium">{{ formatPrice(rate.cost) }}</span>
            </li>
          </ul>
          <p class="mt-1 text-xs text-gray-500">Alamat di luar daftar memakai tarif wilayah terdekat.</p>
        </details>
      </div>

      <div class="mb-4">
        <label for="notes" class="block text-sm font-medium text-gray-700">
          Catatan (opsional)
        </label>
        <textarea
          id="notes"
          v-model.trim="userInfo.notes"
          rows="2"
          placeholder="Contoh: ukuran baju, warna, titipan pesan, dll."
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
        ></textarea>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">
          Metode Pembayaran <span class="text-red-500">*</span>
        </label>
        <select
          v-model="paymentMethod"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
        >
          <option value="manual">{{ showBankTransfer ? "Manual (Transfer Bank / QRIS)" : "Manual (QRIS)" }}</option>
          <option v-if="midtransEnabled" value="midtrans">Online (Midtrans)</option>
          <option v-else value="midtrans" disabled>Online (Midtrans) - Sementara Tidak Tersedia</option>
        </select>
        <div class="mt-2 text-sm text-gray-500 space-y-0.5">
          <p>Subtotal: {{ formatPrice(subtotal) }}</p>
          <p>Ongkir: {{ shippingQuote ? formatPrice(shippingQuote.cost) : "— (lengkapi alamat)" }}</p>
          <p class="font-medium text-gray-700">Total Pembayaran: {{ formatPrice(totalPayment) }}</p>
        </div>
      </div>

      <div v-if="paymentMethod === 'midtrans'" class="mb-4 bg-blue-50 border border-blue-200 p-4 rounded">
        <p class="text-sm text-gray-700">
          Setelah menekan <strong>Pesan Sekarang</strong>, jendela pembayaran Midtrans akan terbuka.
          Anda dapat membayar dengan kartu kredit, transfer bank, e-wallet, atau QRIS.
        </p>
      </div>

      <div v-else class="mb-4">
        <div class="mb-4 bg-gray-50 border border-gray-200 p-4 rounded text-sm text-gray-700">
          <p class="font-medium">{{ showBankTransfer ? "Bayar melalui salah satu cara berikut:" : "Bayar melalui QRIS berikut:" }}</p>
          <div class="flex flex-col md:flex-row gap-4 mt-3">
            <div v-if="showBankTransfer" class="w-full md:w-1/2">
              <p class="font-semibold">Transfer Bank</p>
              <p class="mt-1">No. Rekening <strong>0028668954</strong> (BNI) An. IOM-ITB</p>
            </div>
            <div class="w-full md:w-1/2">
              <p class="font-semibold">Scan QRIS</p>
              <!-- QRIS statis: nominal diketik sendiri oleh pembeli saat scan. -->
              <a :href="merchQrisImage" target="_blank" rel="noopener" title="Buka QRIS ukuran penuh">
                <img :src="merchQrisImage" alt="QRIS IOM ITB Kegiatan (BNI)" class="mt-1 w-full max-w-[240px] h-auto rounded border border-gray-200" />
              </a>
              <p class="mt-1 text-xs text-gray-500">
                <template v-if="shippingQuote">
                  Masukkan nominal <strong>{{ formatPrice(totalPayment) }}</strong> (termasuk ongkir) saat membayar.
                </template>
                <template v-else>Lengkapi alamat dulu untuk melihat total yang harus dibayar (termasuk ongkir).</template>
              </p>
            </div>
          </div>
        </div>

        <label class="block text-sm font-medium text-gray-700">
          Upload Bukti Pembayaran <span class="text-red-500">*</span>
        </label>

        <input
          type="file"
          ref="file"
          name="file"
          id="payment"
          @change="onChange"
          class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm hidden"
        />

        <label 
          @dragover="dragover"
          @dragleave="dragleave"
          @drop="drop"
          for="payment" 
          :class="`cursor-pointer hover:opacity-[0.8] ${ isDragging ? 'opacity-[0.8]' : ''}`"
        >
          <img v-if="file.length" :src="generateURL(file[0] || '')" alt="Preview" class="rounded-lg w-full h-auto mt-1" />
          <div
            v-else
            class="mt-1 w-full h-[120px] border border-gray-400 border-dashed rounded-[8px] flex justify-center items-center"
            :class="errors.payment ? 'border-red-500' : 'border-gray-400'"
          >
            <div class="text-center">
              <p class="text-gray-600 text-[14px] flex items-center gap-2 font-[600]">
                <img :src="require('@/assets/icon/upload.svg')" alt="icon" class="rounded-lg w-[14px] h-auto" />
                Click to choose a file or drag here
              </p>
              <p class="text-gray-600 text-[11px]">Accepts .jpg, .jpeg, .png, .pdf files</p>
              <p class="text-gray-600 text-[11px]">Size limit: 5 MB</p>
            </div>
          </div>
        </label>

        <p v-if="errors.payment" class="mt-1 text-sm text-red-500">
          {{ errors.payment }}
        </p>
      </div>

      <!-- Submit Button -->
      <div class="mt-6">
        <button
          type="button"
          @click="submitCheckout"
          class="inline-flex items-center px-5 py-2 text-white bg-main rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
        Pesan Sekarang
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_MERCHANDISE_DETAIL } from "@/store/merchandises.module";
import { POST_TRANSACTION, POST_TRANSACTION_SNAP, GET_SHIPPING_RATES, GET_SHIPPING_QUOTE } from "@/store/transactions.module";
import Swal from 'sweetalert2';
import { savePendingPayment, removePendingPayment } from "@/utils/pendingPayments";
import { syncPaymentStatus, isTerminalPaymentStatus, isMidtransEnabled } from "@/utils/midtransPayment";
import { isNotStartedPaymentSession } from "@/utils/paymentSessionState";
import MerchPoNotice from "@/components/MerchPoNotice.vue";

const successLogo = require('@/assets/image/IOM-ITB-PrimaryLogo-blue.png');

export default {
  components: {
    MerchPoNotice,
  },
  data() {
    return {
      quantity: 1,
      userInfo: {
        name: "",
        email: "",
        noTelp: "",
        address: "",
        notes: "",
      },
      file: [],
      payment: "",
      paymentMethod: "manual",
      isDragging: false,
      selectedOptions: {},
      shippingRates: [],
      shippingQuote: null,
      shippingLoading: false,
      shippingChecked: false,
      shippingRequestId: 0,
      errors: {
        quantity: "",
        options: "",
        name: "",
        email: "",
        noTelp: "",
        address: "",
        payment: "",
      },
    };
  },
  computed: {
    // Transfer rekening untuk merchandise ditutup sementara — hanya QRIS.
    // Ubah ke true untuk menampilkan lagi No. Rekening BNI.
    showBankTransfer() {
      return false;
    },
    merchQrisImage() {
      return require("@/assets/image/merch-qris-bni.jpeg");
    },
    midtransEnabled() {
      return isMidtransEnabled();
    },
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
    totalPayment() {
      return this.subtotal + (this.shippingQuote ? this.shippingQuote.cost : 0);
    },
  },
  watch: {
    "userInfo.address"() {
      this.scheduleShippingQuote();
    },
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
    this.$store.dispatch(GET_SHIPPING_RATES)
      .then((rates) => { this.shippingRates = rates; })
      .catch(() => {});
  },
  beforeUnmount() {
    clearTimeout(this.shippingTimer);
  },
  methods: {
    // Ongkir dihitung server dari teks alamat (tunggu pengguna berhenti
    // mengetik); nilai final tetap dihitung ulang server saat pesanan dibuat.
    scheduleShippingQuote() {
      clearTimeout(this.shippingTimer);
      this.shippingQuote = null;
      this.shippingChecked = false;
      const address = this.userInfo.address;
      if (!address) {
        this.shippingLoading = false;
        return;
      }
      this.shippingLoading = true;
      this.shippingTimer = setTimeout(() => this.fetchShippingQuote(address), 600);
    },
    async fetchShippingQuote(address) {
      const requestId = ++this.shippingRequestId;
      try {
        const quote = await this.$store.dispatch(GET_SHIPPING_QUOTE, { address });
        if (requestId !== this.shippingRequestId) return;
        this.shippingQuote = quote;
        this.shippingChecked = true;
        if (quote && this.errors.address) this.errors.address = "";
      } catch (err) {
        if (requestId !== this.shippingRequestId) return;
        console.error(err);
        this.shippingQuote = null;
        this.shippingChecked = false;
      } finally {
        if (requestId === this.shippingRequestId) this.shippingLoading = false;
      }
    },
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
      return parseFloat(price).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.payment = file;

      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.previewImage = e.target.result; // Set the preview image URL
        };
        reader.readAsDataURL(file); // Read the file as a data URL for preview
      } else {
        this.previewImage = null; // Clear the preview if no file is selected
      }
    },
    onChange() {
      const self = this;
      let incomingFiles = Array.from(this.$refs.file.files);
      const fileExist = self.file.some((r) =>
        incomingFiles.some(
          (file) => file.name === r.name && file.size === r.size,
        ),
      );
      const fileRequired = incomingFiles.some((file) =>
        ["image/jpg", "image/jpeg", "image/png", "application/pdf"].includes(
          file.type,
        ),
      );

      if (!fileRequired) {
        Swal.fire({
          title: "Upload File",
          text: "Format file must .pdf, .jpg, .jpeg, or .png.",
          icon: "warning",
        });
        return;
      }

      if (incomingFiles.length > 1 || self.file.length == 1) {
        Swal.fire({
          title: "Upload File",
          text: "Upload file must be 1 items.",
          icon: "warning",
        });
        return;
      }

      if (fileExist) {
        self.showMessage = true;
        Swal.fire({
          title: "Upload File",
          text: "New upload contains files that already exist.",
          icon: "warning",
        });
        return;
      }

      self.file = incomingFiles;
      this.payment = incomingFiles[0];
    },
    dragover(e) {
      e.preventDefault();
      this.isDragging = true;
    },
    dragleave() {
      this.isDragging = false;
    },
    drop(e) {
      e.preventDefault();
      this.$refs.file.files = e.dataTransfer.files;
      this.onChange();
      this.isDragging = false;
    },
    generateURL(file) {
      let fileSrc = URL.createObjectURL(file);
      setTimeout(() => {
        URL.revokeObjectURL(fileSrc);
      }, 1000);
      return ["image/jpg", "image/jpeg", "image/png"].includes(file.type)
        ? fileSrc
        : '';
    },
    async submitCheckout() {
      if (!this.validateForm()) {
        Swal.fire({
          title: "Required!",
          text: "Mohon lengkapi semua form dengan benar.",
          icon: "warning",
        });
        return;
      }

      const basePayload = {
        merchandiseId: this.currentMerchandise.id,
        username: this.userInfo.name,
        email: this.userInfo.email,
        noTelp: this.userInfo.noTelp,
        address: this.userInfo.address,
        qty: Number(this.quantity),
        notes: this.userInfo.notes || undefined,
        // String JSON: checkout manual dikirim sebagai multipart/form-data.
        selectedOptions: this.optionGroups.length ? JSON.stringify(this.selectedOptions) : undefined,
      };

      const confirmCheckout = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!',
      });

      if (!confirmCheckout.isConfirmed) return;

      try {
        if (this.paymentMethod === "midtrans") {
          await this.payWithMidtrans(basePayload);
        } else {
          const response = await this.$store.dispatch(POST_TRANSACTION, {
            data: { ...basePayload, payment: this.payment },
          });
          const itemName = this.currentMerchandise?.name || 'Pesanan';
          const orderStatusToken = response?.data?.orderStatusToken || response?.data?.trackingToken || response?.data?.publicToken;
          await Swal.fire({
            title: "Checkout Berhasil!",
            html: `
              <p>Pesanan <strong>${itemName}</strong> Anda telah kami terima.</p>
              <p style="margin-top:8px;">Bukti pembayaran akan diverifikasi oleh tim IOM ITB.</p>
              <p style="margin-top:8px;color:#6b7280;font-size:13px;">Konfirmasi akan dikirim ke WhatsApp dan Email Anda.</p>
            `,
            icon: "success",
            imageUrl: successLogo,
            imageWidth: 120,
            imageAlt: 'IOM ITB',
            confirmButtonColor: '#7066e0',
            confirmButtonText: "OK",
          });
          if (orderStatusToken) window.location.href = `/order-status?token=${encodeURIComponent(orderStatusToken)}`;
          else window.location.href = `/transaksi?q=${response?.data?.code || ''}`;
        }
      } catch (err) {
        console.error(err);
        await Swal.fire({
          title: "Error!",
          // Pesan validasi server (opsi/alamat) lebih jelas daripada pesan umum.
          text: err?.response?.data?.message || "There was a problem with your transaction.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
    async payWithMidtrans(basePayload) {
      if (typeof window === "undefined" || !window.snap) {
        await Swal.fire({
          icon: "error",
          title: "Midtrans belum siap",
          text: "Snap.js belum termuat. Silakan refresh halaman dan coba lagi.",
        });
        return;
      }
      const result = await this.$store.dispatch(POST_TRANSACTION_SNAP, { data: basePayload });
      const payload = (result && result.data) || result || {};
      const token = payload.token;
      const orderId = payload.orderId;
      const code = payload.code;
      const orderStatusToken = payload.orderStatusToken || payload.trackingToken || payload.publicToken;
      if (!token) throw new Error("Snap token tidak tersedia");

      const grossAmount = Number(payload.grossAmount ?? this.totalPayment);
      if (orderId) {
        savePendingPayment({
          orderId,
          token,
          type: 'transaction',
          amount: grossAmount,
          label: `Pembelian — ${this.currentMerchandise?.name || 'Merchandise'}`,
          code,
          orderStatusToken,
        });
        window.dispatchEvent(new Event('iom:pending-updated'));
      }

      await new Promise((resolve) => {
        window.snap.pay(token, {
          onSuccess: () => {
            if (orderId) removePendingPayment(orderId);
            window.dispatchEvent(new Event('iom:pending-updated'));
            syncPaymentStatus(orderId, { attempts: 1, removeWhenTerminal: false }).catch(() => {});
            const itemName = this.currentMerchandise?.name || 'Pesanan';
            const amountFormatted = Number(grossAmount).toLocaleString('id-ID');
            Swal.fire({
              icon: "success",
              title: "Pembayaran Berhasil",
              html: `
                <p>Terima kasih atas pembelian <strong>${itemName}</strong> sebesar <strong>Rp ${amountFormatted}</strong>.</p>
                <p style="margin-top:8px;">Pesanan Anda sedang kami proses.</p>
                <p style="margin-top:8px;color:#6b7280;font-size:13px;">Konfirmasi pembayaran telah dikirim ke WhatsApp dan Email Anda.</p>
              `,
              imageUrl: successLogo,
              imageWidth: 120,
              imageAlt: 'IOM ITB',
              confirmButtonColor: '#7066e0',
            }).then(() => {
              if (orderStatusToken) window.location.href = `/order-status?token=${encodeURIComponent(orderStatusToken)}`;
              else if (code) window.location.href = `/transaksi?q=${code}`;
              else window.location.reload();
            });
            resolve();
          },
          onPending: () => {
            Swal.fire({ icon: "info", title: "Menunggu pembayaran", text: "Transaksi sedang diproses. Anda bisa melanjutkan pembayaran kapan saja melalui banner di pojok kanan bawah." });
            resolve();
          },
          onError: async () => {
            const result = await syncPaymentStatus(orderId).catch(() => null);
            const isNotStarted = isNotStartedPaymentSession(result?.paymentSessionState);
            const isCanceled = isTerminalPaymentStatus(result?.paymentStatus);
            Swal.fire(
              isNotStarted
                ? { icon: "info", title: "Pembayaran belum dimulai", text: "Anda belum memilih metode pembayaran. Anda bisa melanjutkannya lagi dari banner di pojok kanan bawah." }
                : isCanceled
                ? { icon: "info", title: "Pembayaran dibatalkan", text: "Transaksi Anda telah dibatalkan." }
                : { icon: "error", title: "Pembayaran gagal", text: "Silakan coba lagi melalui banner di pojok kanan bawah." }
            );
            resolve();
          },
          onClose: async () => {
            const result = await syncPaymentStatus(orderId).catch(() => null);
            const isNotStarted = isNotStartedPaymentSession(result?.paymentSessionState);
            const isCanceled = isTerminalPaymentStatus(result?.paymentStatus);
            Swal.fire(
              isNotStarted
                ? { icon: "info", title: "Pembayaran belum dimulai", text: 'Anda belum memilih metode pembayaran. Klik "Lanjutkan" pada banner di pojok kanan bawah jika ingin melanjutkan.' }
                : isCanceled
                ? { icon: "info", title: "Pembayaran dibatalkan", text: "Transaksi Anda telah dibatalkan." }
                : { icon: "info", title: "Pembayaran ditunda", text: 'Jangan khawatir, pesanan Anda tersimpan. Klik "Lanjutkan" pada banner di pojok kanan bawah untuk melanjutkan.' }
            );
            resolve();
          },
        });
      });
    },
    clearErrors() {
      this.errors = {
        quantity: "",
        options: "",
        name: "",
        email: "",
        noTelp: "",
        address: "",
        payment: "",
      };
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

    sanitizePhone() {
      this.userInfo.noTelp = this.userInfo.noTelp.replace(/[^0-9]/g, "");
    },

    validateForm() {
      this.clearErrors();
      let isValid = true;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9]+$/;

      const qty = Number(this.quantity);
      const stock = Number(this.currentMerchandise.stock || 0);

      if (!this.quantity && this.quantity !== 0) {
        this.errors.quantity = "Jumlah produk wajib diisi.";
        isValid = false;
      } else if (!Number.isInteger(qty)) {
        this.errors.quantity = "Jumlah produk harus bilangan bulat.";
        isValid = false;
      } else if (qty < 1) {
        this.errors.quantity = "Jumlah produk minimal 1.";
        isValid = false;
      } else if (stock && qty > stock) {
        this.errors.quantity = `Jumlah produk tidak boleh melebihi stok (${stock}).`;
        isValid = false;
      }

      const missingOptions = this.optionGroups.filter((g) => !this.selectedOptions[g.name]).map((g) => g.name);
      if (missingOptions.length) {
        this.errors.options = `Pilih ${missingOptions.join(", ")} terlebih dahulu.`;
        isValid = false;
      }

      if (!this.userInfo.name.trim()) {
        this.errors.name = "Nama wajib diisi.";
        isValid = false;
      }

      if (!this.userInfo.email.trim()) {
        this.errors.email = "Email wajib diisi.";
        isValid = false;
      } else if (!emailRegex.test(this.userInfo.email)) {
        this.errors.email = "Format email tidak valid.";
        isValid = false;
      }

      if (!this.userInfo.noTelp.trim()) {
        this.errors.noTelp = "No. Telepon wajib diisi.";
        isValid = false;
      } else if (!phoneRegex.test(this.userInfo.noTelp)) {
        this.errors.noTelp = "No. Telepon hanya boleh angka.";
        isValid = false;
      } else if (this.userInfo.noTelp.length < 10 || this.userInfo.noTelp.length > 15) {
        this.errors.noTelp = "No. Telepon harus 10 hingga 15 digit.";
        isValid = false;
      }

      if (!this.userInfo.address.trim()) {
        this.errors.address = "Alamat lengkap wajib diisi.";
        isValid = false;
      } else if (!this.shippingQuote) {
        this.errors.address = this.shippingLoading
          ? "Ongkir masih dihitung, tunggu sebentar."
          : "Ongkir belum bisa dihitung. Lengkapi alamat sampai nama kota/kabupaten dan provinsi.";
        isValid = false;
      }

      if (this.paymentMethod === "manual" && !this.payment) {
        this.errors.payment = "Bukti pembayaran wajib diunggah.";
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
</style>
