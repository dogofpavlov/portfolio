import { useNavigate } from "react-router-dom";
import { useDepth } from "../hooks/useDepth";
import { ISectionProps, SectionFunction } from "../types/Section";
import { useTheme } from "../context/ThemeContext";
import SectionBox from "../SectionBox";


interface ISkillsProps extends ISectionProps{

}

const Skills:SectionFunction = ({ready}:ISkillsProps)=>{

    const depthInfo = useDepth(Skills,ready);
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
                some skills
            </SectionBox>
        </>
    )
}
Skills.PATH = "/skills/";
Skills.DEPTH = 1;
Skills.ID = "skills";
export default Skills;