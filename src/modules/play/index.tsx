import * as React from 'react';
import { PlayList } from "./PlayList";
import { Route } from 'react-router-dom';
import { PlayDetail } from "./PlayDetail";
import { CoreModule } from "../core";

export class PlayModule extends React.Component {
    render() {
        return <CoreModule>
            <Route exact={true} path="/plays" component={PlayList}/>
            <Route exact={true} path="/plays/:playId" component={PlayDetail}/>
        </CoreModule>;
    }
}
