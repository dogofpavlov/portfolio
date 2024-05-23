import { useNavigate } from "react-router-dom";
import { useDepth } from "../hooks/useDepth";
import { ISectionProps, SectionFunction } from "../types/Section";
import { useTheme } from "../context/ThemeContext";
import SectionBox from "../SectionBox";
import useStageSize from "../context/StageSizeContext";
import Input from "../ui/Input";
import { FormEvent, useState } from "react";
import './Contact.scss';
import ValidationUtil from "../util/ValidationUtil";
import Api from "../api/Api";
import Loader from "../ui/Loader";


interface IContactProps extends ISectionProps{

}

const Contact:SectionFunction = ({ready}:IContactProps)=>{

    const depthInfo = useDepth(Contact,ready);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionResult, setSubmissionResult] = useState<"success" | "error" | "">("");

    const [formState, setFormState] = useState({
        name:"",
        email:"",
        company:"", 
        clocation:"",
        phone:"",
        website:"",
        message:""
    });
    const [formError, setFormError] = useState({
        name:false,
        email:false,
        message:false,
    })

    const {totalWidth} = useStageSize();

    let actualWidth = Math.min(totalWidth, 1400);

    let leftX = -actualWidth/2;
    let rightX = actualWidth/2;

    let gap = 10;
    let leftWidth = Math.round((actualWidth-gap)*.35);
    let rightWidth = Math.round((actualWidth-gap)*.65);

    const onInputChange = ($value:string, $name:string)=>{

        let value = $value.trim();
        let isOk = value?true:false;
        switch($name){
            case "name":
            case "message":
                if(isOk){
                    setFormError({
                        ...formError,
                        [$name]:false
                    });
                }
            break;
            case "email":
                isOk = ValidationUtil.validateEmail(value);
                if(isOk){
                    setFormError({
                        ...formError,
                        [$name]:false
                    });
                }
            break;
        }

        setFormState({
            ...formState,
            [$name]:$value
        })
    }


    const onSubmit = async ($event:FormEvent)=>{
        $event.preventDefault();

        let nameOk = formState.name.trim()?true:false;
        let emailOk = formState.email.trim()?true:false;
        let messageOk = formState.message.trim()?true:false;

        if(!ValidationUtil.validateEmail(formState.email)){
            emailOk=false;
        }
        
        setFormError({
            name:!nameOk,
            email:!emailOk,
            message:!messageOk
        });

        if(nameOk && emailOk && messageOk){
            
            const urlParams = new URLSearchParams(formState);
            urlParams.append('responseType','json');

            const formDataToSend = urlParams.toString();
            

            setIsSubmitting(true);

            try{
                const response = await Api.fetchAsync("http://www.ryancaillouet.com/email.php","POST",formDataToSend,true);

                setIsSubmitting(false);
                if(response.success){
                    setSubmissionResult("success");
                }else{
                    setSubmissionResult("error");
                }
            }catch(error){
                setIsSubmitting(false);
                setSubmissionResult("error");
            }
        }

    }

    const resetForm = ()=>{
        setSubmissionResult("");
    }

    let contactFormSubmissionCN:string = "contactFormSubmission";
    if(isSubmitting || submissionResult!==""){
        contactFormSubmissionCN+=" hide";
    }

    let contactFormResultCN:string = "contactFormResult";
    if(isSubmitting || submissionResult===""){
        contactFormResultCN+=" hide";
    }

    return (
        <>
            <SectionBox padding zOffset={20} delay={0} x={leftX+(leftWidth/2)} y={50} width={leftWidth} height={300} depthInfo={depthInfo} className={"contactInfo"}>
                <h2>Contact Info</h2>
            </SectionBox>
            <SectionBox padding zOffset={70} delay={0.1} x={leftX+((leftWidth)/2)+15} y={85} width={leftWidth-40} height={200} depthInfo={depthInfo} className={"contactInfoDetails"}>
                <div className="contactInfoDetailsItem">
                    <div className="title">
                        Email
                    </div>
                    <div className="value">
                        <img src="./icon-email.png" alt="email"/>
                        <a href="mailto:wolfofpavlov@gmail.com">wolfofpavlov@gmail.com</a>
                    </div>
                </div>
                <div className="contactInfoDetailsItem">
                    <div className="title">
                        Location
                    </div>
                    <div className="value">
                        <img src="./icon-location.png" alt="location"/>
                        Georgia, USA
                    </div>
                </div>
            </SectionBox>
            <SectionBox padding zOffset={0} delay={.1} x={rightX-(rightWidth/2)} y={20} width={rightWidth} height={380} depthInfo={depthInfo} className={"contactForm"}>

                <div className={contactFormSubmissionCN}>
                    <h2>Contact Form</h2>
                    
                    <p>Fill out this simple form to contact me!</p>
                    <form onSubmit={onSubmit}>
                        <div>
                            <Input placeholder="Name" name="name" error={formError.name} onChange={onInputChange} value={formState.name} />
                            <Input placeholder="E-mail" name="email" error={formError.email} onChange={onInputChange} value={formState.email} />
                            <Input placeholder="Company" name="company" onChange={onInputChange} value={formState.company} />
                        </div>
                        <div>
                            <Input placeholder="Location" name="clocation" onChange={onInputChange} value={formState.clocation} />
                            <Input placeholder="Phone Number" name="phone" onChange={onInputChange} value={formState.phone} />
                            <Input placeholder="Website URL" name="website" onChange={onInputChange} value={formState.website} />                        
                        </div>
                        <div className="messageCol">
                            <Input placeholder="Message" name="message" error={formError.message} type="textarea" onChange={onInputChange} value={formState.message} />      
                            <Input type="submit" label="Submit"/>
                        </div>
                    </form>
                </div>
                <div className={contactFormResultCN}>
                    <h2>Thank you!</h2>
                    <p>I have recieved your message and will get back to you ASAP!</p>
                    <div className="tryAgain themeBtn" onClick={resetForm}>
                        Send Another Message?
                    </div>
                </div>
                <Loader show={isSubmitting}/>
            </SectionBox>
            
        </>
    )
}
Contact.PATH = "/contact/";
Contact.DEPTH = 1;
Contact.ID = "contact";
export default Contact;