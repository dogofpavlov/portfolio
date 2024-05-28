import { useState } from "react";
import Box from "../Box";
import './ChangeTheme.scss';
import { THEMES, useTheme } from "../context/ThemeContext";
import ThemeSpan from "./ThemeSpan";
import useStageSize from "../context/StageSizeContext";
import useResize from "../context/ResizeContext";
import { useDepthPath } from "../hooks/useDepth";

export interface IChangeThemeProps {
    ready:boolean;
}

export default function ChangeTheme (props: IChangeThemeProps) {

    const {changeTheme, isThemeLoaded, theme, isPinholeOpen, isMusicPlaying, playMusic, stopMusic, hasInteractedOnce} = useTheme();

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [localThemeId, setLocalThemeId] = useState<string>(theme.id);

    const expandedW:number = 560;
    const expandedH:number = 60;

    const resize = useResize();

    const {rightX} = useStageSize();

    const width = isExpanded?expandedW:212;
    const height = 60;
    
    const {activeDepth} = useDepthPath();

    let y = props.ready?(activeDepth===0?350:470):0;

    let x = rightX-(width/2);
    if(activeDepth===0){
        x = rightX-(width/2)-300;
    }

    if(x<0){
        x = 0;
    }


    

    const themesJSX:JSX.Element[] = [];
    
    for(let i in THEMES){
        let themeOption = THEMES[i];

        let isSelected = localThemeId===themeOption.id;

        let style:React.CSSProperties = {
            color:themeOption.themeColor
        }
        if(isSelected){
            style.backgroundImage = `url(./theme/${themeOption.id}/color.jpg)`;
            style.backgroundSize="100% 100%";
            style.color = "#000000";
        }
        themesJSX.push(<div style={style} className={`themeOption`} key={themeOption.id} onClick={()=>{
            if(isThemeLoaded && isPinholeOpen && !isSelected){
                setLocalThemeId(themeOption.id);
                changeTheme(themeOption.id);
                if(resize.disable3D){
                    resize.toggleThemeVisible();
                }
            }
        }}>{themeOption.label}</div>);
    }




    let audioToggleCN:string = "btnAudioToggle";
    if(isMusicPlaying){
        audioToggleCN+=" playing";
    }
    if(resize.disable3D){
        audioToggleCN+=" mobileAudioToggle";
    }

    const btnAudioToggle = (
        <div className={audioToggleCN} onClick={()=>{
            if(hasInteractedOnce){
                if(isMusicPlaying){
                    stopMusic();
                }else{
                    playMusic();
                }
            }else{
                if(!isMusicPlaying){
                    playMusic();
                }
            }
        }}>
            <img src={`./icon-${(isMusicPlaying?"volume":"mute")}.png`} alt="audioToggle"/>
        </div>
    );

    let mobileThemeToggleCN:string = "mobileThemeToggle";
    let changeThemeCN:string = "changeTheme";
    if(resize.disable3D && resize.mobileThemeVisible){
        changeThemeCN+=" mobileShow";
        mobileThemeToggleCN+=" themeVisible";
    }

    return (
        <>
            {resize.disable3D && (
                <>
                    <div className={mobileThemeToggleCN} onClick={()=>{
                        resize.toggleThemeVisible();
                    }}>
                        <img src="./icon-theme.png" alt="Change Theme"/>
                    </div>
                    {btnAudioToggle}
                </>
            )}
            <Box
                delay={0.1} 
                opacity={props.ready?1:0} 
                contentOpacity={1}
                className={changeThemeCN} 
                width={width} 
                height={height} 
                contentWidth={expandedW}
                contentHeight={expandedH}
                x={x} 
                y={y} 
                z={-20} 
            >   
                {!resize.disable3D && btnAudioToggle}
                <div className="btnChangeTheme" onClick={()=>{
                    setIsExpanded(!isExpanded);
                }}>
                    <ThemeSpan style={{marginRight:5}}>Change</ThemeSpan> Theme
                </div>
                {themesJSX}
            </Box>
        </>
    );
}
