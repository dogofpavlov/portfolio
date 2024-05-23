import { PropsWithChildren, useRef } from "react";
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
    overflowScroll?:boolean;
    noStyle?:boolean;
    outerChildren?:React.ReactNode;
    anchorBottom?:boolean;
}

export default function Box (props: IBoxProps) {

    let cn:string = "box";
    if(props.className){
        cn+=" "+props.className;
    }
    if(props.overflowScroll){
        cn+=" overflowScroll";
    }

    let boxShadowY:number = props.y-10;

    let numX:number=props.x;
    let numY:number=props.y;
    let numZ:number=props.z;

    let opacity:number = props.opacity;
    let contentOpacity:number = props.contentOpacity;

    let delay:number = props.delay || 0;

    const {theme} = useTheme();

    let borderWidth:number = 10;
    if(props.noStyle){
        borderWidth=0;
    }


    const boxBorderStyle:React.CSSProperties = {};
    if(!props.noStyle){
        boxBorderStyle.borderWidth = borderWidth;
        boxBorderStyle.borderImageSource = `url('./theme/${theme.id}/boxborder.png')`
    }

    const boxColorStyle:React.CSSProperties = {};
    if(!props.noStyle){
        boxColorStyle.backgroundColor = theme.boxColor;
        boxColorStyle.color = theme.textColor;
    }

    let boxTop:number | undefined = undefined;
    if(props.anchorBottom){
        //the stage is position at 70% down... so we need to go down a further 30%
        boxTop = window.innerHeight*.3;
    }

    return (
        <div className={cn} style={{top:boxTop, opacity:opacity, transitionDelay:delay+"s", transform:`translate(-50%,-100%) translate(${numX}px,-${numY}px) translateZ(${numZ}px)`}}>
            <div className="boxBorder" style={{...boxBorderStyle, width:props.width, height:props.height, transitionDelay:delay+"s", cursor:props.onClick?"pointer":undefined}} onClick={props.onClick}>
                <div className="boxColor" style={{...boxColorStyle, width:props.contentWidth-(borderWidth*2), height:props.contentHeight-(borderWidth*2)}}>
                    <div className="boxContent" style={{opacity:contentOpacity}}>
                        {props.children}
                    </div>
                </div>
            </div>
            <div className="boxShadow" style={{backgroundImage:`url('./theme/${theme.id}/boxshadow.png')`, transform:`translate(0,${boxShadowY}px)`, transitionDelay:delay+"s"}}></div>
            {props.outerChildren}
        </div>
    );
}
