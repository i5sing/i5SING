import * as React from 'react';
import { Route } from 'react-router-dom';
import { Discovery } from "./Discovery";
import { WebView } from "./WebView";
import { CoreModule } from "../core";

export class DiscoveryModule extends React.Component {
    render() {
        return <CoreModule>
            <Route path="/discoveries" exact={true} component={Discovery}/>
            <Route path="/discoveries/webview" exact={true} component={WebView}/>
        </CoreModule>;
    }
}
