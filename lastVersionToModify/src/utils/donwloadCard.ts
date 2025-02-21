import html2canvas from 'html2canvas';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

export const downloadCard = async (elementId: string, fileName: string = 'id-card.png') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Get all images in the element
    const images = Array.from(element.getElementsByTagName('img'));
    const svgs = Array.from(element.getElementsByTagName('svg'));

    // Wait for all images to load
    await Promise.all([
      ...images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      }),
      // Pre-load images to ensure they're in the browser cache
      ...images.map(img => loadImage(img.src))
    ]);

    // Create a canvas with a white background
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true, // Enable CORS for images
      allowTaint: true, // Allow cross-origin images
      backgroundColor: '#ffffff',
      logging: false,
      width: 400, // Match the fixed dimensions
      height: 250,
      onclone: (clonedDoc) => {
        // Ensure SVGs are properly rendered
        svgs.forEach((svg, index) => {
          const clonedSvg = clonedDoc.getElementsByTagName('svg')[index];
          if (clonedSvg) {
            clonedSvg.setAttribute('width', svg.clientWidth.toString());
            clonedSvg.setAttribute('height', svg.clientHeight.toString());
          }
        });
      }
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