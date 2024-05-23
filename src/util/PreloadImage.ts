const PreloadImage = async ($src: string, $onProgress?: ($progress: number) => void): Promise<void> => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', $src, true);
        xhr.responseType = 'blob';

        xhr.onprogress = ($event) => {
            if ($event.lengthComputable && $onProgress) {
                const progress = ($event.loaded / $event.total) * 100;
                $onProgress(progress);
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                const img = new Image();
                const url = URL.createObjectURL(xhr.response);
                img.src = url;
                img.onload = () => {
                URL.revokeObjectURL(url);
                resolve();
                };
                img.onerror = (err) => reject(err);
            } else {
                reject(new Error('Image loading failed'));
            }
        };

        xhr.onerror = () =>{
            reject(new Error('Image loading failed'));
        }
        xhr.send();
    });
};
  

export default PreloadImage;


