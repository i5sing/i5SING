import * as React from 'react';
import { Route } from 'react-router-dom';
import { FavoriteSongs } from "./FavoriteSongs";
import { Collections } from "./Collections";
import { CoreModule } from "../core";

export class FavoriteModule extends React.Component {
    render() {
        return <CoreModule>
            <Route path="/favorite/songs" exact={true} component={FavoriteSongs}/>
            <Route path="/favorite/collections" component={Collections}/>
        </CoreModule>;
    }
}
