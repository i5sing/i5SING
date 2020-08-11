import * as React from 'react';
import { Route } from "react-router";
import { Channels } from "./Channels";
import { CoreModule } from "../core";

export class ChannelModule extends React.Component {
    render() {
        return <CoreModule>
            <Route exact={true} component={Channels}/>
        </CoreModule>
    }
}
