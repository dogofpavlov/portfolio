import * as React from 'react';
import './PushHover.scss';

export interface IPushHoverProps extends React.PropsWithChildren{
    className?:string;

}

export default function PushHover (props: IPushHoverProps) {

    let cn:string = "pushHover";
    if(props.className){
        cn+=" "+props.className;
    }
    return (
        <div className={cn}>
            <div className="pushHoverInside">
                {props.children}
            </div>
        </div>
    );
}
