import * as React from 'react';
import { NavLink } from 'react-router-dom';
import Home from '../sections/Home';
import About from '../sections/About';
import Box from '../Box';
import './Navigation.scss';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

export interface INavigationProps {
    ready:boolean;
}

export default function Navigation (props: INavigationProps) {

    const width = props.ready?600:50;
    const height = props.ready?70:0;
    const x = 300;
    const y = props.ready?400:0;

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
            z={50}
        >
                
            <NavLink to={Home.PATH}>Home</NavLink>
            <NavLink to={About.PATH}>About</NavLink>
            <NavLink to={Projects.PATH}>Projects</NavLink>
            <NavLink to={Skills.PATH}>Skills</NavLink>
            <NavLink to={Contact.PATH}>Contact</NavLink>
            <NavLink to={About.PATH}>Links</NavLink>
        </Box>
    );
}
