export default class XMLUtil{

    private static _parser:DOMParser = new DOMParser();

    static parseStringXMLToObj($xml:string){
        let obj:any;

        try{
            let xml:XMLDocument = this._parser.parseFromString($xml,"text/xml");
            obj = this.parseXMLToObj(xml.documentElement);

        }catch($error){
            obj = null;
        }

        return obj;
    }

    /**
     * 
     * @param node this does say "HTMLElement" but its really an xml.documentElement
     */
    static parseXMLToObj(node:HTMLElement){
        let	data:{[key:string]:any} = {};

        

        // append a value
        function Add(name:any, value:any) {


            if(value==="true"){

                value = true;
            }
            if(value==="false"){

                value = false;
            }

            if (data[name]) {
                if (data[name].constructor !== Array) {
                    data[name] = [data[name]];
                }
                data[name][data[name].length] = value;
            }
            else {
                data[name] = value;
            }
        };
        
        // element attributes
        let c:number;
        let cn:any;
        
        //eslint-disable-next-line
        for (c = 0; cn = node.attributes[c]; c++) {
            Add(cn.name, cn.value);
        }
        
        // child elements
        
        //eslint-disable-next-line
        for (c = 0; cn = node.childNodes[c]; c++) {
            if (cn.nodeType === 1) {
                if (cn.childNodes.length === 1 && cn.firstChild!.nodeType === 3) {
                    // text value
                    let nodeValue = cn.firstChild!.nodeValue;

                    Add(cn.nodeName, nodeValue);
                }
                else {
                    // sub-object
                    Add(cn.nodeName, this.parseXMLToObj(cn));
                }
            }
        }
    
        return data;
    }

}