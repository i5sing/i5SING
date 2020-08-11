import * as React from 'react';
import { Route } from 'react-router-dom';
import { DownloadManage } from "./DownloadManage";
import { CoreModule } from "../core";

export class DownloadModule extends React.Component {
    render() {
        return <CoreModule>
            <Route path="/downloads" exact={true} component={DownloadManage}/>
        </CoreModule>;
    }
}
