import * as React from 'react';
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Event } from './Event';
import { Initial } from "./Initial";
import { ContextMenu } from "./ContextMenu";

export interface CoreModuleProps {
    type?: 'normal' | 'full' | 'no_footer';
}

export class CoreModule extends React.Component<CoreModuleProps> {
    render() {
        const { type } = this.props;
        switch (type) {
            case 'full':
                return <div>
                    <Header noSide={true}/>
                    <main>{this.props.children}</main>
                    <Initial/>
                    <Event/>
                    <ContextMenu/>
                </div>
            case 'no_footer':
                return <div>
                    <Header/>
                    <Sidebar noFooter={true}/>
                    <main>{this.props.children}</main>
                    <Initial/>
                    <Event/>
                    <ContextMenu/>
                </div>
            case 'normal':
            default:
                return <div>
                    <Header/>
                    <Sidebar/>
                    <main>{this.props.children}</main>
                    <Footer/>
                    <Initial/>
                    <Event/>
                    <ContextMenu/>
                </div>
        }

    }
}
