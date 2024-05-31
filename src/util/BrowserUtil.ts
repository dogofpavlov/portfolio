
class BrowserUtilClass{
    isSafari:boolean=false;
    constructor(){
        const ua = navigator.userAgent;
        this.isSafari = ua.includes("Safari") && ua.includes("AppleWebKit") && !ua.includes("Chrome") && !ua.includes("Chromium");
    }
}
const BrowserUtil:BrowserUtilClass = new BrowserUtilClass();

export default BrowserUtil;