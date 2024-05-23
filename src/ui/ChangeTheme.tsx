import { useState } from "react";
import Box from "../Box";
import './ChangeTheme.scss';
import { THEMES, useTheme } from "../context/ThemeContext";
import ThemeSpan from "./ThemeSpan";
import useStageSize from "../context/StageSizeContext";

export interface IChangeThemeProps {
    ready:boolean;
}

export default function ChangeTheme (props: IChangeThemeProps) {

    const {changeTheme, isThemeLoaded, theme, isPinholeOpen, isMusicPlaying, playMusic, stopMusic, hasInteractedOnce} = useTheme();

    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [localThemeId, setLocalThemeId] = useState<string>(theme.id);

    const expandedW:number = 495;
    const expandedH:number = 60;


    const {rightX} = useStageSize();

    const width = isExpanded?expandedW:211;
    const height = 60;
    const x = rightX-(width/2);
    const y = props.ready?(isExpanded?470:470):0;



    const themesJSX:JSX.Element[] = [];
    
    for(let i in THEMES){
        let themeOption = THEMES[i];

        let isSelected = localThemeId===themeOption.id;

        let style:React.CSSProperties = {
            color:themeOption.themeColor
        }
        if(isSelected){
            style.backgroundColor = themeOption.themeColor;
            style.color = "#000000";
        }
        themesJSX.push(<div style={style} className={`themeOption`} key={themeOption.id} onClick={()=>{
            if(isThemeLoaded && isPinholeOpen && !isSelected){
                setLocalThemeId(themeOption.id);
                changeTheme(themeOption.id);
            }
        }}>{themeOption.label}</div>);
    }


    return (
        <>
            <Box
                delay={0.1} 
                opacity={props.ready?1:0} 
                contentOpacity={1}
                className={"changeTheme"} 
                width={width} 
                height={height} 
                contentWidth={expandedW}
                contentHeight={expandedH}
                x={x} 
                y={y} 
                z={-20} 
            >
                <div className={`btnAudioToggle ${isMusicPlaying?"playing":""}`} onClick={()=>{
                    console.log('audio press', hasInteractedOnce);
                    if(hasInteractedOnce){
                        if(isMusicPlaying){
                            console.log('stopping music');
                            stopMusic();
                        }else{
                            console.log("running play msuci");
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
