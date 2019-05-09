import * as React from 'react';
import { Route } from 'react-router-dom';
import { CloudSongs } from "./CloudSongs";

export class CloudModule extends React.Component {
    render() {
        return <div>
            <Route path="/clouds" exact={ true } component={ CloudSongs }/>
        </div>;
    }
}
