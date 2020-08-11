import * as React from 'react';
import { Redirect, Route } from "react-router";
import { FavoritePlays } from "./favorite-plays.container";
import { FavoriteMusicians } from "./favorite-musicians.container";
import { FavoriteMovies } from "./favorite-movies.container";
import { HeadButton, Layout } from "../../components";

export class Collections extends React.Component {
    render() {
        const headers = <span style={{ marginLeft: 20 }}>
            <HeadButton to="/favorite/collections/plays">歌单</HeadButton>
            <HeadButton to="/favorite/collections/movies">视频</HeadButton>
            <HeadButton to="/favorite/collections/musicians">歌手</HeadButton>
        </span>;
        return <Layout header={headers} id="main">
            <Route exact={true} path="/favorite/collections"
                   component={() => <Redirect to="/favorite/collections/plays"/>}/>
            <Route exact={true} path="/favorite/collections/plays" component={FavoritePlays}/>
            <Route exact={true} path="/favorite/collections/movies" component={FavoriteMovies}/>
            <Route exact={true} path="/favorite/collections/musicians" component={FavoriteMusicians}/>
        </Layout>;
    }
}
