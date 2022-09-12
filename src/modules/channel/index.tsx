import * as React from 'react';
import { Route } from "react-router";
import { Channels } from "./channels.container";
import { CoreModule } from "../core";

export const ChannelModule = () => (
    <CoreModule>
        <Route exact={true} component={Channels}/>
    </CoreModule>
)
