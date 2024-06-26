import SectionBox from "../SectionBox";
import useResize from "../context/ResizeContext";
import useStageSize from "../context/StageSizeContext";
import { useDepth } from "../hooks/useDepth";
import { ISectionProps, SectionFunction } from "../types/Section";
import './Links.scss';

interface ILinksProps extends ISectionProps{

}

const Links:SectionFunction = ({ready}:ILinksProps)=>{



    const depthInfo = useDepth(Links, ready);
    const {totalWidth} = useStageSize();

    const {resizePoint} = useResize();




    const links = [
        {
            label:"Github",
            url:"https://github.com/dogofpavlov",
            icon:"./icon-github.png",
            handle:"dogofpavlov"
        },
        {
            label:"Linked in",
            url:"https://www.linkedin.com/in/ryancaillouet",
            icon:"./icon-linkedin.png",
            handle:"ryancaillouet"
        },
        {
            label:"Youtube",
            url:"https://www.youtube.com/@thecyberhobbit",
            icon:"./icon-youtube.png",
            handle:"thecyberhobbit"
        },
        {
            label:"Instagram",
            url:"https://www.instagram.com/dogofpavlov",
            icon:"./icon-instagram.png",
            handle:"dogofpavlov"
        },
    ]


    

    let gap:number = 30;
    if(resizePoint.value<=1200){
        gap = 10;
    }

    let itemWidth:number = (totalWidth-((links.length-1)*gap))/links.length;
    if(itemWidth<250) itemWidth = 250;

    if(itemWidth>350) itemWidth = 350;

    if(resizePoint.value<=1200){
        itemWidth = 220;
    }



    const actualWidth:number = links.length*itemWidth+((links.length-1)*gap);




    let leftX = -actualWidth/2;
    let rightX = actualWidth/2;



    return (
        <>
            <SectionBox className="sectionTitle" verCenter horCenter zOffset={-20} delay={0} x={leftX+300} y={320} width={200} height={60} depthInfo={depthInfo}>
                <h1>Links</h1>
            </SectionBox>
            {links.map(($link, $index)=>{
                let x:number = leftX+($index*(itemWidth+gap))+(itemWidth/2);
                return (
                    <SectionBox key={"linkOption"+$link.label} className="linkOption" verCenter horCenter zOffset={($index%2)*20} delay={0.1*$index} x={x} y={100} width={itemWidth} height={210} depthInfo={depthInfo}>
                        <a href={$link.url} target="_blank">
                            <img src={$link.icon} alt={$link.label}/>
                            <div className="linkLabel">{$link.label}</div>
                            <div className="linkHandle">{$link.handle}</div>
                        </a>
                    </SectionBox>
                )
            })}
        </>
    );
}


Links.PATH = "/links/";
Links.DEPTH = 1;
Links.ID = "links";
export default Links;