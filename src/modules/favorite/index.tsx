import * as React from 'react';
import { Route } from 'react-router-dom';
import { FavoriteSongs } from "./favorite-songs.container";
import { Collections } from "./collections.container";
import { CoreModule } from "../core";

export const FavoriteModule = () => (
    <CoreModule>
        <Route path="/favorite/songs" exact={true} component={FavoriteSongs}/>
        <Route path="/favorite/collections" component={Collections}/>
    </CoreModule>
)
