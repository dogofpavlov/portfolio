import React, {useEffect, useState} from 'react';

import './App.scss';

import { HashRouter, Route, Routes } from 'react-router-dom';

import Home from './sections/Home';
import About from './sections/About';
import World from './World';
import { useTheme } from './context/ThemeContext';

import ChangeTheme from './ui/ChangeTheme';
import Navigation from './ui/Navigation';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Contact from './sections/Contact';


export interface IAppProps {

}

export default function App ($props: IAppProps) {
    return (
        <World>
            <HashRouter>
                <Routes>
                    <Route path="*" element={<Sections/>}  />
                </Routes>
            </HashRouter>
        </World>
    );
}


export interface ISectionsProps {

}


export function Sections ($props: ISectionsProps) {

    const [ready, setReady] = useState<boolean>(false)

    const {isThemeLoaded} = useTheme();

    useEffect(()=>{
        if(!ready){
            window.setTimeout(()=>{
                setReady(true);
            },1500);
        }
    },[isThemeLoaded]);

    return (
        <>
            <Home ready={ready}/>
            <About ready={ready}/>
            <Skills ready={ready}/>
            <Projects ready={ready}/>
            <Contact ready={ready}/>
            <ChangeTheme ready={ready}/>
            <Navigation ready={ready}/>
        </>
    );
}

