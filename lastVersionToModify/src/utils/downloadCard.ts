import html2canvas from 'html2canvas';

export const downloadCard = async (elementId: string, fileName: string = 'id-card.png') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Wait for images to load
    await Promise.all(
      Array.from(element.getElementsByTagName('img')).map(
        img => img.complete ? Promise.resolve() : new Promise(resolve => img.onload = resolve)
      )
    );

    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true, // Enable CORS for images
      backgroundColor: '#ffffff',
      logging: false,
      width: 400, // Match the fixed dimensions
      height: 250
    });

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
        'image/png',
        1.0
      );
    });

    // Create download URL
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading card:', error);
    throw error;
  }
};