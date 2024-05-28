
import { NavLink } from 'react-router-dom';
import Home from '../sections/Home';
import About from '../sections/About';
import Box from '../Box';
import './Navigation.scss';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import { useDepthPath } from '../hooks/useDepth';
import useStageSize from '../context/StageSizeContext';
import Links from '../sections/Links';
import useResize from '../context/ResizeContext';
import { useState } from 'react';

export interface INavigationProps {
    ready:boolean;
}

export default function Navigation (props: INavigationProps) {


    const fullWidth = 650;
    const fullHeight = 70;


    const width = props.ready?fullWidth:50;
    const height = props.ready?fullHeight:0;

    const {rightX} = useStageSize();
    const {activeDepth} = useDepthPath();

    let x = rightX-(width/2);
    let y = props.ready?400:0;

    if(activeDepth===0){
        x = 0;
        y = 120;
    }

    if(x<0){
        x = 0;
    }



    const zOffset = activeDepth===3?-10:50;


    const resize = useResize();

    let onNavClick:(($event:React.MouseEvent<HTMLAnchorElement>)=>void) | undefined = undefined;

    let cn:string = "navigation";

    let mobileToggleCN:string = "mobileNavToggle";

    if(resize.disable3D && resize.mobileNavVisible){
        cn+=" mobileShow";
        mobileToggleCN+=" mobileShow";
        onNavClick = ($event:React.MouseEvent<HTMLAnchorElement>)=>{
            resize.setMobileNavVisible(false);
        }
    }



    return (
        <>
            {resize.disable3D && (
                <div className={mobileToggleCN} onClick={()=>{
                    resize.setMobileNavVisible(!resize.mobileNavVisible);
                }}>
                    <div/>
                </div>
            )}
            <Box 
                contentHeight={height}
                contentWidth={width}
                opacity={props.ready?1:0} 
                contentOpacity={1}
                delay={0.15}
                className={cn} 
                height={height} 
                width={width} 
                x={x} 
                y={y} 
                z={zOffset}
            >
                    
                <NavLink to={Home.PATH} onClick={onNavClick}>Home</NavLink>
                <NavLink to={About.PATH} onClick={onNavClick}>About</NavLink>
                <NavLink to={Projects.PATH} onClick={onNavClick}>Projects</NavLink>
                <NavLink to={Contact.PATH} onClick={onNavClick}>Contact</NavLink>
                <NavLink to={Links.PATH} onClick={onNavClick}>Links</NavLink>
                <NavLink to={"http://ryancaillouet.com/my-resume.pdf"} target='_blank'>My Resume</NavLink>
            </Box>
        </>
    );
}
