import './Loader.scss';

export interface ILoaderProps {
    show:boolean;
}

export default function Loader (props: ILoaderProps) {
    const cn:string = "loader "+(props.show?"show":"");
    return (
        <div className={cn}>
            <div/>
            <div/>
            <div/>
            <div/>
        </div>
    );
}