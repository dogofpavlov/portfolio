export type SectionFunction = {
    ID:string;
    PATH:string;
    DEPTH:number;
    ($props:ISectionProps):JSX.Element;
}

export interface ISectionProps{
    ready:boolean;   
}
