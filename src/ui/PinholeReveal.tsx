import * as React from 'react';
import './PinholeReveal.scss';
import Loader from './Loader';
import { useTheme } from '../context/ThemeContext';
export interface IPinholeRevealProps extends React.PropsWithChildren{
    
}


export const PinholeRevealDuration = 1;

export default function PinholeReveal (props: IPinholeRevealProps) {



    const {isPinholeOpen, isThemeLoaded} = useTheme();

    let cn:string = "pinholeReveal";
    if(isPinholeOpen){
        cn+=" open";
    }


    const style:React.CSSProperties = {
        transition:`all ${PinholeRevealDuration}s cubic-bezier( 1, 0, 0, 1 )`
    }


    return (
        <>
            <div className={cn}>
                <div className="left" style={style}/>
                <div className="right" style={style}/>
                <div className="themeLoading">
                    <Loader show={!isThemeLoaded}/>
                </div>
            </div>
        </>
    );
}
