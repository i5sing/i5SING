import * as React from 'react';
import { Route } from 'react-router-dom';
import { TopDetail } from "./TopDetail";
import { Tops } from "./Tops";
import { StyleTopDetail } from "./StyleTopDetail";

export class TopModule extends React.Component {
    render() {
        return <div>
            <Route path="/tops/:topId" exact={ true } component={ TopDetail }/>
            <Route path="/tops/style/:topId" exact={ true } component={ StyleTopDetail }/>
            <Route path="/tops" exact={ true } component={ Tops }/>

        </div>;
    }
}
