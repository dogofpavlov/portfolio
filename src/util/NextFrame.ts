/**
 * Run a Function on the Next Frame.
 * @param $action what you want to happen on the next frame
 */
const NextFrame = ($action:()=>void)=>{
    requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
            $action();
        });
    })
}

export default NextFrame;