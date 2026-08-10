import { OrderStatus, PaymentMethodType } from '../types';

export function formatCurrency(amount: number): string {
  return `RM ${amount.toFixed(2)}`;
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('ms-MY', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export const formatDate = formatDateTime;

export function getOrderStatusBadge(status: OrderStatus | string): {
  label: string;
  bg: string;
  color: string;
  border: string;
} {
  switch (status) {
    case 'pending_payment':
    case 'pending':
      return {
        label: 'Menunggu Bayaran',
        bg: 'bg-amber-50',
        color: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'preparing':
      return {
        label: 'Sedang Disediakan',
        bg: 'bg-indigo-50',
        color: 'text-indigo-700',
        border: 'border-indigo-200',
      };
    case 'delivering':
      return {
        label: 'Sedang Dihantar ke Meja',
        bg: 'bg-blue-50',
        color: 'text-blue-700',
        border: 'border-blue-200',
      };
    case 'ready_for_pickup':
      return {
        label: 'Sedia Diambil',
        bg: 'bg-purple-50',
        color: 'text-purple-700',
        border: 'border-purple-200',
      };
    case 'completed':
      return {
        label: 'Selesai Diterima',
        bg: 'bg-emerald-50',
        color: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'cancelled':
      return {
        label: 'Dibatalkan',
        bg: 'bg-rose-50',
        color: 'text-rose-700',
        border: 'border-rose-200',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-50',
        color: 'text-slate-700',
        border: 'border-slate-200',
      };
  }
}

export function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Baru sahaja';
    if (diffMin < 60) return `${diffMin} minit yang lalu`;
    if (diffHour < 24) return `${diffHour} jam yang lalu`;
    if (diffDay === 1) return 'Semalam';
    if (diffDay < 7) return `${diffDay} hari yang lalu`;
    return date.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short' });
  } catch {
    return isoString;
  }
}

export function getOrderStatusConfig(status: OrderStatus): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  description: string;
  stepIndex: number;
} {
  switch (status) {
    case 'pending_payment':
      return {
        label: 'Menunggu Bayaran',
        bgClass: 'bg-amber-50',
        textClass: 'text-amber-700',
        borderClass: 'border-amber-200',
        description: 'Sila buat bayaran kepada penjual melalui DuitNow/Bank atau pilih COD.',
        stepIndex: 1,
      };
    case 'preparing':
      return {
        label: 'Sedang Disediakan / Dimasak',
        bgClass: 'bg-blue-50',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-200',
        description: 'Penjual sedang membungkus pesanan atau memasak sajian anda.',
        stepIndex: 2,
      };
    case 'delivering':
      return {
        label: 'Sedang Dihantar ke Meja',
        bgClass: 'bg-indigo-50',
        textClass: 'text-indigo-700',
        borderClass: 'border-indigo-200',
        description: 'Penjual / wakil sedang menghantar pesanan ke meja atau bilik anda.',
        stepIndex: 3,
      };
    case 'ready_for_pickup':
      return {
        label: 'Sedia Untuk Diambil',
        bgClass: 'bg-purple-50',
        textClass: 'text-purple-700',
        borderClass: 'border-purple-200',
        description: 'Pesanan sedia diambil di meja penjual atau pantry yang ditetapkan.',
        stepIndex: 3,
      };
    case 'completed':
      return {
        label: 'Pesanan Selesai',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        borderClass: 'border-emerald-200',
        description: 'Pesanan telah selamat diterima. Terima kasih atas sokongan warga jabatan!',
        stepIndex: 4,
      };
    case 'cancelled':
      return {
        label: 'Dibatalkan',
        bgClass: 'bg-rose-50',
        textClass: 'text-rose-700',
        borderClass: 'border-rose-200',
        description: 'Pesanan telah dibatalkan.',
        stepIndex: 0,
      };
    default:
      return {
        label: status,
        bgClass: 'bg-gray-50',
        textClass: 'text-gray-700',
        borderClass: 'border-gray-200',
        description: '',
        stepIndex: 0,
      };
  }
}

export function getPaymentMethodLabel(method: PaymentMethodType): { label: string; icon: string } {
  switch (method) {
    case 'duitnow_qr':
      return { label: 'DuitNow QR Pay (Imbas & Bayar)', icon: '📱' };
    case 'bank_transfer':
      return { label: 'Pindahan Bank Dalam Talian (Instant Transfer)', icon: '🏦' };
    case 'tng_ewallet':
      return { label: "Touch 'n Go eWallet", icon: '💳' };
    case 'cod':
      return { label: 'Tunai Semasa Terima di Meja (COD)', icon: '💵' };
  }
}
