

const checkMobileDevice = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  return true;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|phone/i.test(userAgent);
};


let isMobile = checkMobileDevice();




export default isMobile
