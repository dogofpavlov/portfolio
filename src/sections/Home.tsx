
import { ISectionProps, SectionFunction } from '../types/Section';

import { useDepth } from '../hooks/useDepth';
import SectionBox from '../SectionBox';

import "./Home.scss";
import ThemeSpan from '../ui/ThemeSpan';
import { useProjectData } from '../context/DataContext';
import { ProjectTypesOption } from './ProjectTypes';
import useStageSize from '../context/StageSizeContext';
import MovieQuotes from '../ui/MovieQuotes';

export interface IHomeProps extends ISectionProps{
}


const Home:SectionFunction = ({ready}:IHomeProps)=>{

    const depthInfo = useDepth(Home,ready);


    const {totalWidth ,leftX} = useStageSize();

    const isAtHome = depthInfo.activeDepth===0;


    const homeScale = 1.3;

    let width = 450;
    let height = 90;

    if(isAtHome){
        width = width*homeScale;
        height = height*homeScale;
    }

    let y = isAtHome?200:400;
    let x = isAtHome?0:leftX+(width/2);

    if(!isAtHome){
        if(x>0){
            x=0;
        }
    }

    return (
        <>
            <SectionBox horCenter verCenter x={x} y={y} depthInfo={depthInfo} className={"welcome"} width={width} height={height}>
                <h1 style={{textAlign:"center", transition:"all 0.5s ease-in-out", transform:(isAtHome?`scale(${homeScale})`:undefined)}}>
                    <ThemeSpan>Welcome to the Digital Portfolio of</ThemeSpan>
                    Patrick “Ryan” Caillouet
                </h1>
            </SectionBox>
            <MovieQuotes depthInfo={depthInfo}/>
        </>
    )
}
Home.PATH = "/";
Home.DEPTH = 0;
Home.ID = "home";
export default Home;
