import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";
import PreloadImage from "../util/PreloadImage";
import { PinholeRevealDuration as PinholeRevealDurationSecs } from "../ui/PinholeReveal";
import delay from "../util/Delay";
import PreloadAudio from "../util/PreloadAudio";
import { useLocalStorage } from "./LocalStorageContext";
import { changeScrollbarColor } from "../util/ScrollbarUtil";

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
    loaded:boolean;
    bgMusic?:HTMLAudioElement;
}

export const THEMES:{[key:string]:Theme} = {
    [THEME_SHIRE]:{
        id:THEME_SHIRE,
        label:"Hobbiton",
        bgColor:"#071b00",
        textColor:"#FFFFFF",
        themeColor:"#acff4a",
        boxColor:"rgba(0,0,0,0.6)",
        loaded:false
    },
    [THEME_TECH]:{
        id:THEME_TECH,
        label:"Tron",
        bgColor:"#000000",
        textColor:"#FFFFFF",
        themeColor:"#52c0fa",
        boxColor:"rgba(0,0,0,0.8)",
        loaded:false
    },
    [THEME_OCEAN]:{
        id:THEME_OCEAN,
        label:"Ocean",
        bgColor:"#071b00",
        textColor:"#FFFFFF",
        themeColor:"#ffa019",
        boxColor:"rgba(0,0,0,0.8)",
        loaded:false
    }
}

export interface ThemeContextType{
    theme:Theme;
    changeTheme:($id:string)=>void;
    themes:{[key:string]:Theme};
    setThemeLoaded:($value:boolean)=>void;
    isThemeLoaded:boolean;
    isPinholeOpen:boolean;
    isMusicPlaying:boolean;
    stopMusic:($userInitiated?:boolean)=>void;
    playMusic:($userInitiated?:boolean)=>void;
    hasInteractedOnce:boolean;
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface IThemeProviderProps extends PropsWithChildren{
    
}

export function ThemeProvider (props: IThemeProviderProps) {

    const {savedData, setSavedTheme, setSavedAudioEnabled} = useLocalStorage();

    const [themeId, setThemeId] = useState<string>(savedData.themeId);
    const [isThemeLoaded, setThemeLoaded] = useState<boolean>(false);
    const [isPinholeOpen, setIsPinholeOpen] = useState<boolean>(false);
    const hasInteracted = useRef<boolean>(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
    const isAudioUserStopped = useRef<boolean>(false);
    const sfxWhomp = useRef<HTMLAudioElement | undefined>(undefined);

    const closeTimeoutId = useRef<number>(-1);

    const [forceRerender, setForceRerender] = useState<boolean>(true);

    const forceUpdate = ()=>{
        setForceRerender(!forceRerender);
    }

    const theme = THEMES[themeId];


    useEffect(()=>{
        document.documentElement.style.setProperty('--theme-color',theme.themeColor);
        document.documentElement.style.setProperty('--theme-color-hover',theme.themeColor+"33");//"33" = 20% alpha added

        changeScrollbarColor(theme.themeColor);

        loadTheme();
    },[themeId]);



    const firstInteraction=()=>{
        if(!hasInteracted.current){
            hasInteracted.current=true;
            if(savedData.audioEnabled){
                playMusic();
            }else{
                forceUpdate();
            }
        }
    }
    const playMusic=($userInitiated:boolean=true)=>{
        if(theme.bgMusic && theme.loaded){
            let canPlay = savedData.audioEnabled;
            if($userInitiated){
                isAudioUserStopped.current=false;
                setSavedAudioEnabled(true);
                canPlay=true;
            }

            if(!isAudioUserStopped.current && canPlay){
                theme.bgMusic.volume = 0.1;
                theme.bgMusic.loop=true;
                if(theme.bgMusic.paused){
    
                    const handlePlay=()=>{
                        hasInteracted.current=true;
                        setIsMusicPlaying(true);
                    }
                    theme.bgMusic.addEventListener("play", handlePlay,{once:true});
                    theme.bgMusic.play();
                }
            }

        }
    }
    const stopMusic=($userInitiated:boolean=true)=>{
        if(theme.bgMusic){

            const handlePause=()=>{
                setIsMusicPlaying(false);
                if($userInitiated){
                    isAudioUserStopped.current=true;
                    setSavedAudioEnabled(false);
                }
            }
            theme.bgMusic.addEventListener('pause', handlePause, {once:true});
            theme.bgMusic.pause();
        }
    }

    const playWhomp=()=>{
        if(!isAudioUserStopped.current && savedData.audioEnabled){
            if(sfxWhomp.current){
                sfxWhomp.current.play();
            }
        }
    }

    useEffect(()=>{
        document.addEventListener("click", firstInteraction,{once:true});
        document.addEventListener("touchstart", firstInteraction,{once:true});
    },[]);


    const loadTheme = async ()=>{
        try{

            const skyURL:string = `./theme/${theme.id}/sky.jpg`;
            const groundURL:string = `./theme/${theme.id}/ground.jpg`;
            const audioURL:string = `./theme/${theme.id}/theme.mp3`;


            if(!sfxWhomp.current){
                sfxWhomp.current = await PreloadAudio(`./sfx/whomp.mp3`);
                sfxWhomp.current.volume = 0.5;
            }

            if(!theme.loaded){
                await PreloadImage(skyURL);
                await PreloadImage(groundURL);
                theme.bgMusic = await PreloadAudio(audioURL);
                await delay(500);
                theme.loaded=true;
            }
            playMusic(false);

            setThemeLoaded(true);
            setIsPinholeOpen(true);
            playWhomp();

        }catch($error){
            console.error("Error Loading Theme Images: ", $error);
        }
    }

    const changeTheme = ($id:string)=>{
        playWhomp();
        setIsPinholeOpen(false);

        window.clearTimeout(closeTimeoutId.current);
        closeTimeoutId.current = window.setTimeout(()=>{
            stopMusic(false);
            setThemeLoaded(false);
            setThemeId($id);
            setSavedTheme($id);
            
        },PinholeRevealDurationSecs*1000);
    }


    return (
        <ThemeContext.Provider value={{
            setThemeLoaded,
            changeTheme,
            theme:THEMES[themeId],
            themes:THEMES,
            isThemeLoaded:isThemeLoaded,
            isPinholeOpen:isPinholeOpen,
            isMusicPlaying:isMusicPlaying,
            stopMusic,
            playMusic,
            hasInteractedOnce:hasInteracted.current
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


