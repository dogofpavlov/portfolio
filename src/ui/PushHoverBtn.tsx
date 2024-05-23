import * as React from 'react';
import PushHover from './PushHover';
import './PushHoverBtn.scss';

export interface IPushHoverBtnProps extends React.PropsWithChildren{
    direction:"left" | "right" | string;
}

PushHoverBtn.DIRECTION_LEFT = "left";
PushHoverBtn.DIRECTION_RIGHT = "right";

export default function PushHoverBtn (props: IPushHoverBtnProps) {

    let cn:string = "pushHoverBtn "+props.direction;
    
    return (
        <PushHover className={cn}>
            <div className="push">
                {props.children}
            </div>
            {props.children}
        </PushHover>
    );
}