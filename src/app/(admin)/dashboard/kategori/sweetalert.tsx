import Swal from 'sweetalert2';

export const CyberAlert = {
  success: (title: string, text: string) => {
    return Swal.fire({
      title: `<span style="color: #22c55e; font-family: monospace;">${title}</span>`,
      html: `<span style="color: #cbd5e1; font-family: monospace;">${text}</span>`,
      icon: 'success',
      background: '#0f172a',
      confirmButtonColor: '#ea580c',
      customClass: {
        popup: 'border-2 border-green-500 rounded-xl',
        confirmButton: 'font-bold uppercase tracking-widest'
      }
    });
  },
  error: (title: string, text: string) => {
    return Swal.fire({
      title: `<span style="color: #ef4444; font-family: monospace;">${title}</span>`,
      html: `<span style="color: #cbd5e1; font-family: monospace;">${text}</span>`,
      icon: 'error',
      background: '#0f172a',
      confirmButtonColor: '#ea580c',
      customClass: {
        popup: 'border-2 border-red-500 rounded-xl',
      }
    });
  },
  confirmDelete: () => {
    return Swal.fire({
      title: `<span style="color: #ef4444; font-family: monospace;">HAPUS_DATA?</span>`,
      html: `<span style="color: #cbd5e1; font-family: monospace;">Tindakan ini permanen dan tidak dapat dibatalkan.</span>`,
      icon: 'warning',
      showCancelButton: true,
      background: '#0f172a',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#334155',
      confirmButtonText: 'YA, HAPUS!',
      cancelButtonText: 'BATAL',
      customClass: { popup: 'border-2 border-orange-500 rounded-xl' }
    });
  }
};