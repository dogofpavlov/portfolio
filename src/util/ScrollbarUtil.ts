const changeScrollbarColor = (color: string) => {
    const styleId = 'dynamic-scrollbar-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    styleElement.innerHTML = `

        ::-webkit-scrollbar-thumb {
            background-color: ${color};
        }

        /* For Firefox */
        body {
            scrollbar-color: ${color} transparent;
        }
    `;
};

export {changeScrollbarColor};