
import useMousePosition from './hooks/useMousePosition';
import { useTheme } from './context/ThemeContext';
import { useEffect, useState } from 'react';
import preloadImage from './util/PreloadImage';
import PinholeReveal from './ui/PinholeReveal';

export interface IWorldProps extends React.PropsWithChildren{

}

export default function World (props: IWorldProps) {



    const mousePosition = useMousePosition();
    const rotationX = 5*mousePosition.y-8;
    const rotationY = 10*mousePosition.x;
    const skyPositionX = 50+mousePosition.x*50;
    const worldRotation = -mousePosition.x*0.5;
    const worldVerticalBuffer = 10;
    const verticalMovement = 2*mousePosition.y;

    const skyHeight = 53.62;
    const skyTop = -worldVerticalBuffer+verticalMovement;
    const skyPercent = skyHeight+worldVerticalBuffer;
    const groundTop = skyHeight+verticalMovement;
    const groundPercent = 100-skyPercent+worldVerticalBuffer+(worldVerticalBuffer/2)-verticalMovement;

    const {theme, isPinholeOpen} = useTheme();





    return (
        <>
            <div className='App' style={{backgroundColor:theme.bgColor}}>
                <div className="sky" style={{
                    backgroundImage:`url('./theme/${theme.id}/sky.jpg')`, 
                    backgroundPosition:`${skyPositionX}% 0`, 
                    transform:`translate(-50%, 0) rotate(${worldRotation}deg)`,
                    top:`calc(${skyTop}% + 1px)`,
                    height:`${skyPercent}%`
                    
                }}/>
                <div className="ground" style={{
                    backgroundImage:`url('./theme/${theme.id}/ground.jpg')`, 
                    transform:`translate(-50%, 0) rotate(${worldRotation}deg)`,
                    top:`${groundTop}%`,
                    backgroundPosition:`${skyPositionX}% 0`, 
                    height:`${groundPercent}%`
                }}/>
                <div className="stage" style={{
                    transform:`rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                }}>
                    {props.children}
                </div>
            </div>
            <PinholeReveal open={isPinholeOpen}>
                <div className="themeLoading">
                    Loading Please Wait...
                </div>
            </PinholeReveal>
        </>
    );
}
