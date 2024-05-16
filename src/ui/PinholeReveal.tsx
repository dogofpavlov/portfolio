import * as React from 'react';
import './PinholeReveal.scss';
export interface IPinholeRevealProps extends React.PropsWithChildren{
    open:boolean;
}


export const PinholeRevealDuration = 1;

export default function PinholeReveal (props: IPinholeRevealProps) {


    let cn:string = "pinholeReveal";
    if(props.open){
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
                {props.children}
            </div>
        </>
    );
}
