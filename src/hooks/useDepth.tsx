import { useLocation } from "react-router-dom";
import { SectionFunction } from "../types/Section";



export interface IDepthInfo{
    depth:number;
    isActive:boolean;
    isExactActive:boolean;
    activeDepth:number;
    isDepthCurrent:boolean;
    sectionPath:string;
    pathSplit:string[];
}



export function useDepthPath():{path:string, activeDepth:number, pathSplit:string[]}{
    const location = useLocation();

    //make path uniform for exact comparisons
    const endsWithSlash = location.pathname.endsWith("/");
    const path = location.pathname+(endsWithSlash?"":"/");

    const pathSplit = path.split("/").filter(($part)=>{return $part});
    let activeDepth = pathSplit.length;
    if(activeDepth>3) activeDepth=3;
    

    return {path, activeDepth, pathSplit}

}


export function useDepth($section:SectionFunction, $ready:boolean, $sectionPathDetail?:string):IDepthInfo{
    
    const {activeDepth, path, pathSplit} = useDepthPath();

    let depth = activeDepth-$section.DEPTH;
    if(depth<-1) depth = -1;

    let sectionPath = $section.PATH;
    if($sectionPathDetail){
       // sectionPath+=$sectionPathDetail; //not sure I need this
    }
    
    let isActive:boolean = $ready && path.includes(sectionPath);
    let isExactActive:boolean = $ready && path===sectionPath;
    let isDepthCurrent:boolean = $ready && activeDepth===$section.DEPTH;

    return {depth, isActive, activeDepth, isDepthCurrent, isExactActive, sectionPath:sectionPath, pathSplit}
}