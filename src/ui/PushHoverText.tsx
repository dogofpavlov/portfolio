import * as React from 'react';
import PushHover from './PushHover';
import './PushHoverText.scss';

export interface IPushHoverTextProps extends React.PropsWithChildren{
    className?:string;
}

export default function PushHoverText (props: IPushHoverTextProps) {

    let cn:string = "pushHoverText";
    if(props.className){
        cn+=" "+props.className;
    }
    return (
        <PushHover className={cn}>
            <div className="colored">
                {props.children}
            </div>
            <div className="text">
                {props.children}
            </div>
        </PushHover>
    );
}
