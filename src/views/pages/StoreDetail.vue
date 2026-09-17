<template>
  <div class="bg-colorSecond pt-[10px] pb-[32px] px-[18px] md:px-[70px]">
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
          <p class="text-2xl font-bold text-main mb-4">{{ formatPrice(currentMerchandise.price) }}</p>
          <p class="text-gray-500 mb-6">Stok: {{ currentMerchandise.stock }}</p>

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
          Alamat Lengkap <span class="ext-red-500">*</span>
        </label>
        <textarea
          id="address"
          v-model.trim="userInfo.address"
          rows="3"
          class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
          :class="errors.address ? 'border-red-500' : 'border-gray-300'"
        ></textarea>
        <p v-if="errors.address" class="mt-1 text-sm text-red-500">{{ errors.address }}</p>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">
          Metode Pembayaran <span class="text-red-500">*</span>
        </label>
        <select
          v-model="paymentMethod"
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-main focus:border-main sm:text-sm"
        >
          <option value="manual">Manual (Transfer Bank)</option>
          <option value="midtrans">Online (Midtrans)</option>
        </select>
        <span class="block text-sm font-medium text-gray-500 mt-2">
          Total Pembayaran: {{ formatPrice(quantity * currentMerchandise.price) }}
        </span>
      </div>

      <div v-if="paymentMethod === 'midtrans'" class="mb-4 bg-blue-50 border border-blue-200 p-4 rounded">
        <p class="text-sm text-gray-700">
          Setelah menekan <strong>Pesan Sekarang</strong>, jendela pembayaran Midtrans akan terbuka.
          Anda dapat membayar dengan kartu kredit, transfer bank, e-wallet, atau QRIS.
        </p>
      </div>

      <div v-else class="mb-4">
        <label class="block text-sm font-medium text-gray-700">
          Upload Bukti Pembayaran <span class="text-red-500">*</span>
        </label>
        <span class="block text-sm font-medium text-gray-500">
          No. Rekening 0028668954 (BNI) An. IOM-ITB
        </span>

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
import { POST_TRANSACTION, POST_TRANSACTION_SNAP } from "@/store/transactions.module";
import Swal from 'sweetalert2';
import { savePendingPayment, removePendingPayment } from "@/utils/pendingPayments";
import { syncPaymentStatus, isTerminalPaymentStatus } from "@/utils/midtransPayment";
import { isNotStartedPaymentSession } from "@/utils/paymentSessionState";

const successLogo = require('@/assets/image/IOM-ITB-PrimaryLogo-blue.png');

export default {
  data() {
    return {
      quantity: 1,
      userInfo: {
        name: "",
        email: "",
        noTelp: "",
        address: "",
      },
      file: [],
      payment: "",
      paymentMethod: "manual",
      isDragging: false,
      errors: {
        quantity: "",
        name: "",
        email: "",
        noTelp: "",
        address: "",
        payment: "",
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
          text: "There was a problem with your transaction.",
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

      const grossAmount = Number(this.currentMerchandise?.price || 0) * Number(basePayload.qty || 0);
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
