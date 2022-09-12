import * as React from 'react';
import { Sidebar } from "./sidebar.container";
import { Header } from "./header.container";
import { ReactNode } from "react";

export interface CoreModuleProps {
    type?: 'normal' | 'full' | 'no_footer' | 'no_side';
    children: ReactNode
}

export const CoreModule = ({ children, type }: CoreModuleProps) => {
    switch (type) {
        case 'full':
            return <div>
                <Header noSide={true}/>
                <main>{children}</main>
            </div>
        case 'no_footer':
            return <div>
                <Header/>
                <Sidebar noFooter={true}/>
                <main>{children}</main>
            </div>;
        case 'no_side':
            return <div>
                <Header/>
                <main>{children}</main>
            </div>;
        case 'normal':
        default:
            return <div>
                <Header/>
                <Sidebar/>
                <main>{children}</main>
            </div>
    }
}
