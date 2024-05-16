import { useEffect, useState } from "react";

type MousePosition = {
    x: number;
    y: number;
};
  
/**
 * 
 * @returns MousePosition: The 'x' and 'y' properties are a range from -1 to 1
 */
function useMousePosition(): MousePosition {
    const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  
    useEffect(() => {

        let lastEventTime = 0;
        const throttleMS = 33;

        const handleMove = ($event: MouseEvent | TouchEvent) => {
            const now = Date.now();
            //throttle because it's way too fast otherwise
            if(now - lastEventTime>=throttleMS){

                let clientX;
                let clientY;
                if($event.type.startsWith("touch")){
                    clientX = (event as TouchEvent).touches[0].clientX;
                    clientY = (event as TouchEvent).touches[0].clientY;
                }else{
                    clientX = (event as MouseEvent).clientX;
                    clientY = (event as MouseEvent).clientY;
                }
                const { innerWidth, innerHeight } = window;
        
                // Restrict to a range of -1 to 1 where 0 is the center
                const calculatedX = (clientX / innerWidth) * 2 - 1;
                const calculatedY = (clientY / innerHeight) * 2 - 1;
        
                setPosition({ x: calculatedX, y: calculatedY });

                lastEventTime = now;
            }
        };
    
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove);
        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
        };
    }, []);
  
    return position;
}
  
export default useMousePosition;