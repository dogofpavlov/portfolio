


import { ISectionProps, SectionFunction } from '../types/Section';
import { IDepthInfo, useDepth } from '../hooks/useDepth';
import SectionBox from '../SectionBox';

import ThemeSpan from '../ui/ThemeSpan';

import { useRef, useState } from 'react';
import useStageSize from '../context/StageSizeContext';

import './About.scss';

export interface IAboutProps extends ISectionProps{

}


const About:SectionFunction = ({ready}:IAboutProps)=>{

    const depthInfo = useDepth(About, ready);
    const {totalWidth} = useStageSize();

    let actualWidth = Math.min(totalWidth,1400);

    let leftX = -actualWidth/2;
    let rightX = actualWidth/2;

    let gap = 10;

    let videoWidth = 425;
    let rightWidth = actualWidth-gap-videoWidth;

    return (
        <>
            <SectionBox verCenter horCenter zOffset={-20} delay={0} x={leftX+300} y={360} width={200} height={60} depthInfo={depthInfo} className={About.ID}>
                <h1>About Me</h1>
            </SectionBox>
            <SectionBox delay={0.2} x={leftX+212} y={100} width={425} height={248} depthInfo={depthInfo} className={About.ID}>
                {depthInfo.isExactActive && (
                    <video width="405" height="228" preload="auto" autoPlay loop muted src="./me.mp4">
                        <source src="./me.mp4" type="video/mp4"/>
                    </video>
                )}
            </SectionBox>
            <SectionBox overflowScroll padding delay={.1} zOffset={-20} x={rightX-(rightWidth/2)} y={80} width={rightWidth} height={310} depthInfo={depthInfo} className={"aboutBox"}>
                <p style={{marginRight:30}}>
                    <ThemeSpan style={{fontSize:28, marginRight:5}}>Hello!</ThemeSpan>My name is <span style={{color:"#FFF", fontWeight:700}}>Patrick <ThemeSpan>“Ryan”</ThemeSpan> Caillouet</span>. I’m a 38 year old <span style={{color:"#FFF", fontWeight:700}}>Senior Front End Developer</span> with <ThemeSpan>over 18+ years</ThemeSpan> of experience specializing in <ThemeSpan>architecting</ThemeSpan>, <ThemeSpan>designing</ThemeSpan> and <ThemeSpan>programming</ThemeSpan>, easy to use and graphically pleasing software that runs on the <span style={{color:"#FFF", fontWeight:700}}>web</span> and <span style={{color:"#FFF", fontWeight:700}}>mobile</span> devices. I build anything from <span style={{color:"#FFF", fontWeight:700}}>simple websites</span> to <span style={{color:"#FFF", fontWeight:700}}>complex cross-platform mobile applications</span> for both iOS and Android.
                </p>
                <p>
                    In my spare time, I enjoy working on <ThemeSpan>3D printing</ThemeSpan> and <ThemeSpan>Arduino</ThemeSpan> related projects. I have passion for collecting things, and run a small YouTube channel, "<a href="https://www.youtube.com/@thecyberhobbit" target="_blank"><ThemeSpan>The Cyber Hobbit</ThemeSpan></a>" where I share insights on <span style={{color:"#FFF", fontWeight:700}}>The Lord of the Rings</span> and <span style={{color:"#FFF", fontWeight:700}}>The Hobbit</span> collectibles.
                </p>
            </SectionBox>
            <DoggoBox x={leftX+videoWidth} bigX={-100} y={0} zOffset={120} delay={.3} depthInfo={depthInfo} name='Loki' url='./bobby.jpg' />
            <DoggoBox x={rightX-10} bigX={300} y={250} zOffset={120} delay={.4} depthInfo={depthInfo} name="Rocko" url="./digdiggy.jpg"/>
        </>
    )
}

About.PATH = "/about/";
About.DEPTH = 1;
About.ID = "about";
export default About;





export interface IDoggoBoxProps {
    x:number;
    y:number;
    bigX:number;
    delay:number;
    depthInfo:IDepthInfo;
    url:string;
    name:string;
    zOffset:number;
}

export function DoggoBox (props: IDoggoBoxProps) {

    const [doggoBig, setDoggoBig] = useState<boolean>(false);

    const size = doggoBig?300:112;
    const x = doggoBig?props.bigX:props.x;
    const y = doggoBig?60:props.y;
    const delay = doggoBig?0:props.delay;

    return (
        <SectionBox x={x} y={y} zOffset={props.zOffset} width={size} height={size} delay={delay} depthInfo={props.depthInfo} onClick={()=>{
            setDoggoBig(!doggoBig);
        }}>
            <img style={{transition:"all 0.5s ease-in-out", transitionDelay:delay+"s", cursor:"pointer"}} src={props.url} alt={props.name} width={size-20} height={size-20}/>
        </SectionBox>
    );
}
