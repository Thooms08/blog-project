import Swal from 'sweetalert2';

export const cyberpunkAlert = (title: string, text: string, icon: 'success' | 'error') => {
  return Swal.fire({
    title: `<span style="color: #f97316; font-family: 'Courier New', monospace; font-weight: 900;">${title}</span>`,
    html: `<span style="color: #cbd5e1; font-family: 'Courier New', monospace;">${text}</span>`,
    icon: icon,
    background: '#0f172a', // slate-900
    confirmButtonColor: '#ea580c', // orange-600
    confirmButtonText: 'KONFIRMASI',
    buttonsStyling: true,
    showClass: { popup: 'animate__animated animate__fadeInDown' },
    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
    customClass: {
      popup: 'border-2 border-orange-500 rounded-2xl shadow-[0_0_20px_rgba(234,88,12,0.4)]',
      confirmButton: 'font-bold uppercase tracking-widest px-8 py-3'
    }
  });
};