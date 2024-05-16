import { useLocation } from "react-router-dom";
import { SectionFunction } from "../types/Section";



export interface IDepthInfo{
    depth:number;
    isActive:boolean;
    activeDepth:number;
    isDepthCurrent:boolean;
}

export function useDepth($section:SectionFunction, $ready:boolean):IDepthInfo{
    const location = useLocation();

    const endsWithSlash = location.pathname.endsWith("/");

    const path = location.pathname+(endsWithSlash?"":"/");

    const pathSplit = path.split("/");

    const activeDepth = pathSplit.length-2;


    let depth = activeDepth-$section.DEPTH;

    if(depth<-1){
        depth = -1;
    }
    let isActive:boolean = $ready && path.includes($section.PATH);

    let isDepthCurrent:boolean = activeDepth===$section.DEPTH;

    return {depth, isActive, activeDepth, isDepthCurrent}
}