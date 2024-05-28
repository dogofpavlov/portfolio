import { Link, useLocation, useNavigate } from "react-router-dom";
import SectionBox from "../SectionBox";
import { ISectionProps, SectionFunction } from "../types/Section";

import { IDepthInfo, useDepth } from "../hooks/useDepth";
import { IProject, IProjectType, useProjectData } from "../context/DataContext";
import useStageSize from "../context/StageSizeContext";
import Projects from "./Projects";
import React, { useEffect, useRef, useState } from "react";

import './ProjectTypes.scss';
import PushHoverBtn from "../ui/PushHoverBtn";
import TintIcon from "../ui/TintIcon";
import ThemeSpan from "../ui/ThemeSpan";
import PushHoverText from "../ui/PushHoverText";
import useResize from "../context/ResizeContext";


interface IProjectTypesProps extends ISectionProps{

}

const ProjectTypes:SectionFunction = ({ready}:IProjectTypesProps)=>{

    const location = useLocation();

    const {dataProjectsTypes} = useProjectData();

    const projectType = dataProjectsTypes.find(($type)=>{
        return location.pathname.includes($type.id);
    });

    const depthInfo = useDepth(ProjectTypes,ready);
    

    return (
        <>
            {dataProjectsTypes.map(($projectType)=>{
                let isTypeActive = projectType===$projectType;

                const typeDepthInfo = {...depthInfo};
                typeDepthInfo.isActive = typeDepthInfo.isActive && isTypeActive;
               // typeDepthInfo.isExactActive = typeDepthInfo.isExactActive && isTypeActive;
                typeDepthInfo.isExactActive = typeDepthInfo.isDepthCurrent && isTypeActive;
               
                typeDepthInfo.sectionPath = typeDepthInfo.sectionPath+$projectType.id;


                console.log("dataProjecTypes", $projectType.label, typeDepthInfo);

                return (
                    <ProjectTypeOptions depthInfo={typeDepthInfo} type={$projectType} key={$projectType.id+"projecetTypeOptions"} />
                );
            })}
        </>
    )
}
ProjectTypes.PATH = "/projects/";
ProjectTypes.DEPTH = 2;
ProjectTypes.ID = "projectTypes";
export default ProjectTypes;



export interface IProjectTypeOptionsProps {
    depthInfo:IDepthInfo;
    type:IProjectType;
    
}

