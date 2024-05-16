import * as React from 'react';

export interface IThemeSpanProps extends React.PropsWithChildren{
    style?:React.CSSProperties;
    className?:string;
}

export default function ThemeSpan (props: IThemeSpanProps) {
    
    let cn:string = "theme";
    if(props.className){
        cn+=" "+props.className;
    }
    return (
        <span className={cn} style={props.style}>{props.children}</span>
    );
}
