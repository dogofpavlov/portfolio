import { PropsWithChildren, useRef } from "react";
import './Box.scss';
import { useTheme } from "./context/ThemeContext";
import useStageSize from "./context/StageSizeContext";
import useResize from "./context/ResizeContext";

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
    allowClickWhen3DDisabled?:boolean;
}

export default function Box (props: IBoxProps) {


    const {resizeId, disable3D} = useResize();

    let cn:string = "box "+resizeId;


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


    const extraBoxBorderStyle:React.CSSProperties = {};
    if(!props.noStyle){
        extraBoxBorderStyle.borderWidth = borderWidth;
        extraBoxBorderStyle.borderImageSource = `url('./theme/${theme.id}/boxborder.png')`
    }

    const extraBoxColorStyle:React.CSSProperties = {};
    if(!props.noStyle){
        extraBoxColorStyle.backgroundColor = theme.boxColor;
        extraBoxColorStyle.color = theme.textColor;
    }

    let boxTop:number | undefined = undefined;
    if(props.anchorBottom){
        //the stage is position at 70% down... so we need to go down a further 30%
        boxTop = window.innerHeight*.3;
    }

    let boxStyle:React.CSSProperties = {top:boxTop, opacity:opacity, transitionDelay:delay+"s", transform:`translate(-50%,-100%) translate(${numX}px,-${numY}px) translateZ(${numZ}px)`};
    let boxBorderStyle:React.CSSProperties = {...extraBoxBorderStyle, width:props.width, height:props.height, transitionDelay:delay+"s", cursor:props.onClick?"pointer":undefined};
    let boxColorStyle:React.CSSProperties = {...extraBoxColorStyle, width:props.contentWidth-(borderWidth*2), height:props.contentHeight-(borderWidth*2)};
    let boxContentStyle:React.CSSProperties = {opacity:contentOpacity};

    let boxShadowStyle:React.CSSProperties = {backgroundImage:`url('./theme/${theme.id}/boxshadow.png')`, transform:`translate(0,${boxShadowY}px)`, transitionDelay:delay+"s"};

    let boxBorderClick = props.onClick;

    if(disable3D){
        cn+=" disabled3D";
        boxStyle = {};
        boxBorderStyle = {};
        boxColorStyle = {...extraBoxColorStyle};
        boxContentStyle = {};
        boxShadowStyle = {};
        if(!props.allowClickWhen3DDisabled){
            boxBorderClick = undefined;
        }
    }


    return (
        <div className={cn} style={boxStyle}>
            <div className="boxBorder" style={boxBorderStyle} onClick={boxBorderClick}>
                <div className="boxColor" style={boxColorStyle}>
                    <div className="boxContent" style={boxContentStyle}>
                        {props.children}
                    </div>
                </div>
            </div>
            {!disable3D && (
                <div className="boxShadow" style={boxShadowStyle}></div>
            )}
            {props.outerChildren}
        </div>
    );
}
