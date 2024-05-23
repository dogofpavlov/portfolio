import { useEffect, useRef, useState } from "react";
import PreloadImage from "../util/PreloadImage";
import './ImageReveal.scss';
import delay from "../util/Delay";

export interface IImageRevealProps {
    url:string;
    renderer?:($img:JSX.Element)=>JSX.Element;
    onComplete:()=>void;
    direction:string;
    alreadyLoaded:boolean;
}

ImageReveal.DIRECTION_LEFT = "left";
ImageReveal.DIRECTION_RIGHT = "right";

export default function ImageReveal (props: IImageRevealProps) {

    const [isLoaded, setIsLoaded] = useState<boolean>(props.alreadyLoaded);

    useEffect(()=>{
        let mounted:boolean=true;
        const loadImage = async ()=>{
            try{
                await PreloadImage(props.url);
                if(mounted){
                    await delay(1000);
                }                
                if(mounted){
                    setIsLoaded(true);
                    props.onComplete();
                }
            }catch($error){

            }
        }
        loadImage();

        return ()=>{
            mounted=false;
        }
    },[]);


    const defaultRenderer = ($img:JSX.Element)=>{
        return $img;
    }

    const renderer = props.renderer || defaultRenderer;

    return (
        <>
            {isLoaded && (                
                <div className={"imageReveal "+props.direction}>
                    <>
                        {renderer(<img src={props.url} alt={"Project Image"}/>)}
                    </>
                    <div className="cover"/>
                </div>
            )}
        </>
    );
}
