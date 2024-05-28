import { Link, useLocation, useNavigate } from "react-router-dom";
import { IDepthInfo, useDepth } from "../hooks/useDepth";
import { ISectionProps, SectionFunction } from "../types/Section";
import { useTheme } from "../context/ThemeContext";
import SectionBox from "../SectionBox";
import './Projects.scss';
import useStageSize from "../context/StageSizeContext";
import { IProjectType, useProjectData } from "../context/DataContext";
import PushHoverText from "../ui/PushHoverText";
import TintIcon from "../ui/TintIcon";





interface IProjectsProps extends ISectionProps{

}

const Projects:SectionFunction = ({ready}:IProjectsProps)=>{

    const location = useLocation();
    const {totalWidth} = useStageSize();
    const depthInfo = useDepth(Projects,ready);

    const {dataProjectsTypes} = useProjectData();

    const types:IProjectType[] = dataProjectsTypes;

    const gap:number = 30;
    let itemWidth:number = (totalWidth-((types.length-1)*gap))/types.length;
    if(itemWidth<250) itemWidth = 250;

    if(itemWidth>350) itemWidth = 350;

    const actualWidth:number = types.length*itemWidth+((types.length-1)*gap);


    const actualLeftX = -(actualWidth/2);


    const selectedProjectType = dataProjectsTypes.find(($type)=>{
        return location.pathname.includes($type.id);
    });


    return (
        <>
            <SectionBox verCenter horCenter zOffset={-20} delay={0} x={actualLeftX+100} y={370} width={200} height={60} depthInfo={depthInfo} className={Projects.ID+" sectionTitle"}>
                <h1>PROJECTS</h1>
            </SectionBox>     
            {types.map(($type,$index)=>{

                let selected:boolean=false;
                if(selectedProjectType && selectedProjectType.id===$type.id){
                    selected=true;
                }

                let x:number = actualLeftX+($index*(itemWidth+gap))+(itemWidth/2);
                return (
                    <ProjectType selected={selected} key={$type.id} delay={($index+1)*.1} depthInfo={depthInfo} width={itemWidth} type={$type} z={($index%2)*20} x={x} />
                );
            })}
        </>
    )
}
Projects.PATH = "/projects/";
Projects.DEPTH = 1;
Projects.ID = "projects";
export default Projects;


export interface IProjectTypeProps {
    type:IProjectType;
    z:number;
    x:number;
    width:number;
    delay:number;
    depthInfo:IDepthInfo;
    selected:boolean;
}

export function ProjectType (props: IProjectTypeProps) {

    return (
        <SectionBox zOffset={props.z} delay={props.delay} x={props.x} y={60} width={props.width} height={300} depthInfo={props.depthInfo} className={"projectClass "+(props.selected?"selected":"")}>
            <Link to={Projects.PATH+props.type.id}>
                <TintIcon src={`./icon-${props.type.id}.png`}/>
                <PushHoverText>
                    {props.type.label}
                </PushHoverText>
            </Link>
        </SectionBox>
    );
}
