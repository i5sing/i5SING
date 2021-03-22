import * as React from 'react';
import { PlayList } from "./play-list.container";
import { Route } from 'react-router-dom';
import { PlayDetail } from "./play-detail.container";
import { CoreModule } from "../core";

export class PlayModule extends React.Component {
    render() {
        return <CoreModule>
            <Route exact={true} path="/plays" component={PlayList} children={props => <div
                style={{ display: props.location.pathname === '/plays' ? 'block' : 'none' }}>
                <PlayList {...props}/>
            </div>}/>
            <Route exact={true} path="/plays/:playId" component={PlayDetail}/>
        </CoreModule>;
    }
}
