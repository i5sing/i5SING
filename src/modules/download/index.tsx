import * as React from 'react';
import { Route } from 'react-router-dom';
import { DownloadManage } from "./DownloadManage";

export class DownloadModule extends React.Component {
    render() {
        return <div>
            <Route path="/downloads" exact={ true } component={ DownloadManage }/>

        </div>;
    }
}
