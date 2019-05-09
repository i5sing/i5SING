import * as React from 'react';
import { Layout } from "../../components/Layout";
import { HeadBtn } from "../../components/HeadBtn";
import { Redirect, Route } from "react-router";
import { FavoritePlays } from "./FavoritePlays";
import { FavoriteMusicians } from "./FavoriteMusicians";
import { FavoriteMovies } from "./FavoriteMovies";

export class Collections extends React.Component {
    render() {
        const headers = <span style={ { marginLeft: 20 } }>
            <HeadBtn to="/favorite/collections/plays">歌单</HeadBtn>
            <HeadBtn to="/favorite/collections/movies">视频</HeadBtn>
            <HeadBtn to="/favorite/collections/musicians">歌手</HeadBtn>
        </span>;
        return <Layout header={ headers } id="main">
            <Route exact={ true } path="/favorite/collections"
                   component={ () => <Redirect to="/favorite/collections/plays"/> }/>
            <Route exact={ true } path="/favorite/collections/plays" component={ FavoritePlays }/>
            <Route exact={ true } path="/favorite/collections/movies" component={ FavoriteMovies }/>
            <Route exact={ true } path="/favorite/collections/musicians" component={ FavoriteMusicians }/>
        </Layout>;
    }
}
