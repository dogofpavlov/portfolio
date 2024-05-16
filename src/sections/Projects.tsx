import { useNavigate } from "react-router-dom";
import { useDepth } from "../hooks/useDepth";
import { ISectionProps, SectionFunction } from "../types/Section";
import { useTheme } from "../context/ThemeContext";
import SectionBox from "../SectionBox";


interface IProjectsProps extends ISectionProps{

}

const Projects:SectionFunction = ({ready}:IProjectsProps)=>{

    const depthInfo = useDepth(Projects,ready);
    const navigate = useNavigate();
    const {theme} = useTheme();

    const boxClick=()=>{
        if(!depthInfo.isDepthCurrent){
        //    navigate(Home.PATH);
        }
    }

    //1600
    return (
        <>
            <SectionBox horCenter verCenter x={-395} y={400} depthInfo={depthInfo} className={"welcome"} width={410} height={90} onClick={boxClick}>
                projects
            </SectionBox>
        </>
    )
}
Projects.PATH = "/projects/";
Projects.DEPTH = 1;
Projects.ID = "projects";
export default Projects;