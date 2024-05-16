import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";
import preloadImage from "../util/PreloadImage";
import { PinholeRevealDuration as PinholeRevealDurationSecs } from "../ui/PinholeReveal";



export const THEME_TECH:string="tech";
export const THEME_SHIRE:string="shire";
export const THEME_OCEAN:string="ocean";


export type Theme = {
    id:string;
    label:string;
    bgColor:string;
    textColor:string;
    themeColor:string;
    boxColor:string;
}

export const THEMES:{[key:string]:Theme} = {
    [THEME_SHIRE]:{
        id:THEME_SHIRE,
        label:"Hobbiton",
        bgColor:"#071b00",
        textColor:"#FFFFFF",
        themeColor:"#ffaf00",
        boxColor:"rgba(0,0,0,0.8)"
    },
    [THEME_TECH]:{
        id:THEME_TECH,
        label:"Tron",
        bgColor:"#000000",
        textColor:"#FFFFFF",
        themeColor:"#52c0fa",
        boxColor:"rgba(0,0,0,0.8)"
    },
    [THEME_OCEAN]:{
        id:THEME_OCEAN,
        label:"Ocean",
        bgColor:"#071b00",
        textColor:"#FFFFFF",
        themeColor:"#ff51fd",
        boxColor:"rgba(0,0,0,0.8)"
    }
}

export interface ThemeContextType{
    theme:Theme;
    changeTheme:($id:string)=>void;
    themes:{[key:string]:Theme};
    setThemeLoaded:($value:boolean)=>void;
    isThemeLoaded:boolean;
    isPinholeOpen:boolean;
}





const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface IThemeProviderProps extends PropsWithChildren{
    
}
export function ThemeProvider (props: IThemeProviderProps) {
    const [themeId, setThemeId] = useState<string>(THEME_SHIRE);
    const [isThemeLoaded, setThemeLoaded] = useState<boolean>(false);
    const [isPinholeOpen, setIsPinholeOpen] = useState<boolean>(false);

    const closeTimeoutId = useRef<number>(-1);

    const theme = THEMES[themeId];


    useEffect(()=>{
        document.documentElement.style.setProperty('--theme-color',theme.themeColor);
        //this is 20% alpha
        document.documentElement.style.setProperty('--theme-color-hover',theme.themeColor+"33");


        

        loadThemeImages();
    },[themeId]);

    const loadThemeImages = async ()=>{
        try{

            const skyURL:string = `./theme/${theme.id}/sky.jpg`;
            const groundURL:string = `./theme/${theme.id}/ground.jpg`;

            await preloadImage(skyURL);
            await preloadImage(groundURL);

            setThemeLoaded(true);
            setIsPinholeOpen(true);

        }catch($error){
            console.error("Error Loading Theme Images: ", $error);
        }
    }

    const changeTheme = ($id:string)=>{
        setIsPinholeOpen(false);

        window.clearTimeout(closeTimeoutId.current);
        closeTimeoutId.current = window.setTimeout(()=>{
            setThemeId($id);
        },PinholeRevealDurationSecs*1000);
    }



    return (
        <ThemeContext.Provider value={{
            setThemeLoaded,
            changeTheme,
            theme:THEMES[themeId],
            themes:THEMES,
            isThemeLoaded:isThemeLoaded,
            isPinholeOpen:isPinholeOpen
        }}>
            {props.children}
        </ThemeContext.Provider>
    );
}


export const useTheme = ():ThemeContextType=>{
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("You're an idiot!");
    }
    return context;
}


