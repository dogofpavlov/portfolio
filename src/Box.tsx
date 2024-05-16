import { PropsWithChildren } from "react";
import './Box.scss';
import { useTheme } from "./context/ThemeContext";

export interface IBoxProps extends PropsWithChildren{
    
    y:number;
    x:number;
    z:number;
    width:number;
    contentWidth:number;
    height:number;
    contentHeight:number;
    opacity:number;
    contentOpacity:number;
    onClick?:()=>void;
    delay?:number;
    className?:string;
    overflowHidden?:boolean;
}

export default function Box (props: IBoxProps) {

    let cn:string = "box";
    if(props.className){
        cn+=" "+props.className;
    }
    if(props.overflowHidden){
        cn+=" overflowHidden";
    }

    let boxShadowY:number = props.y-10;

    let numX:number=props.x;
    let numY:number=props.y;
    let numZ:number=props.z;

    let opacity:number = props.opacity;
    let contentOpacity:number = props.contentOpacity;

    let delay:number = props.delay || 0;

    const {theme} = useTheme();

    const borderWidth:number = 10;

    return (
        <div className={cn} style={{opacity:opacity, transitionDelay:delay+"s", transform:`translate(-50%,-100%) translate(${numX}px,-${numY}px) translateZ(${numZ}px)`}}>
            <div className="boxBorder" style={{borderWidth:10, width:props.width, height:props.height, transitionDelay:delay+"s", borderImageSource:`url('./theme/${theme.id}/boxborder.png')`}} onClick={props.onClick}>
                <div className="boxColor" style={{backgroundColor:theme.boxColor, color:theme.textColor, width:props.contentWidth-(borderWidth*2), height:props.contentHeight-(borderWidth*2)}}>
                    <div className="boxContent" style={{opacity:contentOpacity}}>
                        {props.children}

                    </div>
                </div>
            </div>
            <div className="boxShadow" style={{backgroundImage:`url('./theme/${theme.id}/boxshadow.png')`, transform:`translate(0,${boxShadowY}px)`, transitionDelay:delay+"s"}}></div>
        </div>
    );
}
