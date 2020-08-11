import * as React from 'react';
import { Redirect, Route } from "react-router";
import { MusicianDetail } from "./musician-detail.container";
import { CoreModule } from "../core";

export class MusicianModule extends React.Component {
    render() {
        return <CoreModule>
            <Route exact={true} path="/musicians/:musicianId"
                   component={(props) => <Redirect
                       to={`/musicians/${props.match.params.musicianId}/yc`}/>}/>
            <Route exact={true} path="/musicians/:musicianId/:type" component={MusicianDetail}/>
        </CoreModule>
    }
}
