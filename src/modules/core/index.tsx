import * as React from 'react';
import { Sidebar } from "./sidebar.container";
import { Header } from "./header.container";

export interface CoreModuleProps {
    type?: 'normal' | 'full' | 'no_footer' | 'no_side';
}

export class CoreModule extends React.Component<CoreModuleProps> {
    render() {
        const { type } = this.props;
        switch (type) {
            case 'full':
                return <div>
                    <Header noSide={true}/>
                    <main>{this.props.children}</main>
                </div>
            case 'no_footer':
                return <div>
                    <Header/>
                    <Sidebar noFooter={true}/>
                    <main>{this.props.children}</main>
                </div>;
            case 'no_side':
                return <div>
                    <Header/>
                    <main>{this.props.children}</main>
                </div>;
            case 'normal':
            default:
                return <div>
                    <Header/>
                    <Sidebar/>
                    <main>{this.props.children}</main>
                </div>
        }

    }
}
