import * as React from 'react';
import { Route } from "react-router";
import { Channels } from "./Channels";

export class ChannelModule extends React.Component {
    render() {
        return <div>
            <Route exact={ true } component={ Channels }/>
        </div>
    }
}
