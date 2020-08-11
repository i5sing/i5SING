import * as React from 'react';
import { Playing } from "./playing.container";
import { Route } from 'react-router-dom';
import { CoreModule } from "../core";

export class PlayingModule extends React.Component {
    render() {
        return <CoreModule type="no_side">
            <Route exact={true} path="/playing" component={Playing}/>
        </CoreModule>;
    }
}
