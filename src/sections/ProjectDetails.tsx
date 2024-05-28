import { Link, useLocation } from "react-router-dom";
import SectionBox from "../SectionBox";
import { IProject, IProjectType, useProjectData } from "../context/DataContext";
import useStageSize from "../context/StageSizeContext";
import { useDepth } from "../hooks/useDepth";
import { ISectionProps, SectionFunction } from "../types/Section";
import ProjectTypes from "./ProjectTypes";
import { useEffect, useRef, useState } from "react";
import Loader from "../ui/Loader";
import delay from "../util/Delay";
import useWorldControl from "../context/WorldControlContext";
import ImageReveal from "../ui/ImageReveal";
import { useTheme } from "../context/ThemeContext";
import './ProjectDetails.scss';
import ThemeSpan from "../ui/ThemeSpan";
import PreloadImage from "../util/PreloadImage";
import forceDivReflow from "../util/ForceDivReflow";
import PushHoverBtn from "../ui/PushHoverBtn";
import TintIcon from "../ui/TintIcon";
import { gsap } from 'gsap';
import NextFrame from "../util/NextFrame";

interface IProjectDetailsProps extends ISectionProps{

}

const ProjectDetails:SectionFunction = ({ready}:IProjectDetailsProps)=>{


    

    const divProjectDetailsContentContainer = useRef<HTMLDivElement>(null);
    const divProjectDetailsContentContainerReveals = useRef<HTMLDivElement>(null);
    const divProjectDetailsName = useRef<HTMLDivElement>(null);


    const closeTween = useRef<gsap.core.Tween>();
    const nameTween = useRef<gsap.core.Tween>();

    const [windowSize, setWindowSize] = useState<{w:number, h:number}>({w:window.innerWidth, h:window.innerHeight});

    const [project, setProject] = useState<IProject>();
    const [projectType, setProjectType] = useState<IProjectType>();

    const [isProjectLoading, setIsProjectLoading] = useState<boolean>(false);
    const [isProjectLoaded, setIsProjectLoaded] = useState<boolean>(false);
    const [arrImageNums, setArrImageNums] = useState<number[]>([1]);

    const reflowTimeoutID = useRef<number>(-1);
    const timeoutIDNameIntro = useRef<number>(-1);

    

    const depthInfo = useDepth(ProjectDetails,ready);


    const {dataProjectsTypes, dataAllProjects, getProjectPath} = useProjectData();

    const pathProjectTypeId = depthInfo.pathSplit.length>=ProjectTypes.DEPTH?depthInfo.pathSplit[ProjectTypes.DEPTH-1]:"";
    const pathProjectType = dataProjectsTypes.find(($type)=>{
        return $type.id===pathProjectTypeId;
    });

    const pathProjectId = depthInfo.pathSplit.length>=ProjectDetails.DEPTH?depthInfo.pathSplit[ProjectDetails.DEPTH-1]:"";


    let prevProjectIndex = -1;
    let nextProjectIndex = -1;

    const pathProject = dataAllProjects.find(($project, $index)=>{
        let match:boolean=false;
        if($project.id===pathProjectId){
            match=true;

            nextProjectIndex = $index+1;
            prevProjectIndex = $index-1;
        }
        return match;
    });
    if(prevProjectIndex<0){
        prevProjectIndex = dataAllProjects.length-1;
    }
    if(nextProjectIndex>dataAllProjects.length-1){
        nextProjectIndex = 0;
    }


    depthInfo.isExactActive = depthInfo.isDepthCurrent && (pathProjectId && pathProjectTypeId)?true:false;

    const {setIsViewingDetail, isViewingDetail} = useWorldControl();



    useEffect(()=>{

        let isMounted:boolean=true;

        const loadProject = async ($project:IProject, $projectType:IProjectType)=>{
            if($project){
                window.clearTimeout(reflowTimeoutID.current);
                window.clearTimeout(timeoutIDNameIntro.current);

                const loadingDone = ()=>{

                    if(divProjectDetailsContentContainerReveals.current){                    
                        divProjectDetailsContentContainerReveals.current.style.height = "auto";          
                        divProjectDetailsContentContainerReveals.current.style.overflow = "visible";
                    }

                    setProjectType($projectType);
                    setProject($project);
                    
                    timeoutIDNameIntro.current = window.setTimeout(()=>{
                        if(divProjectDetailsName.current && isMounted){
                            nameTween.current = gsap.to(divProjectDetailsName.current,{opacity:1, duration:0.5});
                        }
                    },200);
                }

                setArrImageNums([1]);
                if(!isProjectLoaded){
    
                    setIsProjectLoading(true);
                    
                    try{
                        
                        if(isMounted){
                            await PreloadImage(`./projects/${$project.id}1.jpg`);
                        }
                        if(isMounted){
                            await delay(1000);
                        }

                    }catch($error){
            
                    }

                    
                    if(isMounted){
                        setIsProjectLoading(false);
                        setIsViewingDetail(true);
                        setIsProjectLoaded(true);
                        loadingDone();
            
                        window.clearTimeout(reflowTimeoutID.current);
                        reflowTimeoutID.current = window.setTimeout(()=>{
                            if(divProjectDetailsContentContainer.current && isMounted){
                                forceDivReflow(divProjectDetailsContentContainer.current);
                            }
                        },1000);
                    }
                }else{
    
                    try{
            
                        if(isMounted){
                            await PreloadImage(`./projects/${$project.id}1.jpg`);
                        }
                        if(isMounted){
                            await delay(100);
                        }
                    }catch($error){
            
                    }
                    if(isMounted){
                        loadingDone();

                    }
                }
            }
        }


        if(pathProject && pathProjectType){
            if(project){
                //close current project then load next
                if(divProjectDetailsContentContainerReveals.current){

                    divProjectDetailsContentContainerReveals.current.style.height = divProjectDetailsContentContainerReveals.current.clientHeight+"px";          
                    divProjectDetailsContentContainerReveals.current.style.overflow = "hidden";

                    if(divProjectDetailsName.current){
                        nameTween.current = gsap.to(divProjectDetailsName.current,{opacity:0, duration:0.5});
                    }
                    closeTween.current = gsap.to(divProjectDetailsContentContainerReveals.current,{height:0, duration:1, onComplete:()=>{    
                        if(isMounted){
                            loadProject(pathProject, pathProjectType);
                        }               
                    }});
                }
            }else{
                loadProject(pathProject, pathProjectType);
            }
        }else{

            if(closeTween.current){
                closeTween.current.kill();
            }
            if(nameTween.current){
                nameTween.current.kill();
            }
            window.clearTimeout(timeoutIDNameIntro.current);
            window.clearTimeout(reflowTimeoutID.current);
            setProjectType(undefined);
            setProject(undefined);
            setIsProjectLoading(false);
            setIsProjectLoaded(false);
            setIsViewingDetail(false);
            setArrImageNums([1]);
        }

        return ()=>{
            isMounted=false;
            window.clearTimeout(timeoutIDNameIntro.current);
            window.clearTimeout(reflowTimeoutID.current);
            if(closeTween.current){
                closeTween.current.kill();
            }
            if(nameTween.current){
                nameTween.current.kill();
            }
        }

    },[pathProject]);


    const onResize=()=>{
        setWindowSize({w:window.innerWidth, h:window.innerHeight});
    }

    useEffect(()=>{
        window.addEventListener("resize", onResize);

        return ()=>{
            window.removeEventListener("resize", onResize);
        }
    },[]);


    const imageRevealDone=()=>{
        let newArrImageNums = [...arrImageNums];
        newArrImageNums.push(newArrImageNums.length+1);
        setArrImageNums(newArrImageNums);
    }


    let x = 0;
    let y = 0;
    let width = 100;
    let height = 100;

    if(isProjectLoading){
        y = 150;
        width = 100;
        height = 100;
    }else{
        if(isProjectLoaded){
            y = 0;
            width = windowSize.w;
            height = windowSize.h;
        }else{

        }
    }



    return (
        <>
            <SectionBox anchorBottom={isViewingDetail} verCenter horCenter zOffset={0} delay={0} x={x} y={y} width={width} height={height} depthInfo={depthInfo} className={ProjectDetails.ID}>
                {isProjectLoading && (
                    <Loader show/>
                )}
                {projectType && project && isProjectLoaded &&(
                    <>
                        <div className="projectDetailsContent">
                            <div className="projectDetailsContentHeader">
                                <div className="projectDetailsContentHeaderInside">
                                    <div className="projectDetailsContentHeaderInsideName" ref={divProjectDetailsName} style={{opacity:0}}>
                                        <ThemeSpan>{projectType.label}</ThemeSpan>
                                        {project.name}
                                    </div>
                                    {dataAllProjects[prevProjectIndex] && (
                                        <Link to={getProjectPath(dataAllProjects[prevProjectIndex].id)} className="headerBtn prev">
                                            <PushHoverBtn direction="left">
                                                <TintIcon src="./icon-prev.png"/>
                                            </PushHoverBtn>
                                        </Link>
                                    )}
                                    {dataAllProjects[nextProjectIndex] && (
                                        <Link to={getProjectPath(dataAllProjects[nextProjectIndex].id)} className="headerBtn next">
                                            <PushHoverBtn direction="right">
                                                <TintIcon src="./icon-next.png"/>
                                            </PushHoverBtn>
                                        </Link>
                                    )}
                                    <Link to={ProjectTypes.PATH+projectType.id} className="headerBtn close">
                                        <TintIcon src="./icon-close.png"/>
                                    </Link>
                                </div>
                            </div>
                            <div className="projectDetailsContentContainer" ref={divProjectDetailsContentContainer}>                            
                                <div className="projectDetailsContentContainerReveals" ref={divProjectDetailsContentContainerReveals}>

                                    {arrImageNums.map(($i)=>{
                                        let direction = $i%2===0?ImageReveal.DIRECTION_LEFT:ImageReveal.DIRECTION_RIGHT;
                                        return (
                                            <ImageReveal 
                                                alreadyLoaded={$i===0}
                                                key={project.id+$i} 
                                                direction={direction} 
                                                url={`./projects/${project.id}${$i}.jpg`} 
                                                onComplete={imageRevealDone}
                                                renderer={$i===2?($img:JSX.Element)=>{
                                                    return (
                                                        <div className="projectDetailsImageInfo">
                                                            <ProjectDetailsInfo project={project}/>
                                                            {$img}
                                                        </div>
                                                    )
                                                }:undefined}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </SectionBox>  
        </>
    )
}
ProjectDetails.PATH = "/projects/";
ProjectDetails.DEPTH = 3;
ProjectDetails.ID = "projectDetails";
export default ProjectDetails;




export interface IProjectDetailsInfoProps {
    project:IProject;
}

export  function ProjectDetailsInfo (props: IProjectDetailsInfoProps) {


    let hasRealLink = props.project.link.indexOf("http")!==-1;

    return (
        <div className="projectDetailsInfoBox">
            <ProjectDetailsInfoDetail className="desc" title="Project Description" value={props.project.desc} />
            <ProjectDetailsInfoDetail className="client" title="Client" value={props.project.client} />
            <ProjectDetailsInfoDetail className="scope" title="Project Scope" value={props.project.scope} />
            <ProjectDetailsInfoDetail className="tech" title="Technology" value={props.project.tech} />
            <div className="link">
                {hasRealLink && (
                    <>
                        <a href={props.project.link} target="_blank">
                            <span>PROJECT STATUS</span>
                            Launch Project
                        </a>
                    </>   
                )}
                {!hasRealLink && (
                    <div className="linkStatus">
                        <span>PROJECT STATUS</span>
                        {props.project.link}
                    </div>
                )}
            </div>
        </div>
    );
}


export interface IProjectDetailsInfoDetailProps {
    title:string;
    value:string;
    className?:string;
}

export function ProjectDetailsInfoDetail (props: IProjectDetailsInfoDetailProps) {
    let cn:string = "projectDetailsInfoBoxDetail";
    if(props.className){
        cn+=" "+props.className;
    }
    return (
        <div className={cn}>
            <div className="title">
                {props.title}
            </div>
            <div className="value">
                {props.value}
            </div>
        </div>
    );
}

