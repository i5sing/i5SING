import * as React from 'react';
import { Route } from 'react-router-dom';
import { Discovery } from "./Discovery";
import { WebView } from "./WebView";

export class DiscoveryModule extends React.Component {
    render() {
        return <div>
            <Route path="/discoveries" exact={ true } component={ Discovery }/>
            <Route path="/discoveries/webview" exact={ true } component={ WebView }/>
        </div>;
    }
}
