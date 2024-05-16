import { useNavigate } from "react-router-dom";
import { useDepth } from "../hooks/useDepth";
import { ISectionProps, SectionFunction } from "../types/Section";
import { useTheme } from "../context/ThemeContext";
import SectionBox from "../SectionBox";



interface IContactProps extends ISectionProps{

}

const Contact:SectionFunction = ({ready}:IContactProps)=>{

    const depthInfo = useDepth(Contact,ready);
    const navigate = useNavigate();
    const {theme} = useTheme();

    const boxClick=()=>{
        if(!depthInfo.isDepthCurrent){
        //    navigate(Home.PATH);
        }
    }

    //1600
    return (
        <>
            <SectionBox horCenter verCenter x={-395} y={400} depthInfo={depthInfo} className={"welcome"} width={410} height={90} onClick={boxClick}>
                contact
            </SectionBox>
        </>
    )
}
Contact.PATH = "/contact/";
Contact.DEPTH = 1;
Contact.ID = "contact";
export default Contact;