import { useEffect, useRef, useState } from "react";

import { gsap } from "gsap/gsap-core";
import isMobile from "../util/IsMobile";
import MathUtil from "../util/MathUtil";
import BrowserUtil from "../util/BrowserUtil";

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
    const refPosition = useRef<MousePosition>({x:0, y:0});

    const tweenRef = useRef<gsap.core.Timeline | null>(null);
  
    useEffect(() => {

        let lastEventTime = 0;
        let throttleMS = 33;
        if(BrowserUtil.isSafari){//since we disabled the transitions for safari, let's reduce the throttle
            throttleMS=0;
        }

        const handleMove = ($event: MouseEvent | TouchEvent) => {


            if(tweenRef.current){
                tweenRef.current.kill();
                tweenRef.current = null;
            }



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
                refPosition.current = {x:calculatedX, y:calculatedY}

                lastEventTime = now;
            }
        };

        const updatePositionFromTween = ($pos:{x:number, y:number})=>{
            const now = Date.now();
            //throttle because it's way too fast otherwise
            if(now - lastEventTime>=33){

                setPosition({ x: $pos.x, y: $pos.y });
                lastEventTime = now;
            }
        }

        const animatedPosition = {x:0, y:0};

        const createTween = ()=>{
            if(tweenRef.current){
                tweenRef.current.kill();
            }

            let curX = animatedPosition.x;
            let curY = animatedPosition.y;

            let newX = (Math.random()*2)-1;
            let newY = (Math.random()*2)-1;

            const baseDistance = 2;
            const baseDuration = 8;
            const distance = MathUtil.calculateDistance(curX,curY, newX, newY);
            const duration = (distance*baseDuration)/baseDistance;

            tweenRef.current = gsap.timeline({onComplete:createTween})
            .to(animatedPosition, {
                x:newX,
                y:newY,
                duration,
                onUpdate:function(){
                    updatePositionFromTween({x:animatedPosition.x, y:animatedPosition.y});
                },
                ease:"linear"
            })
        }

        createTween();


        const restartTweenFromRefPosition = ()=>{
            if(refPosition.current){
                animatedPosition.x = refPosition.current.x;
                animatedPosition.y = refPosition.current.y;
                createTween();
            }
        }


        const handleStart=()=>{
            if(tweenRef.current){
                tweenRef.current.kill();
            }
        }
        const handleEnd=(event:MouseEvent | TouchEvent)=>{
            if ('relatedTarget' in event && (!event.relatedTarget || (event.relatedTarget as Node).nodeName === "HTML")) {
                restartTweenFromRefPosition();
            }else if('touches' in event && event.touches.length === 0){
                restartTweenFromRefPosition();
            }
        }


        window.addEventListener('mouseenter', handleStart);
        window.addEventListener('mouseout', handleEnd);
        window.addEventListener('mousemove', handleMove);

        window.addEventListener('touchstart', handleStart);
        window.addEventListener('touchend', handleEnd);
        window.addEventListener('touchmove', handleMove);
        return () => {

            window.removeEventListener('mouseenter', handleStart);
            window.removeEventListener('mouseout', handleEnd);
            window.removeEventListener('mousemove', handleMove);

            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchstart', handleStart);
            window.removeEventListener('touchend', handleEnd);

            if(tweenRef.current){
                tweenRef.current.kill();
            }
        };
    }, []);
  
    return position;
}
  
export default useMousePosition;