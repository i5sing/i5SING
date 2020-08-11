import * as React from 'react';
import { Route } from "react-router";
import { Search } from "./Search";
import { CoreModule } from "../core";

export class SearchModule extends React.Component {
    render() {
        return <CoreModule>
            <Route exact={true} path="/search/:type/:id" component={Search}/>
        </CoreModule>;
    }
}
