import * as React from 'react';
import { Route } from "react-router";
import { Setting } from "./Setting";
import { CoreModule } from "../core";

export class SettingModule extends React.Component {
    render() {
        return <CoreModule>
            <Route exact={true} path="/settings" component={Setting}/>
        </CoreModule>;
    }
}
