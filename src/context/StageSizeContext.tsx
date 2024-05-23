import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";


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

const StageSizeProvider = (props:IStageSizeProviderProps)=>{
    
    const totalWidthPadding:number = 300;

    const maxWidth:number = 1920;

    const [totalWidth, setTotalWidth] = useState<number>(Math.min(window.innerWidth-totalWidthPadding, maxWidth));

    const resizeTimeoutId = useRef<number>(-1);

    
    const onResize=()=>{
        window.clearTimeout(resizeTimeoutId.current);
        resizeTimeoutId.current = window.setTimeout(()=>{
            setTotalWidth(Math.min(window.innerWidth-totalWidthPadding, maxWidth));
        },100);
    }

    useEffect(()=>{
        window.addEventListener("resize", onResize);
        return ()=>{
            window.removeEventListener("resize",onResize);
        }
    },[]);

    const halfWidth = totalWidth/2;

    const halfWindow = window.innerWidth/2;

    return (
        <StageSizeContext.Provider value={{totalWidth, halfWidth:halfWidth, leftX:-halfWidth, rightX:halfWidth, offLeftX:-halfWindow, offRightX:halfWindow}}>
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