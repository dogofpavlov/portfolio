import { IProject, IProjectType, IProjects } from "../context/DataContext";
import XMLUtil from "../util/XMLUtil";



class ApiManager{

    async getProjects():Promise<IProjects> {
        try {
            let strConfigURL: string = "./projects.xml?t=" + Date.now();

            const response = await this.fetchAsync(
                strConfigURL,
                "GET"
            );

            if (response !== "") {
                let objResponse:IProjects = XMLUtil.parseStringXMLToObj(response);
                
                //let's create a flat list as well and a shortcut to the type
                objResponse.projects.all = objResponse.projects.projectType.reduce(($prev:IProject[], $current:IProjectType)=>{
                    $current.project.forEach(($project)=>{
                        $project.type = $current;//shortcut to type
                        $prev.push($project);
                    });
                    return $prev;
                },[]);

                return objResponse;

            } else {
                throw new Error("Failed to Load Config1");
            }
        } catch ($error:any) {
            throw new Error($error.message);
        }
    }

    async fetchAsync($url: string, $method: string = "POST", $data?:any, $jsonFormat?:boolean){
        
        let reqInit: RequestInit = {
            method: $method,
        };
        if($jsonFormat){
            reqInit.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        }
        if ($data) {
            reqInit.body = $data;
        }

        try {
            const response: Response = await fetch($url, reqInit);

            if(!response.ok){
                throw new Error("HTTP Error!");
            }

            if($jsonFormat){
                return await response.json();
            }else{
                return await response.text();
            }

        } catch ($error) {
            throw new Error("Error loading: " + $url);
        }
    }

}

const Api:ApiManager = new ApiManager();
export default Api;