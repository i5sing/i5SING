import * as React from 'react';
import { PlayList } from "./PlayList";
import { Route } from 'react-router-dom';
import { PlayDetail } from "./PlayDetail";

export class PlayModule extends React.Component {
    render() {
        return <div>
            <Route exact={ true } path="/plays" component={ PlayList }/>
            <Route exact={ true } path="/plays/:playId" component={ PlayDetail }/>
        </div>;
    }
}
