import * as React from 'react';
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Routes } from "../index";
import { Footer } from "./Footer";
import { Event } from './Event';
import { Initial } from "./Initial";
import { ContextMenu } from "./ContextMenu";

export class CoreModule extends React.Component {
    render() {
        return <div>
            <Header/>
            <Sidebar/>
            <main><Routes/></main>
            <Footer/>
            <Initial/>
            <Event/>
            <ContextMenu/>
        </div>
    }
}
