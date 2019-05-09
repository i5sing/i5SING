import * as React from 'react';
import { Route } from "react-router";
import { Setting } from "./Setting";

export class SettingModule extends React.Component {
    render() {
        return <div>
            <Route exact={ true } path="/settings" component={ Setting }/>
        </div>;
    }
}
