import * as React from 'react';
import { Layout } from "../../components";
import { Carousels } from "./carousel.container";
import { Channels } from "./channels.container";
import { PlayList } from "./play-list.container";
import { LatestSongs } from "./latest-songs.container";
import { MovieList } from "./movie-list.contianer";
import { LatestMusician } from "./latest-musician.container";

export const Discovery = () => {
    return <Layout className="discovery">
        <Carousels/>
        <PlayList/>
        <LatestSongs/>
        <MovieList/>
        <Channels/>
        <LatestMusician/>
    </Layout>;
}
