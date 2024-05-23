import * as React from 'react';
import './TintIcon.scss';

export interface ITintIconProps {
    src:string;
}

export default function TintIcon (props: ITintIconProps) {
    return (
        <div className='tintIcon' style={{maskImage:`url('${props.src}')`}}>
        
        </div>
    );
}
