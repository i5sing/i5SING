declare module '*.less' {
    const content: any;
    export = content;
}

declare module '*.svg' {
    const content: any;
    export = content;
}

declare module '*.png' {
    const content: any;
    export = content;
}

declare module '*.module.less' {
    const classes: { [key: string]: string };
    export default classes;
}

declare var MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare var LOGIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
declare var MAIN_WINDOW_WEBPACK_ENTRY: string;
declare var LOGIN_WINDOW_WEBPACK_ENTRY: string;
declare var mobShare: any;
