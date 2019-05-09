import * as React from 'react';
import { Route } from 'react-router-dom';
import { FavoriteSongs } from "./FavoriteSongs";
import { Collections } from "./Collections";

export class FavoriteModule extends React.Component {
    render() {
        return <div>
            <Route path="/favorite/songs" exact={ true } component={ FavoriteSongs }/>
            <Route path="/favorite/collections" component={ Collections }/>
        </div>;
    }
}
