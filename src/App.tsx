import React, {useEffect, useState} from 'react';

import './App.scss';

import { HashRouter, Route, Routes } from 'react-router-dom';

import Home from './sections/Home';
import About from './sections/About';
import World from './World';
import { ThemeProvider, useTheme } from './context/ThemeContext';

import ChangeTheme from './ui/ChangeTheme';
import Navigation from './ui/Navigation';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Contact from './sections/Contact';
import ProjectTypes from './sections/ProjectTypes';
import ProjectDetails from './sections/ProjectDetails';
import Links from './sections/Links';

import { DataProvider } from './context/DataContext';
import { WorldControlProvider } from './context/WorldControlContext';
import { ResizeProvider } from './context/ResizeContext';
import { LocalStorageProvider } from './context/LocalStorageContext';
import { StageSizeProvider } from './context/StageSizeContext';


export interface IAppProps {

}

export default function App ($props: IAppProps) {
    return (
        <LocalStorageProvider>
            <ThemeProvider>
                <ResizeProvider>
                    <StageSizeProvider>
                        <WorldControlProvider>
                            <World>
                                <DataProvider>
                                    <HashRouter>
                                        <Routes>
                                            <Route path="*" element={<Sections/>}  />
                                        </Routes>
                                    </HashRouter>
                                </DataProvider>
                            </World>
                        </WorldControlProvider>
                    </StageSizeProvider>
                </ResizeProvider>
            </ThemeProvider>
        </LocalStorageProvider>
    );
}


export interface ISectionsProps {

}


export function Sections ($props: ISectionsProps) {

    const [ready, setReady] = useState<boolean>(false);

    const {isThemeLoaded} = useTheme();

    useEffect(()=>{
        if(!ready && isThemeLoaded){
            window.setTimeout(()=>{
                setReady(true);
            },1000);
        }
    },[isThemeLoaded]);

    return (
        <>
            <ChangeTheme ready={ready}/>
            <Navigation ready={ready}/>
            <Home ready={ready}/>
            <About ready={ready}/>
            <Skills ready={ready}/>
            <Links ready={ready}/>
            <Projects ready={ready}/>
            <ProjectTypes ready={ready}/>
            <ProjectDetails ready={ready}/>
            <Contact ready={ready}/>
        </>
    );
}

