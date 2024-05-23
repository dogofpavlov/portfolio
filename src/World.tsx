
import useMousePosition from './hooks/useMousePosition';
import { useTheme } from './context/ThemeContext';

import PinholeReveal from './ui/PinholeReveal';
import { StageSizeProvider } from './context/StageSizeContext';
import useWorldControl from './context/WorldControlContext';


export interface IWorldProps extends React.PropsWithChildren{

}

export default function World (props: IWorldProps) {

    const {isViewingDetail, stageTop} = useWorldControl();


    const mousePosition = useMousePosition();

    const mouseX = isViewingDetail?0:mousePosition.x;
    const mouseY = isViewingDetail?0:mousePosition.y;


    const rotationX = isViewingDetail?0:(5*mouseY-8);
    const rotationY = 10*mouseX;
    const skyPositionX = 50+mouseX*50;
    const worldRotation = -mouseX*0.5;
    const worldVerticalBuffer = 10;
    const verticalMovement = 2*mouseY;

    const skyHeight = 53.62;
    const skyTop = -worldVerticalBuffer+verticalMovement;
    const skyPercent = skyHeight+worldVerticalBuffer;
    const groundTop = skyHeight+verticalMovement;
    const groundPercent = 100-skyPercent+worldVerticalBuffer+(worldVerticalBuffer/2)-verticalMovement;

    const {theme} = useTheme();


    return (
        <StageSizeProvider>
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
                    top:`${stageTop}%`,
                    transform:`rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                }}>
                    {props.children}
                </div>
            </div>
            <PinholeReveal/>
        </StageSizeProvider>
    );
}
