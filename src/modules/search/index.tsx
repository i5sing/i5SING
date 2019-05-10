import * as React from 'react';
import { Route } from "react-router";
import { Search } from "./Search";

export class SearchModule extends React.Component {
    render() {
        return <div>
            <Route exact={ true } path="/search/:type/:id" component={ Search }/>
        </div>;
    }
}
