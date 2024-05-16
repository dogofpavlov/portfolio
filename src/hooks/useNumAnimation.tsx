import { useRef, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

type UseNumAnimationParams = {
    start: number;
    end: number;
    duration?: number;
    isActive: boolean;  // This is the prop that will trigger the animation direction
}

function useNumAnimation({ start, end, duration = 1, isActive }: UseNumAnimationParams): number {
    const [number, setNumber] = useState<number>(isActive?start:end);
    const ref = useRef<{ value: number }>({ value: isActive?start:end});
    const tweenRef = useRef<GSAPTween | null>(null);

    const isFirstRender = useRef<boolean>(true);
    const prevIsActive = useRef<boolean>(isActive);

    const startAnimation = useCallback(() => {
        //clear existing
        if (tweenRef.current) {
            tweenRef.current.kill(); 
        }

        ref.current.value = isActive?start:end;
        let targetValue = isActive?end:start;

        //let's goooo
        tweenRef.current = gsap.to(ref.current, {
            value: targetValue,
            duration,
            onUpdate: () => setNumber(ref.current.value),
            immediateRender:true
        });
    }, [start, end, duration, isActive]);


    useEffect(() => {
        if (!isFirstRender.current) {
            if(prevIsActive.current !== isActive){
                startAnimation();
            }
        } else if (isActive) {
            startAnimation();
        }
        isFirstRender.current=false;
        prevIsActive.current = isActive;

    }, [isActive, startAnimation]);

    useEffect(() => {
        return () => {
            if (tweenRef.current) {
                tweenRef.current.kill();  // Cleanup the animation on component unmount
            }
        };
    }, []);

    return number;
}

export default useNumAnimation;