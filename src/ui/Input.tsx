import { ChangeEvent, ChangeEventHandler } from "react";
import './Input.scss';

export interface IInputProps {
    name?:string;
    label?:string;
    value?:string;
    onChange?:($value:string, $name:string)=>void;
    type?:"text" | "textarea" | "submit";
    placeholder?:string;
    error?:boolean;
}

export default function Input (props: IInputProps) {


    let type = props.type || "text";

    let cn:string = "input";
    if(props.error){
        cn+=" error";
    }

    return (
        <div className={cn}>
            {type==="textarea" && (
                <textarea placeholder={props.placeholder} className="inputElement" name={props.name} value={props.value} onChange={($event:ChangeEvent<HTMLTextAreaElement>)=>{
                    if(props.onChange && props.name){
                        props.onChange($event.target.value, props.name);
                    }
                }}/>
            )}
            {type==="text" && (
                <input placeholder={props.placeholder} className="inputElement" name={props.name} type={type} value={props.value} onChange={($event:ChangeEvent<HTMLInputElement>)=>{
                    if(props.onChange && props.name){
                        props.onChange($event.target.value, props.name);
                    }
                }}/>
            )}
            {type==="submit" && (
                <button className="inputElement themeBtn" type={type}>
                    {props.label}
                </button>
            )}
        </div>
    );
}
