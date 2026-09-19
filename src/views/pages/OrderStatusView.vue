<template>
  <div class="bg-colorSecond min-h-[60vh] py-[24px] px-[18px] md:px-[70px]">
    <div class="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg shadow p-6">
      <h1 class="text-2xl md:text-3xl font-bold text-main mb-1">Status Pesanan</h1>
      <p class="text-gray-500 text-sm mb-6">Detail pesanan merchandise Anda.</p>

      <div v-if="loading" class="text-center py-12 text-gray-500">Memuat data pesanan...</div>

      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500 font-semibold mb-2">{{ error }}</p>
        <router-link to="/merchandise" class="inline-block mt-4 px-4 py-2 bg-main text-white rounded-md hover:opacity-90">
          Kembali ke Merchandise
        </router-link>
      </div>

      <div v-else-if="transaction" class="space-y-6">
        <div class="flex items-start gap-4 border-b border-gray-200 pb-4">
          <img
            v-if="transaction?.merchandises?.image"
            :src="transaction.merchandises.image"
            alt="Produk"
            class="w-24 h-24 rounded-md object-cover"
          />
          <div class="flex-1">
            <h2 class="text-lg font-bold">{{ transaction?.merchandises?.name || '-' }}</h2>
            <p class="text-gray-600 text-sm">Jumlah: {{ transaction.qty }}</p>
            <p class="text-gray-600 text-sm">Harga satuan: {{ formatIDR(transaction?.merchandises?.price) }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p class="text-gray-500">Kode Pesanan</p>
            <p class="font-mono font-semibold">{{ transaction.code || '-' }}</p>
          </div>
          <div>
            <p class="text-gray-500">Nama Pemesan</p>
            <p class="font-semibold">{{ transaction.username }}</p>
          </div>
          <div>
            <p class="text-gray-500">Email</p>
            <p class="font-semibold">{{ transaction.email }}</p>
          </div>
          <div>
            <p class="text-gray-500">No. Telepon</p>
            <p class="font-semibold">{{ transaction.noTelp }}</p>
          </div>
          <div>
            <p class="text-gray-500">Total Pembayaran</p>
            <p class="font-semibold text-main">{{ formatIDR(transaction.grossAmount || (transaction?.merchandises?.price * transaction.qty)) }}</p>
          </div>
          <div class="md:col-span-2">
            <p class="text-gray-500">Alamat Pengiriman</p>
            <p class="font-semibold">{{ transaction.address }}</p>
          </div>
          <div v-if="transaction.notes" class="md:col-span-2">
            <p class="text-gray-500">Catatan</p>
            <p class="font-semibold whitespace-pre-line">{{ transaction.notes }}</p>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider">Status Pembayaran</p>
            <span
              class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold"
              :class="paymentStatusClass"
            >
              {{ paymentStatusLabel }}
            </span>
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wider">Status Pesanan</p>
            <span
              class="inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold capitalize"
              :class="orderStatusClass"
            >
              {{ transaction.status || '-' }}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-200 pt-5">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-main">Riwayat Pesanan</h3>
            <p class="text-sm text-gray-500">Perkembangan status pesanan Anda dari waktu ke waktu.</p>
          </div>

          <ol class="relative border-l-2 border-blue-100 ml-3 space-y-5">
            <li
              v-for="(item, index) in statusHistory"
              :key="`${item.status}-${item.changedAt || index}`"
              class="relative pl-6"
            >
              <span
                class="absolute -left-[11px] top-0 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white"
                :class="index === statusHistory.length - 1 ? 'bg-main shadow' : 'bg-blue-100'"
              >
                <span
                  class="h-2 w-2 rounded-full"
                  :class="index === statusHistory.length - 1 ? 'bg-white' : 'bg-main'"
                ></span>
              </span>
              <div class="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
                <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p class="font-semibold text-main">{{ item.label || labelForStatus(item.status) }}</p>
                  <p class="text-xs font-medium text-gray-500">{{ formatDateTime(item.changedAt) }}</p>
                </div>
                <p v-if="item.note" class="mt-1 text-sm text-gray-600">{{ item.note }}</p>
              </div>
            </li>
          </ol>
        </div>

        <div class="bg-blue-50 border border-blue-100 rounded-md p-4 text-sm text-blue-900">
          <p>
            Konfirmasi pembayaran telah dikirim ke <strong>{{ transaction.email }}</strong>
            dan WhatsApp <strong>{{ transaction.noTelp }}</strong>.
          </p>
          <p class="mt-2 text-blue-800/80">Anda akan menerima notifikasi lanjutan ketika status pesanan diperbarui.</p>
        </div>

        <div class="flex justify-end">
          <router-link to="/merchandise" class="px-4 py-2 bg-main text-white rounded-md hover:opacity-90">
            Kembali ke Merchandise
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GET_TRANSACTION_BY_TOKEN } from "@/store/transactions.module";

const PAYMENT_STATUS_LABELS = {
  pending: "Menunggu Pembayaran",
  settlement: "Lunas",
  failed: "Gagal",
  expired: "Kadaluarsa",
  refunded: "Dikembalikan",
};

const ORDER_STATUS_LABELS = {
  waiting: "Menunggu",
  "on process": "Diproses",
  "on delivery": "Dikirim",
  arrived: "Tiba",
  done: "Selesai",
  canceled: "Dibatalkan",
  denied: "Ditolak",
};

export default {
  data() {
    return {
      loading: true,
      error: "",
    };
  },
  computed: {
    orderStatusToken() {
      return this.$route.query.token;
    },
    transaction() {
      return this.$store.getters.currentTransaction?.data || null;
    },
    paymentStatusLabel() {
      return PAYMENT_STATUS_LABELS[this.transaction?.paymentStatus] || this.transaction?.paymentStatus || "-";
    },
    paymentStatusClass() {
      const s = this.transaction?.paymentStatus;
      if (s === "settlement") return "bg-green-100 text-green-700";
      if (s === "pending") return "bg-yellow-100 text-yellow-700";
      if (s === "failed" || s === "expired") return "bg-red-100 text-red-700";
      return "bg-gray-100 text-gray-700";
    },
    orderStatusClass() {
      const s = this.transaction?.status;
      if (s === "done" || s === "arrived") return "bg-green-100 text-green-700";
      if (s === "on process" || s === "on progress" || s === "on delivery") return "bg-blue-100 text-blue-700";
      if (s === "canceled" || s === "denied") return "bg-red-100 text-red-700";
      return "bg-yellow-100 text-yellow-700";
    },
    statusHistory() {
      const histories = this.transaction?.statusHistory;
      if (Array.isArray(histories) && histories.length > 0) return histories;

      if (!this.transaction?.status) return [];

      return [{
        status: this.transaction.status,
        label: this.labelForStatus(this.transaction.status),
        note: "Status terkini",
        changedAt: this.transaction.updatedAt || this.transaction.createdAt,
      }];
    },
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch() {
      if (!this.orderStatusToken) {
        this.error = "Tautan status pesanan tidak valid.";
        this.loading = false;
        return;
      }
      try {
        await this.$store.dispatch(GET_TRANSACTION_BY_TOKEN, { token: this.orderStatusToken });
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || "Gagal memuat data pesanan.";
      } finally {
        this.loading = false;
      }
    },
    formatIDR(value) {
      const n = Number(value || 0);
      return n.toLocaleString("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 });
    },
    labelForStatus(status) {
      return ORDER_STATUS_LABELS[status] || status || "-";
    },
    formatDateTime(value) {
      if (!value) return "-";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "-";
      return date.toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
