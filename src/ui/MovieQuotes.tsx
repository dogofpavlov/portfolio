
import { QUOTE_LINE_BREAK, useTheme } from '../context/ThemeContext';
import SectionBox from '../SectionBox';
import { IDepthInfo } from '../hooks/useDepth';
import './MovieQuotes.scss';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { gsap } from "gsap/gsap-core";


export interface IMovieQuotesProps {
    depthInfo:IDepthInfo;
}

export default function MovieQuotes (props: IMovieQuotesProps) {


    const [quoteIndex, setQuoteIndex] = useState<number>(0);

    const divQuoteSize = useRef<HTMLDivElement>(null);

    const [canPlayQuotes, setCanPlayQuotes] = useState<boolean>(true);
    
    const [quoteWidth, setQuoteWidth] = useState<number>(0);
    const {theme} = useTheme();
    const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    const themeQuote = theme.quotes[quoteIndex];

    const timeoutDelayID = useRef<number>(-1);

    wordRefs.current = [];


    const nextQuote = ()=>{
        setQuoteIndex(($prev)=>{
            let nextIndex = $prev+1;
            if(nextIndex===theme.quotes.length){
                nextIndex = 0;
            }
            return nextIndex;
        });
    }
    const clearTimeline = ()=>{        
        if(timelineRef.current){
            timelineRef.current.kill();
        }
        
        if(timeoutDelayID.current){
            window.clearTimeout(timeoutDelayID.current);
        }
    }

    
    useEffect(()=>{
        clearTimeline();
        setQuoteIndex(0);
    },[theme]);
    

    const hideWords=()=>{

        if(wordRefs.current){

            timelineRef.current = gsap.timeline({});
            timelineRef.current.to(
                wordRefs.current,
                {opacity:0, y:50, filter:"blur(10px)", delay:0, duration:1, stagger:0.1}
            );
        }

    }

    useEffect(()=>{

        if(canPlayQuotes){

            clearTimeline();

            if(divQuoteSize.current){
                divQuoteSize.current.style.display="block";
                setQuoteWidth(divQuoteSize.current.clientWidth+30);
                divQuoteSize.current.style.display="none";
            }


            if(timelineRef.current){
                timelineRef.current.kill();
            }


            timelineRef.current = gsap.timeline({delay:3, onComplete:nextQuote});
            if(wordRefs.current && wordRefs.current.length>0){
                
                wordRefs.current.forEach(($wordRef, $wordIndex)=>{
                    if($wordRef){
                        
                        const {timeOffset, word} = themeQuote.words[$wordIndex];
    
                        if(word!==QUOTE_LINE_BREAK){
    
                            let position:number = -.6;
                            if(timeOffset){
                                position = position+(timeOffset/1000);
                            }
                            let strPosition:string = "";
                            if(position<0){
                                strPosition = "-="+Math.abs(position);
                            }else{
                                strPosition = "+="+position;
                            }
    
                            timelineRef.current!.to(
                                $wordRef,
                                {opacity:1, y:0, filter:"blur(0px)", duration:1},
                                strPosition
                            );
                        }

                    }
                });
                
                
                
                timelineRef.current.to(
                    wordRefs.current,
                    {opacity:0, y:50, filter:"blur(10px)", delay:3, duration:3, stagger:0.1}
                );
            }
            

        }else{
            hideWords();
        }


        return ()=>{
            clearTimeline();
        }

    },[themeQuote, canPlayQuotes]);


    useEffect(()=>{
        if(props.depthInfo.isExactActive){
            if(!canPlayQuotes){
                setCanPlayQuotes(true);
            }
        }else{
            if(canPlayQuotes){
                setCanPlayQuotes(false);
            }
        }
    },[props.depthInfo.isExactActive]);






    return (
        <SectionBox className="movieQuotes" noStyle depthInfo={props.depthInfo} width={quoteWidth} zOffset={100} height={60} x={0} y={50}>
            <div className="quoteSize" ref={divQuoteSize}>{themeQuote.fullQuote}</div>
            <div className="quotesContainer">
                {themeQuote.words.map(($word,$index)=>{
                    let word = $word.word;

                    let key = $word.word+theme.id+"-"+quoteIndex+$index;

                    if(word===QUOTE_LINE_BREAK){
                        return (
                            <div className='newLine' key={key}  ref={(el)=>{
                                if(el){
                                    wordRefs.current.push(el);
                                }
                            }}/>
                        );
                    }
                    return (
                        <div key={key} style={{opacity:0, transform:"translate(0,-50px)", filter:"blur(10px)"}} className="movieQuoteWord" ref={(el)=>{
                            if(el){
                                wordRefs.current.push(el);
                            }
                        }}>
                            {word}
                            {$index !== themeQuote.words.length - 1 && <>&nbsp;</>}
                        </div>
                    );
                })}
            </div>
        </SectionBox>
    );
}
