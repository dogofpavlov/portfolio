
import { ISectionProps, SectionFunction } from '../types/Section';

import { useDepth } from '../hooks/useDepth';
import SectionBox from '../SectionBox';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useTheme } from '../context/ThemeContext';
import "./Home.scss";

export interface IHomeProps extends ISectionProps{
}


const Home:SectionFunction = ({ready}:IHomeProps)=>{

    const depthInfo = useDepth(Home,ready);
    const navigate = useNavigate();
    const {theme} = useTheme();

    const boxClick=()=>{
        if(!depthInfo.isDepthCurrent){
            navigate(Home.PATH);
        }
    }

    //1600
    return (
        <>
            <SectionBox horCenter verCenter x={-395} y={400} depthInfo={depthInfo} className={"welcome"} width={410} height={90} onClick={boxClick}>
                <h1>
                    <span style={{color:theme.themeColor}}>Welcome to the Digital Portfolio of</span>
                    Patrick Ryan Caillouet
                </h1>
            </SectionBox>
            <SectionBox delay={0.1} zOffset={30} horCenter verCenter depthInfo={depthInfo} className={"latestProjects"} height={60} width={200} x={-500} y={350} onClick={boxClick}>
                <h3><span style={{color:theme.themeColor}}>LATEST</span> PROJECTS</h3>
            </SectionBox>
        </>
    )
}
Home.PATH = "/";
Home.DEPTH = 0;
Home.ID = "home";
export default Home;
