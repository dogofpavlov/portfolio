import {useEffect} from 'react';
import Box from './Box';
import { SectionFunction } from './types/Section';
import { IDepthInfo, useDepth } from './hooks/useDepth';
import './SectionBox.scss';


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
    overflowHidden?:boolean;
}

export default function SectionBox (props: ISectionBoxProps) {
    const {depth, isActive} = props.depthInfo;


   // const introProgress = useNumAnimation({start:0, end:1, duration:10, isActive});

    let numWidth = isActive?props.width:20;
    let numHeight = isActive?props.height:0;

    let numX:number=props.x;
    let numY:number=isActive?props.y:0;
    let numZ:number=-(depth)*250;
    if(props.zOffset){
        numZ+=props.zOffset;
    }

    let opacity:number = 1 - (numZ/-500);
    if(!isActive){
        opacity=0;
    }
    if(opacity>1)opacity=1;
   // console.log(props.className, introProgress);

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

    let contentOpacity:number = depth===0?1:opacity*.5;


    

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
            overflowHidden={props.overflowHidden}
            onClick={props.onClick}
        >
            {props.children}
        </Box>
    );
}
