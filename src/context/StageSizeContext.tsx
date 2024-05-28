import { PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import useResize, { IResizePoint, startingResizePoint } from "./ResizeContext";



interface StageSizeContextType{
    totalWidth:number;
    halfWidth:number;
    leftX:number;
    rightX:number;
    offLeftX:number;
    offRightX:number;
}

const StageSizeContext = createContext<StageSizeContextType | undefined>(undefined);


interface IStageSizeProviderProps extends PropsWithChildren{

}


const maxWidth:number = 1920;

const StageSizeProvider = (props:IStageSizeProviderProps)=>{

    const {resizePoint} = useResize();

    const totalWidthPadding = resizePoint.totalWidthPadding || 300;
    
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const [totalWidth, setTotalWidth] = useState<number>(Math.min(window.innerWidth-totalWidthPadding, maxWidth));
    const resizeTimeoutId = useRef<number>(-1);


    useEffect(()=>{

        const onResize=()=>{
            window.clearTimeout(resizeTimeoutId.current);
            resizeTimeoutId.current = window.setTimeout(()=>{    

                setWindowWidth(window.innerWidth);
                setTotalWidth(Math.min(window.innerWidth-totalWidthPadding, maxWidth));
            },100);
        }
        setTotalWidth(Math.min(window.innerWidth-totalWidthPadding, maxWidth));

        window.addEventListener("resize", onResize);
        return ()=>{
            window.removeEventListener("resize",onResize);
            window.clearTimeout(resizeTimeoutId.current);
        }
    },[resizePoint]);

    const halfWidth = totalWidth/2;
    const halfWindow = windowWidth/2;


    return (
        <StageSizeContext.Provider value={{
            totalWidth, halfWidth:halfWidth, leftX:-halfWidth, rightX:halfWidth, offLeftX:-halfWindow, offRightX:halfWindow
        }}>
            {props.children}
        </StageSizeContext.Provider>
    )
}
export {StageSizeProvider, StageSizeContext};

const useStageSize = ()=>{
    const context = useContext(StageSizeContext);
    if (context === undefined) {
        throw new Error("You've done it now");
    }
    return context;
}

export default useStageSize;