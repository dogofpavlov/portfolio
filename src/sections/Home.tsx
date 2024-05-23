
import { ISectionProps, SectionFunction } from '../types/Section';

import { useDepth } from '../hooks/useDepth';
import SectionBox from '../SectionBox';

import "./Home.scss";
import ThemeSpan from '../ui/ThemeSpan';

export interface IHomeProps extends ISectionProps{
}


const Home:SectionFunction = ({ready}:IHomeProps)=>{

    const depthInfo = useDepth(Home,ready);

    return (
        <>
            <SectionBox horCenter verCenter x={-395} y={400} depthInfo={depthInfo} className={"welcome"} width={430} height={90}>
                <h1>
                    <ThemeSpan>Welcome to the Digital Portfolio of</ThemeSpan>
                    Patrick “Ryan” Caillouet
                </h1>
            </SectionBox>
            <SectionBox delay={0.1} zOffset={30} horCenter verCenter depthInfo={depthInfo} className={"latestProjects"} height={60} width={200} x={-500} y={350}>
                <h3><ThemeSpan>LATEST</ThemeSpan> PROJECTS</h3>
            </SectionBox>
        </>
    )
}
Home.PATH = "/";
Home.DEPTH = 0;
Home.ID = "home";
export default Home;
