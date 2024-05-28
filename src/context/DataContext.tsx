import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import Api from "../api/Api";
import Box from "../Box";
import Projects from "../sections/Projects";


export interface IProject{
    id:string;
    name:string;
    desc:string;
    client:string;
    scope:string;
    tech:string;
    link:string;
    type:IProjectType;
    latest:boolean;
}

export interface IProjectType{
    id:string;
    label:string;
    project:IProject[];
}

export interface IProjects{
    projects:{
        projectType:IProjectType[];
        all:IProject[];
        latest:IProject[];
    }
}

interface DataContextType{
    dataProjectsTypes:IProjectType[];
    dataAllProjects:IProject[];
    dataLatestProjects:IProject[];
    getProjectPath:($id:string)=>string;

}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface IDataProviderProps extends PropsWithChildren{

}

const DataProvider = (props:IDataProviderProps)=>{

    const [dataProjects, setDataProjects] = useState<IProjects>();
    const [dataError, setDataError] = useState<string>();

    useEffect(()=>{
        const loadInitialThings = async ()=>{

            try{
                const config = await Api.getProjects();
             

                
                setDataProjects(config);
            }catch(error:any){
                setDataError(error.message);
            }
        }
        loadInitialThings();

    },[]);


    const width = 350;
    const height = 40;

    if(dataError){
        return (
            <Box 
                contentHeight={height}
                contentWidth={width}
                opacity={1} 
                contentOpacity={1}
                delay={0}
                height={height} 
                width={width} 
                x={0} 
                y={100} 
                z={0}
            >
                <div style={{textAlign:"center"}}>
                    {dataError}
                </div>
            </Box>
        )
    }
    if(!dataProjects){
        return null;
    }

    const getProjectPath=($id:string)=>{
        const project = dataProjects.projects.all.find(($project)=>{
            return $project.id===$id;
        });
        
        let path:string = "";
        if(project){
            path = Projects.PATH+project.type.id+"/"+project.id;
        }
        return path;
    }

    return (
        <DataContext.Provider value={{dataProjectsTypes:dataProjects.projects.projectType, dataAllProjects:dataProjects.projects.all, dataLatestProjects:dataProjects.projects.latest, getProjectPath}}>
            {props.children}
        </DataContext.Provider>
    )
}

export {DataProvider}

export const useProjectData = ():DataContextType=>{
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error("WTF are you doing?");
    }
    return context;
}

