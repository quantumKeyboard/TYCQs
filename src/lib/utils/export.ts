import html2canvas from 'html2canvas';

export const exportAsImage = async (element: HTMLElement, fileName: string) => {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2, // Higher resolution
      logging: false,
    });

    // Create a download link
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Error exporting image:', error);
    throw error;
  }
}; 