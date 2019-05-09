import * as React from 'react';
import { MovieList } from "./MovieList";
import { Route } from 'react-router-dom';
import { MovieDetail } from "./MovieDetail";

export class MovieModule extends React.Component {
    render() {
        return <div>
            <Route path="/movies/:movieId" exact={ true } component={ MovieDetail }/>
            <Route path="/movies" exact={ true } component={ MovieList }/>

        </div>;
    }
}
