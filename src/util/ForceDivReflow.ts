export default function forceDivReflow($element:HTMLDivElement | undefined){
    if($element){
        let display = $element.style.display;
        $element.style.display = "none";
        $element.offsetHeight;//Access the offsetHeight forces the reflow
        $element.style.display = display;
    }
}