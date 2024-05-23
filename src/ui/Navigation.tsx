import * as React from 'react';
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

export interface INavigationProps {
    ready:boolean;
}

export default function Navigation (props: INavigationProps) {

    const width = props.ready?650:50;
    const height = props.ready?70:0;

    const {rightX} = useStageSize();

    const x = rightX-(width/2);
    const y = props.ready?400:0;

    const {activeDepth} = useDepthPath();

    const zOffset = activeDepth===3?-10:50;

    return (
        
        <Box 
            contentHeight={height}
            contentWidth={width}
            opacity={props.ready?1:0} 
            contentOpacity={1}
            delay={0.15}
            className='navigation' 
            height={height} 
            width={width} 
            x={x} 
            y={y} 
            z={zOffset}
        >
                
            <NavLink to={Home.PATH}>Home</NavLink>
            <NavLink to={About.PATH}>About</NavLink>
            <NavLink to={Projects.PATH}>Projects</NavLink>
            <NavLink to={Contact.PATH}>Contact</NavLink>
            <NavLink to={Links.PATH}>Links</NavLink>
            <NavLink to={"http://ryancaillouet.com/my-resume.pdf"} target='_blank'>My Resume</NavLink>
        </Box>
    );
}
