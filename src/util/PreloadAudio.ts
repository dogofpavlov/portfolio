const PreloadAudio = (url: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    audio.preload = "auto";

    const handleCanPlay = () => {
        resolve(audio);
        cleanup();
    };

    const handleError = () => {
        reject(new Error(`Failed to load audio: ${url}`));
        cleanup();
    };

    const cleanup = () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
    };

    audio.addEventListener('canplay', handleCanPlay, { once: true });
    audio.addEventListener('error', handleError, { once: true });

    audio.load();
    });
};

export default PreloadAudio;