export function ProjectTypeOptions (props: IProjectTypeOptionsProps) {

    const {totalWidth, offLeftX, offRightX} = useStageSize();

    const [scrollIndex, setScrollIndex] = useState<number>(0);

    const gap:number = 30;

    const width:number = 420;
    const height:number = 320;

    const widthPerOption = width+gap;

    let numVisible = Math.max(Math.floor(totalWidth/(widthPerOption)),1);

    if(numVisible>props.type.project.length){
        numVisible = props.type.project.length;
    }

    const occupiedWidth:number = (numVisible*(widthPerOption))-gap;
    const halfOccupiedWidth:number = Math.round(occupiedWidth/2);
    const occupiedLeftX:number = -halfOccupiedWidth;
    const occupiedRightX:number = halfOccupiedWidth;

    const {dataProjectsTypes} = useProjectData();

    const resize = useResize();

    const navigate = useNavigate();

    let delay:number = 0.1;

    let projectLabel:string = props.type.label;
    let lblBoxWidth:number = projectLabel.length*30;
    if(lblBoxWidth>250){
        lblBoxWidth = 250;
    }
    let maxScroll = props.type.project.length-numVisible;

    const nextPrev=($dir:number)=>{

        if(resize.disable3D){
            let curIndex = dataProjectsTypes.findIndex(($type)=>{
                return $type.id===props.type.id;
            });
            if(curIndex!==-1){
                curIndex+=$dir;
                if(curIndex<0) curIndex=dataProjectsTypes.length-1;
                if(curIndex>dataProjectsTypes.length-1) curIndex = 0;


                let newType = dataProjectsTypes[curIndex];

                
                navigate(Projects.PATH+newType.id);

            }


        }else{
            let newScrollIndex = scrollIndex+$dir;
            if(newScrollIndex<0) newScrollIndex=0;
            if(newScrollIndex>maxScroll)newScrollIndex = maxScroll;
            setScrollIndex(newScrollIndex);
        }

    }

    useEffect(()=>{

        if(scrollIndex>maxScroll){
            setScrollIndex(maxScroll);
        }

    },[maxScroll]);



    let prevBtnX = offLeftX-300;
    if(scrollIndex>0){
        prevBtnX = occupiedLeftX-50;
    }
    let nextBtnX = offRightX+300;
    if(scrollIndex<maxScroll){
        nextBtnX = occupiedRightX+50;
    }

    const projectTypeOptions = (
        <>
            {props.type.project.map(($project, $index)=>{

                let numX = occupiedLeftX+(width/2)+(($index-scrollIndex)*widthPerOption);

                if($index<scrollIndex){
                    numX = offLeftX-(width);
                }
                if($index>scrollIndex+numVisible-1){
                    numX = offRightX+(width);
                }

                return(
                    <ProjectTypesOption
                        key={props.type.id+$project.id+$index}
                        delay={.1}
                        depthInfo={props.depthInfo}
                        height={height}
                        width={width}
                        project={$project}
                        type={props.type}
                        x={numX}
                        y={50}
                        zOffset={($index%2)*10}
                    />
                );
            })} 
        </>
    );


    return (
        <>
            <SectionBox className="sectionTitle" verCenter horCenter zOffset={20} delay={0} x={occupiedLeftX+50} y={400} width={lblBoxWidth} height={60} depthInfo={props.depthInfo}>
                <h1>{props.type.label}</h1>
            </SectionBox>  
            
            <SectionBox zOffset={40} delay={0} x={occupiedRightX-50} y={350} width={230} height={50} depthInfo={props.depthInfo} className="backToProjects">
                <Link to={Projects.PATH}>
                    <h3><ThemeSpan>BACK TO </ThemeSpan>PROJECTS</h3>
                </Link>
            </SectionBox> 
            <SectionBox allowClickWhen3DDisabled noStyle verCenter horCenter zOffset={30} delay={0} x={prevBtnX} y={170} width={120} height={120} depthInfo={props.depthInfo} className="projectTypeArrow typeArrowLeft" onClick={()=>{
                console.log("wuttt");
                nextPrev(-1);
            }}>
                <PushHoverBtn direction={PushHoverBtn.DIRECTION_LEFT}>
                    <TintIcon src="./icon-prev.png"/>
                </PushHoverBtn>
            </SectionBox>  
            <SectionBox allowClickWhen3DDisabled noStyle verCenter horCenter zOffset={30} delay={(2*delay)} x={nextBtnX} y={170} width={120} height={120} depthInfo={props.depthInfo} className="projectTypeArrow typeArrowRight" onClick={()=>{
                nextPrev(1);
            }}>
                <PushHoverBtn direction={PushHoverBtn.DIRECTION_RIGHT}>
                    <TintIcon src="./icon-next.png"/>
                </PushHoverBtn>
            </SectionBox>  
            {resize.disable3D && (
                <div className="projectTypeOptions">
                    {projectTypeOptions}
                </div>
            )}
            {!resize.disable3D && (
                <>
                    {projectTypeOptions}
                </>
            )}
             
        </>
    );
}




export interface IProjectTypesOptionProps {
    project:IProject;
    type:IProjectType;
    zOffset:number;
    delay:number;
    x:number;
    y:number;
    width:number;
    height:number;
    depthInfo:IDepthInfo;
}

export function ProjectTypesOption (props: IProjectTypesOptionProps) {

    const [isThumbLoaded, setIsThumbLoaded] = useState<boolean>(false);




    return (
        <SectionBox zOffset={props.zOffset} delay={props.delay} x={props.x} y={props.y} width={props.width} height={props.height} depthInfo={props.depthInfo} className={"projectOption"} outerChildren={(
            <>
                <div className="projectTypeOptionName">
                    {props.project.name}
                </div>
            </>
        )}>
            <Link to={Projects.PATH+props.type.id+"/"+props.project.id}>
                {(props.depthInfo.isActive || isThumbLoaded) && (
                    <img src={`./projects/${props.project.id}.jpg`} alt={props.project.name+" Thumbnail"} onLoad={()=>{
                        setIsThumbLoaded(true);
                    }}/>
                )}
            </Link>
        </SectionBox>
    );
}
