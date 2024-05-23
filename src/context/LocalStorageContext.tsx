import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { THEME_SHIRE } from "./ThemeContext";

interface LocalStorageContextType{
    savedData:ISavedData;
    setSavedAudioEnabled:($value:boolean)=>void;
    setSavedTheme:($id:string)=>void;
    
}

const LocalStorageContext = createContext<LocalStorageContextType | undefined>(undefined);


interface ISavedData{
    themeId:string;
    audioEnabled:boolean;
}

const LocalStorageKey = "5-22-2024";


const getSavedData = ()=>{
    const strData = localStorage.getItem(LocalStorageKey);

    if(strData){
        try{
            return JSON.parse(strData) as ISavedData;            
        }catch($error){
            console.log("Error local storage??");
        }
    }
    //defaults
    return {
        audioEnabled:true,
        themeId:THEME_SHIRE,
    };
}

interface ILocalStorageProviderProps extends PropsWithChildren{

}

const LocalStorageProvider = (props:ILocalStorageProviderProps)=>{

    const [savedData, setSavedDataState] = useState<ISavedData>(getSavedData());

    useEffect(()=>{
        localStorage.setItem(LocalStorageKey,JSON.stringify(savedData));
    },[savedData]);

    const setSavedAudioEnabled = ($value:boolean)=>{
        setSavedDataState((prevData) => ({...prevData, audioEnabled: $value }));
    }
    const setSavedTheme = ($id:string)=>{
        setSavedDataState((prevData) => ({...prevData, themeId:$id}));
    }

    const contextValue = {
        savedData,
        setSavedAudioEnabled,
        setSavedTheme
    }

    return (
        <LocalStorageContext.Provider value={contextValue}>
            {props.children}
        </LocalStorageContext.Provider>
    )

}


export {LocalStorageProvider}

export const useLocalStorage = ():LocalStorageContextType=>{
    const context = useContext(LocalStorageContext);
    if (context === undefined) {
        throw new Error("No Stowage!?");
    }
    return context;
}
