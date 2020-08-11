import * as React from 'react';
import { MovieList } from "./movie-list.container";
import { Route } from 'react-router-dom';
import { MovieDetail } from "./movie-detail.container";
import { CoreModule } from "../core";

export class MovieModule extends React.Component {
    render() {
        return <>
            <Route path="/movies/:movieId" exact={true}
                   component={props => <CoreModule type="no_footer"><MovieDetail {...props}/></CoreModule>}/>
            <Route path="/movies"
                   exact={true}
                   component={props => <CoreModule><MovieList {...props}/></CoreModule>}/>
        </>;
    }
}
