import * as React from 'react';
import { Route } from 'react-router-dom';
import { CloudSongs } from "./CloudSongs";
import { CoreModule } from "../core";

export class CloudModule extends React.Component {
    render() {
        return <CoreModule>
            <Route path="/clouds" exact={true} component={CloudSongs}/>
        </CoreModule>;
    }
}
