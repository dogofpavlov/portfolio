const delay = async ($duration:number):Promise<void>=>{
    return new Promise((resolve)=>{
        window.setTimeout(()=>{
            resolve();
        },$duration);
    });
}

export default delay;