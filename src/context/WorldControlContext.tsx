import { PropsWithChildren, createContext, useContext, useState } from "react";

interface WorldControlContextType{
    isViewingDetail:boolean;
    setIsViewingDetail:($value:boolean)=>void;
    stageTop:number;
}

const WorldControlContext = createContext<WorldControlContextType | undefined>(undefined);



interface IWorldControlProviderProps extends PropsWithChildren{

}

const WorldControlProvider = (props:IWorldControlProviderProps)=>{
    const [isViewingDetail, setIsViewingDetail] = useState<boolean>(false);

    return (
        <WorldControlContext.Provider value={{isViewingDetail, setIsViewingDetail, stageTop:70}}>
            {props.children}
        </WorldControlContext.Provider>
    );
}

export {WorldControlProvider, WorldControlContext}


const useWorldControl = ()=>{
    const context = useContext(WorldControlContext);
    if (context === undefined) {
        throw new Error("Not allowed to control the world");
    }
    return context;
}

export default useWorldControl;