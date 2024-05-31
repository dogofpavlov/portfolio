
import useMousePosition from './hooks/useMousePosition';
import { useTheme } from './context/ThemeContext';

import PinholeReveal from './ui/PinholeReveal';
import { StageSizeProvider } from './context/StageSizeContext';
import useWorldControl from './context/WorldControlContext';
import useResize from './context/ResizeContext';
import BrowserUtil from './util/BrowserUtil';


export interface IWorldProps extends React.PropsWithChildren{

}

export default function World (props: IWorldProps) {

    const {disable3D, resizeId} = useResize();

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



    let styleTransition:React.CSSProperties = {};
    let canEaseTransition:boolean=true;
    if(BrowserUtil.isSafari){//safari is really weird so no transition for you  ¯\_(ツ)_/¯
        canEaseTransition=false;
    }
    if(canEaseTransition){
        styleTransition.transition = "all 0.5s ease-out";
    }


    let stageStyle:React.CSSProperties = {
        top:`${stageTop}%`,
        transform:`rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
        ...styleTransition
    }
    let appCN:string = "App";
    
    if(disable3D){
        stageStyle = {};
        appCN+=" disabled3D";
    }else{
        appCN+=" can3D";
    }


    

    return (
        <>
            <div className={appCN} style={{backgroundColor:theme.bgColor}}>
                <div className="sky" style={{
                    backgroundImage:`url('./theme/${theme.id}/sky.jpg')`, 
                    backgroundPosition:`${skyPositionX}% 0`, 
                    transform:`translate(-50%, 0) rotate(${worldRotation}deg)`,
                    top:`calc(${skyTop}% + 1px)`,
                    height:`${skyPercent}%`,
                    ...styleTransition
                    
                }}/>
                <div className="ground" style={{
                    backgroundImage:`url('./theme/${theme.id}/ground.jpg')`, 
                    transform:`translate(-50%, 0) rotate(${worldRotation}deg)`,
                    top:`${groundTop}%`,
                    backgroundPosition:`${skyPositionX}% 0`, 
                    height:`${groundPercent}%`,
                    ...styleTransition
                }}/>
                <div className="stage" style={stageStyle}>
                    {props.children}
                </div>
            </div>
            <PinholeReveal/>
        </>
    );
}
