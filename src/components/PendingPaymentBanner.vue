<template>
  <Transition name="slide-up">
    <div
      v-if="pendingList.length > 0"
      class="fixed bottom-4 right-4 left-4 md:left-auto md:right-6 md:bottom-6 z-[1000] max-w-md mx-auto md:mx-0 pointer-events-none"
    >
      <div
        class="pointer-events-auto bg-white rounded-[24px] shadow-soft border border-line-brand overflow-hidden"
      >
        <div class="bg-surface-subtle px-4 md:px-5 py-3 border-b border-line-brand">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 min-w-[40px] rounded-full bg-main text-white flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-main text-[14px] md:text-[15px] font-[800] leading-tight">
                Pembayaran Belum Selesai
              </p>
              <p class="text-main/70 text-[12px] md:text-[13px] leading-relaxed mt-1">
                Transaksi Anda masih tersimpan dan bisa dilanjutkan kapan saja sebelum kadaluarsa.
              </p>
            </div>
          </div>
        </div>

        <div class="p-4 md:p-5 bg-white">
          <div v-for="p in pendingList" :key="p.orderId" class="mb-3 last:mb-0">
            <div class="flex items-start justify-between gap-3 rounded-[18px] border border-line-brand bg-surface-subtle p-3 md:p-4">
              <div class="flex-1 min-w-0">
                <p class="text-[14px] font-[700] text-main truncate">{{ p.label || labelFor(p) }}</p>
                <p class="text-[12px] text-main/65 mt-1">
                  <span class="font-mono">{{ p.code || p.orderId }}</span>
                </p>
                <p class="text-[20px] font-[800] text-main mt-2">{{ formatIDR(p.amount) }}</p>
                <p class="text-[11px] text-main/60 mt-1">
                  Kadaluarsa: {{ formatExpiry(p.expiresAt) }}
                </p>
              </div>
              <div class="flex flex-col gap-2 shrink-0">
                <button
                  @click="resume(p)"
                  :disabled="resumingOrderId === p.orderId"
                  class="bg-main hover:opacity-[0.92] disabled:opacity-50 text-white text-[12px] font-[700] px-4 py-2 rounded-full whitespace-nowrap flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                  </svg>
                  Lanjutkan
                </button>
                <button
                  @click="dismiss(p)"
                  :disabled="cancelingOrderId === p.orderId"
                  class="border border-line-brand text-main/75 hover:bg-surface-subtle hover:text-main disabled:opacity-50 text-[12px] font-[600] px-4 py-2 rounded-full transition"
                >
                  Batalkan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import Swal from 'sweetalert2';
import { getPendingPayments, removePendingPayment } from '@/utils/pendingPayments';
import { cancelPayment, syncPaymentStatus, isTerminalPaymentStatus } from '@/utils/midtransPayment';
import { isNotStartedPaymentSession } from '@/utils/paymentSessionState';

export default {
  name: 'PendingPaymentBanner',
  data() {
    return {
      pendingList: [],
      resumingOrderId: null,
      cancelingOrderId: null,
      refreshTimer: null,
    };
  },
  mounted() {
    this.refresh();
    this.refreshTimer = setInterval(this.refresh, 30000);
    window.addEventListener('storage', this.refresh);
    window.addEventListener('iom:pending-updated', this.refresh);
  },
  beforeUnmount() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
    window.removeEventListener('storage', this.refresh);
    window.removeEventListener('iom:pending-updated', this.refresh);
  },
  methods: {
    refresh() {
      this.pendingList = getPendingPayments();
    },
    labelFor(p) {
      if (p.type === 'donation') return 'Donasi Menunggu Pembayaran';
      if (p.type === 'transaction') return 'Pembelian Menunggu Pembayaran';
      return 'Pembayaran Menunggu';
    },
    formatIDR(value) {
      const num = Number(value || 0);
      return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0,
      }).format(num);
    },
    formatExpiry(ts) {
      if (!ts) return '-';
      const diffMs = ts - Date.now();
      if (diffMs <= 0) return 'expired';
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      if (hours > 0) return `${hours} jam ${minutes} menit lagi`;
      return `${minutes} menit lagi`;
    },
    async dismiss(payment) {
      const orderId = payment?.orderId;
      const publicToken = payment?.publicToken || payment?.orderStatusToken || payment?.trackingToken;
      const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Batalkan pembayaran?',
        text: 'Transaksi yang dibatalkan tidak bisa dilanjutkan dari banner ini.',
        showCancelButton: true,
        confirmButtonText: 'Ya, batalkan',
        cancelButtonText: 'Kembali',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#003793',
      });
      if (!confirm.isConfirmed) return;

      this.cancelingOrderId = orderId;
      try {
        const result = await cancelPayment(orderId, { publicToken });
        if (isNotStartedPaymentSession(result?.paymentSessionState)) {
          await Swal.fire({
            icon: 'info',
            title: 'Pengingat dihapus',
            text: 'Pembayaran belum pernah dimulai di Midtrans, jadi tidak ada transaksi gateway yang perlu dibatalkan.',
          });
          return;
        }
        if (!isTerminalPaymentStatus(result?.paymentStatus)) {
          await Swal.fire({
            icon: 'info',
            title: 'Status belum berubah',
            text: 'Pembayaran belum berhasil dibatalkan. Silakan coba lagi sesaat lagi.',
          });
          return;
        }
        await Swal.fire({
          icon: 'success',
          title: 'Pembayaran dibatalkan',
          text: 'Status transaksi telah diperbarui.',
        });
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Gagal membatalkan pembayaran',
          text: error?.response?.data?.message || error?.message || 'Silakan coba lagi.',
        });
      } finally {
        this.cancelingOrderId = null;
        this.refresh();
      }
    },
    resume(p) {
      if (!window.snap) {
        alert('Snap.js belum termuat. Silakan refresh halaman.');
        return;
      }
      this.resumingOrderId = p.orderId;
      window.snap.pay(p.token, {
        onSuccess: () => {
          removePendingPayment(p.orderId);
          this.refresh();
          this.resumingOrderId = null;
          syncPaymentStatus(p.orderId, { attempts: 1, removeWhenTerminal: false }).catch(() => {});
          Swal.fire({
            icon: 'success',
            title: 'Pembayaran Berhasil',
            html: `<p>Terima kasih, pembayaran sebesar <strong>${this.formatIDR(p.amount)}</strong> telah kami terima.</p>`,
            confirmButtonColor: '#7066e0',
          }).then(() => {
            if (p.type === 'transaction' && p.orderStatusToken) {
              window.location.href = `/order-status?token=${encodeURIComponent(p.orderStatusToken)}`;
            } else {
              window.location.reload();
            }
          });
        },
        onPending: () => {
          this.resumingOrderId = null;
          this.refresh();
        },
        onError: () => {
          this.resumingOrderId = null;
          syncPaymentStatus(p.orderId).catch(() => {});
        },
        onClose: () => {
          this.resumingOrderId = null;
          syncPaymentStatus(p.orderId).catch(() => {});
        },
      });
    },
  },
};
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(120%);
  opacity: 0;
}
</style>
