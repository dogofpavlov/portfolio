


import { ISectionProps, SectionFunction } from '../types/Section';
import { IDepthInfo, useDepth } from '../hooks/useDepth';
import SectionBox from '../SectionBox';

import ThemeSpan from '../ui/ThemeSpan';

import React, { useRef, useState } from 'react';
import useStageSize from '../context/StageSizeContext';

import './About.scss';
import useResize from '../context/ResizeContext';

export interface IAboutProps extends ISectionProps{

}

const AboutSection_AboutMe:string = "aboutMe";
const AboutSection_Services:string = "services";
const AboutSection_Clients:string = "clients";

const About:SectionFunction = ({ready}:IAboutProps)=>{


    const [curSectionId, setCurSectionId] = useState<string>(AboutSection_AboutMe)

    const depthInfo = useDepth(About, ready);
    const {totalWidth} = useStageSize();

    let actualWidth = Math.min(totalWidth,1400);

    let leftX = -actualWidth/2;
    let rightX = actualWidth/2;

    let gap = 10;

    let videoWidth = 425;
    let rightWidth = actualWidth-gap-videoWidth;

    let aboutContentX = rightX-(rightWidth/2);

    const clients:string[] = [
        "cocacola",
        "jeep",
        "laaser911",
        "chrysler",
        "citibank",
        "fifa",
        "phonefusion",
        "hitlab",
        "burgerking",
        "prizm5",
        "vitaminwater",
        "combos",
    ]

    const aboutSections = [
        {
            label:"About Me",
            id:AboutSection_AboutMe,
            jsx:(
                <div className="aboutSectionContent sectionAboutMe">
                    <p>
                        <ThemeSpan style={{fontSize:28, marginRight:5}}>Hello!</ThemeSpan>My name is <span className='whiteSpan'>Patrick <ThemeSpan>“Ryan”</ThemeSpan> Caillouet</span>. I’m a 38 year old <span className='whiteSpan'>Senior Front End Developer</span> with <ThemeSpan>over 18+ years</ThemeSpan> of experience specializing in <ThemeSpan>architecting</ThemeSpan>, <ThemeSpan>designing</ThemeSpan> and <ThemeSpan>programming</ThemeSpan>, easy to use and graphically pleasing software that runs on the <span className='whiteSpan'>web</span> and <span className='whiteSpan'>mobile</span> devices. I build anything from <span className='whiteSpan'>simple websites</span> to <span className='whiteSpan'>complex cross-platform mobile applications</span> for both iOS and Android.
                    </p>
                    <p>
                        In my spare time, I enjoy working on <ThemeSpan>3D printing</ThemeSpan> and <ThemeSpan>Arduino</ThemeSpan> related projects. I have passion for collecting things, and run a small YouTube channel, "<a href="https://www.youtube.com/@thecyberhobbit" target="_blank"><ThemeSpan>The Cyber Hobbit</ThemeSpan></a>" where I share insights on <span style={{color:"#FFF", fontWeight:700}}>The Lord of the Rings</span> and <span style={{color:"#FFF", fontWeight:700}}>The Hobbit</span> collectibles.
                    </p>
                </div>
            )
        },
        {
            label:"Services",
            id:AboutSection_Services,
            jsx:(
                <div className="aboutSectionContent sectionAboutServices">
                    <p className="IBelieve">I believe in <span className='whiteSpan'>Native</span>.<br/> I believe in <span className='whiteSpan'>Cross-platform</span>.<br/> I believe in <span className='whiteSpan'>Hybrid</span>.<br/> I believe in <span className="whiteSpan">doing what is </span><ThemeSpan className='rightForTheProject'>Right for the Project.</ThemeSpan></p>
                    <p>My <ThemeSpan>Skill tree</ThemeSpan> includes but is not limited to: <span className='whiteSpan'>HTML5, CSS, SASS, LESS, JavaScript, Typescript, React, React Native, Redux, MobX, Cordova, Capacitor, ES6, Grunt, Gulp, Web pack, Node.js, JSON, C/C++, Wordpress, Google Maps</span></p>
                    <p>My <ThemeSpan>Graphical</ThemeSpan>, <ThemeSpan>Audio</ThemeSpan> and <ThemeSpan>Video</ThemeSpan> skillsets extend to <span className='whiteSpan'>Adobe Photoshop, Adobe Illustrator, Adobe After Effects, Adobe Premier, Adobe Audition, GIMP and Final Cut Pro.</span></p>
                </div>
            )
        },
        {
            label:"Clients",
            id:AboutSection_Clients,
            jsx:(
                <div className="aboutSectionContent sectionAboutClients">
                    <p>Here are a few <span className='whiteSpan'>clients</span> and <span className='whiteSpan'>companies</span> I've had the <ThemeSpan>priviledge</ThemeSpan> to work with over the years.</p>
                    <div className="clientLogos">
                        {clients.map(($client)=>{
                            return (
                                <img key={$client} src={`./logo-${$client}.png`} alt={$client}/>
                            );
                        })}
                    </div>
                </div>
            )
        },
    ]

    const curSectionContentIndex = aboutSections.findIndex(($sec)=>{
        return $sec.id===curSectionId;
    });

    return (
        <>
        
            <SectionBox verCenter horCenter zOffset={-20} delay={0} x={leftX+300} y={360} width={200} height={60} depthInfo={depthInfo} className={About.ID+" sectionTitle"}>
                <h1>About</h1>
            </SectionBox>
            <SectionBox delay={0.2} x={leftX+212} y={100} width={425} height={248} depthInfo={depthInfo} className={"aboutVideo"}>
                {depthInfo.isExactActive && (
                    <video width="405" height="228" preload="auto" autoPlay loop muted src="./me.mp4">
                        <source src="./me.mp4" type="video/mp4"/>
                    </video>
                )}
            </SectionBox>
            <SectionBox verCenter horCenter zOffset={10} delay={0} x={aboutContentX} y={20} width={350} height={60} depthInfo={depthInfo} className={"aboutNav"}>
                {aboutSections.map(($aboutSection)=>{
                    let cn:string = "aboutNavItem";
                    if($aboutSection.id===curSectionId){
                        cn+=" selected";
                    }
                    return (
                        <div className={cn} key={"nav"+$aboutSection.id} onClick={()=>{
                            setCurSectionId($aboutSection.id);
                        }}>{$aboutSection.label}</div>
                    )
                })}
            </SectionBox>
            
            <SectionBox delay={.1} zOffset={-20} x={aboutContentX} y={80} width={rightWidth} height={310} depthInfo={depthInfo} className={"aboutBox"}>
                <div className="aboutBoxInside" style={{transform:`translate(-${curSectionContentIndex*100}%,0)`}}>
                    {aboutSections.map(($aboutSection)=>{
                        return <React.Fragment key={$aboutSection.id+"sec"}>{$aboutSection.jsx}</React.Fragment>
                    })}
                </div>
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

    let size = doggoBig?300:112;
    const x = doggoBig?props.bigX:props.x;
    const y = doggoBig?60:props.y;
    const delay = doggoBig?0:props.delay;
    const resize = useResize();

    if(resize.disable3D){
        size = 300;
    }



    return (
        <SectionBox className={"doggo " +props.name} x={x} y={y} zOffset={props.zOffset} width={size} height={size} delay={delay} depthInfo={props.depthInfo} onClick={()=>{
            setDoggoBig(!doggoBig);
        }}>
            <img style={{transition:"all 0.5s ease-in-out", transitionDelay:delay+"s", cursor:"pointer"}} src={props.url} alt={props.name} width={size-20} height={size-20}/>
        </SectionBox>
    );
}
