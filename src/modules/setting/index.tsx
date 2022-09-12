import * as React from 'react';
import { Route } from "react-router";
import { Setting } from "./settings.container";
import { CoreModule } from "../core";

export const SettingModule = () => (
    <CoreModule>
        <Route exact={true} path="/settings" component={Setting}/>
    </CoreModule>
)
