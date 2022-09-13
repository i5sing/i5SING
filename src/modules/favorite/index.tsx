import * as React from 'react';
import { Route } from 'react-router-dom';
import { FavoriteSongs } from "./favorite-songs.container";
import { Collections } from "./collections.container";
import { CoreModule } from "../core";

export class FavoriteModule extends React.Component {
    render() {
        return <CoreModule>
            <Route path="/favorite/songs" exact={true} component={FavoriteSongs}/>
            <Route exact={true} path="/favorite/collections" children={props => <div
                style={{ display: props.location.pathname.indexOf('/favorite/collections') === 0 ? 'block' : 'none' }}>
                <Collections {...props}/>
            </div>}/>
        </CoreModule>;
    }
}
