import * as React from 'react';
import { Carousels } from "./Carousel";

import { PlayList } from "./PlayList";
import { MovieList } from "./MovieList";
import { LatestSongs } from "./LatestSongs";
import { Channels } from "./Channels";
import { Layout } from "../../components/Layout";

export class Discovery extends React.Component {
    render() {
        return <Layout className="discovery">
            <Carousels/>
            <PlayList/>
            <LatestSongs/>
            <MovieList/>
            <Channels/>
        </Layout>
    }
}
