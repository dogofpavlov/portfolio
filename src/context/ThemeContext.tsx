import { PropsWithChildren, createContext, useContext, useEffect, useRef, useState } from "react";
import PreloadImage from "../util/PreloadImage";
import { PinholeRevealDuration as PinholeRevealDurationSecs } from "../ui/PinholeReveal";
import delay from "../util/Delay";
import PreloadAudio from "../util/PreloadAudio";
import { useLocalStorage } from "./LocalStorageContext";
import { changeScrollbarColor } from "../util/ScrollbarUtil";



export interface IThemeQuoteWord{
    word:string;
    timeOffset?:number;
}

export interface IThemeQuote{
    words:IThemeQuoteWord[];
    fullQuote:string;
}

export type Theme = {
    id:string;
    label:string;
    bgColor:string;
    textColor:string;
    themeColor:string;
    boxColor:string;
    loaded:boolean;
    bgMusic?:HTMLAudioElement;
    quotes:IThemeQuote[];
}

export const QUOTE_LINE_BREAK:string = "<br/>";


//generate theme quote
const gtq=($quote:string):IThemeQuote=>{
    let quoteLine:string = "";
    let quoteLines:string[] = [];

    let quoteSplit = $quote.split(" ");

    let words:IThemeQuoteWord[] = quoteSplit.map(($word,$index)=>{
        let word = $word;
        let timeOffset:number | undefined = undefined;
        if($word.includes("_")){
            let split = $word.split("_");
            word = split[0];
            timeOffset = Number(split[1]);
        }
        if(word!==QUOTE_LINE_BREAK){
            if(quoteLine===""){
                quoteLine+=word;
            }else{
                quoteLine+=" "+word;
            }
        }
        
        if(word===QUOTE_LINE_BREAK || $index===quoteSplit.length-1){
            quoteLines.push(quoteLine);
            quoteLine = "";
        }
        return {
            word,
            timeOffset
        };
    })

    const longestQuote = quoteLines.reduce((longest, current) => {
        return current.length > longest.length ? current : longest;
    }, "");

    return {
        fullQuote: longestQuote,
        words
    };
}

export const THEME_TECH:string="tech";
export const THEME_SHIRE:string="shire";
export const THEME_TWINSUN:string="twinsun";


export const THEMES:{[key:string]:Theme} = {
    [THEME_SHIRE]:{
        id:THEME_SHIRE,
        label:"The Shire",
        bgColor:"#071b00",
        textColor:"#FFFFFF",
        themeColor:"#acff4a",
        boxColor:"rgba(0,0,0,0.6)",
        loaded:false,
        quotes:[
            gtq(`I think I'm quite_600 ready..._300 <br/> for_1200 another_-100 adventure.`),
            gtq(`All_-200 we_-200 have_-200 to_-200 decide is_300 what_600 <br/> to do with_300 the_-100 time_-100 that_200 is_-100 given_-100 to_-100 us._-100`),
            gtq(`What are we holding on_-200 to,_-200 Sam?`),
            gtq(`That there's some good in_-200 this_-200 world_-200, Mr._400 Frodo, <br/> and_900 it's_-200 worth_-200 fighting_400 for.`),
            gtq(`And then you_-200 see_-200 it._-200 <br/> White_1500 shores..._100 and_1200 beyond.`),
            gtq(`There and back again!`),
            gtq(`Even the smallest person can_500 <br/> change the course of the future`),
        ]
    },
    [THEME_TECH]:{
        id:THEME_TECH,
        label:"The Grid",
        bgColor:"#000000",
        textColor:"#FFFFFF",
        themeColor:"#52c0fa",
        boxColor:"rgba(0,0,0,0.8)",
        loaded:false,
        quotes:[
            gtq("The Grid... A_1400 digital_-200 frontier."),
            gtq("I kept dreaming of a world <br/> I_800 thought I'd never see..."),
            gtq("Am_-200 I_-200 still_-200 to_-200 create <br/> the perfect system?_500"),
            gtq("I did everything... <br/> everything_900 you ever asked."),
            gtq("I fight... for_700 the Users!"),
        ]
    },
    [THEME_TWINSUN]:{
        id:THEME_TWINSUN,
        label:"Twin Suns",
        bgColor:"#000000",
        textColor:"#FFFFFF",
        themeColor:"#ffa019",
        boxColor:"rgba(0,0,0,0.7)",
        loaded:false,
        quotes:[
            gtq("Always remember... <br/> your_600 focus determines your_300 reality."),
            gtq("You must unlearn_200 what_800 you_-100 have_-100 learned._-100"),
            gtq("Luminous beings are_-100 we..._-100, not_900 this_200 crude matter."),
            gtq("I am a Jedi, like_700 my father before me."),
            gtq("I feel the good in you, the_600 conflict."),
        ]
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
        document.documentElement.style.setProperty('--theme-bgcolor', `url('http://ryancaillouet.com/theme/${theme.id}/color.jpg')`);
        
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


