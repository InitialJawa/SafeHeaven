import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

export const downloadPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    toast.error('Gagal membuat PDF: Konten tidak ditemukan');
    return;
  }

  const toastId = toast.loading('Sedang menyiapkan PDF...');

  try {
    const dataUrl = await toJpeg(element, {
      quality: 0.95,
      backgroundColor: '#07060b',
      pixelRatio: 2,
      filter: (node) => {
        // Filter out cross-origin images to prevent CORS errors during capture
        if (node.tagName === 'IMG') {
          const img = node as HTMLImageElement;
          if (img.src && !img.src.startsWith('data:')) {
            return false;
          }
        }
        return true;
      },
    });

    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (img.height * pdfWidth) / img.width;
    
    pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    
    pdf.save(`${filename}.pdf`);
    
    toast.success('PDF berhasil diunduh!', { id: toastId });
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    toast.error(`Gagal membuat PDF: ${error.message || 'Kesalahan tidak diketahui'}`, { id: toastId });
  }
};
