export const fileToBase64 = (file: File): Promise<string> => {
  const MAX_WIDTH = 1024;
  const MAX_HEIGHT = 1024;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("FileReader did not return a result."));
      }
      
      const img = new Image();
      img.src = event.target.result as string;
      
      img.onload = () => {
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          return reject(new Error('Failed to get canvas context'));
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Use JPEG format with quality compression for photos to reduce size
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      
      img.onerror = error => reject(error);
    };
    
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};
