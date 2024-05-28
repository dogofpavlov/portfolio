import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";




const RESIZE_POINTS:IResizePoint[] = [//need to be always ordered smallest to largest
    {id:"resize400", value:400, disable3D:true},
    {id:"resize600", value:600, disable3D:true},
    {id:"resize800", value:800, disable3D:true},
    {id:"resize1024", value:1024, disable3D:true, totalWidthPadding:50},
    {id:"resize1200", value:1200, totalWidthPadding:50},
    {id:"resize1400", value:1400, totalWidthPadding:100},
    {id:"resize1600", value:1600, totalWidthPadding:100},
    {id:"", value:10000000},
]




export interface IResizePoint{
    id:string;
    value:number;
    disable3D?:boolean;
    totalWidthPadding?:number;
}

interface ResizeContextType{
    resizePoint:IResizePoint;
    resizeId:string;
    value:number;
    disable3D:boolean;
    mobileNavVisible:boolean;
    setMobileNavVisible:($visible:boolean)=>void;
    mobileThemeVisible:boolean;
    toggleThemeVisible:()=>void;
}


const getResizePoint = ($totalWidth:number)=>{

    const point = RESIZE_POINTS.find(($point)=>{
        let use:boolean=false;
        if($totalWidth<=$point.value){
            use=true;
        }
        return use;
    })!;//because there will never be a window.innerWidth greater than 10,000,000 (or if not fuck you and your expensive shit), it's safe to assume it will exist

    return point;
};


const ResizeContext = createContext<ResizeContextType | undefined>(undefined);

export const startingResizePoint = getResizePoint(window.innerWidth);


interface IResizeProviderProps extends PropsWithChildren{
    
}

const ResizeProvider = (props:IResizeProviderProps)=>{

    const [resizePoint, setResizePoint] = useState<IResizePoint>(startingResizePoint);

    const [mobileNavVisible, setMobileNavVisible] = useState<boolean>(false);
    const [mobileThemeVisible, setMobileThemeVisible] = useState<boolean>(false);


    const resizeTimeoutId = useRef<number>(-1);

    const onResize=()=>{
        window.clearTimeout(resizeTimeoutId.current);
        resizeTimeoutId.current = window.setTimeout(()=>{
            const newResizePoint = getResizePoint(window.innerWidth);

            setResizePoint(($prevState)=>{

                if($prevState.id!==newResizePoint.id){
                    return newResizePoint;
                }

                return $prevState
            });

        },100);
    }

    useEffect(()=>{
        window.addEventListener("resize", onResize);
        return ()=>{
            window.removeEventListener("resize",onResize);
            window.clearTimeout(resizeTimeoutId.current);
        }
    },[]);

    const toggleThemeVisible=()=>[

        setMobileThemeVisible(($prevState)=>{
            return !$prevState;
        })
    ]
    
   // const context:ResizeContextType = 

    return (
        <ResizeContext.Provider value={{
            resizePoint,
            resizeId:resizePoint.id,
            value:resizePoint.value,
            disable3D:resizePoint.disable3D?true:false,
            mobileNavVisible,
            setMobileNavVisible,
            mobileThemeVisible,
            toggleThemeVisible
        }}>
            {props.children}
        </ResizeContext.Provider>
    )
}

export {ResizeProvider, ResizeContext};

const useResize = ()=>{
    const context = useContext(ResizeContext);
    if (context === undefined) {
        throw new Error("You've done it now");
    }
    return context;
}

export default useResize;
