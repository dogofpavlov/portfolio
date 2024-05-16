


import { ISectionProps, SectionFunction } from '../types/Section';
import { IDepthInfo, useDepth } from '../hooks/useDepth';
import SectionBox from '../SectionBox';

import ThemeSpan from '../ui/ThemeSpan';

import { useState } from 'react';

export interface IAboutProps extends ISectionProps{

}


const About:SectionFunction = ({ready}:IAboutProps)=>{

    const depthInfo = useDepth(About, ready);

    return (
        <>
            <SectionBox verCenter horCenter zOffset={-20} delay={0} x={-490} y={360} width={200} height={60} depthInfo={depthInfo} className={About.ID}>
                <h1>About Me</h1>
            </SectionBox>
            <SectionBox overflowHidden delay={0.2} x={-382} y={100} width={425} height={248} depthInfo={depthInfo} className={About.ID}>
                {depthInfo.isActive && (
                    <video width="405" height="228" preload="auto" autoPlay loop muted src="./me.mp4">
                        <source src="./me.mp4" type="video/mp4"/>
                    </video>
                )}
            </SectionBox>
            <SectionBox padding delay={.1} zOffset={-20} x={250} y={80} width={840} height={310} depthInfo={depthInfo} className={About.ID}>
                <p>
                <span style={{fontSize:30, marginRight:5}} className='theme'>Hello!</span> My name is Patrick “<ThemeSpan>Ryan</ThemeSpan>” Caillouet. I’m a 38 year old Senior Front End Developer with <ThemeSpan>over 18+ years</ThemeSpan> of experience specializing in <ThemeSpan>architecting</ThemeSpan>, <ThemeSpan>designing</ThemeSpan> and <ThemeSpan>programming</ThemeSpan>, easy to use and graphically pleasing software that runs on the web and mobile devices. I build anything from simple websites to complex cross-platform mobile applications for both iOS and Android.
                </p>
                <p>
                In my spare time, I enjoy working on <ThemeSpan>3D printing</ThemeSpan> and <ThemeSpan>Arduino</ThemeSpan> related projects. I have passion for collecting things, and run a small YouTube channel, "<a href="https://www.youtube.com/@thecyberhobbit" target="_blank"><ThemeSpan>The Cyber Hobbit</ThemeSpan></a>" where I share insights on Lord of the Rings and The Hobbit collectibles.
                </p>
            </SectionBox>
            <DoggoBox x={260} bigX={-100} y={20} zOffset={120} delay={.3} depthInfo={depthInfo} name='Loki' url='./bobby.jpg' />

            <DoggoBox x={630} bigX={300} y={350} zOffset={120} delay={.4} depthInfo={depthInfo} name="Rocko" url="./digdiggy.jpg"/>
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
