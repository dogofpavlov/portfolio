import Box from './Box';
import { IDepthInfo, useDepth } from './hooks/useDepth';
import './SectionBox.scss';
import { useLocation, useNavigate } from 'react-router-dom';


export interface ISectionBoxProps extends React.PropsWithChildren{

    width:number;
    height:number;
    x:number;
    y:number;
    zOffset?:number;
    depthInfo:IDepthInfo;
    delay?:number;
    className?:string;
    onClick?:()=>void;

    verCenter?:boolean;
    horCenter?:boolean;
    padding?:boolean;
    overflowScroll?:boolean;
    disableDepthClick?:boolean;
    noStyle?:boolean;
    outerChildren?:React.ReactNode;
    anchorBottom?:boolean;
}

export default function SectionBox (props: ISectionBoxProps) {
    const {depth, isActive, isDepthCurrent, sectionPath} = props.depthInfo;

    let navigate = useNavigate();

    let isVisible = isActive;
    if(depth<0){
        isVisible=false;
    }

    let numWidth = isVisible?props.width:20;
    let numHeight = isVisible?props.height:0;

    let numX:number=props.x;
    let numY:number=isVisible?props.y:0;
    let numZ:number=-(depth)*250;
    if(props.zOffset){
        numZ+=props.zOffset;
    }

    let opacity:number = 1 - (numZ/-650);
    if(!isVisible){
        opacity=0;
    }
    if(opacity>1)opacity=1;

    let cn:string = "sectionBox";
    if(props.className){
        cn+=" "+props.className;
    }
    if(props.verCenter){
        cn+=" verCenter";
    }
    if(props.horCenter){
        cn+=" horCenter";
    }
    if(props.padding){
        cn+=" padding";
    }

    let contentOpacity:number = depth===0?1:opacity;
    
    

    let onClick = props.onClick;
    if(!isDepthCurrent){
        if(!props.disableDepthClick){
            onClick = ()=>{
                navigate(sectionPath);
            }
        }
    }
    if(opacity===0){
        onClick = undefined;
    }

    return (
        <Box 
            delay={props.delay} 
            opacity={opacity} 
            contentOpacity={contentOpacity}
            className={cn} 
            contentWidth={props.width}
            contentHeight={props.height}
            width={numWidth} 
            height={numHeight} 
            x={numX} 
            y={numY} 
            z={numZ} 
            overflowScroll={props.overflowScroll}
            onClick={onClick}
            noStyle={props.noStyle}
            outerChildren={props.outerChildren}
            anchorBottom={props.anchorBottom}
        >
            {props.children}
        </Box>
    );
}
